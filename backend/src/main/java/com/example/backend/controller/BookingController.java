package com.example.backend.controller;

import com.example.backend.dto.BookingDto;
import com.example.backend.dto.BookingRequest;
import com.example.backend.entity.Booking;
import com.example.backend.entity.ParkingSlot;
import com.example.backend.entity.User;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.ParkingSlotRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AvailabilityService availabilityService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ParkingSlot slot = parkingSlotRepository.findById(request.getParkingSlotId())
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));

        // Validate that the requested time slot is available
        List<Booking> conflictingBookings = bookingRepository.findByParkingSlotInAndStatus(
            List.of(slot), "CONFIRMED"
        ).stream()
        .filter(booking -> {
            LocalDateTime bookingStart = booking.getStartTime();
            LocalDateTime bookingEnd = booking.getEndTime();
            LocalDateTime requestStart = request.getStartTime();
            LocalDateTime requestEnd = request.getEndTime();

            // Check for overlap: request starts before booking ends AND request ends after booking starts
            return requestStart.isBefore(bookingEnd) && requestEnd.isAfter(bookingStart);
        })
        .collect(Collectors.toList());

        if (!conflictingBookings.isEmpty()) {
            return ResponseEntity.status(409).body("Slot not available for selected time.");
        }

        Booking booking = new Booking(
                user,
                slot,
                request.getStartTime(),
                request.getEndTime(),
                "CONFIRMED",
                request.getTotalAmount()
        );

        Booking savedBooking = bookingRepository.save(booking);

        // Update availability after booking creation
        availabilityService.updateAvailabilityAfterBookingCreation(slot.getId());

        return ResponseEntity.ok(convertToDto(savedBooking));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingDto>> getMyBookings(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings = bookingRepository.findByUser(user);

        // Update status to COMPLETED for bookings that have ended
        LocalDateTime now = LocalDateTime.now();
        List<Booking> bookingsToUpdate = bookings.stream()
                .filter(booking -> !"COMPLETED".equals(booking.getStatus()) && booking.getEndTime().isBefore(now))
                .collect(Collectors.toList());

        if (!bookingsToUpdate.isEmpty()) {
            bookingsToUpdate.forEach(booking -> booking.setStatus("COMPLETED"));
            bookingRepository.saveAll(bookingsToUpdate);
        }

        List<BookingDto> dtos = bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify the booking belongs to the authenticated user
        if (!booking.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You can only cancel your own bookings");
        }

        // Only allow cancellation if booking is confirmed and not in the past
        if (!"CONFIRMED".equals(booking.getStatus())) {
            return ResponseEntity.badRequest().body("Only confirmed bookings can be cancelled");
        }

        if (booking.getStartTime().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Cannot cancel past bookings");
        }

        // Booking can be cancelled ONLY if current_time <= booking_start_time - 1 hour
        java.time.LocalDateTime oneHourBeforeStart = booking.getStartTime().minusHours(1);
        if (java.time.LocalDateTime.now().isAfter(oneHourBeforeStart)) {
            return ResponseEntity.badRequest().body("Bookings can only be cancelled at least 1 hour before the start time");
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        // Update availability after booking cancellation
        availabilityService.updateAvailabilityAfterBookingCancellation(booking.getParkingSlot().getId());

        return ResponseEntity.ok(convertToDto(booking));
    }

    @GetMapping("/payments")
    public ResponseEntity<List<java.util.Map<String, Object>>> getPayments(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings = bookingRepository.findByUser(user);

        List<java.util.Map<String, Object>> payments = bookings.stream()
                .map(b -> {
                    java.util.Map<String, Object> p = new java.util.HashMap<>();
                    p.put("id", b.getId());
                    p.put("transactionId", "TXN" + String.format("%06d", b.getId()));
                    p.put("bookingId", "BK" + b.getId());
                    p.put("parkingName", b.getParkingSlot().getName());
                    p.put("date", b.getStartTime().toLocalDate().toString());
                    p.put("time", b.getStartTime().toLocalTime().toString());
                    p.put("amount", b.getTotalAmount());
                    p.put("paymentMethod", "credit_card"); // default
                    p.put("status", "completed"); // confirmed booking is completed payment
                    p.put("type", "booking");
                    p.put("description", "Parking at " + b.getParkingSlot().getName());
                    p.put("createdAt", b.getCreatedAt().toString());
                    return p;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(payments);
    }

    @GetMapping("/unavailable-times/{slotId}")
    public ResponseEntity<List<java.util.Map<String, Object>>> getUnavailableTimeRanges(@PathVariable Long slotId) {
        ParkingSlot slot = parkingSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));

        // Get all confirmed bookings for this slot
        List<Booking> bookings = bookingRepository.findByParkingSlotInAndStatus(
            List.of(slot), "CONFIRMED"
        );

        List<java.util.Map<String, Object>> unavailableRanges = bookings.stream()
                .map(booking -> {
                    java.util.Map<String, Object> range = new java.util.HashMap<>();
                    range.put("startTime", booking.getStartTime().toString());
                    range.put("endTime", booking.getEndTime().toString());
                    range.put("bookingId", booking.getId());
                    return range;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(unavailableRanges);
    }

    @GetMapping("/payments/{id}/receipt")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify the booking belongs to the authenticated user
        if (!booking.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        // Generate receipt content
        StringBuilder receipt = new StringBuilder();
        receipt.append("================================\n");
        receipt.append("        PARKING RECEIPT         \n");
        receipt.append("================================\n\n");
        receipt.append("Transaction ID: TXN").append(String.format("%06d", booking.getId())).append("\n");
        receipt.append("Booking ID: BK").append(booking.getId()).append("\n");
        receipt.append("Date: ").append(booking.getStartTime().toLocalDate()).append("\n");
        receipt.append("Time: ").append(booking.getStartTime().toLocalTime()).append("\n\n");
        receipt.append("Location: ").append(booking.getParkingSlot().getName()).append("\n");
        receipt.append("Address: ").append(booking.getParkingSlot().getAddress()).append("\n\n");
        receipt.append("Duration: ").append(java.time.Duration.between(booking.getStartTime(), booking.getEndTime()).toHours()).append(" hours\n");
        receipt.append("Amount: ₹").append(String.format("%.2f", booking.getTotalAmount())).append("\n");
        receipt.append("Status: ").append(booking.getStatus()).append("\n\n");
        receipt.append("Thank you for using Smart Parking!\n");
        receipt.append("================================\n");

        // Return as downloadable text file
        HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receipt_" + booking.getId() + ".txt");
        headers.add(HttpHeaders.CONTENT_TYPE, "text/plain");

        return ResponseEntity.ok()
                .headers(headers)
                .body(receipt.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8));
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
        dto.setLatitude(booking.getParkingSlot().getLatitude());
        dto.setLongitude(booking.getParkingSlot().getLongitude());
        return dto;
    }
}
