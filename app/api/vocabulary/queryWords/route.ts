import { QueryWordsResponse } from "@/app/lib/types/network";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import sql from "@/app/lib/data";
import { JLPTLevel } from "@/app/lib/types/common";
import { WordStatus } from "@/app/lib/types/vocabulary";
import postgres from "postgres";

export async function POST(req: Request) {
  const resData: QueryWordsResponse = { code: 200, ok: true };
  try {
    // 1. Verify user authentication
    const cookiesStore = await cookies();
    const token = cookiesStore.get("session")?.value;
    if (!token) {
      resData.code = 401;
      resData.ok = false;
      resData.message = "Invalid session";
      return Response.json(resData, { status: 401 });
    }
    const isValidToken = jwt.verify(token, process.env.JWT_SECRET || "");
    if (!isValidToken) {
      resData.code = 401;
      resData.ok = false;
      resData.message = "Invalid session";
      return Response.json(resData, { status: 401 });
    }
    const user = jwt.decode(token) as { id: number };

    // 2️. Parse and validate request body
    console.log('parsing request body');
    const { level, status, page = 1, limit = 10 } = await req.json();
    const offset = (page - 1) * limit;

    if (!level || !status) {
      resData.code = 400;
      resData.ok = false;
      resData.message = "Invalid parameters";
      return Response.json(resData, { status: 400 });
    }
    if (Object.values(WordStatus).indexOf(status) === -1) {
      resData.code = 400;
      resData.ok = false;
      resData.message = "Invalid status";
      return Response.json(resData, { status: 400 });
    }

    // 3️. Get jlpt_level_id from level name
    console.log('fetching jlpt level id');
    const jlptRows = await sql<JLPTLevel[]>`SELECT * FROM "jlpt_levels" WHERE level_name = ${level} LIMIT 1`;
    if (jlptRows.length === 0) {
      resData.code = 400;
      resData.ok = false;
      resData.message = "Invalid JLPT level";
      return Response.json(resData, { status: 400 });
    }
    const jlptLevelId = jlptRows[0].id;

    console.log(`jlpt: ${jlptRows[0].total_count}`);

    // 4️. Fetch words based on status
    console.log('fetching words');
    let wordsRows: postgres.Row[] = [];
    const wordsTotal = jlptRows[0].total_count || 0;
    const wordsLearned = await sql`SELECT count(*) AS total FROM words as w JOIN "user_word_learned" as uwl ON w.id = uwl.word_id WHERE uwl.user_id = ${user.id} AND w.jlpt_level_id = ${jlptLevelId}`;

    if (status === WordStatus.learned) {
      wordsRows = await sql`SELECT w.* FROM words AS w JOIN "user_word_learned" AS uwl ON w.id = uwl.word_id
      WHERE uwl.user_id = ${user.id} AND w.jlpt_level_id = ${jlptLevelId} ORDER BY w.romaji LIMIT ${limit} OFFSET ${offset};`;
    } else {
      wordsRows = await sql`SELECT * FROM words AS w WHERE w.jlpt_level_id = ${jlptLevelId} AND NOT EXISTS (SELECT 1 FROM "user_word_learned" as uwl WHERE uwl.user_id = ${user.id} AND uwl.word_id = w.id) ORDER BY w.romaji LIMIT ${limit} OFFSET ${offset};`;
    }
    resData.words = [];
    wordsRows.forEach(row => {
      resData.words?.push({
        id: row.word_id,
        word: row.word,
        meaning: row.meaning,
        jlpt_level_id: row.jlpt_level_id,
        furigana: row.furigana,
        romaji: row.romaji,
        level: row.level,
      });
    });


    console.log(`wordsLearned: ${wordsLearned[0]?.total}, wordsTotal: ${wordsTotal}`);
    resData.total = status === WordStatus.learned ? (wordsLearned[0]?.total || 0) : (wordsTotal - (wordsLearned[0]?.total || 0));
    resData.page = page;
    resData.limit = limit;
    return Response.json(resData);
  } catch (err) {
    console.error("Server error", err);
    resData.code = 500;
    resData.ok = false;
    resData.message = "Server error";
    return Response.json(resData, { status: 500 });
  }
}
