package com.example.backend.dto;

public class OwnerEarningsDto {
    private Double totalEarnings;
    private int totalBookings;

    public OwnerEarningsDto(Double totalEarnings, int totalBookings) {
        this.totalEarnings = totalEarnings;
        this.totalBookings = totalBookings;
    }

    public Double getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(Double totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public int getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(int totalBookings) {
        this.totalBookings = totalBookings;
    }
}
