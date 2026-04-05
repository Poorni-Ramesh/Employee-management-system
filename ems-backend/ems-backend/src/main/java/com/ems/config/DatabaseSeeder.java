package com.ems.config;

import com.ems.entity.Admin;
import com.ems.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin already exists
        if (adminRepository.count() == 0) {
            System.out.println("No Admin found in database. Seeding a default Admin...");
            
            Admin admin = new Admin();
            admin.setName("Admin");
            admin.setEmail("admin@gmail.com"); 
            admin.setPassword(passwordEncoder.encode("admin123")); // Set default password
            admin.setRole("ADMIN");
            admin.setStatus("ACTIVE"); 
            
            adminRepository.save(admin);
            System.out.println("Default Admin seeded successfully: admin@gmail.com / admin123");
        } else {
            System.out.println("Admin already exists in database. Skipping seed.");
        }
    }
}
