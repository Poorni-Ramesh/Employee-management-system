import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  searchText: string = '';
  manager: any;
  employees: any[] = [];
  currentPage: number = 1;

  constructor(private http: HttpClient,private router:Router,private cd:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadProfile();
  }

  loadEmployees() {

    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.http.get<any>(
      "https://employee-management-system-3-ywre.onrender.com/api/employees/manager/employees",
      { headers }
    ).subscribe({
      next: (res) => {
        console.log("Manager Data:", res);
        this.employees = res;
        this.cd.detectChanges();
        console.log("Employees:", this.employees);
      },
      error: (err) => {
        console.log("Error:", err);
      }
    });
  }
    //  NEW → LOAD MANAGER PROFILE
  loadProfile() {
    const email = localStorage.getItem("email");

    this.http.get<any>(
      `https://employee-management-system-3-ywre.onrender.com/api/employees/profile?email=${email}`
    ).subscribe({
      next: (res) => {
        this.manager = res;
      },
      error: (err) => {
        console.log("Profile error:", err);
      }
    });
  }
   //  SEARCH FUNCTION
  filteredEmployees() {
    console.log("search",this.searchText);
    return this.employees.filter(emp =>
      emp.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  goToAttendance(employeeId: number) {
    this.router.navigate(['/attendance', employeeId]);
  }


  deleteEmployee(id: number) {

    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.http.delete(
      `https://employee-management-system-3-ywre.onrender.com/api/employees/delete/${id}`,
      { headers }
    ).subscribe(() => {
      alert("Employee Deleted");
      this.loadEmployees();
    });
  }
  editEmployee(id: number) {
  this.router.navigate(['/edit-employee', id]);
}
onSearchChange() {
  this.currentPage = 1;
}

}
