import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {

  employee: any = {}; //  to avoid undefined
  originalEmployee: any={};
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    //  GET employee by ID
    this.http.get<any>(`http://localhost:8081/api/employees/id/${id}`, { headers })
      .subscribe({
        next: (res) => {
          console.log("dataaa",res);
          this.employee = res;
          this.originalEmployee={...res};
        },
        error: (err) => {
          console.log("LOAD ERROR:", err);
        }
      });
  }

  //  UPDATE FUNCTION
  updateEmployee() {
    if (
  this.employee.name === this.originalEmployee.name &&
  this.employee.email === this.originalEmployee.email && 
  this.employee.department === this.originalEmployee.department &&
  this.employee.role === this.originalEmployee.role &&
  this.employee.status === this.originalEmployee.status
) {
  alert("No changes detected ❗");
  return;
}
  

    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.put(
      `http://localhost:8081/api/employees/update/${this.employee.id}`,
      this.employee,
      { headers, responseType: 'text' }
    )
    .subscribe({
      next: () => {
        alert("Employee updated successfully");
        this.router.navigate(['/employees']); //  go back
      },
      error: (err) => {
        console.log("UPDATE ERROR:", err);
        alert("Update failed");
      }
    });
  }
  resetPassword() {
    if(!confirm("Are yous sure you want to reset password?"))return;
  this.http.put(
    `http://localhost:8081/api/employees/reset-password/${this.employee.id}`,
    {},
    { responseType: 'text' }
  )
  .subscribe({
    next: (res) => {
      alert(res);
    },
    error: (err) => {
      console.log("errorr",err);
      alert("Reset failed");
    }
  });
}


}