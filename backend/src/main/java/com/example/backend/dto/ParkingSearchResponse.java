package com.example.backend.dto;

import com.example.backend.entity.ParkingSlot;

public class ParkingSearchResponse {

    private Long id;
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    
    // Calculated fields
    private double distance;
    private String trafficLevel;
    private double pricePerHour;
    private int predictedAvailableSpots;
    private int availableSpots;
    private double score;
    private int totalSpots;
    
    // Availability fields
    private int availabilityPercent;
    private String availabilityStatus;
    private int aiPredictedAvailability;
    private boolean recommended;
    private boolean available;
    private String reason;

    // UI Mock Fields for compatibility
    private java.util.List<String> amenities;
    private String operatingHours;
    private String image;
    private String lastVisited;
    private int visitCount;

    public ParkingSearchResponse() {
    }

    public ParkingSearchResponse(ParkingSlot slot, double distance, String trafficLevel, int predictedAvailableSpots, double score) {
        this.id = slot.getId();
        this.name = slot.getName();
        this.address = slot.getAddress();
        this.latitude = slot.getLatitude();
        this.longitude = slot.getLongitude();
        this.pricePerHour = slot.getPricePerHour();
        this.totalSpots = slot.getTotalSpots();
        
        this.distance = distance;
        this.trafficLevel = trafficLevel;
        this.predictedAvailableSpots = predictedAvailableSpots;
        this.availableSpots = predictedAvailableSpots;
        this.score = score;
        
        // Defaults
        this.amenities = java.util.List.of("Security", "24/7 Access", "EV Charging");
        this.operatingHours = "24/7";
        this.image = "https://images.unsplash.com/photo-1579532586980-284d4fd16b91?w=800";
        this.visitCount = 0;
        this.lastVisited = null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = Math.round(distance * 100.0) / 100.0;
    }

    public String getTrafficLevel() {
        return trafficLevel;
    }

    public void setTrafficLevel(String trafficLevel) {
        this.trafficLevel = trafficLevel;
    }

    public double getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(double pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public int getPredictedAvailableSpots() {
        return predictedAvailableSpots;
    }

    public void setPredictedAvailableSpots(int predictedAvailableSpots) {
        this.predictedAvailableSpots = predictedAvailableSpots;
        this.availableSpots = predictedAvailableSpots;
    }

    public int getAvailableSpots() {
        return availableSpots;
    }

    public void setAvailableSpots(int availableSpots) {
        this.availableSpots = availableSpots;
        this.predictedAvailableSpots = availableSpots;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = Math.round(score * 100.0) / 100.0;
    }
    
    public int getTotalSpots() {
        return totalSpots;
    }

    public void setTotalSpots(int totalSpots) {
        this.totalSpots = totalSpots;
    }

    public java.util.List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(java.util.List<String> amenities) {
        this.amenities = amenities;
    }

    public String getOperatingHours() {
        return operatingHours;
    }

    public void setOperatingHours(String operatingHours) {
        this.operatingHours = operatingHours;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getLastVisited() {
        return lastVisited;
    }

    public void setLastVisited(String lastVisited) {
        this.lastVisited = lastVisited;
    }

    public int getVisitCount() {
        return visitCount;
    }

    public void setVisitCount(int visitCount) {
        this.visitCount = visitCount;
    }

    // Availability field getters and setters
    public int getAvailabilityPercent() {
        return availabilityPercent;
    }

    public void setAvailabilityPercent(int availabilityPercent) {
        this.availabilityPercent = availabilityPercent;
    }

    public String getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(String availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public int getAiPredictedAvailability() {
        return aiPredictedAvailability;
    }

    public void setAiPredictedAvailability(int aiPredictedAvailability) {
        this.aiPredictedAvailability = aiPredictedAvailability;
    }

    public boolean isRecommended() {
        return recommended;
    }

    public void setRecommended(boolean recommended) {
        this.recommended = recommended;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
