'use server';

import bcrypt from 'bcryptjs';
import sql from "@/app/lib/data";
import { User } from "@/app/lib/types/user";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) return Response.json({ ok: false, error: "Email and password are required" }, { status: 400 });

    console.log(`verifying user: ${email}`);
    const rows = await sql<User[]>`SELECT * FROM "User" WHERE email=${email}`;
    const user = rows[0];

    if (!user) return Response.json({ ok: false, error: "Invalid email or password" }, { status: 401 });

    const passwordsMatch = await bcrypt.compare(password, user.passwordhash);
    if (!passwordsMatch) return Response.json({ ok: false, error: "Invalid email or password" }, { status: 401 });

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
  
    return Response.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ ok: false, error: "Failed to login" }, { status: 500 });
  }
}
