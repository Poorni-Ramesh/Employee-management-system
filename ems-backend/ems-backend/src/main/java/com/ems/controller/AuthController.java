package com.ems.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.ems.config.JwtUtil;
import com.ems.dto.LoginRequest;
import com.ems.entity.Admin;
import com.ems.entity.Employee;
import com.ems.repository.AdminRepository;
import com.ems.service.EmployeeService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private EmployeeService service;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //  LOGIN API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        String email = req.getEmail();
        String password = req.getPassword();

        System.out.println("EMAIL FROM FRONTEND: " + email);

        //  1. EMPLOYEE LOGIN
        Employee emp = service.getByEmail(email);

        if (emp != null) {

            System.out.println("EMPLOYEE FOUND");
            System.out.println("DB PASSWORD: " + emp.getPassword());
            System.out.println("INPUT PASSWORD: " + password);

            boolean match = passwordEncoder.matches(password, emp.getPassword());
            System.out.println("MATCH RESULT: " + match);

            if (!match) {
                return ResponseEntity.badRequest().body("Invalid password");
            }

            String token = jwtUtil.generateToken(emp.getEmail(), "ROLE_"+emp.getRole().toString());

            Map<String, Object> response = new HashMap<>();
            response.put("email", emp.getEmail());
            response.put("role", emp.getRole());
            response.put("token", token);
            response.put("id", emp.getId());

            return ResponseEntity.ok(response);
        }

        //  2. ADMIN LOGIN
        Admin admin = adminRepository.findByEmail(email);

        System.out.println("ADMIN FROM DB: " + admin);

        if (admin != null) {

            System.out.println("DB PASSWORD: " + admin.getPassword());
            System.out.println("INPUT PASSWORD: " + password);

            boolean match = passwordEncoder.matches(password, admin.getPassword());
            System.out.println("MATCH RESULT: " + match);

            if (!match) {
                return ResponseEntity.badRequest().body("Invalid password");
            }

            String token = jwtUtil.generateToken(admin.getEmail(), "ROLE_ADMIN");

            Map<String, Object> response = new HashMap<>();
            response.put("email", admin.getEmail());
            response.put("role", "ADMIN");
            response.put("token", token);
            response.put("id", admin.getId());

            return ResponseEntity.ok(response);
        }

        //  USER NOT FOUND
        return ResponseEntity.badRequest().body("User not found");
    }
}