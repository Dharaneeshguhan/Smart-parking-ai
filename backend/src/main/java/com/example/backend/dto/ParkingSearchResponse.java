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
    private double score;
    private int totalSpots;

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
        this.score = score;
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
}
