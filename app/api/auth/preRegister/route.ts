'use server'

import crypto from "crypto";
import { randomUUID } from "crypto";
import { Resend } from 'resend';
import sql from "@/app/lib/data";
import { cookies } from "next/headers";
import { PreRegisterResponse } from "@/app/lib/types/network";

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(req: Request) {
  const preRegisterResponse: PreRegisterResponse = { ok: true, code: 200 };

  try {
    const { email, passwordHash } = await req.json();

    if (!email || !passwordHash) {
      preRegisterResponse.ok = false;
      preRegisterResponse.code = 400;
      preRegisterResponse.message = "Parameter Error";
      return Response.json(preRegisterResponse, { status: 400 });
    }
    // 格式校验
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      preRegisterResponse.ok = false;
      preRegisterResponse.code = 400;
      preRegisterResponse.message = "Email format error";
      return Response.json(preRegisterResponse, { status: 400 });
    }
    if (email.length > 100) {
      preRegisterResponse.ok = false;
      preRegisterResponse.code = 400;
      preRegisterResponse.message = "Email too long";
      return Response.json(preRegisterResponse, { status: 400 });
    }
    if (passwordHash.length < 32 || passwordHash.length > 128) {
      preRegisterResponse.ok = false;
      preRegisterResponse.code = 400;
      preRegisterResponse.message = "Password hash length error";
      return Response.json(preRegisterResponse, { status: 400 });
    }

    // 1. Check if email already exists
    const existing = await sql`SELECT * FROM "user" WHERE email = ${email.toLowerCase()} LIMIT 1`;
    if (existing.length > 0) {
      preRegisterResponse.ok = false;
      preRegisterResponse.code = 400;
      preRegisterResponse.message = "Email already registered";
      return Response.json(preRegisterResponse, { status: 400 });
    }

    // 2. generate temp token and store temp registration
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await sql`
      INSERT INTO "temp_register" (token, email, passwordHash, expiresAt)
      VALUES (${token}, ${email.toLowerCase()}, ${passwordHash}, ${expiresAt})
    `;

    // 3. Verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await sql`
      INSERT INTO "email_code" (email, codeHash, expiresAt)
      VALUES (${email.toLowerCase()}, ${codeHash}, ${codeExpiresAt})
    `;

    // 4. Send Email
    await resend.emails.send({
      from: process.env.SMTP_HOST || '',
      to: email,
      subject: "您的注册验证码",
      text: `您的验证码是 ${code}，有效期10分钟，请勿泄露给他人。`
    });
    (await cookies()).set("registerToken", token, {
      httpOnly: true,
      secure: true
    })
    // 5. Return token
    return Response.json(preRegisterResponse);
  } catch (err) {
    console.error("Pre-register error:", err);
    preRegisterResponse.ok = false;
    preRegisterResponse.code = 500;
    preRegisterResponse.message = "Internal Server Error";
    return Response.json(preRegisterResponse, { status: 500 });
  }
}
