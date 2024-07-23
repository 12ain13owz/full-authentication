import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, switchMap, tap, timer } from 'rxjs';
import { AuthService } from './auth.service';
import {
  Avatar,
  AvatarResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  Profile,
  ProfileResponse,
} from '../../shared/models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly API_URL = environment.API_URL + 'api/v1/profile';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProfile() {
    return this.http.get<Profile>(this.API_URL);
  }

  changeAvatar(body: Avatar) {
    return this.http.patch<AvatarResponse>(this.API_URL + '/avatar', body).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap(() => this.authService.updateProfile({ avatar: body.avatar }))
    );
  }

  updateProfile(body: Partial<Profile>) {
    return this.http.patch<ProfileResponse>(this.API_URL, body).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.authService.updateProfile(res.data))
    );
  }

  changePassword(body: ChangePasswordPayload) {
    return this.http
      .patch<ChangePasswordResponse>(this.API_URL + '/changes-password', body)
      .pipe(switchMap((res) => timer(200).pipe(map(() => res))));
  }
}
