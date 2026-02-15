import { inject } from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

  export const authGuard: CanActivateFn =(route, state) => {
  const router = inject(Router);

  // 1. Check if token exists
  const token = localStorage.getItem('auth_token');
  if (!token) {

    router.navigate(['/auth'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // 2. (Optional) Verify token is not expired
  if (isTokenExpired(token)) {
    localStorage.removeItem('auth_token');
    router.navigate(['/auth'], {
      queryParams: { sessionExpired: true }
    });
    return false;
  }

  return true;
};

// Helper function to check JWT expiration
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  } catch {
    return true;
  }

};
