import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthUtility } from '../../utility/auth-utility';
import { Constante } from '../../utility/constante';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  if (AuthUtility.isAuthenticated()) {
    return true;
  } else {
    //let urlIdentity = environment.URL_IDENTITY;
    //window.open(urlIdentity + Constante.URL_IDENTITY_DASHBOARD_HOME, '_self');
    router.navigate(['/login']);
    return false;
  }

};
