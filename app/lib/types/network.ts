import { User } from "./user";

export interface BaseResponse {
  code: number;
  ok?: boolean;
  message?: string;
  timestamp?: Date;
}

export interface BaseRequest {
  requestId?: string;
}

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

export type RegisterResponse = BaseResponse;

export type AuthRequest = BaseRequest;

export type LogoutRequest = BaseRequest;

export type LogoutResponse = BaseResponse;

export interface LoginRequest extends BaseRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends BaseResponse {
  user?: User;
};

export interface AuthResponse extends BaseResponse {
  user?: User;
}