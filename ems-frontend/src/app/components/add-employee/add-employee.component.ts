import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {

  // ✅ Employee object (binds with form)
  employee = {
    name: '',
    email: '',
    password: '',
    role: '',
    department: '',
    status: ''
    
  };
  isEditMode =false;
  id:any;

  constructor(private http: HttpClient, private router: Router,private route:ActivatedRoute) {}
  ngOnInit() {

  this.id = this.route.snapshot.paramMap.get('id');

  if (this.id) {
    this.isEditMode = true;

    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get(`https://employee-management-system-3-ywre.onrender.com/api/employees/id/${this.id}`, { headers })
      .subscribe((res: any) => {
        this.employee = res;
      });
  }
}

  addEmployee(form: any) {

  if (form.invalid) {
    alert("Please fill all required fields");
    return;
  }

  let emp = { ...this.employee }; // ✅ clone object

  // ✅ HANDLE PASSWORD SAFELY
  if (!emp.password || emp.password.trim() === '') {
    emp.password = 'emp@123';
  }

  if (emp.password.length < 4) {
    alert("Password must be at least 4 characters");
    return;
  }

  console.log("Sending Data:", emp);

  this.http.post('https://employee-management-system-3-ywre.onrender.com/api/employees', emp)
    .subscribe({
      next: (res: any) => {
        alert("Employee added successfully ✅");

        form.reset();

        this.employee = {
          name: '',
          email: '',
          password: '',
          role: '',
          department: '',
          status: ''
        };

        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error("Error:", err);
        alert("Failed to add employee");
      }
    });
}
}