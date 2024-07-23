import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const loadingService = inject(LoadingService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      loadingService.hide();

      const logout = error.error.logout || false;
      const status = error.status === 0 ? 0 : error.status || 500;
      const message =
        status === 0 || status === 500
          ? 'Internal Server Error!'
          : error.error.message || 'Unknow Error!';

      toastr.error(message);
      if (logout) authService.logout().subscribe();
      if (status === 0) router.navigate(['error']);

      return throwError(() => error);
    })
  );
};
