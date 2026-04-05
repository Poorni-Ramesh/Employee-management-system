import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';
  showPassword: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  //4/4/26 login() {

  //   console.log("LOGIN CLICKED");
  //   console.log("EMAIL SENT:", this.email);

  //   //  VALIDATION
  //   if (!this.email || !this.password) {
  //     alert("Email and Password are required");
  //     return;
  //   }

  //   this.auth.login({
  //     email: this.email,
  //     password: this.password
  //   }).subscribe({
  //     next: (res: any) => {
  //       console.log("response", res);
  //       localStorage.setItem("token", res.token);
  //       localStorage.setItem("role",res.role);
  //       localStorage.setItem("id",res.id);
  //      localStorage.setItem("email", res.email); 

  //       // HANDLE BACKEND ERROR
  //       if (res.error) {
  //         alert(res.error);
  //         return;
  //       }

  //       // TOKEN CHECK
  //       if (!res.token) {
  //         alert("Token not received");
  //         return;
  //       }
        
  //       // STORE TOKEN
  //       localStorage.setItem("token", res.token);
  //       localStorage.setItem("role", res.role);
  //       localStorage.setItem("email", this.email );
      
  //       console.log("Email stored ",localStorage.getItem("email"));
  //       console.log("ROLE:", res.role);
       
  //       if (res.role === 'ADMIN') {
  //      this.router.navigate(['/dashboard']);   // admin/ dashboard
  //      }
  //      else if (res.role === 'MANAGER') {
  //     //  this.router.navigate(['/manager']); //manager
  //     this.router.navigate(['/manager']);
  //    }
  //    else if (res.role === 'EMPLOYEE') {
  //   this.router.navigate(['/profile']);     // employee page
  //   }
    
  //   else{
  //     alert("Unknown role");
  //   }

  //       //  NAVIGATE
  //       // this.router.navigate(['/dashboard']);
  //     },
  //     error: (err) => {
  //       console.log("ERROR", err);
  //       alert("Invalid login");
  //     }
  //   });
  // }
  login() {

  console.log("LOGIN CLICKED");

  // ✅ VALIDATION
  if (!this.email || !this.password) {
    alert("Email and Password are required");
    return;
  }

  this.auth.login({
    email: this.email,
    password: this.password
  }).subscribe({
    
    next: (res: any) => {

      console.log("response", res);

      this.auth.saveUser(res);

      localStorage.setItem("email", res.email);

      console.log("ROLE:", res.role);

      if (res.role === 'ADMIN') {
        this.router.navigate(['/dashboard']);
      } 
      else if (res.role === 'MANAGER') {
        this.router.navigate(['/manager']);
      } 
      else if (res.role === 'EMPLOYEE') {
        this.router.navigate(['/profile']);
      } 
      else {
        alert("Unknown role");
      }
    },

    error: (err) => {
      console.log("ERROR", err);
      alert("Invalid login");
    }

  });
}
  togglePassword() {
  this.showPassword = !this.showPassword;
}
}
