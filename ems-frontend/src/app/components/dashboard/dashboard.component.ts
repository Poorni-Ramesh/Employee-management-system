
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import{Chart} from 'chart.js/auto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  stats = {
    total: 0,
    active: 0,
    inactive: 0,
    departments: 0
  };

  recentEmployees: any[] = [];
  isLoading = true;

  departmentCounts: any = {}; // for pie chart

  constructor(private http: HttpClient,private router: Router,private authService:AuthService,private cd:ChangeDetectorRef) {}

 
  
  role: string = '';

ngOnInit(): void {
  this.role = (localStorage.getItem("role") || '')?.replace('ROLE_','');
  if (this.role.startsWith('ROLE_')) {
  this.role = this.role.replace('ROLE_', '');
}

console.log("ROLE IN UI:", this.role);
  this.loadDashboard();
}
  

  loadDashboard() {
  const token = localStorage.getItem("token");

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.get<any[]>('https://employee-management-system-3-ywre.onrender.com/api/employees', { headers })
    .subscribe({
      next: (data) => {

        console.log("DATA:", data);

        // Stats
        this.stats.total = data.length;
        this.stats.active = data.filter(e => e.status === 'ACTIVE').length;
        this.stats.inactive = data.filter(e => e.status === 'INACTIVE').length;

        // Department count
        this.departmentCounts = {};
        data.forEach(emp => {
          if (emp.department) {
            this.departmentCounts[emp.department] =
              (this.departmentCounts[emp.department] || 0) + 1;
          }
        });

        this.stats.departments = Object.keys(this.departmentCounts).length;

        // Recent employees
        this.recentEmployees = data.slice(-5).reverse();

        //stop loading ONCE
        this.isLoading = false;
        this.cd.detectChanges();

        
        setTimeout(() => {
          this.createBarChart();
          this.createPieChart();
        }, 0);
      },

      error: (err) => {
        console.log("ERROR:", err);

        // stop loading even on error
        this.isLoading = false;
      }
    });
}

  // 📊 Bar Chart
  createBarChart() {
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{
          label: 'Employees',
          data: [this.stats.active, this.stats.inactive],
          backgroundColor: ['#20bf6b', '#eb3b5a']
        }]
      }
    });
  }

  
  createPieChart() {
    const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: 'pie',
      data: {
        labels: Object.keys(this.departmentCounts),
        datasets: [{
          data: Object.values(this.departmentCounts),
          backgroundColor: [
            '#667eea',
            '#764ba2',
            '#20bf6b',
            '#f7b731',
            '#eb3b5a',
            '#45aaf2'
          ]
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

  
}
}
