type PreRegisterRequest = {
  email: string;
  passwordHash: string;
}

type PreRegisterResponse = {
  token?: string;
}

type RegisterRequest = {
  code: string;
}

type LoginRequest = {
  email: string;
  password: string;
}