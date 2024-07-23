import { ApiResponse } from './shared.model';

export interface User {
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

export interface DisplayUser {
  id: number;
  no: number;
  avatar: string;
  email: string;
  name: string;
  verified: boolean;
  active: boolean;
  roles: string;
}

export interface DisplayDelete {
  id: number;
  no: number;
  avatar: string;
  email: string;
}

export type UpdateUserResponse = ApiResponse<Partial<User>>;
