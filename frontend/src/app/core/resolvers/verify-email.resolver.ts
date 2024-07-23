import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { catchError, finalize, map, of } from 'rxjs';

export const verifyEmailResolver: ResolveFn<string> = (route, state) => {
  const loadingService = inject(LoadingService);
  const authService = inject(AuthService);
  const token: string = route.params['token'];

  loadingService.show();
  return authService.verifyEmail({ token }).pipe(
    map((res) => res.message),
    catchError((error) =>
      of('Failed to verify email. Please try again later.')
    ),
    finalize(() => loadingService.hide())
  );
};
