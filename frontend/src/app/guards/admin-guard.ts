import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);

  const email = cookieService.get('email');
  const role = cookieService.get('role');

  if (email && role === 'admin') {
    return true;
  }

  router.navigate(['/user']); // ou logout
  return false;
};
