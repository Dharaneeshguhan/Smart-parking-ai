package com.example.backend.config;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.entity.ParkingSlot;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.ParkingSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        fixDatabaseSchema();
        initializeRoles();
        initializeParkingSlots();
    }
    
    private void fixDatabaseSchema() {
        System.out.println("Running one-time schema permanent fix...");
        try {
            // Renaming the problematic available_slots to available_spots to match the entity
            jdbcTemplate.execute("ALTER TABLE parking_slots CHANGE COLUMN available_slots available_spots INT NOT NULL DEFAULT 0");
            System.out.println("Renamed available_slots to available_spots successfully.");
        } catch (Exception e) {
            System.out.println("No available_slots column found to rename or error: " + e.getMessage());
        }
        
        try {
            // Also renaming total_slots to total_spots for consistency with the entity
            jdbcTemplate.execute("ALTER TABLE parking_slots CHANGE COLUMN total_slots total_spots INT NOT NULL DEFAULT 0");
            System.out.println("Renamed total_slots to total_spots successfully.");
        } catch (Exception e) {
            System.out.println("No total_slots column found to rename or error: " + e.getMessage());
        }
    }
    
    private void initializeRoles() {
        if (!roleRepository.findByName(Role.UserRole.ROLE_DRIVER).isPresent()) {
            Role driverRole = new Role();
            driverRole.setName(Role.UserRole.ROLE_DRIVER);
            roleRepository.save(driverRole);
        }
        
        if (!roleRepository.findByName(Role.UserRole.ROLE_OWNER).isPresent()) {
            Role ownerRole = new Role();
            ownerRole.setName(Role.UserRole.ROLE_OWNER);
            roleRepository.save(ownerRole);
        }
    }

    private void initializeParkingSlots() {
        if (parkingSlotRepository.count() == 0) {
            // Find or create an owner user
            User owner = userRepository.findByEmail("admin@owner.com").orElseGet(() -> {
                User newOwner = new User();
                newOwner.setName("Super Admin");
                newOwner.setEmail("admin@owner.com");
                newOwner.setPassword(passwordEncoder.encode("password123"));
                
                Role ownerRole = roleRepository.findByName(Role.UserRole.ROLE_OWNER).get();
                newOwner.getRoles().add(ownerRole);
                return userRepository.save(newOwner);
            });

            // Add fake Chennai based parking locations
            parkingSlotRepository.save(new ParkingSlot("Marina Beach Parking", "Marina Beach Road, Chennai", 13.0543, 80.2818, 50.0, 100, 45, null, owner));
            parkingSlotRepository.save(new ParkingSlot("Express Avenue Mall", "Royapettah, Chennai", 13.0587, 80.2641, 100.0, 500, 120, null, owner));
            parkingSlotRepository.save(new ParkingSlot("T Nagar Hub", "T Nagar, Chennai", 13.0405, 80.2337, 80.0, 200, 15, null, owner));
            parkingSlotRepository.save(new ParkingSlot("Chennai Central Station", "Park Town, Chennai", 13.0827, 80.2707, 40.0, 300, 250, null, owner));
            parkingSlotRepository.save(new ParkingSlot("Forum Vijaya Mall", "Vadapalani, Chennai", 13.0494, 80.2093, 120.0, 400, 80, null, owner));
        }
    }
}
