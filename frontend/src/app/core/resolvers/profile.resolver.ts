import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { finalize, of, tap } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { Profile } from '../../shared/models/profile.model';

export const profileResolver: ResolveFn<Profile> = (route, state) => {
  const loadingService = inject(LoadingService);
  const profileService = inject(ProfileService);
  const authService = inject(AuthService);
  const profile = authService.getProfile();

  if (profile) return of(profile);

  loadingService.show();
  return profileService.getProfile().pipe(
    tap((res) => authService.updateProfile(res)),
    finalize(() => loadingService.hide())
  );
};
