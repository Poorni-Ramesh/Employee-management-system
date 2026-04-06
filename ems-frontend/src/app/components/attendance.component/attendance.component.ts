
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  employeeId: number = 0;
  attendanceList: any[] = [];

  attendance: any = {
    status: 'PRESENT',
    checkIn: '',
    checkOut: ''
  };
  
  page=1;
  pageSize=5;
  showAll = false;
  role: string = '';
  alreadyMarked: boolean = false;
  hasCheckedOut: boolean = false;
  isLoading: boolean = true;
  fullAttendance: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

 

  ngOnInit(): void {
  this.role = localStorage.getItem("role") || '';

  if (this.role === 'EMPLOYEE') {
    this.employeeId = Number(localStorage.getItem("id"));
  } 
  
  else if (this.role === 'MANAGER') {

    const paramId = this.route.snapshot.paramMap.get('employeeId');

    if (paramId) {
      // 👉 Manager viewing employee
      this.employeeId = Number(paramId);
    } else {
      // 👉 Manager self attendance (THIS YOU MISSED ❗)
      this.employeeId = Number(localStorage.getItem("id"));
    }
  }

  this.loadAttendance();
}
  loadAttendance() {
  

  this.isLoading = true;
  const token = localStorage.getItem("token");


 this.http.get<any>(`https://employee-management-system-3-ywre.onrender.com/api/attendance/employee/${this.employeeId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .subscribe({
    
      next: (res) => {

  console.log("FULL DATA:", res);

  this.fullAttendance = res || [];
  const today = new Date().toISOString().split('T')[0];

  // const todayRecord = this.fullAttendance.find(
  //   (a: any) => a.date === today
  // );
  const todayRecord = this.fullAttendance.find(
  (a: any) => a.date === today 
);

  this.alreadyMarked = !!todayRecord;
  this.hasCheckedOut = todayRecord?.checkOut != null;

  
  this.isLoading = false;
  this.cdr.detectChanges();

},
      error: () => {
        this.attendanceList = [];
        this.isLoading = false;
      }
    });
}
get paginatedAttendance() {

    if (this.showAll) {
      return [...this.fullAttendance].reverse();
    }

    const start = (this.page - 1) * this.pageSize;

    return [...this.fullAttendance]
      .reverse()
      .slice(start, start + this.pageSize);
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  toggleView() {
    this.showAll = !this.showAll;
    this.page = 1;
  }

  saveAttendance() {

    if (!this.attendance.status) {
      alert("Select status");
      return;
    }

    if (!this.attendance.checkIn && !this.attendance.checkOut) {
      alert("Enter check-in or check-out");
      return;
    }

    const payload = {
      ...this.attendance,
      date: new Date().toISOString().split('T')[0],
      employee: { id: this.employeeId }
    };

    
    const token = localStorage.getItem("token");

this.http.post('https://employee-management-system-3-ywre.onrender.com/api/attendance', payload, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})  
    .subscribe({
        next: () => {
          alert("Saved ✅");
          this.loadAttendance();

          this.attendance = {
            status: 'PRESENT',
            checkIn: '',
            checkOut: ''
          };
        },
        error: (err) => {
          alert(err?.error?.message || "Error");
        }
      });
  }

  isToday(date: string) {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  }

}
