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
            Admin admin = adminRepository.findByEmail("admin@gmail.com");
            if (admin == null) {
                admin = new Admin();
                admin.setEmail("admin@gmail.com");
                admin.setName("Admin");
                admin.setRole("ADMIN");
                admin.setStatus("ACTIVE"); 
            }
            
            // Force reset the password to exactly this: admin123
            admin.setPassword(passwordEncoder.encode("admin123")); 
            adminRepository.save(admin);
            
            return ResponseEntity.ok("Successfully force-reset Admin user! Login with email: admin@gmail.com and password: admin123 (No @ symbol!)");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error talking to database: " + e.getMessage() + " | " + e.toString());
        }
    }
}
