import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  employee: any = {};
  originalEmployee: any ={};

  showPasswordForm: boolean = false;

  currentPassword: string = '';
  newPassword: string ='';
  confirmPassword: string ='';
  isLoading: boolean =false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    this.http.get(`http://localhost:8081/api/employees/profile?email=${email}`,
    { headers}
        )     
        
        .subscribe((res: any) => {
        this.employee = res;
        this.originalEmployee={...res}
      });
  }
updateProfile() {

    if (!this.employee.name || !this.employee.email) {
      alert("Name and Email are required");
      return;
    }
    if (
    this.employee.name === this.originalEmployee.name &&
    this.employee.email === this.originalEmployee.email
  ) {
    alert("No changes detected");
    return;
  }

    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.put(
      `http://localhost:8081/api/employees/update/${this.employee.id}`,
      this.employee,
      { headers }
    ).subscribe(() => {
      alert("Profile Updated Successfully");
    });
  }
changePassword() {

  if (this.isLoading) return;
  this.isLoading = true;

  if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
    alert("All password fields required");
    this.isLoading = false;
    return;
  }

  if (this.newPassword !== this.confirmPassword) {
    alert("Passwords do not match");
    this.isLoading = false;
    return;
  }

  const token = localStorage.getItem("token");

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.post(
    `http://localhost:8081/api/employees/change-password`,
    {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    },
    { headers }
  ).subscribe({
    next: (res: any) => {
      console.log("SUCCESS:", res);

      // ✅ show backend message
      alert(res.message);

      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.showPasswordForm = false;
      this.isLoading = false;
    },

    error: (err) => {
      console.log("ERROR:", err);

      // ✅ proper error handling
      if (err.error && err.error.message) {
        alert(err.error.message);
      } else if (typeof err.error === 'string') {
        alert(err.error);
      } else {
        alert("Something went wrong");
      }

      this.isLoading = false;
    }
  });
} 
togglePasswordForm() {
  this.showPasswordForm = !this.showPasswordForm;
}

toggleCurrent() {
  this.showCurrentPassword = !this.showCurrentPassword;
}

toggleNew() {
  this.showNewPassword = !this.showNewPassword;
}

toggleConfirm() {
  this.showConfirmPassword = !this.showConfirmPassword;
}
}

 