package com.ems.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ems.config.JwtUtil;
import com.ems.entity.Employee;

import com.ems.service.EmployeeService;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService service;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
   
  
     
 
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> data,
            @RequestHeader("Authorization") String token) {

        String jwt = token.substring(7);
        String email = jwtUtil.extractUsername(jwt);

        String currentPassword = data.get("currentPassword");
        String newPassword = data.get("newPassword");

        Employee emp = service.getByEmail(email);

        if (emp == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (!passwordEncoder.matches(currentPassword, emp.getPassword())) {
            return ResponseEntity.badRequest().body("Wrong current password");
        }

        emp.setPassword(passwordEncoder.encode(newPassword));
        service.save(emp);

        //  JSON response
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password updated successfully");

        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(service.getAllEmployees());
    }

    // ADD
    @PostMapping
    public ResponseEntity<Employee> addEmployee(@RequestBody Employee emp) {
        return ResponseEntity.ok(service.saveEmployee(emp));
    }
    @GetMapping("/profile")
    public ResponseEntity<Employee> getProfile(@RequestParam String email) {

        System.out.println("EMAIL RECEIVED: " + email);

        Employee emp = service.getByEmail(email);

        if (emp == null) {
            throw new RuntimeException("Employee not found"); // ✅ simple
        }

        return ResponseEntity.ok(emp);
    }
    @GetMapping("/encrypt-passwords")
    public String encryptPasswords() {
        service.encryptAllPasswords();
        return "All passwords encrypted ✅";
    }
   
 // GET BY ID (for edit)
    @GetMapping("/id/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        try {
            Employee emp = service.getEmployeeById(id);
            return ResponseEntity.ok(emp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody Employee emp,
                                    @RequestHeader("Authorization") String token) {

        String jwt = token.substring(7);
        String role = jwtUtil.extractRole(jwt);
         role=role.replace("ROLE_","");

        //  ADMIN → full access
        if ("ADMIN".equals(role)) {
            return ResponseEntity.ok(service.updateEmployee(id, emp));
        }

        //  MANAGER → allow update 
        if ("MANAGER".equals(role)) {
            return ResponseEntity.ok(service.updateEmployee(id, emp));
        }

        // EMPLOYEE → allow self update
        if ("EMPLOYEE".equals(role)) {
            return ResponseEntity.ok(service.updateEmployee(id, emp));
        }

        return ResponseEntity.status(403).body("Access denied");
    }
    
    
    @PutMapping("/reset-password/{id}")
    public ResponseEntity<?> resetPassword(@PathVariable Long id) {
        try {
            service.resetPassword(id);
            return ResponseEntity.ok("Password reset to emp@123");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Employee not found");
        }
    }

    @DeleteMapping("/delete/{id}")
    public String deleteEmployee(@PathVariable Long id) {

        service.delete(id); // ✅ correct

        return "Deleted successfully";
    }
    
    // DASHBOARD
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(service.getEmployeeStats());
    }

    @GetMapping("/manager/employees")
    public ResponseEntity<List<Employee>> getEmployeesForManager(
            @RequestHeader("Authorization") String token) {

        String jwt = token.substring(7);
        String email = jwtUtil.extractUsername(jwt);

        Employee manager = service.getByEmail(email);

        System.out.println("MANAGER EMAIL: " + email);
        System.out.println("MANAGER ID: " + manager.getId());

        return ResponseEntity.ok(service.getEmployeesByManager(manager.getId()));
    }   
}
