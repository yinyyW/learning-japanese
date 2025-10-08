'use server';

import bcrypt from 'bcryptjs';
import sql from "@/app/lib/data";
import { User } from "@/app/lib/types/user";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { LoginResponse } from '@/app/lib/types/network';
import { JWT_SECRET } from '@/app/lib/constants';

export async function POST(req: Request) {
  const loginResponse: LoginResponse = { code: 200, ok: true };
  try {
    // parse and validate request body
    const { email, password } = await req.json();
    if (!email || !password) {
      loginResponse.code = 400;
      loginResponse.ok = false;
      loginResponse.message = "Email and password are required";
      return Response.json(loginResponse, { status: 400 });
    }

    // 格式校验
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      loginResponse.ok = false;
      loginResponse.code = 400;
      loginResponse.message = "Email format error";
      return Response.json(loginResponse, { status: 400 });
    }
    if (email.length > 100) {
      loginResponse.ok = false;
      loginResponse.code = 400;
      loginResponse.message = "Email too long";
      return Response.json(loginResponse, { status: 400 });
    }
    if (password.length < 32 || password.length > 128) {
      loginResponse.ok = false;
      loginResponse.code = 400;
      loginResponse.message = "Password length error";
      return Response.json(loginResponse, { status: 400 });
    }

    console.log(`verifying user: ${email}`);
    const rows = await sql<User[]>`SELECT * FROM "User" WHERE email=${email}`;
    const user = rows[0];

    if (!user) {
      loginResponse.code = 401;
      loginResponse.ok = false;
      loginResponse.message = "Invalid email or password";
      return Response.json(loginResponse, { status: 401 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordhash ?? '');
    if (!passwordsMatch) {
      loginResponse.code = 401;
      loginResponse.ok = false;
      loginResponse.message = "Invalid email or password";
      return Response.json(loginResponse, { status: 401 });
    }

    // generate a session token or JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    (await cookies()).set('session', token, { httpOnly: true, secure: true });
    loginResponse.message = "Login successful";
    loginResponse.user = { id: user.id, email: user.email, role: user.role, emailverified: user.emailverified };
    return Response.json(loginResponse);
  } catch (error) {
    console.error("Login error: ", error);
    loginResponse.code = 500;
    loginResponse.ok = false;
    loginResponse.message = "Failed to login";
    return Response.json(loginResponse, { status: 500 });
  }
}
