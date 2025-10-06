import axios, { AxiosInstance } from 'axios';

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

  async preRegister(email: string, passwordHash: string): Promise<string> {
    const params: PreRegisterRequest = {
      email,
      passwordHash
    };
    const res = await this.api.post('api/auth/preRegister', params);
    return res.data.token;
  }

  async register(code: string) {
    const params: RegisterRequest = {
      code
    };
    await this.api.post('api/auth/register', params);
  }

  async login(email: string, password: string) {
    const params: LoginRequest = {
      email,
      password
    };
    const res = await this.api.post('api/auth/login', params);
    return res.data;
  }

  async authorize() {
    const res = await this.api.get('api/auth/authorize');
    console.log('authorize response:', res.data);
    return res.data;
  }

  async logout() {
    await this.api.post('api/auth/logout');
  }
}