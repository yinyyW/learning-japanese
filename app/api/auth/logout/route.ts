import { LogoutResponse } from '@/app/lib/types/network';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookiesStore = await cookies();
  const logoutResponse: LogoutResponse = { ok: true, code: 200 };
  if (!cookiesStore.has('session')) {
    logoutResponse.ok = false;
    logoutResponse.code = 401;
    logoutResponse.message = 'No session';
    return Response.json(logoutResponse, { status: 401 });
  }
  cookiesStore.delete('session');
  return Response.json(logoutResponse);
}