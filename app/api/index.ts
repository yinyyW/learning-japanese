import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { User } from '@/app/lib/types/user';
import { BaseResponse, PreRegisterRequest, PreRegisterResponse, RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, AuthResponse, LogoutResponse } from '../lib/types/network';

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
}