import sql from "@/app/lib/data";

export async function POST(req: Request) {
  try {
    // const { level } = await req.json();
    const rows = await sql`SELECT * FROM jlpt_exams`;
    return Response.json({ ok: true, code: 200, data: rows });
  } catch (error) {
    console.log('Server Error:', error);
    return Response.json({ ok: false, code: 500, message: 'Internal Server Error' });
  }
}