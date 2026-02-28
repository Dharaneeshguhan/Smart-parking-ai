package com.example.backend.controller;

import com.example.backend.dto.ParkingSearchRequest;
import com.example.backend.dto.ParkingSearchResponse;
import com.example.backend.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Object>> getMyBookings() {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<Object>> getFavorites() {
        return ResponseEntity.ok(List.of());
    }
}
