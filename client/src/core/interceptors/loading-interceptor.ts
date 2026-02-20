import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize, of, tap } from 'rxjs';
import { BusyService } from '../services/busy-service';

// Cache keyed by request URL
const cache = new Map<string, HttpResponse<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);
  const cacheKey = req.urlWithParams;

  if (req.method == 'GET') {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse.clone());
    }
  } else {
    // Any write can make cached GET data stale (members, profile, photos, etc.)
    cache.clear();
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap((response) => {
      if (req.method == 'GET' && response instanceof HttpResponse) {
        cache.set(cacheKey, response.clone());
      }
    }),
    finalize(() => {
      busyService.idle();
    }),
  );
};
