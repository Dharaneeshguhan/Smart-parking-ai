package com.example.backend.service;

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
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
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

    public List<ParkingSearchResponse> searchParkingByTime(
            String date, String startTime, Integer duration,
            Double userLat, Double userLng, Double destinationLat, Double destinationLng) {
        
        List<ParkingSlot> allSlots = parkingSlotRepository.findAll();
        List<ParkingSearchResponse> responseList = new ArrayList<>();
        
        try {
        // Parse requested time correctly with date
        java.time.LocalDate parsedDate = java.time.LocalDate.parse(date);
        LocalTime parsedStartTime = LocalTime.parse(startTime);
        LocalDateTime requestedStart = LocalDateTime.of(parsedDate, parsedStartTime);
        LocalDateTime requestedEnd = requestedStart.plusHours(duration);
        
        System.out.println("=== TIME SEARCH DEBUG ===");
        System.out.println("Requested Date: " + date);
        System.out.println("Requested Start Time: " + startTime);
        System.out.println("Duration: " + duration + " hours");
        System.out.println("Parsed Date: " + parsedDate);
        System.out.println("Parsed Start Time: " + parsedStartTime);
        System.out.println("Calculated Start: " + requestedStart);
        System.out.println("Calculated End: " + requestedEnd);
        
        for (ParkingSlot slot : allSlots) {
            // Get bookings for this slot
            List<Booking> existingBookings = bookingRepository.findByParkingSlotAndStatus(slot, "CONFIRMED");
            
            System.out.println("Slot: " + slot.getName() + " - Bookings found: " + existingBookings.size());
            
            boolean isAvailable = true;
            String nextAvailableFrom = null;
            
            // If no bookings exist, slot is available
            if (existingBookings.isEmpty()) {
                System.out.println("No bookings found - slot available");
                isAvailable = true;
            } else {
                // Check for overlapping bookings
                for (Booking booking : existingBookings) {
                    LocalDateTime bookingStart = booking.getStartTime();
                    LocalDateTime bookingEnd = booking.getEndTime();
                    
                    System.out.println("Checking booking: " + bookingStart + " to " + bookingEnd);
                    
                    // Correct overlap condition: booking.startTime < requestedEnd AND booking.endTime > requestedStart
                    boolean overlap = bookingStart.isBefore(requestedEnd) && bookingEnd.isAfter(requestedStart);
                    
                    System.out.println("Overlap result: " + overlap);
                    
                    if (overlap) {
                        isAvailable = false;
                        // Find next available time
                        if (bookingEnd.isAfter(requestedStart)) {
                            nextAvailableFrom = bookingEnd.toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm"));
                        }
                        System.out.println("Slot unavailable - next available from: " + nextAvailableFrom);
                        break;
                    }
                }
            }
            
            ParkingSearchResponse response = new ParkingSearchResponse();
            response.setId(slot.getId());
            response.setName(slot.getName());
            response.setAddress(slot.getAddress());
            response.setLatitude(slot.getLatitude());
            response.setLongitude(slot.getLongitude());
            response.setPricePerHour(slot.getPricePerHour());
            response.setTotalSpots(slot.getTotalSpots());
            
            // Calculate distance if coordinates are provided
            if (userLat != null && userLng != null) {
                // Simple distance calculation (Haversine formula approximation)
                double lat1 = userLat;
                double lon1 = userLng;
                double lat2 = slot.getLatitude();
                double lon2 = slot.getLongitude();
                
                double R = 6371; // Earth's radius in km
                double dLat = Math.toRadians(lat2 - lat1);
                double dLon = Math.toRadians(lon2 - lon1);
                double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                double distance = R * c;
                
                response.setDistance(distance);
            }
            
            // Set default rating
            response.setRating(4.0);
            response.setAvailable(isAvailable);
            
            if (!isAvailable && nextAvailableFrom != null) {
                response.setRecommended(true);
                response.setNextAvailableFrom(nextAvailableFrom);
                response.setMessage("Currently unavailable. Available soon.");
            }
            
            responseList.add(response);
        }
        
        // Sort results: 1. Available slots, 2. Distance, 3. Rating, 4. Recommended soon-available
        return responseList.stream()
                .sorted(Comparator
                        .comparing((ParkingSearchResponse r) -> r.isAvailable() ? 0 : 1)
                        .thenComparingDouble(ParkingSearchResponse::getDistance)
                        .thenComparingDouble(ParkingSearchResponse::getRating)
                        .thenComparing((ParkingSearchResponse r) -> r.isRecommended() ? 0 : 1))
                .collect(Collectors.toList());
    } catch (Exception e) {
        System.out.println("ERROR IN TIME SEARCH: " + e.getMessage());
        e.printStackTrace();
        throw e;
    }
    }

    public List<Object> getUnavailableTimeRanges(Long slotId) {
        ParkingSlot slot = parkingSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));
        
        List<Booking> bookings = bookingRepository.findByParkingSlotAndStatus(slot, "CONFIRMED");
        List<Object> timeRanges = new ArrayList<>();
        
        for (Booking booking : bookings) {
            Map<String, Object> timeRange = Map.of(
                "startTime", booking.getStartTime().toString(),
                "endTime", booking.getEndTime().toString()
            );
            timeRanges.add(timeRange);
        }
        
        return timeRanges;
    }

    public List<ParkingSearchResponse> searchParking(Object request) {
        List<ParkingSlot> allSlots = parkingSlotRepository.findAll();
        List<ParkingSearchResponse> responseList = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();
        int hourOfDay = now.getHour();
        int dayOfWeek = now.getDayOfWeek().getValue() - 1; 
        if (dayOfWeek < 0) dayOfWeek = 6;
        int month = now.getMonthValue();

        String trafficLevel = calculateTrafficLevel(hourOfDay, dayOfWeek);
        double trafficScore = mapTrafficToScore(trafficLevel);

        // For now, return all slots without time filtering
        for (ParkingSlot slot : allSlots) {
            ParkingSearchResponse response = new ParkingSearchResponse();
            response.setId(slot.getId());
            response.setName(slot.getName());
            response.setAddress(slot.getAddress());
            response.setLatitude(slot.getLatitude());
            response.setLongitude(slot.getLongitude());
            response.setPricePerHour(slot.getPricePerHour());
            response.setTotalSpots(slot.getTotalSpots());
            response.setRating(4.0);
            response.setAvailable(true);
            
            responseList.add(response);
        }

        return responseList;
    }

    public ParkingSlot getParkingDetails(Long id) {
        return parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));
    }

    public void addToFavorites(Long slotId, String userEmail) {
        // Mock implementation
    }

    public void removeFromFavorites(Long slotId, String userEmail) {
        // Mock implementation
    }

    public List<ParkingSearchResponse> getFavorites(String userEmail) {
        // Mock implementation
        return new ArrayList<>();
    }

    public List<ParkingSearchResponse> getNearbyParking(double userLat, double userLng) {
        // Mock implementation
        return new ArrayList<>();
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
