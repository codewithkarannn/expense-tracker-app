import {CanActivateFn, Router, RouterLink} from '@angular/router';
import {inject} from '@angular/core';
import {ROUTES_CONSTANTS} from '../env/env';


export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  if (token) {
    router.navigate([ROUTES_CONSTANTS.BASE]);
    return false;
  }

  return true;
};
