package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(Map.of(
                "totalBookings", 0,
                "activeBookings", 0,
                "totalSpent", 0,
                "savedTime", "0h"
        ));
    }

    @GetMapping("/demand-prediction")
    public ResponseEntity<List<Map<String, Object>>> getDemandPrediction() {
        return ResponseEntity.ok(List.of(
                Map.of("time", "8:00 AM", "demand", 40),
                Map.of("time", "12:00 PM", "demand", 80),
                Map.of("time", "4:00 PM", "demand", 60),
                Map.of("time", "8:00 PM", "demand", 90)
        ));
    }

    @GetMapping("/availability")
    public ResponseEntity<List<Map<String, Object>>> getAvailabilityChart() {
         return ResponseEntity.ok(List.of(
                Map.of("name", "Mon", "available", 120),
                Map.of("name", "Tue", "available", 80),
                Map.of("name", "Wed", "available", 90),
                Map.of("name", "Thu", "available", 150),
                Map.of("name", "Fri", "available", 40)
        ));
    }

    @GetMapping("/activity")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity() {
        return ResponseEntity.ok(List.of()); // return empty activity list
    }
}
