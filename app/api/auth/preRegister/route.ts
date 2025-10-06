'use server'

import crypto from "crypto";
import { randomUUID } from "crypto";
import { Resend } from 'resend';
import sql from "@/app/lib/data";
import { cookies } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(req: Request) {
  const { email, passwordHash } = await req.json();

  if (!email || !passwordHash) {
    return Response.json({ ok: false, error: "Parameter Error" }, { status: 400 });
  }

  try {
    // 1. Check if email already exists
    const existing = await sql`SELECT * FROM "User" WHERE email = ${email.toLowerCase()} LIMIT 1`;
    if (existing.length > 0) {
      return Response.json({ ok: false, error: "Email already registered" }, { status: 400 });
    }

    // 2. generate temp token and store temp registration
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await sql`
      INSERT INTO "TempRegister" (token, email, passwordHash, expiresAt)
      VALUES (${token}, ${email.toLowerCase()}, ${passwordHash}, ${expiresAt})
    `;

    // 3. Verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await sql`
      INSERT INTO "EmailCode" (email, codeHash, expiresAt)
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
    return Response.json({ ok: true, token });
  } catch (err) {
    return Response.json({ ok: false, error: "Failed to initialize registration" }, { status: 500 });
  }
}
