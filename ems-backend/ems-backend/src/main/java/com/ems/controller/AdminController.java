package com.ems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.ems.entity.Employee;
import com.ems.service.EmployeeService;

import jakarta.servlet.http.HttpServletRequest;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private EmployeeService service;

 
    
    //  GET ALL EMPLOYEES (ADMIN ONLY)
    @GetMapping("/employees")
    public List<Employee> getAll(HttpServletRequest request) {
        return service.getAllEmployees();
    }
   
    @PutMapping("/update/{id}")
    public Employee update(@PathVariable Long id,
                           @RequestBody Employee emp) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {

            return service.updateEmployee(id, emp);
        }

        throw new RuntimeException("Access Denied");
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        System.out.println("AUTHORITIES >>> " + auth.getAuthorities());

        if (auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("ADMIN"))) {

            service.delete(id);
            return "Employee Deleted Successfully";
        }

        throw new RuntimeException("Access Denied");
    }
   
}

