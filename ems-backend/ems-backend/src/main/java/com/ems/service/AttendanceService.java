
package com.ems.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ems.config.JwtUtil;
import com.ems.entity.Attendance;
import com.ems.entity.Employee;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.EmployeeRepository;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository repository;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private JwtUtil jwtUtil;

    // ROLE-BASED ATTENDANCE
    public List<Attendance> getAttendanceByRole(String token) {

        String role = jwtUtil.extractRole(token);
        String email = jwtUtil.extractUsername(token);

        Employee user = employeeRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //  ADMIN → all attendance
        if (role.equals("ROLE_ADMIN")) {
            return repository.findAll();
        }

        //  MANAGER → no attendance
        else if (role.equals("ROLE_MANAGER")) {
            return new ArrayList<>();
        }

        // EMPLOYEE → own attendance
        else {
            return repository.findByEmployeeId(user.getId());
        }
    }

   
    public List<Attendance> getAttendanceByEmployee(Long employeeId) {
        return repository.findByEmployeeId(employeeId);
    }

    //  SAVE ATTENDANCE (CHECK-IN / CHECK-OUT)
    public Attendance saveAttendance(Attendance attendance,String token) {
    	 String role =jwtUtil.extractRole(token);
       
    	 if (role.equals("ROLE_EMPLOYEE")) {
    	        throw new RuntimeException("Only manager can mark attendance");
    	    }
        var existing = repository.findByEmployeeIdAndDate(
                attendance.getEmployee().getId(),
                attendance.getDate()
        );

        //  CHECK-IN
        if (existing.isEmpty()) {
            attendance.setCheckOut(null);
            return repository.save(attendance);
        }

        //  CHECK-OUT
        Attendance att = existing.get();

        if (att.getCheckOut() != null) {
            throw new RuntimeException("Already checked out");
        }


        if (attendance.getCheckOut() == null && attendance.getCheckIn()!=null) {
            return att;
        }
        
        if(attendance.getCheckOut() !=null) {
        att.setCheckOut(attendance.getCheckOut());
        return repository.save(att);
    }
        return att;
}
}

