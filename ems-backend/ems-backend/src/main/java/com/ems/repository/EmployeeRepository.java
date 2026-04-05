package com.ems.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ems.entity.Employee;
import com.ems.entity.Role;

import com.ems.entity.*;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    List<Employee>findByRole(Role role);
    long countByStatus(Status status);
    List<Employee> findByManager_Id(Long managerId);
   
    
    
    Optional<Employee> findByDepartmentAndRole(String department, Role role);
    
}
