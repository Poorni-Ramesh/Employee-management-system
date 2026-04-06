package com.ems.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ems.entity.Employee;
import com.ems.entity.Role;
import com.ems.entity.Status;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.EmployeeRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository repo;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
   
   @Autowired
   private AttendanceRepository attendanceRepository;
    
    

    public Employee saveEmployee(Employee e) {

        // FIND MANAGER BASED ON DEPARTMENT (ONLY IF NEW EMPLOYEE IS NOT A MANAGER)
        if (e.getRole() != Role.MANAGER) {
            Employee manager = repo
                .findByDepartmentAndRole(e.getDepartment(), Role.MANAGER)
                .orElseThrow(() ->
                    new RuntimeException("Manager not found for department: " + e.getDepartment())
                );
            // ASSIGN MANAGER
            e.setManager(manager);
        } else {
            // Managers don't need a manager assigned
            e.setManager(null);
        }

        // PASSWORD LOGIC
        String password = e.getPassword();

        if (password == null || password.trim().isEmpty()) {
            password = "emp@123";
        }

        e.setPassword(passwordEncoder.encode(password));

        //  SAVE
        return repo.save(e);
    }
    
    public Employee save(Employee emp) {
    	return repo.save(emp);
    }

    // READ ALL
    public List<Employee> getAllEmployees() {
        return repo.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return repo.findById(id).orElse(null);
    }
    
    

    // READ BY EMAIL
    public Employee getByEmail(String email) {
        return repo.findByEmail(email).orElse(null);
    }
    public boolean checkPassword(String inputPassword, String storedPassword) {
        return passwordEncoder.matches(inputPassword, storedPassword);
    }



    @Transactional
    public void delete(Long id) {

        Employee emp = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Safeguard: Prevent deleting a MANAGER directly
        if (emp.getRole() == Role.MANAGER) {
            throw new RuntimeException("Cannot delete a MANAGER directly. Please re-assign their employees and change their role first.");
        }

        //  1: delete attendance (VERY IMPORTANT)
        attendanceRepository.deleteByEmployeeId(id);

        //  2: remove manager references
        List<Employee> list = repo.findAll();

        for (Employee e : list) {
            if (e.getManager() != null && e.getManager().getId().equals(id)) {
                e.setManager(null);
            }
        }

        // 3: delete employee
        repo.deleteById(id);
    }

    // UPDATE 
    public Employee updateEmployee(Long id, Employee emp) {

        Employee existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Email duplicate check
        if (!existing.getEmail().equals(emp.getEmail())) {
            if (repo.findByEmail(emp.getEmail()).isPresent()) {
                throw new RuntimeException("Email already exists");
            }
            existing.setEmail(emp.getEmail());
        }

        existing.setName(emp.getName());

        // Password update only if provided
        if (emp.getPassword() != null && !emp.getPassword().isEmpty()) {
           existing.setPassword(passwordEncoder.encode(emp.getPassword()));  
           }

        existing.setRole(emp.getRole());
        existing.setDepartment(emp.getDepartment());
        existing.setStatus(emp.getStatus());

        return repo.save(existing);
    }

    // DASHBOARD
    public Map<String, Long> getEmployeeStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("total", repo.count());

        List<Employee> list = repo.findAll();

        long active = list.stream()
                .filter(e -> e.getStatus() == Status.ACTIVE)
                .count();

        long inactive = list.stream()
                .filter(e -> e.getStatus() == Status.INACTIVE)
                .count();

        stats.put("active", active);
        stats.put("inactive", inactive);

        return stats;
    }
    public List<Employee> getEmployeesForManager() {
        return repo.findByRole(com.ems.entity.Role.EMPLOYEE);
    }

    public void resetPassword(Long id) {

        Employee emp = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        String encoded = passwordEncoder.encode("emp@123");

        System.out.println("RESET DEFAULT PASSWORD: emp@123");
        System.out.println("ENCODED: " + encoded);

        emp.setPassword(encoded);
        repo.save(emp);
    }
 //  Manager-specific employees
    public List<Employee> getEmployeesByManager(Long managerId) {
        return repo.findByManager_Id(managerId);
    }
    

    public void encryptAllPasswords() {

        List<Employee> employees = repo.findAll();

        for (Employee e : employees) {

            String rawPassword = e.getPassword();

            // skip if already encoded
            if (rawPassword.startsWith("$2a$")) {
                continue;
            }

            String encoded = passwordEncoder.encode(rawPassword);

            e.setPassword(encoded);
            repo.save(e);
        }

        System.out.println("All passwords encrypted ✅");
    }
    
}