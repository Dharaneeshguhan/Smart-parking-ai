package com.example.backend.service;

import com.example.backend.dto.ParkingSearchRequest;
import com.example.backend.dto.ParkingSearchResponse;
import com.example.backend.entity.Booking;
import com.example.backend.entity.ParkingSlot;
import com.example.backend.repository.ParkingSlotRepository;
import com.example.backend.service.AvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ParkingService {

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    @Autowired
    private com.example.backend.repository.UserRepository userRepository;

    @Autowired
    private AvailabilityService availabilityService;

    @Autowired
    private com.example.backend.repository.BookingRepository bookingRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String ML_API_URL = "http://localhost:5000/predict";

    public List<ParkingSearchResponse> searchParking(ParkingSearchRequest request) {
        List<ParkingSlot> allSlots = parkingSlotRepository.findAll();
        List<ParkingSearchResponse> responseList = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();
        int hourOfDay = now.getHour();
        int dayOfWeek = now.getDayOfWeek().getValue() - 1; 
        if (dayOfWeek < 0) dayOfWeek = 6;
        int month = now.getMonthValue();

        String trafficLevel = calculateTrafficLevel(hourOfDay, dayOfWeek);
        double trafficScore = mapTrafficToScore(trafficLevel);

        // Parse requested time slot if provided
        LocalDateTime requestedStartTime = null;
        LocalDateTime requestedEndTime = null;
        boolean hasTimeSlot = false;

        if (request.getStartTime() != null && request.getEndTime() != null) {
            try {
                // Frontend sends full ISO datetime strings like "2024-01-01T10:00:00"
                requestedStartTime = LocalDateTime.parse(request.getStartTime());
                requestedEndTime = LocalDateTime.parse(request.getEndTime());
                hasTimeSlot = true;
            } catch (Exception e) {
                // Invalid time format, ignore time slot filtering
                hasTimeSlot = false;
            }
        }

        // Create final copies for lambda expression
        final LocalDateTime finalRequestedStartTime = requestedStartTime;
        final LocalDateTime finalRequestedEndTime = requestedEndTime;

        for (ParkingSlot slot : allSlots) {
            double distToDest = 0.0;
            double distFromUser = 0.0;
            
            // Calculate distance to destination (60% weight)
            if (request.getDestinationLat() != null && request.getDestinationLng() != null) {
                distToDest = com.example.backend.util.DistanceUtil.calculateDistance(
                        request.getDestinationLat(), request.getDestinationLng(),
                        slot.getLatitude(), slot.getLongitude()
                );
            }
            
            // Calculate distance from user (20% weight)
            if (request.getUserLat() != null && request.getUserLng() != null) {
                distFromUser = com.example.backend.util.DistanceUtil.calculateDistance(
                        request.getUserLat(), request.getUserLng(),
                        slot.getLatitude(), slot.getLongitude()
                );
            }

            // Check availability for requested time slot using proper time overlap logic
            boolean isAvailableForTimeSlot = true;
            String timeSlotReason = null;

            if (hasTimeSlot) {
                // Check for bookings that overlap with the requested time slot
                // A booking overlaps if: existingStart < selectedEnd AND existingEnd > selectedStart
                List<Booking> overlappingBookings = bookingRepository.findByParkingSlotInAndStatus(
                    List.of(slot), "CONFIRMED"
                ).stream()
                .filter(booking -> {
                    LocalDateTime bookingStart = booking.getStartTime();
                    LocalDateTime bookingEnd = booking.getEndTime();
                    // Proper overlap check: booking starts before request ends AND booking ends after request starts
                    return bookingStart.isBefore(finalRequestedEndTime) && bookingEnd.isAfter(finalRequestedStartTime);
                })
                .collect(Collectors.toList());

                if (!overlappingBookings.isEmpty()) {
                    isAvailableForTimeSlot = false;
                    timeSlotReason = "Slot unavailable for selected time range";
                }
            }

            // Real Time AI prediction
            int predictedAvailability = slot.getAvailableSpots();
            try {
                Map<String, Object> mlPayload = Map.of(
                        "day_of_week", dayOfWeek,
                        "hour_of_day", hourOfDay,
                        "month", month,
                        "location", 0, 
                        "weather", 0, 
                        "event_type", 0, 
                        "traffic_level", trafficScore,
                        "total_slots", slot.getTotalSpots(),
                        "price_per_hour_inr", slot.getPricePerHour()
                );

                ResponseEntity<Map> mlResponse = restTemplate.postForEntity(ML_API_URL, mlPayload, Map.class);
                if (mlResponse.getStatusCode().is2xxSuccessful() && mlResponse.getBody() != null) {
                    Number predStr = (Number) mlResponse.getBody().get("predicted_available_slots");
                    predictedAvailability = predStr.intValue();
                    if (predictedAvailability < 0) predictedAvailability = 0;
                    if (predictedAvailability > slot.getTotalSpots()) predictedAvailability = slot.getTotalSpots();
                }
            } catch (Exception e) {
                System.err.println("Failed to fetch ML prediction: " + e.getMessage());
            }

            // Smart Ranking Formula
            // score = (distToDest * 0.6) + (distFromUser * 0.2) + (trafficScore * 0.1) + (priceFactor * 0.1)
            double priceFactor = slot.getPricePerHour() / 10.0; // Normalized price factor
            double score = (distToDest * 0.6) + (distFromUser * 0.2) + (trafficScore * 0.1) + (priceFactor * 0.1);

            ParkingSearchResponse pResponse = new ParkingSearchResponse(slot, distToDest, trafficLevel, predictedAvailability, score);
            pResponse.setScore(score);

            // Add real-time availability information
            Map<String, Object> availabilityInfo = availabilityService.getCompleteAvailabilityInfo(slot.getId());
            pResponse.setAvailabilityPercent((Integer) availabilityInfo.get("availabilityPercent"));
            pResponse.setAvailabilityStatus((String) availabilityInfo.get("availabilityStatus"));
            pResponse.setAiPredictedAvailability((Integer) availabilityInfo.get("aiPredictedAvailability"));
            
            // Set recommended flag based on time slot availability
            if (hasTimeSlot && !isAvailableForTimeSlot) {
                // Unavailable for time slot - do not mark as recommended
                pResponse.setRecommended(false);
                pResponse.setAvailable(false);
                pResponse.setReason(timeSlotReason);
            } else {
                pResponse.setRecommended((Boolean) availabilityInfo.get("recommended"));
                pResponse.setAvailable(true);
            }

            responseList.add(pResponse);
        }

        return responseList.stream()
                .sorted(Comparator.comparingDouble(ParkingSearchResponse::getScore))
                .collect(Collectors.toList());
    }

    public ParkingSlot getParkingDetails(Long id) {
        return parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));
    }

    public ParkingSearchResponse getDetailedResponse(Long id) {
        ParkingSlot slot = getParkingDetails(id);
        
        LocalDateTime now = LocalDateTime.now();
        int hourOfDay = now.getHour();
        int dayOfWeek = now.getDayOfWeek().getValue() - 1;
        if (dayOfWeek < 0) dayOfWeek = 6;
        int month = now.getMonthValue();

        String trafficLevel = calculateTrafficLevel(hourOfDay, dayOfWeek);
        double trafficScore = mapTrafficToScore(trafficLevel);
        
        // Mocking distances as 0 for direct detail view
        int predictedAvailability = getMlAvailability(slot, hourOfDay, dayOfWeek, month, trafficScore);
        
        ParkingSearchResponse response = new ParkingSearchResponse(slot, 0.0, trafficLevel, predictedAvailability, 0.0);

        // Add real-time availability information
        Map<String, Object> availabilityInfo = availabilityService.getCompleteAvailabilityInfo(slot.getId());
        response.setAvailabilityPercent((Integer) availabilityInfo.get("availabilityPercent"));
        response.setAvailabilityStatus((String) availabilityInfo.get("availabilityStatus"));
        response.setAiPredictedAvailability((Integer) availabilityInfo.get("aiPredictedAvailability"));
        response.setRecommended((Boolean) availabilityInfo.get("recommended"));

        return response;
    }

    private int getMlAvailability(ParkingSlot slot, int hour, int day, int month, double traffic) {
        try {
            Map<String, Object> mlPayload = Map.of(
                    "day_of_week", day,
                    "hour_of_day", hour,
                    "month", month,
                    "location", 0, 
                    "weather", 0, 
                    "event_type", 0, 
                    "traffic_level", traffic,
                    "total_slots", slot.getTotalSpots(),
                    "price_per_hour_inr", slot.getPricePerHour()
            );

            ResponseEntity<Map> mlResponse = restTemplate.postForEntity(ML_API_URL, mlPayload, Map.class);
            if (mlResponse.getStatusCode().is2xxSuccessful() && mlResponse.getBody() != null) {
                Number predStr = (Number) mlResponse.getBody().get("predicted_available_slots");
                int pred = predStr.intValue();
                if (pred < 0) pred = 0;
                if (pred > slot.getTotalSpots()) pred = slot.getTotalSpots();
                return pred;
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch ML prediction: " + e.getMessage());
        }
        return slot.getAvailableSpots();
    }

    public void addToFavorites(Long slotId, String userEmail) {
        com.example.backend.entity.User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ParkingSlot slot = getParkingDetails(slotId);
        user.getFavoriteSlots().add(slot);
        userRepository.save(user);
    }

    public void removeFromFavorites(Long slotId, String userEmail) {
        com.example.backend.entity.User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getFavoriteSlots().removeIf(slot -> slot.getId().equals(slotId));
        userRepository.save(user);
    }

    public List<ParkingSearchResponse> getFavorites(String userEmail) {
        com.example.backend.entity.User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getFavoriteSlots().stream()
                .map(slot -> getDetailedResponse(slot.getId()))
                .collect(Collectors.toList());
    }

    public List<ParkingSearchResponse> getNearbyParking(double userLat, double userLng) {
        List<ParkingSlot> allSlots = parkingSlotRepository.findAll();
        List<ParkingSearchResponse> responseList = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();
        int hourOfDay = now.getHour();
        int dayOfWeek = now.getDayOfWeek().getValue() - 1;
        if (dayOfWeek < 0) dayOfWeek = 6;
        int month = now.getMonthValue();

        String trafficLevel = calculateTrafficLevel(hourOfDay, dayOfWeek);
        double trafficScore = mapTrafficToScore(trafficLevel);

        for (ParkingSlot slot : allSlots) {
            double distance = com.example.backend.util.DistanceUtil.calculateDistance(userLat, userLng, slot.getLatitude(), slot.getLongitude());
            
            int predictedAvailability = getMlAvailability(slot, hourOfDay, dayOfWeek, month, trafficScore);
            
            // Priority Ranking: 1. Distance, 2. Availability, 3. Price
            // We use the score for sorting. Lower is better for distance and price, higher is better for availability.
            // Let's create a combined score or just sort the list.
            
            ParkingSearchResponse pResponse = new ParkingSearchResponse(slot, distance, trafficLevel, predictedAvailability, distance);
            pResponse.setScore(distance); // Primary sort factor

            // Add real-time availability information
            Map<String, Object> availabilityInfo = availabilityService.getCompleteAvailabilityInfo(slot.getId());
            pResponse.setAvailabilityPercent((Integer) availabilityInfo.get("availabilityPercent"));
            pResponse.setAvailabilityStatus((String) availabilityInfo.get("availabilityStatus"));
            pResponse.setAiPredictedAvailability((Integer) availabilityInfo.get("aiPredictedAvailability"));
            pResponse.setRecommended((Boolean) availabilityInfo.get("recommended"));

            responseList.add(pResponse);
        }

        return responseList.stream()
                .sorted(Comparator.comparingDouble(ParkingSearchResponse::getDistance)
                        .thenComparing(Comparator.comparingInt(ParkingSearchResponse::getPredictedAvailableSpots).reversed())
                        .thenComparingDouble(ParkingSearchResponse::getPricePerHour))
                .limit(10)
                .collect(Collectors.toList());
    }

    private String calculateTrafficLevel(int hourOfDay, int dayOfWeek) {
        // Simple Real-time traffic logic
        // 8 AM - 10 AM, 5 PM (17) - 8 PM (20) are High
        boolean isWeekend = (dayOfWeek == 5 || dayOfWeek == 6); // Sat = 5, Sun = 6
        if (!isWeekend && ((hourOfDay >= 8 && hourOfDay <= 10) || (hourOfDay >= 17 && hourOfDay <= 20))) {
            return "High";
        } else if (hourOfDay >= 22 || hourOfDay <= 5) {
            return "Low";
        }
        return "Medium";
    }

    private double mapTrafficToScore(String trafficLevel) {
        switch (trafficLevel) {
            case "High": return 10.0;
            case "Medium": return 5.0;
            case "Low": return 2.0;
            default: return 5.0;
        }
    }
}
