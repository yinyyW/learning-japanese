import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookiesStore = await cookies();
  if (!cookiesStore.has('session')) {
    return Response.json({ ok: false, error: 'No session' }, { status: 401 });
  }
  cookiesStore.delete('session');
  return Response.json({ ok: true });
}