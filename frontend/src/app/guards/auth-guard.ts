import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);

  const isLoggedIn = !!cookieService.get('email');

  if (isLoggedIn) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};