package com.ems.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ems.entity.Attendance;


public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    //  Get attendance by employee
    List<Attendance> findByEmployeeId(Long employeeId);
    
    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

    void deleteByEmployeeId(Long employeeId);

}