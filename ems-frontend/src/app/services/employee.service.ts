import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = 'https://employee-management-system-3-ywre.onrender.com/api/employees';

  constructor(private http: HttpClient) {}

 getEmployeesByManager() {
  return this.http.get(`${this.baseUrl}/manager/employees`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}
  getAllEmployees() {
    const role = localStorage.getItem('role');

    return this.http.get(this.baseUrl, {
      headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
  deleteEmployee(id: number) {
  const role = localStorage.getItem('role');
  const managerId = localStorage.getItem('id');

  return this.http.delete(`https://employee-management-system-3-ywre.onrender.com/api/employees/delete/${id}`, {
    headers: {
     Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}
updateEmployee(id: number, emp: any) {
  const role = localStorage.getItem('role');
  const managerId = localStorage.getItem('id');

  return this.http.put(`https://employee-management-system-3-ywre.onrender.com/api/employees/update/${id}`, emp, {
    headers: {
     Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}
getMyTeam() {
  const token = localStorage.getItem('token');

  return this.http.get('https://employee-management-system-3-ywre.onrender.com/api/employees/manager/employees', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
}
