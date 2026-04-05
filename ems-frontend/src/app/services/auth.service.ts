import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'https://employee-management-system-3-ywre.onrender.com/api/auth';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.api}/login`, data);
  }
    //  SAVE USER DATA 
  saveUser(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);
    localStorage.setItem('id', res.id);
  }

  //  CHECK LOGIN 
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  //  GET ROLE
  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  //  GET USER ID
  getUserId(): number {
    return Number(localStorage.getItem('id'));
  }
  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

}