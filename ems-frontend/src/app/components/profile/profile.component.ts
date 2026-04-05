import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  employee: any = {};
  attendanceList: any[] = [];
  role: string = '';
attendance: any[] = [];

  constructor(private http: HttpClient, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    this.role = localStorage.getItem("role") || '';

    if (email && token) {
      this.getProfile();
    } else {
      this.router.navigate(['/login']);
    }
  }
  

  goToEdit() {
    this.router.navigate(['/edit-profile']);
  }

  getProfile() {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get(`http://localhost:8081/api/employees/profile?email=${email}`, { headers })
      .subscribe({
        next: (res: any) => {
          this.employee = res;
          this.cd.detectChanges();
          console.log("PROFILE:", res);
          this.loadAttendance();
        },
        error: (err) => {
          console.error("ERROR:", err);
        }
      });
  }
  loadAttendance() {
    if (this.role === 'MANAGER') {
  this.attendanceList = [];
  return;
}
  const id = this.employee.id;   
  const token = localStorage.getItem("token");

this.http.get(`http://localhost:8081/api/attendance`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
 
    .subscribe((res: any) => {
      console.log("Attendance:", res);
      this.attendanceList = res;
      this.cd.detectChanges();
    });
}
  
}