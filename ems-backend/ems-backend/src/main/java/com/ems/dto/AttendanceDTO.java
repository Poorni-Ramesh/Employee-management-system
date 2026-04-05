package com.ems.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceDTO {

    public Long id;
    public LocalDate date;
    public LocalTime checkIn;
    public LocalTime checkOut;
    public Long workingHours;
    public String status;

    public AttendanceDTO(Long id, LocalDate date, LocalTime checkIn,
                         LocalTime checkOut, Long workingHours, String status) {
        this.id = id;
        this.date = date;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.workingHours = workingHours;
        this.status = status;
    }
}
