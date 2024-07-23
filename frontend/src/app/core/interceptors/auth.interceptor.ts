import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, EMPTY, finalize, switchMap, throwError } from 'rxjs';

let isRefreshToken = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.accessToken;
  const jwtHelper = inject(JwtHelperService);

  if (!accessToken || accessToken === 'undefined') return next(req);
  if (isRefreshToken) return next(req);

  const authRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
  });

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      const expired = jwtHelper.isTokenExpired();

      if (expired && error.status === 401) {
        isRefreshToken = true;
        return authService.refreshToken().pipe(
          switchMap((res: { accessToken: string }) => {
            authService.updateToken(res.accessToken);

            const authReq = authRequest.clone({
              headers: authRequest.headers.set(
                'Authorization',
                `Bearer ${res.accessToken}`
              ),
            });
            return next(authReq);
          }),
          catchError((error) => EMPTY),
          finalize(() => (isRefreshToken = false))
        );
      }

      return throwError(() => error);
    })
  );
};
