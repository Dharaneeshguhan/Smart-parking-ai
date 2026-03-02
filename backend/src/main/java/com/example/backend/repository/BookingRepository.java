package com.example.backend.repository;

import com.example.backend.entity.Booking;
import com.example.backend.entity.ParkingSlot;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByParkingSlotIn(List<ParkingSlot> parkingSlots);
    List<Booking> findByParkingSlotInAndStatus(List<ParkingSlot> parkingSlots, String status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.parkingSlot = :parkingSlot AND b.status = :status AND b.endTime > :currentTime")
    long countByParkingSlotAndStatusAndEndTimeAfter(@Param("parkingSlot") ParkingSlot parkingSlot, @Param("status") String status, @Param("currentTime") LocalDateTime currentTime);
}
