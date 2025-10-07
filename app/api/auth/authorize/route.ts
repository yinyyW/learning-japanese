import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AuthResponse } from "@/app/lib/types/network";
import { User } from "@/app/lib/types/user";

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function POST(req: Request) {
  const authResponse: AuthResponse = { ok: true, code: 200 };
  // 1. Check session cookie
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) {
    authResponse.ok = false;
    authResponse.code = 401;
    authResponse.message = 'No session';
    return Response.json(authResponse, { status: 401 });
  }

  // 2. Verify and decode JWT
  const isValidSession = jwt.verify(session, JWT_SECRET);
  if (!isValidSession) {
    authResponse.ok = false;
    authResponse.code = 401;
    authResponse.message = 'Invalid session';
    return Response.json(authResponse, { status: 401 });
  }
  const userInfo = jwt.decode(session);
  if (!userInfo) {
    authResponse.ok = false;
    authResponse.code = 401;
    authResponse.message = 'Failed to decode session';
    return Response.json(authResponse, { status: 401 });
  }
  authResponse.user = userInfo as User;
  return Response.json(authResponse);
}