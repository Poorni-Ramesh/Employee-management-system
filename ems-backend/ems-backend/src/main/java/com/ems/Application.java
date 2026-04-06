package com.ems;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ems.entity.Admin;
import com.ems.repository.AdminRepository;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public CommandLineRunner seedAdmin(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "aarthi7813@gmail.com";
            if (adminRepository.findByEmail(adminEmail) == null) {
                Admin admin = new Admin();
                admin.setName("Aarthi");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("Aarthi13"));
                admin.setRole("ADMIN");
                admin.setStatus("ACTIVE");
                adminRepository.save(admin);
                System.out.println("Admin user seeded successfully ✅");
            } else {
                System.out.println("Admin already exists in database. Skipping seed.");
            }
        };
    }
}