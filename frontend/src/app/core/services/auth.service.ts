import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  refreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  resentVerificationPayload,
  resentVerificationResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from '../../shared/models/auth.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Profile } from '../../shared/models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.API_URL + 'api/v1/auth';
  private router = inject(Router);

  private profile = new BehaviorSubject<Profile>(null);
  profile$ = this.profile.asObservable();

  constructor(private http: HttpClient) {}

  register(body: RegisterPayload) {
    return this.http.post<RegisterResponse>(this.API_URL + '/register', body);
  }

  verifyEmail(body: VerifyEmailPayload) {
    return this.http.post<VerifyEmailResponse>(
      this.API_URL + '/verify-email',
      body
    );
  }

  login(body: LoginPayload) {
    return this.http
      .post<LoginResponse>(this.API_URL + '/login', body, {
        withCredentials: true,
      })
      .pipe(tap((res) => this.setAuthData(res)));
  }

  resendVerification(body: resentVerificationPayload) {
    return this.http.post<resentVerificationResponse>(
      this.API_URL + '/resend-verification',
      body
    );
  }

  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(this.API_URL + '/logout', {}).pipe(
      finalize(() => {
        localStorage.removeItem('accessToken');
        this.profile.next(null);
        this.router.navigate(['/auth/login']);
      })
    );
  }

  refreshToken() {
    return this.http
      .post<refreshTokenResponse>(
        this.API_URL + '/refresh',
        {},
        { withCredentials: true }
      )
      .pipe(tap((res) => this.updateToken(res.accessToken)));
  }

  forgotPassword(body: ForgotPasswordPayload) {
    return this.http.post<ForgotPasswordResponse>(
      this.API_URL + '/forgot-password',
      body
    );
  }

  resetPassword(body: ResetPasswordPayload) {
    return this.http.post<ResetPasswordResponse>(
      this.API_URL + '/reset-password',
      body
    );
  }

  get accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  get isLoggeIn(): boolean {
    return !!this.accessToken;
  }

  getProfile(): Profile {
    return this.profile.getValue();
  }

  updateToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  updateProfile(profile: Partial<Profile>): void {
    const currentProfile = this.profile.getValue();
    const updatedProfile = currentProfile
      ? { ...currentProfile, ...profile }
      : (profile as Profile);

    this.profile.next(updatedProfile);
  }

  private setAuthData(res: LoginResponse): void {
    const { accessToken, data } = res;
    this.updateToken(accessToken);
    this.updateProfile(data);
  }
}
