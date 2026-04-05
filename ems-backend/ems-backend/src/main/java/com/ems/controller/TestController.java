package com.ems.controller;

import com.ems.entity.Admin;
import com.ems.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/test-seed")
    public ResponseEntity<String> testSeed() {
        try {
            if (adminRepository.findByEmail("admin@gmail.com") == null) {
                Admin admin = new Admin();
                admin.setName("Admin");
                admin.setEmail("admin@gmail.com"); 
                admin.setPassword(passwordEncoder.encode("admin123")); 
                admin.setRole("ADMIN");
                admin.setStatus("ACTIVE"); 
                adminRepository.save(admin);
                return ResponseEntity.ok("Successfully seeded Admin user! (admin@gmail.com / admin123)");
            } else {
                return ResponseEntity.ok("Admin already exists!");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error talking to database: " + e.getMessage() + " | " + e.toString());
        }
    }
}
