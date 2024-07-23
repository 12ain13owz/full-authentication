import { Profile } from './profile.model';
import { ApiResponse } from './shared.model';

export interface RegisterVisibility {
  password: boolean;
  confirmPassword: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  avatar?: string;
  remark?: string;
}
export type RegisterResponse = ApiResponse<null>;

export type VerifyEmailPayload = { token: string };
export type VerifyEmailResponse = ApiResponse<null>;

export type resentVerificationPayload = Pick<RegisterPayload, 'email'>;
export type resentVerificationResponse = ApiResponse<null>;

export type LoginPayload = Pick<RegisterPayload, 'email' | 'password'>;
export type LoginResponse = ApiResponse<Profile> & { accessToken: string };

export type LogoutResponse = ApiResponse<null>;

export type refreshTokenResponse = { accessToken: string };

export type ForgotPasswordPayload = Pick<RegisterPayload, 'email'>;
export type ForgotPasswordResponse = ApiResponse<null> & { note: string };

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}
export type ResetPasswordResponse = ApiResponse<null>;
