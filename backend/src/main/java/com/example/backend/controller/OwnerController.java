package com.example.backend.controller;

import com.example.backend.dto.AddSlotRequest;
import com.example.backend.dto.BookingDto;
import com.example.backend.dto.OwnerEarningsDto;
import com.example.backend.entity.Booking;
import com.example.backend.entity.ParkingSlot;
import com.example.backend.entity.User;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.ParkingSlotRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/owner")
public class OwnerController {

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/slots")
    public ResponseEntity<?> addSlot(@RequestBody AddSlotRequest request, Authentication authentication) {
        if (authentication == null || authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Authentication required");
        }
        
        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        // Validate Coordinates
        if (request.getLatitude() == null || request.getLatitude() < -90 || request.getLatitude() > 90) {
            return ResponseEntity.badRequest().body("Invalid latitude. Must be between -90 and 90.");
        }
        if (request.getLongitude() == null || request.getLongitude() < -180 || request.getLongitude() > 180) {
            return ResponseEntity.badRequest().body("Invalid longitude. Must be between -180 and 180.");
        }

        ParkingSlot newSlot = new ParkingSlot(
                request.getName(),
                request.getAddress(),
                request.getLatitude(),
                request.getLongitude(),
                request.getPricePerHour(),
                request.getTotalSpots(),
                request.getTotalSpots(), // initially available spots = total spots
                request.getDailyRate(),
                owner
        );

        ParkingSlot savedSlot = parkingSlotRepository.save(newSlot);
        return ResponseEntity.ok(savedSlot);
    }

    @GetMapping("/slots")
    public ResponseEntity<List<ParkingSlot>> getMySlots(Authentication authentication) {
        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        List<ParkingSlot> slots = parkingSlotRepository.findByOwner(owner);
        return ResponseEntity.ok(slots);
    }

    @PutMapping("/slots/{id}")
    public ResponseEntity<?> updateSlot(@PathVariable Long id, @RequestBody AddSlotRequest request, Authentication authentication) {
        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));

        // Verify ownership
        if (!slot.getOwner().getId().equals(owner.getId())) {
            return ResponseEntity.status(403).body("You can only update your own slots");
        }

        // Update slot details
        slot.setName(request.getName());
        slot.setAddress(request.getAddress());
        slot.setLatitude(request.getLatitude());
        slot.setLongitude(request.getLongitude());
        slot.setPricePerHour(request.getPricePerHour());
        slot.setTotalSpots(request.getTotalSpots());
        slot.setAvailableSpots(request.getTotalSpots()); // Reset available spots to total
        slot.setDailyRate(request.getDailyRate());

        ParkingSlot updatedSlot = parkingSlotRepository.save(slot);
        return ResponseEntity.ok(updatedSlot);
    }

    @DeleteMapping("/slots/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id, Authentication authentication) {
        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));

        // Verify ownership
        if (!slot.getOwner().getId().equals(owner.getId())) {
            return ResponseEntity.status(403).body("You can only delete your own slots");
        }

        // Check if slot has any active bookings
        List<Booking> activeBookings = bookingRepository.findByParkingSlotInAndStatus(
            List.of(slot), "CONFIRMED"
        ).stream()
        .filter(booking -> booking.getEndTime().isAfter(LocalDateTime.now()))
        .collect(Collectors.toList());

        if (!activeBookings.isEmpty()) {
            return ResponseEntity.badRequest().body("Cannot delete slot with active bookings. Cancel all bookings first.");
        }

        parkingSlotRepository.delete(slot);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDto>> getMySlotBookings(Authentication authentication) {
        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        List<ParkingSlot> ownerSlots = parkingSlotRepository.findByOwner(owner);

        // Assuming BookingRepository has a method to find by a list of slots
        List<Booking> bookings = bookingRepository.findByParkingSlotIn(ownerSlots);

        List<BookingDto> dtos = bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(Authentication authentication) {
        if (authentication == null || authentication.getName().equals("anonymousUser")) {
             return ResponseEntity.status(401).body("Authentication required");
        }
        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        List<ParkingSlot> ownerSlots = parkingSlotRepository.findByOwner(owner);
        int totalLocations = ownerSlots.size();
        int totalSpotsCount = ownerSlots.stream().mapToInt(ParkingSlot::getTotalSpots).sum();
        int availableSpotsCount = ownerSlots.stream().mapToInt(ParkingSlot::getAvailableSpots).sum();
        int occupiedSpotsCount = totalSpotsCount - availableSpotsCount;

        List<Booking> bookings = bookingRepository.findByParkingSlotIn(ownerSlots);
        double totalEarnings = bookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .mapToDouble(Booking::getTotalAmount)
                .sum();

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalSlots", totalLocations);
        stats.put("totalSpots", totalSpotsCount);
        stats.put("occupiedSlots", occupiedSpotsCount);
        stats.put("totalEarnings", totalEarnings);
        stats.put("monthlyRevenue", totalEarnings); // For now same as total

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/earnings")
    public ResponseEntity<OwnerEarningsDto> getEarnings(Authentication authentication) {
        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        List<ParkingSlot> ownerSlots = parkingSlotRepository.findByOwner(owner);
        List<Booking> confirmedBookings = bookingRepository.findByParkingSlotInAndStatus(ownerSlots, "CONFIRMED");

        double totalEarnings = confirmedBookings.stream()
                .mapToDouble(Booking::getTotalAmount)
                .sum();

        OwnerEarningsDto earningsDto = new OwnerEarningsDto(totalEarnings, confirmedBookings.size());
        return ResponseEntity.ok(earningsDto);
    }

    private BookingDto convertToDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setParkingSlotId(booking.getParkingSlot().getId());
        dto.setParkingSlotName(booking.getParkingSlot().getName());
        dto.setParkingSlotAddress(booking.getParkingSlot().getAddress());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setStatus(booking.getStatus());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUserName(booking.getUser().getName());
        return dto;
    }
}
