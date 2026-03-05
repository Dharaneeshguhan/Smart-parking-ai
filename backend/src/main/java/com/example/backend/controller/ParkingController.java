package com.example.backend.controller;

import com.example.backend.dto.ParkingSearchResponse;
import com.example.backend.entity.ParkingSlot;
import com.example.backend.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/parking")
public class ParkingController {

    @Autowired
    private ParkingService parkingService;

    @PostMapping("/search")
    public ResponseEntity<List<ParkingSearchResponse>> searchParking(@RequestBody Object request) {
        List<ParkingSearchResponse> bestSlots = parkingService.searchParking(request);
        return ResponseEntity.ok(bestSlots);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ParkingSearchResponse>> searchParkingByTime(
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam Integer duration,
            @RequestParam(required = false) Double userLat,
            @RequestParam(required = false) Double userLng,
            @RequestParam(required = false) Double destinationLat,
            @RequestParam(required = false) Double destinationLng
    ) {
        System.out.println("=== API REQUEST DEBUG ===");
        System.out.println("Date: " + date);
        System.out.println("StartTime: " + startTime);
        System.out.println("Duration: " + duration);
        System.out.println("UserLat: " + userLat);
        System.out.println("UserLng: " + userLng);
        
        try {
            List<ParkingSearchResponse> availableSlots = parkingService.searchParkingByTime(
                    date, startTime, duration, userLat, userLng, destinationLat, destinationLng);
            return ResponseEntity.ok(availableSlots);
        } catch (Exception e) {
            System.out.println("Error in searchParkingByTime: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingSearchResponse> getParkingDetails(@PathVariable Long id) {
        ParkingSlot slot = parkingService.getParkingDetails(id);
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
        return ResponseEntity.ok(response);
    }

    @GetMapping("/slots/{slotId}/unavailable-times")
    public ResponseEntity<List<Object>> getUnavailableTimeRanges(@PathVariable Long slotId) {
        List<Object> unavailableTimes = parkingService.getUnavailableTimeRanges(slotId);
        return ResponseEntity.ok(unavailableTimes);
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<?> addToFavorites(@PathVariable Long id, org.springframework.security.core.Authentication authentication) {
        parkingService.addToFavorites(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/favorite")
    public ResponseEntity<?> removeFromFavorites(@PathVariable Long id, org.springframework.security.core.Authentication authentication) {
        parkingService.removeFromFavorites(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<ParkingSearchResponse>> getFavorites(org.springframework.security.core.Authentication authentication) {
        return ResponseEntity.ok(parkingService.getFavorites(authentication.getName()));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Object>> getMyBookings() {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ParkingSearchResponse>> getNearbyParking(
            @RequestParam double lat,
            @RequestParam double lng
    ) {
        return ResponseEntity.ok(parkingService.getNearbyParking(lat, lng));
    }
}
