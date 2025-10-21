import { WordStatus, Word } from "./vocabulary";
import { User } from "./user";
import { ListeningExam, ListeningMaterial } from "./listening";

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

export interface QueryWordsRequest extends BaseRequest {
  level: string;
  status: WordStatus;
  page?: number;
  limit?: number;
}

export interface QueryWordsResponse extends BaseResponse {
  words?: Array<Word>;
  total?: number;
  page?: number;
  limit?: number;
}

export interface QueryListeningExamsResponse extends BaseResponse {
  data?: Array<ListeningExam>;
  // total?: number;
  // page?: number;
  // pageSize?: number;
}

export interface QueryListeningListRequest extends BaseRequest {
  examId: number | string;
}

export interface QueryListeningListResponse extends BaseResponse {
  data?: Array<number | string>,
  total?: number
}

export interface QueryListeningDetailRequest extends BaseRequest {
  materialId: number | string;
}

export interface QueryListeningDetailResponse extends BaseResponse {
  data?: ListeningMaterial
}