import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const cart = searchParams.get("cart") || "";
    const status = searchParams.get("status") || "";

    let sql = `SELECT * FROM notebooks WHERE 1=1`;
    const args = [];

    if (search) {
      sql += ` AND (asset_tag LIKE ? OR brand LIKE ? OR model LIKE ? OR serial_number LIKE ? OR slot_number LIKE ?)`;
      const term = `%${search}%`;
      args.push(term, term, term, term, term);
    }

    if (cart && cart !== "todos") {
      sql += ` AND cart_group = ?`;
      args.push(cart);
    }

    if (status && status !== "todos") {
      sql += ` AND status = ?`;
      args.push(status);
    }

    sql += ` ORDER BY cart_group ASC, slot_number ASC`;

    const result = await db.execute({ sql, args });

    // Obter lista única de carrinhos para os filtros
    const cartsRes = await db.execute(`
      SELECT 
        cart_group,
        COUNT(*) as total,
        SUM(CASE WHEN status IN ('disponivel', 'em_uso') THEN 1 ELSE 0 END) as operacionais,
        SUM(CASE WHEN status IN ('em_manutencao', 'danificado', 'aguardando_peca') THEN 1 ELSE 0 END) as defeito
      FROM notebooks
      GROUP BY cart_group
    `);

    return NextResponse.json({
      success: true,
      notebooks: result.rows,
      carts: cartsRes.rows,
    });
  } catch (error) {
    console.error("Erro ao listar notebooks:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();

    const {
      asset_tag,
      cart_group,
      slot_number,
      brand,
      model,
      processor = "Intel Core i5",
      ram = "16 GB DDR4",
      storage = "512 GB SSD",
      serial_number = "",
      charger_tag = "",
      battery_health = "100%",
      notes = "",
    } = body;

    if (!asset_tag || !cart_group || !slot_number || !brand || !model) {
      return NextResponse.json(
        { success: false, error: "Preencha todos os campos obrigatórios do notebook." },
        { status: 400 }
      );
    }

    const id = `nb-${Date.now()}`;

    await db.execute({
      sql: `INSERT INTO notebooks (
        id, asset_tag, cart_group, slot_number, brand, model,
        processor, ram, storage, serial_number, charger_tag,
        battery_health, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'disponivel', ?)`,
      args: [
        id,
        asset_tag,
        cart_group,
        slot_number,
        brand,
        model,
        processor,
        ram,
        storage,
        serial_number,
        charger_tag,
        battery_health,
        notes,
      ],
    });

    return NextResponse.json({ success: true, id, asset_tag });
  } catch (error) {
    console.error("Erro ao cadastrar notebook:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
