import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";

    let sql = `
      SELECT e.*,
        (SELECT COUNT(*) FROM incidents i WHERE i.target_id = e.id AND i.status NOT IN ('resolvido', 'fechado')) as active_incidents
      FROM equipment e
      WHERE 1=1
    `;
    const args = [];

    if (search) {
      sql += ` AND (name LIKE ? OR asset_tag LIKE ? OR serial_number LIKE ? OR room_name LIKE ?)`;
      const term = `%${search}%`;
      args.push(term, term, term, term);
    }

    if (category && category !== "todas") {
      sql += ` AND category = ?`;
      args.push(category);
    }

    if (status && status !== "todos") {
      sql += ` AND status = ?`;
      args.push(status);
    }

    sql += ` ORDER BY name ASC`;

    const result = await db.execute({ sql, args });

    return NextResponse.json({
      success: true,
      equipment: result.rows,
    });
  } catch (error) {
    console.error("Erro ao listar equipamentos:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
