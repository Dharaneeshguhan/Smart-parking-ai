package com.example.backend.service;

import com.example.backend.dto.ParkingSearchRequest;
import com.example.backend.dto.ParkingSearchResponse;
import com.example.backend.entity.ParkingSlot;
import com.example.backend.repository.ParkingSlotRepository;
import com.example.backend.util.DistanceUtil;
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

        for (ParkingSlot slot : allSlots) {
            double distToDest = 0.0;
            double distFromUser = 0.0;
            
            // Calculate distance to destination (60% weight)
            if (request.getDestinationLat() != null && request.getDestinationLng() != null) {
                distToDest = DistanceUtil.calculateDistance(
                        request.getDestinationLat(), request.getDestinationLng(),
                        slot.getLatitude(), slot.getLongitude()
                );
            }
            
            // Calculate distance from user (20% weight)
            if (request.getUserLat() != null && request.getUserLng() != null) {
                distFromUser = DistanceUtil.calculateDistance(
                        request.getUserLat(), request.getUserLng(),
                        slot.getLatitude(), slot.getLongitude()
                );
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
        
        return new ParkingSearchResponse(slot, 0.0, trafficLevel, predictedAvailability, 0.0);
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
