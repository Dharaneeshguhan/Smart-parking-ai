package com.example.backend.service;

import com.example.backend.dto.JwtResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.SignupRequest;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtils;
import com.example.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    public ResponseEntity<?> authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("ROLE_DRIVER");
        
        return ResponseEntity.ok(new JwtResponse(jwt,
                "Bearer",
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                role));
    }
    
    public ResponseEntity<?> registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }
        
        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        
        Set<Role> roles = new HashSet<>();
        
        if (signUpRequest.getRole().equalsIgnoreCase("owner")) {
            Role ownerRole = roleRepository.findByName(Role.UserRole.ROLE_OWNER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(ownerRole);
        } else {
            Role driverRole = roleRepository.findByName(Role.UserRole.ROLE_DRIVER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(driverRole);
        }
        
        user.setRoles(roles);
        userRepository.save(user);
        
        return ResponseEntity.ok("User registered successfully!");
    }
}
