import { cookies } from "next/headers";
import sql from "@/app/lib/data";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('registerToken')?.value;

    if (!token || !code) {
      return Response.json({ ok: false, error: "Parameter Error" }, { status: 400 });
    }

    // 1. 查找临时注册信息
    console.log(`search temp register info: ${token}`)
    const tmp = await sql`
      SELECT * FROM "TempRegister"
      WHERE token = ${token} AND used = false AND expiresAt > now()
      LIMIT 1
    `;
    if (tmp.length === 0) {
      return Response.json({ ok: false, error: "Invalid or Expired Registration Token" }, { status: 400 });
    }

    const tempUser = tmp[0];
    const email = tempUser.email;
    console.log(`temp user info: email ${email}`);

    // 2. 查找最新验证码
    console.log(`temp email confirm code: $`);
    const codeRecord = await sql`
      SELECT * FROM "EmailCode"
      WHERE email = ${email} AND used = false AND expiresAt > now()
      ORDER BY createdAt DESC
      LIMIT 1
    `;
    console.log(`find email code: ${codeRecord}`)
    if (codeRecord.length === 0) {
      return Response.json({ ok: false, error: "Invalid or Expired Email Code" }, { status: 400 });
    }
    const record = codeRecord[0];
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    if (codeHash !== record.codehash) {
      return Response.json({ ok: false, error: "Invalid Email Code" }, { status: 401 });
    }

    console.log("update email code table")
    // 3. 标记验证码已使用
    await sql`UPDATE "EmailCode" SET used = true WHERE id = ${record.id}`;

    // 4. 创建正式用户
    console.log("create new user");
    await sql`
      INSERT INTO "User" (email, passwordHash, emailVerified)
      VALUES (${email.toLowerCase()}, ${tempUser.passwordhash}, now())
    `;

    console.log("update temp register table")
    // 5. 标记临时 token 已使用
    await sql`UPDATE "TempRegister" SET used = true WHERE token = ${token}`;

    return Response.json({ ok: true, message: "Registration Successful" });
  } catch (err) {
    return Response.json({ ok: false, error: "Registration Initialization Failed" }, { status: 500 });
  }
 
}