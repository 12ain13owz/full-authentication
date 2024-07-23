import { ApiResponse } from './shared.model';

export interface Profile {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  avatar: string;
  verified: boolean;
  active: boolean;
  remark?: string;
  Roles: string[];
}

export interface Avatar {
  avatar: string;
}

export type AvatarResponse = ApiResponse<null>;
export type ProfileResponse = ApiResponse<
  Pick<Profile, 'id' | 'firstname' | 'lastname' | 'remark'>
>;

export interface PasswordVisibility {
  oldPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export type ChangePasswordResponse = ApiResponse<null>;
