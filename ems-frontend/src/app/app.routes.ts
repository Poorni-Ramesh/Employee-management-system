import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { ManagerComponent } from './manager/manager.component';
import { roleGuard } from './guards/role.guard';
import { AttendanceComponent } from './components/attendance.component/attendance.component';

export const routes: Routes = [

 
  { path: 'login', component: LoginComponent },

  
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard,roleGuard] ,data: { roles: ['ADMIN'] } },
  {
  path: 'employees',
  component: EmployeeListComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN', 'MANAGER'] }
},
  {
  path: 'add-employee',
  component: AddEmployeeComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN'] }
},

{
  path: 'profile',
  component: ProfileComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['EMPLOYEE','MANAGER','ADMIN'] }
},
  { path: 'edit-profile', component: EditProfileComponent,canActivate:[authGuard] },
  {
  path: 'edit-employee/:id',
  component: EditEmployeeComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN', 'MANAGER'] }
},
   {path:'manager',component: ManagerComponent,canActivate:[authGuard]},
   {
  path: 'attendance/:employeeId',
  component: AttendanceComponent
  //  canActivate:[authGuard,roleGuard]
 
},



  // Default
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Wildcard
  { path: '**', redirectTo: 'login' }
];
