import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { User } from '@/app/lib/types/user';
import {
  BaseResponse, PreRegisterRequest, PreRegisterResponse, RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, AuthResponse, LogoutResponse, QueryWordsRequest, QueryWordsResponse,
  QueryListeningListRequest, QueryListeningListResponse, QueryListeningDetailResponse, QueryListeningDetailRequest,
  QueryListeningExamsResponse
} from '../lib/types/network';
import { WordStatus } from '../lib/types/vocabulary';

const ONE_MINUTE = 1000 * 60;

export default class Client {
  public api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/',
      timeout: ONE_MINUTE,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async postEnhance(url: string, data?: object): Promise<BaseResponse> {
    try {
      const response: AxiosResponse = await this.api.post(url, data);
      console.log('POST request response:', response.data);
      return { ...response.data, timestamp: new Date() };
    } catch (error) {
      console.error('POST request error:', error);
      const apiError = (error as AxiosError).response?.data;
      throw apiError || error;
    }
  }

  async preRegister(email: string, passwordHash: string): Promise<PreRegisterResponse> {
    const params: PreRegisterRequest = {
      email,
      passwordHash
    };
    const res = (await this.postEnhance('api/auth/preRegister', params)) as PreRegisterResponse;
    return res;
  }

  async register(code: string) {
    const params: RegisterRequest = {
      code
    };
    const res = (await this.postEnhance('api/auth/register', params)) as RegisterResponse;
    return res;
  }

  async login(email: string, password: string): Promise<User> {
    const params: LoginRequest = {
      email,
      password
    };
    const res = (await this.postEnhance('api/auth/login', params)) as LoginResponse;
    return res.user as User;
  }

  async authorize() {
    const res = (await this.postEnhance('api/auth/authorize')) as AuthResponse;
    return res;
  }

  async logout() {
    const res = (await this.postEnhance('api/auth/logout')) as LogoutResponse;
    return res;
  }

  async queryWords(level?: string, status?: WordStatus, page?: number, pageSize?: number): Promise<QueryWordsResponse> {
    const params: QueryWordsRequest = {
      level: level || 'N1',
      status: status || WordStatus.not_learned,
      page,
      limit: pageSize
    };
    const res = (await this.postEnhance('api/vocabulary/queryWords', params)) as QueryWordsResponse;
    return res;
  }

  async queryListeningExams(level?: string): Promise<QueryListeningExamsResponse> {
    const res = await this.postEnhance('api/listening/exams');
    return res;
  }

  async queryListeningList(examId: number | string): Promise<QueryListeningListResponse> {
    const params: QueryListeningListRequest = {
      examId
    };
    const res = (await this.postEnhance('api/listening/list', params)) as QueryListeningListResponse;
    return res;
  }

  async fetchListeningDetail(id: string | number): Promise<QueryListeningDetailResponse> {
    const params: QueryListeningDetailRequest = {
      materialId: id
    };
    const res = (await this.postEnhance('api/listening/detail', params)) as QueryListeningDetailResponse;
    const data = res.data;

    if (data) {
      if (data.transcript) {
        data.transcript_data = JSON.parse(data.transcript);
      }
      if (data.question) {
        data.question_data = JSON.parse(data.question);
      }
    }
    return res;
  }
}