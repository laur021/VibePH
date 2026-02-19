import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { BusyService } from '../services/busy-service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);
  // Cache keyed by request URL
  const cache = new Map<string, HttpEvent<unknown>>();

  busyService.busy();

  return next(req).pipe(
    delay(500),
    finalize(() => {
      busyService.idle();
    }),
  );
};;
