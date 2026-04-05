import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route) => {

  const router = inject(Router);

  let role = localStorage.getItem('role');
  const allowedRoles = route.data?.['roles'];

  console.log("RAW ROLE:", role);
  console.log("ALLOWED:", allowedRoles);

  if (!role || !allowedRoles) {
    return router.createUrlTree(['/login']);
  }

  // ✅ FIX: normalize values
  role = role.trim().toUpperCase();

  const normalizedRoles = allowedRoles.map((r: string) =>
    r.trim().toUpperCase()
  );

  console.log("FINAL ROLE:", role);
  console.log("NORMALIZED ROLES:", normalizedRoles);

  if (normalizedRoles.includes(role)) {
    return true;
  }

  return router.createUrlTree(['/login']);
};