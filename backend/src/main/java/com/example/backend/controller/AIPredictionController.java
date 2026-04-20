package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AIPredictionController {

    @Autowired
    private com.example.backend.repository.BookingRepository bookingRepository;

    @Autowired
    private com.example.backend.repository.ParkingSlotRepository parkingSlotRepository;

    @Autowired
    private com.example.backend.repository.UserRepository userRepository;

    // AI Model Status
    @GetMapping("/model-status")
    public ResponseEntity<Map<String, Object>> getModelStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("isTraining", false);
        response.put("isReady", true);
        response.put("accuracy", 0.87);
        response.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.put("version", "2.1.0");
        
        return ResponseEntity.ok(response);
    }

    // Predict parking availability for specific time
    @PostMapping("/predict-availability")
    public ResponseEntity<Map<String, Object>> predictAvailability(@RequestBody Map<String, Object> request) {
        String targetTimeStr = (String) request.get("targetTime");
        LocalDateTime targetTime = LocalDateTime.parse(targetTimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        
        // Simulate AI prediction
        Map<String, Object> prediction = generateAIPrediction(targetTime);
        
        return ResponseEntity.ok(prediction);
    }

    // Get real-time demand trend
    @GetMapping("/demand-trend")
    public ResponseEntity<Map<String, Object>> getDemandTrend(@RequestParam(defaultValue = "60") int timeWindow) {
        Map<String, Object> trend = generateDemandTrend(timeWindow);
        return ResponseEntity.ok(trend);
    }

    // Get AI insights and recommendations
    @GetMapping("/insights")
    public ResponseEntity<Map<String, Object>> getAIInsights() {
        Map<String, Object> insights = new HashMap<>();
        
        // Best booking times
        List<Map<String, Object>> bestTimes = generateBestBookingTimes();
        insights.put("bestBookingTimes", bestTimes);
        
        // Demand patterns
        List<Map<String, Object>> demandPatterns = generateDemandPatterns();
        insights.put("demandPatterns", demandPatterns);
        
        // Price optimizations
        List<Map<String, Object>> priceOptimizations = generatePriceOptimizations();
        insights.put("priceOptimizations", priceOptimizations);
        
        // Alternative locations
        List<Map<String, Object>> alternativeLocations = generateAlternativeLocations();
        insights.put("alternativeLocations", alternativeLocations);
        
        return ResponseEntity.ok(insights);
    }

    // Generate AI prediction
    private Map<String, Object> generateAIPrediction(LocalDateTime targetTime) {
        Map<String, Object> prediction = new HashMap<>();
        
        int hour = targetTime.getHour();
        int dayOfWeek = targetTime.getDayOfWeek().getValue();
        boolean isWeekend = dayOfWeek >= 6;
        
        // Calculate base occupancy based on time patterns
        double baseOccupancy = 0.3;
        
        // Peak hours adjustment
        if (hour >= 8 && hour <= 10) baseOccupancy += 0.4; // Morning rush
        else if (hour >= 17 && hour <= 19) baseOccupancy += 0.45; // Evening rush
        else if (hour >= 12 && hour <= 14) baseOccupancy += 0.2; // Lunch time
        
        // Weekend adjustment
        if (isWeekend) {
            baseOccupancy = Math.max(0.2, baseOccupancy - 0.1);
            if (hour >= 10 && hour <= 15) baseOccupancy += 0.3; // Weekend shopping
        }
        
        // Add randomness
        double randomFactor = (Math.random() - 0.5) * 0.2;
        double predictedOccupancy = Math.max(0.1, Math.min(0.95, baseOccupancy + randomFactor));
        
        // Calculate confidence
        double confidence = 0.7;
        if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) confidence = 0.9;
        else if (hour >= 22 || hour <= 6) confidence = 0.5;
        
        prediction.put("predictedOccupancy", predictedOccupancy);
        prediction.put("confidence", confidence);
        prediction.put("riskLevel", calculateRiskLevel(predictedOccupancy, confidence));
        prediction.put("recommendation", generateRecommendation(predictedOccupancy, confidence));
        
        return prediction;
    }

    // Calculate risk level
    private String calculateRiskLevel(double occupancy, double confidence) {
        double riskScore = occupancy * confidence;
        if (riskScore > 0.7) return "high";
        if (riskScore > 0.4) return "medium";
        return "low";
    }

    // Generate recommendation
    private Map<String, Object> generateRecommendation(double occupancy, double confidence) {
        Map<String, Object> recommendation = new HashMap<>();
        
        if (occupancy > 0.8 && confidence > 0.7) {
            recommendation.put("action", "avoid");
            recommendation.put("message", "High demand expected. Consider booking earlier or finding alternative location.");
            recommendation.put("urgency", "high");
            recommendation.put("color", "red");
        } else if (occupancy > 0.6 && confidence > 0.6) {
            recommendation.put("action", "book_soon");
            recommendation.put("message", "Moderate to high demand. Recommended to book in advance.");
            recommendation.put("urgency", "medium");
            recommendation.put("color", "yellow");
        } else {
            recommendation.put("action", "proceed");
            recommendation.put("message", "Good availability expected. Safe to proceed.");
            recommendation.put("urgency", "low");
            recommendation.put("color", "green");
        }
        
        return recommendation;
    }

    // Generate demand trend
    private Map<String, Object> generateDemandTrend(int timeWindow) {
        Map<String, Object> trend = new HashMap<>();
        
        double currentDemand = 0.5 + (Math.random() - 0.5) * 0.3;
        double velocity = (Math.random() - 0.5) * 0.1;
        double acceleration = (Math.random() - 0.5) * 0.02;
        
        trend.put("currentDemand", currentDemand);
        trend.put("trend", velocity > 0.02 ? "increasing" : velocity < -0.02 ? "decreasing" : "stable");
        trend.put("velocity", velocity);
        trend.put("acceleration", acceleration);
        trend.put("confidence", 0.3 + (timeWindow / 100));
        
        // Predictions
        Map<String, Object> predictions = new HashMap<>();
        predictions.put("next15Min", Math.max(0.1, Math.min(0.95, currentDemand + (velocity * 3))));
        predictions.put("next30Min", Math.max(0.1, Math.min(0.95, currentDemand + (velocity * 6) + (acceleration * 18))));
        predictions.put("next60Min", Math.max(0.1, Math.min(0.95, currentDemand + (velocity * 12) + (acceleration * 72))));
        
        trend.put("prediction", predictions);
        
        return trend;
    }

    // Generate best booking times
    private List<Map<String, Object>> generateBestBookingTimes() {
        List<Map<String, Object>> times = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        for (int hour = 0; hour < 24; hour++) {
            LocalDateTime testTime = now.withHour(hour).withMinute(0).withSecond(0);
            if (testTime.isAfter(now)) {
                Map<String, Object> prediction = generateAIPrediction(testTime);
                Map<String, Object> timeInfo = new HashMap<>();
                timeInfo.put("time", testTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                timeInfo.put("availability", prediction.get("predictedOccupancy"));
                timeInfo.put("confidence", prediction.get("confidence"));
                timeInfo.put("recommendation", prediction.get("recommendation"));
                times.add(timeInfo);
            }
        }
        
        // Sort by availability (best first)
        times.sort((a, b) -> Double.compare((Double) a.get("availability"), (Double) b.get("availability")));
        
        return times.subList(0, Math.min(5, times.size()));
    }

    // Generate demand patterns
    private List<Map<String, Object>> generateDemandPatterns() {
        List<Map<String, Object>> patterns = new ArrayList<>();
        
        patterns.add(createPattern("Morning Rush (8-10 AM)", "high", "Book 30 minutes early", 0.92));
        patterns.add(createPattern("Lunch Time (12-2 PM)", "medium", "Book 15 minutes early", 0.78));
        patterns.add(createPattern("Evening Rush (5-7 PM)", "very_high", "Book 45 minutes early", 0.95));
        patterns.add(createPattern("Night Time (10 PM-6 AM)", "low", "Book on arrival", 0.88));
        
        return patterns;
    }

    private Map<String, Object> createPattern(String period, String demand, String recommendation, double confidence) {
        Map<String, Object> pattern = new HashMap<>();
        pattern.put("period", period);
        pattern.put("demand", demand);
        pattern.put("recommendation", recommendation);
        pattern.put("confidence", confidence);
        return pattern;
    }

    // Generate price optimizations
    private List<Map<String, Object>> generatePriceOptimizations() {
        List<Map<String, Object>> optimizations = new ArrayList<>();
        
        optimizations.add(createOptimization("Early Bird Discount", "20%", "Book 2+ hours early", 0.85));
        optimizations.add(createOptimization("Off-Peak Rates", "30%", "Book between 10 PM - 6 AM", 0.92));
        optimizations.add(createOptimization("Weekly Pass", "40%", "Book 7+ days", 0.78));
        
        return optimizations;
    }

    private Map<String, Object> createOptimization(String type, String savings, String condition, double confidence) {
        Map<String, Object> optimization = new HashMap<>();
        optimization.put("type", type);
        optimization.put("savings", savings);
        optimization.put("condition", condition);
        optimization.put("confidence", confidence);
        return optimization;
    }

    // Generate alternative locations
    private List<Map<String, Object>> generateAlternativeLocations() {
        List<Map<String, Object>> locations = new ArrayList<>();
        
        locations.add(createLocation("North Parking Garage", "0.8 km", 0.85, 12, 0.82));
        locations.add(createLocation("East Street Parking", "1.2 km", 0.72, 8, 0.75));
        locations.add(createLocation("Central Plaza", "0.5 km", 0.45, 18, 0.68));
        
        return locations;
    }

    private Map<String, Object> createLocation(String name, String distance, double availability, int price, double confidence) {
        Map<String, Object> location = new HashMap<>();
        location.put("name", name);
        location.put("distance", distance);
        location.put("availability", availability);
        location.put("price", price);
        location.put("confidence", confidence);
        return location;
    }
}
