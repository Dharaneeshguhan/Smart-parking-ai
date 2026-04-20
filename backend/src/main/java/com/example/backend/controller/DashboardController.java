package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private com.example.backend.repository.BookingRepository bookingRepository;

    @Autowired
    private com.example.backend.repository.UserRepository userRepository;

    @Autowired
    private com.example.backend.repository.ParkingSlotRepository parkingSlotRepository;

    // ===============================
    // DASHBOARD STATS
    // ===============================
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(
            org.springframework.security.core.Authentication authentication) {

        com.example.backend.entity.User user =
                userRepository.findByEmail(authentication.getName())
                        .orElseThrow(() -> new RuntimeException("User not found"));

        List<com.example.backend.entity.Booking> bookings =
                bookingRepository.findByUser(user);

        long totalBookings = bookings.size();

        long activeBookings = bookings.stream()
                .filter(b ->
                        b.getEndTime().isAfter(java.time.LocalDateTime.now())
                                && "CONFIRMED".equals(b.getStatus()))
                .count();

        double totalSpent = bookings.stream()
                .mapToDouble(com.example.backend.entity.Booking::getTotalAmount)
                .sum();

        List<com.example.backend.entity.ParkingSlot> mySlots = parkingSlotRepository.findByOwner(user);
        long myAvailableSlots = mySlots.stream()
                .mapToLong(com.example.backend.entity.ParkingSlot::getAvailableSpots)
                .sum();
        long myTotalSlots = mySlots.stream()
                .mapToLong(com.example.backend.entity.ParkingSlot::getTotalSpots)
                .sum();

        // For regular users, show total available slots from all parking locations
        List<com.example.backend.entity.ParkingSlot> allSlots = parkingSlotRepository.findAll();
        long totalAvailableSlots = allSlots.stream()
                .mapToLong(com.example.backend.entity.ParkingSlot::getAvailableSpots)
                .sum();
        long totalSlots = allSlots.stream()
                .mapToLong(com.example.backend.entity.ParkingSlot::getTotalSpots)
                .sum();

        Map<String, Object> response = new HashMap<>();
        response.put("totalBookings", totalBookings);
        response.put("activeBookings", activeBookings);
        response.put("totalSpent", totalSpent);
        response.put("savedTime", (totalBookings * 15) + "m");
        response.put("availableSlots", mySlots.isEmpty() ? totalAvailableSlots : myAvailableSlots);
        response.put("totalSlots", mySlots.isEmpty() ? totalSlots : myTotalSlots);
        response.put("mySlotsCount", mySlots.size());
        response.put("demandLevel", activeBookings > 5 ? "high" : "medium");
        response.put("totalUsers", userRepository.count());

        return ResponseEntity.ok(response);
    }

    // ===============================
    // OWNER PARKING SLOTS
    // ===============================
    @GetMapping("/my-slots")
    public ResponseEntity<List<Map<String, Object>>> getMyParkingSlots(
            org.springframework.security.core.Authentication authentication) {

        com.example.backend.entity.User user =
                userRepository.findByEmail(authentication.getName())
                        .orElseThrow(() -> new RuntimeException("User not found"));

        List<com.example.backend.entity.ParkingSlot> mySlots = parkingSlotRepository.findByOwner(user);

        List<Map<String, Object>> slots = mySlots.stream()
                .map(slot -> {
                    Map<String, Object> slotMap = new HashMap<>();
                    slotMap.put("id", slot.getId());
                    slotMap.put("name", slot.getName());
                    slotMap.put("address", slot.getAddress());
                    slotMap.put("latitude", slot.getLatitude());
                    slotMap.put("longitude", slot.getLongitude());
                    slotMap.put("pricePerHour", slot.getPricePerHour());
                    slotMap.put("totalSpots", slot.getTotalSpots());
                    slotMap.put("availableSpots", slot.getAvailableSpots());
                    slotMap.put("dailyRate", slot.getDailyRate());
                    return slotMap;
                })
                .toList();

        return ResponseEntity.ok(slots);
    }

    // ===============================
    // DEMAND PREDICTION
    // ===============================
    @GetMapping("/demand-prediction")
    public ResponseEntity<List<Map<String, Object>>> getDemandPrediction() {

        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createMap("time","8:00 AM","demand",40));
        list.add(createMap("time","12:00 PM","demand",80));
        list.add(createMap("time","4:00 PM","demand",60));
        list.add(createMap("time","8:00 PM","demand",90));

        return ResponseEntity.ok(list);
    }

    // ===============================
    // AVAILABILITY CHART
    // ===============================
    @GetMapping("/availability")
    public ResponseEntity<List<Map<String, Object>>> getAvailabilityChart() {

        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createMap("name","Mon","available",120));
        list.add(createMap("name","Tue","available",80));
        list.add(createMap("name","Wed","available",90));
        list.add(createMap("name","Thu","available",150));
        list.add(createMap("name","Fri","available",40));

        return ResponseEntity.ok(list);
    }

    // ===============================
    // RECENT ACTIVITY (FIXED)
    // ===============================
    @GetMapping("/activity")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity(
            org.springframework.security.core.Authentication authentication) {

        com.example.backend.entity.User user =
                userRepository.findByEmail(authentication.getName())
                        .orElseThrow(() -> new RuntimeException("User not found"));

        List<com.example.backend.entity.Booking> bookings =
                bookingRepository.findByUser(user);

        List<Map<String, Object>> activities = bookings.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .map(b -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", b.getId());
                    map.put("type", "booking");
                    map.put("description", "Booked " + b.getParkingSlot().getName());
                    map.put("timestamp", b.getCreatedAt().toString());
                    map.put("amount", b.getTotalAmount());
                    return map;
                })
                .toList();

        return ResponseEntity.ok(activities);
    }

    // helper method
    private Map<String, Object> createMap(String k1, Object v1,
                                          String k2, Object v2) {
        Map<String, Object> map = new HashMap<>();
        map.put(k1, v1);
        map.put(k2, v2);
        return map;
    }
}