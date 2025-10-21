import sql from '@/app/lib/data';

export async function POST(req: Request) {
  try {
    const { materialId } = await req.json();
    if (!materialId) {
      return Response.json({ ok: false, code: 400, message: 'materialId is required' });
    }
    const rows = await sql`SELECT * FROM jlpt_listening_materials WHERE material_id = ${materialId}`;
    if (rows.length === 0) {
      return Response.json({ ok: false, code: 404, message: 'Material not found' });
    }
    return Response.json({ ok: true, code: 200, data: rows[0] });
  } catch (error) {
    console.log('Server Error:', error);
    return Response.json({ ok: false, code: 500, message: 'Internal Server Error' });
  }
}