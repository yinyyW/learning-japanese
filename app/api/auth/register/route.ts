import { cookies } from "next/headers";
import sql from "@/app/lib/data";
import crypto from "crypto";
import { RegisterResponse } from "@/app/lib/types/network";

export async function POST(req: Request) {
  const registerResponse: RegisterResponse = { ok: true, code: 200 };
  try {
    const { code } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('registerToken')?.value;

    if (!token || !code) {
      registerResponse.ok = false;
      registerResponse.code = 400;
      registerResponse.message = "Parameter Error";
      return Response.json(registerResponse, { status: 400 });
    }

    if (code.length !== 6) {
      registerResponse.ok = false;
      registerResponse.code = 400;
      registerResponse.message = "Code length error";
      return Response.json(registerResponse, { status: 400 });
    }

    // 1. 查找临时注册信息
    console.log('check temp register token');
    const tmp = await sql`
      SELECT * FROM "temp_register"
      WHERE token = ${token} AND used = false AND expiresAt > now()
      LIMIT 1
    `;
    if (tmp.length === 0) {
      registerResponse.ok = false;
      registerResponse.code = 400;
      registerResponse.message = "Invalid or Expired Registration Token";
      return Response.json(registerResponse, { status: 400 });
    }

    const tempUser = tmp[0];
    const email = tempUser.email;

    // 2. 查找最新验证码
    console.log('check email code');
    const codeRecord = await sql`
      SELECT * FROM "email_code"
      WHERE email = ${email} AND used = false AND expiresAt > now()
      ORDER BY createdAt DESC
      LIMIT 1
    `;
    if (codeRecord.length === 0) {
      registerResponse.ok = false;
      registerResponse.code = 400;
      registerResponse.message = "Invalid or Expired Email Code";
      return Response.json(registerResponse, { status: 400 });
    }
    const record = codeRecord[0];
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    if (codeHash !== record.codehash) {
      registerResponse.ok = false;
      registerResponse.code = 401;
      registerResponse.message = "Invalid Email Code";
      return Response.json(registerResponse, { status: 401 });
    }

    console.log("update email code table")
    // 3. 标记验证码已使用
    await sql`UPDATE "email_code" SET used = true WHERE id = ${record.id}`;

    // 4. 创建正式用户
    console.log("create new user");
    await sql`
      INSERT INTO "user" (email, passwordHash, emailVerified)
      VALUES (${email.toLowerCase()}, ${tempUser.passwordhash}, now())
    `;

    // 5. 标记临时 token 已使用
    await sql`UPDATE "temp_register" SET used = true WHERE token = ${token}`;

    registerResponse.message = "Registration Successful";
    return Response.json(registerResponse);
  } catch (err) {
    registerResponse.ok = false;
    registerResponse.code = 500;
    registerResponse.message = "Registration Initialization Failed";
    return Response.json(registerResponse, { status: 500 });
  }
}