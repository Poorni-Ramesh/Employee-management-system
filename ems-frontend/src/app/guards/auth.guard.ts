import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  //  not logged in
  if (!token) {
    return router.createUrlTree(['/login']); // 🔥 FIX
  }

  return true; // ✅ logged in
};