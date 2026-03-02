package com.example.backend.service;

import com.example.backend.entity.Booking;
import com.example.backend.entity.ParkingSlot;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.ParkingSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class AvailabilityService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String ML_API_URL = "http://localhost:5000/predict";

    /**
     * Calculate real-time available slots for a parking slot
     * Formula: available_slots = total_slots - active_bookings
     */
    public int calculateRealTimeAvailableSlots(Long parkingSlotId) {
        ParkingSlot slot = parkingSlotRepository.findById(parkingSlotId)
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));

        // Count active bookings (confirmed and not expired)
        LocalDateTime now = LocalDateTime.now();
        long activeBookings = bookingRepository.countByParkingSlotAndStatusAndEndTimeAfter(
                slot, "CONFIRMED", now);

        int availableSlots = slot.getTotalSpots() - (int) activeBookings;

        // Ensure non-negative result
        return Math.max(0, availableSlots);
    }

    /**
     * Calculate availability percentage
     */
    public int calculateAvailabilityPercentage(int availableSlots, int totalSlots) {
        if (totalSlots == 0) return 0;
        return (int) Math.round((double) availableSlots / totalSlots * 100);
    }

    /**
     * Generate availability status based on percentage
     */
    public String getAvailabilityStatus(int availabilityPercentage) {
        if (availabilityPercentage == 0) {
            return "FULL";
        } else if (availabilityPercentage < 30) {
            return "LOW";
        } else if (availabilityPercentage <= 60) {
            return "MEDIUM";
        } else {
            return "HIGH";
        }
    }

    /**
     * Get AI predicted availability for a parking slot
     */
    public int getAiPredictedAvailability(ParkingSlot slot) {
        LocalDateTime now = LocalDateTime.now();
        int hourOfDay = now.getHour();
        int dayOfWeek = now.getDayOfWeek().getValue() - 1;
        if (dayOfWeek < 0) dayOfWeek = 6;
        int month = now.getMonthValue();

        String trafficLevel = calculateTrafficLevel(hourOfDay, dayOfWeek);
        double trafficScore = mapTrafficToScore(trafficLevel);

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
                int predicted = predStr.intValue();
                if (predicted < 0) predicted = 0;
                if (predicted > slot.getTotalSpots()) predicted = slot.getTotalSpots();
                return predicted;
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch ML prediction: " + e.getMessage());
        }

        // Fallback to current available spots
        return calculateRealTimeAvailableSlots(slot.getId());
    }

    /**
     * Check if a parking slot is recommended (high availability or AI prediction)
     */
    public boolean isRecommendedSlot(ParkingSlot slot) {
        int realTimeAvailable = calculateRealTimeAvailableSlots(slot.getId());
        int aiPredicted = getAiPredictedAvailability(slot);
        int totalSlots = slot.getTotalSpots();

        int realTimePercentage = calculateAvailabilityPercentage(realTimeAvailable, totalSlots);
        int aiPercentage = calculateAvailabilityPercentage(aiPredicted, totalSlots);

        // Recommended if either real-time or AI prediction shows high availability
        return getAvailabilityStatus(realTimePercentage).equals("HIGH") ||
               getAvailabilityStatus(aiPercentage).equals("HIGH");
    }

    /**
     * Update availability after booking creation
     */
    public void updateAvailabilityAfterBookingCreation(Long parkingSlotId) {
        updateSlotAvailability(parkingSlotId);
    }

    /**
     * Update availability after booking cancellation
     */
    public void updateAvailabilityAfterBookingCancellation(Long parkingSlotId) {
        updateSlotAvailability(parkingSlotId);
    }

    /**
     * Update availability after booking expiration
     */
    public void updateAvailabilityAfterBookingExpiration(Long parkingSlotId) {
        updateSlotAvailability(parkingSlotId);
    }

    /**
     * Update slot availability in database
     */
    private void updateSlotAvailability(Long parkingSlotId) {
        ParkingSlot slot = parkingSlotRepository.findById(parkingSlotId)
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));

        int realTimeAvailable = calculateRealTimeAvailableSlots(parkingSlotId);
        slot.setAvailableSpots(realTimeAvailable);
        parkingSlotRepository.save(slot);
    }

    /**
     * Scheduled task to update all parking slot availabilities periodically
     * Runs every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void updateAllAvailabilities() {
        List<ParkingSlot> allSlots = parkingSlotRepository.findAll();

        for (ParkingSlot slot : allSlots) {
            try {
                int realTimeAvailable = calculateRealTimeAvailableSlots(slot.getId());
                slot.setAvailableSpots(realTimeAvailable);
                parkingSlotRepository.save(slot);
            } catch (Exception e) {
                System.err.println("Failed to update availability for slot " + slot.getId() + ": " + e.getMessage());
            }
        }
    }

    /**
     * Get complete availability information for a parking slot
     */
    public Map<String, Object> getCompleteAvailabilityInfo(Long parkingSlotId) {
        ParkingSlot slot = parkingSlotRepository.findById(parkingSlotId)
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));

        int availableSlots = calculateRealTimeAvailableSlots(parkingSlotId);
        int availabilityPercent = calculateAvailabilityPercentage(availableSlots, slot.getTotalSpots());
        String availabilityStatus = getAvailabilityStatus(availabilityPercent);
        int aiPredictedAvailability = getAiPredictedAvailability(slot);
        boolean recommended = isRecommendedSlot(slot);

        return Map.of(
                "availableSlots", availableSlots,
                "availabilityPercent", availabilityPercent,
                "availabilityStatus", availabilityStatus,
                "aiPredictedAvailability", aiPredictedAvailability,
                "recommended", recommended,
                "totalSlots", slot.getTotalSpots()
        );
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
