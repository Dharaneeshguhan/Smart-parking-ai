package com.example.backend.controller;

import com.example.backend.dto.ParkingSearchRequest;
import com.example.backend.dto.ParkingSearchResponse;
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
    public ResponseEntity<List<ParkingSearchResponse>> searchParking(@RequestBody ParkingSearchRequest request) {
        List<ParkingSearchResponse> bestSlots = parkingService.searchParking(request);
        return ResponseEntity.ok(bestSlots);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingSearchResponse> getParkingDetails(@PathVariable Long id) {
        return ResponseEntity.ok(parkingService.getDetailedResponse(id));
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
            @RequestParam double lng) {
        return ResponseEntity.ok(parkingService.getNearbyParking(lat, lng));
    }
}
