import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core/primitives/di';
import { AccountService } from '../services/account-service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const user = accountService.currentUser(); //not reactive, just get the current value of the signal

  if (user) {
    req = req.clone({
      setHeaders: {
        // ⚠️ Space after Bearer is REQUIRED
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  return next(req);
};
