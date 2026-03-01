package com.example.backend.controller;

import com.example.backend.dto.BookingDto;
import com.example.backend.dto.BookingRequest;
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

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ParkingSlot slot = parkingSlotRepository.findById(request.getParkingSlotId())
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));

        Booking booking = new Booking(
                user,
                slot,
                request.getStartTime(),
                request.getEndTime(),
                "CONFIRMED",
                request.getTotalAmount()
        );

        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(convertToDto(savedBooking));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingDto>> getMyBookings(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings = bookingRepository.findByUser(user);
        
        List<BookingDto> dtos = bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
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
