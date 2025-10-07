import { User } from "./user";

export interface BaseResponse {
  code: number;
  ok?: boolean;
  message?: string;
  timestamp?: Date;
}

export interface BaseRequest {}

export interface PreRegisterRequest extends BaseRequest {
  email: string;
  passwordHash: string;
}

export interface PreRegisterResponse extends BaseResponse {
  token?: string;
}

export interface RegisterRequest extends BaseRequest {
  code: string;
}

export interface RegisterResponse extends BaseResponse {}

export interface LoginRequest extends BaseRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends BaseResponse {
  user?: User;
};

export interface AuthRequest extends BaseRequest {}

export interface AuthResponse extends BaseResponse {
  user?: User;
}

export interface LogoutRequest extends BaseRequest {}

export interface LogoutResponse extends BaseResponse {}