import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  showLogout = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

 

  ngOnInit(): void {

 
  setTimeout(() => {
    this.updateLoginState();
  }, 0);

  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      this.updateLoginState(event.urlAfterRedirects);
    });
}
updateLoginState(url?: string) {

  const token = localStorage.getItem('token');

  const currentUrl = url || this.router.url;

  const isLoginPage = currentUrl === '/login';

  this.showLogout = !!token && !isLoginPage;
}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
