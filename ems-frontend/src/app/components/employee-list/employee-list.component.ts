import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: any[] = [];
  isLoading :boolean =true;
  role: string | null='';
  searchText : string='';
  filteredEmployees: any[]= [];

  constructor(private http: HttpClient,private cd :ChangeDetectorRef,private router:Router) {}

  ngOnInit(): void {
    
      //  GET ROLE FROM LOCAL STORAGE
    this.role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    console.log("tokeeeen",token);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
this.http.get<any[]>('http://localhost:8081/api/employees', { headers })
      .subscribe({
        next: (data) => {
          console.log("DATA RECEIVED:", data); //  DEBUG DATA

          this.employees = data;
          this.filteredEmployees= data;

          this.isLoading = false; 
           this.cd.detectChanges();
        },
        error: (err) => {
          console.log("ERROR:", err); //  DEBUG ERROR
          this.isLoading = false; 
        }
      });
  }
isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  isManager(): boolean {
    return this.role === 'MANAGER';
  }

  isEmployee(): boolean {
    return this.role === 'EMPLOYEE';
  }


  //  EDIT FUNCTION
  editEmployee(id: number) {
    this.router.navigate(['/edit-employee', id]);
  }

  //  DELETE FUNCTION 
  deleteEmployee(id: number) {

    if (confirm("Are you sure you want to delete this employee?")) {

      const token = localStorage.getItem("token");
      console.log("deletee token",token);1

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      this.http.delete(`http://localhost:8081/api/admin/${id}`, { headers , responseType:'text'})
        .subscribe({
          next: (res) => {
            alert("Employee deleted successfully ");

            //  refresh list
            this.ngOnInit();
          },
          error: (err) => {
            console.log("DELETE ERROR:", err);
            alert("Delete failed ");
          }
        });
    }
  }
  searchEmployee() {
  const text = this.searchText.toLowerCase();

  this.filteredEmployees = this.employees.filter((emp: any) =>
    emp.name.toLowerCase().includes(text) ||
    emp.email.toLowerCase().includes(text)
  );
}
 
}
    