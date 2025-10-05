import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function GET(req: Request) {
  // 1. Check session cookie
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) {
    return Response.json({ ok: false, error: 'No session' }, { status: 401 });
  }

  // 2. Verify and decode JWT
  const isValidSession = jwt.verify(session, JWT_SECRET);
  if (!isValidSession) {
    return Response.json({ ok: false, error: 'Invalid session' }, { status: 401 });
  }
  const userInfo = jwt.decode(session);
  return Response.json({ ok: true, user: userInfo });
}