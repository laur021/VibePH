import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core/primitives/di';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../../interface/error';
import { ToastService } from '../services/toast-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error?.errors) {
              const modelStateErrors: string[] = []; // Store validation errors

              // Loop over validation error keys (email, password, etc.)
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  // Push array of errors for this field
                  modelStateErrors.push(error.error.errors[key]);
                }
              }

              // Flatten nested arrays into a single string array
              return throwError(() => modelStateErrors.flat());
            } else {
              // Handle non-validation 400 error (simple string message)
              toast.error(error.error?.message ?? 'Bad request');
            }
            break;
          case 401:
            toast.error('Unauthorized');
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            const serverError = error.error as ApiError;
            const details =
              serverError?.details ??
              (typeof serverError?.errors === 'object' &&
              serverError.errors !== null &&
              'detail' in serverError.errors
                ? String(serverError.errors.detail ?? '')
                : undefined);

            const extras: NavigationExtras = {
              state: { error: { ...serverError, details } }, // Pass normalized API error object
            };

            router.navigateByUrl('/server-error', extras);
            break;
          default:
            toast.error('something unexpected went wrong');
            break;
        }
      }
      throw error;
    }),
  );
};
