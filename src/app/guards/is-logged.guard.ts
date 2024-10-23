import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';

export const isLoggedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);

  const router = inject(Router);

  if (route.routeConfig?.path === 'login') {
    if (authService.isLogged) {
      router.navigateByUrl('user');
      return false;
    }else {
      return true;
    }
  }else {
    if(!authService.isLogged) {
      router.navigateByUrl('login');
      return false;
    }else {
      return true;
    }
  }


};
