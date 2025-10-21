import sql from '@/app/lib/data';

export async function POST(req: Request) {
  try {
    const { examId } = await req.json();
    console.log('Received examId:', examId);
    const rows = await sql`SELECT material_id FROM jlpt_listening_materials WHERE exam_id = ${examId} ORDER BY question_num ASC`;
    const result = rows.map((row) => row.material_id);
    return Response.json({ ok: true, code: 200, data: result });
  } catch (error) {
    console.log('Server Error:', error);
    return Response.json({ ok: false, code: 500, message: 'Internal Server Error' });
  }

}