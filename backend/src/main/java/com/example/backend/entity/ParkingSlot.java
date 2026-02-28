package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "parking_slots")
public class ParkingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    private String name;
    private String address;
    @Column(nullable = false)
    private Double latitude;
    @Column(nullable = false)
    private Double longitude;

    @Column(name = "hourly_rate")
    private Double pricePerHour;

    @Column(name = "total_spots")
    private Integer totalSpots;

    @Column(name = "available_spots")
    private Integer availableSpots;

    @Column(name = "daily_rate")
    private Double dailyRate = 0.0;

    public ParkingSlot() {}

    public ParkingSlot(String name, String address,
                       Double latitude, Double longitude,
                       Double pricePerHour,
                       Integer totalSpots,
                       Integer availableSpots,
                       Double dailyRate,
                       User owner) {

        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.pricePerHour = pricePerHour;
        this.totalSpots = totalSpots;
        this.availableSpots = availableSpots;
        this.dailyRate = (dailyRate != null)
                ? dailyRate
                : (pricePerHour != null ? pricePerHour * 12 : 0.0);

        this.owner = owner;
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

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(Double pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public Integer getTotalSpots() {
        return totalSpots;
    }

    public void setTotalSpots(Integer totalSpots) {
        this.totalSpots = totalSpots;
    }

    public Integer getAvailableSpots() {
        return availableSpots;
    }

    public void setAvailableSpots(Integer availableSpots) {
        this.availableSpots = availableSpots;
    }

    public Double getDailyRate() {
        return dailyRate;
    }

    public void setDailyRate(Double dailyRate) {
        this.dailyRate = dailyRate;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }
}
