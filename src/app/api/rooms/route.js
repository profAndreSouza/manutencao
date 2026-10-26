import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    let sql = `
      SELECT r.*,
        (SELECT COUNT(*) FROM incidents i WHERE i.target_id = r.id AND i.status NOT IN ('resolvido', 'fechado')) as active_incidents
      FROM rooms r
      WHERE 1=1
    `;
    const args = [];

    if (search) {
      sql += ` AND (name LIKE ? OR code LIKE ? OR block LIKE ?)`;
      const term = `%${search}%`;
      args.push(term, term, term);
    }

    if (status && status !== "todos") {
      sql += ` AND status = ?`;
      args.push(status);
    }

    sql += ` ORDER BY block ASC, name ASC`;

    const result = await db.execute({ sql, args });

    return NextResponse.json({
      success: true,
      rooms: result.rows,
    });
  } catch (error) {
    console.error("Erro ao listar salas:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
