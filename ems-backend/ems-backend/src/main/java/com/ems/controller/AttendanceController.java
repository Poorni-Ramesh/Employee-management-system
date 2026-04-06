package com.ems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ems.entity.Attendance;
import com.ems.service.AttendanceService;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService service;
  
   
    @GetMapping
    public List<Attendance>getAttendance(
    		@ RequestHeader("Authorization")String token){
    	token=token.substring(7);
    	return service.getAttendanceByRole(token);
    }

    //  1. Get attendance by employee
    @GetMapping("/employee/{id}")
    public List<Attendance> getByEmployee(@PathVariable Long id) {
        return service.getAttendanceByEmployee(id);
    }

    //  2. Save attendance

    @PostMapping
    public Attendance saveAttendance(
            @RequestBody Attendance attendance,
            @RequestHeader("Authorization") String token) {

        token = token.substring(7); // remove Bearer

        return service.saveAttendance(attendance, token);
    }
    
}
