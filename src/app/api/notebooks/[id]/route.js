import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await initDb();
    const { id } = await params;

    const nbRes = await db.execute({
      sql: `SELECT * FROM notebooks WHERE id = ? OR asset_tag = ?`,
      args: [id, id],
    });

    if (nbRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Notebook não encontrado" }, { status: 404 });
    }

    const notebook = nbRes.rows[0];

    // Buscar incidentes deste notebook
    const incidentsRes = await db.execute({
      sql: `SELECT * FROM incidents WHERE target_id = ? OR target_id = ? ORDER BY created_at DESC`,
      args: [notebook.id, notebook.asset_tag],
    });

    return NextResponse.json({
      success: true,
      notebook,
      incidents: incidentsRes.rows,
    });
  } catch (error) {
    console.error("Erro ao obter notebook:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();

    const { status, battery_health, notes, cart_group, slot_number } = body;

    const fields = [];
    const args = [];

    if (status !== undefined) {
      fields.push("status = ?");
      args.push(status);
    }
    if (battery_health !== undefined) {
      fields.push("battery_health = ?");
      args.push(battery_health);
    }
    if (notes !== undefined) {
      fields.push("notes = ?");
      args.push(notes);
    }
    if (cart_group !== undefined) {
      fields.push("cart_group = ?");
      args.push(cart_group);
    }
    if (slot_number !== undefined) {
      fields.push("slot_number = ?");
      args.push(slot_number);
    }

    if (fields.length === 0) {
      return NextResponse.json({ success: false, error: "Nenhum campo para atualizar" }, { status: 400 });
    }

    args.push(id, id);

    await db.execute({
      sql: `UPDATE notebooks SET ${fields.join(", ")} WHERE id = ? OR asset_tag = ?`,
      args,
    });

    return NextResponse.json({ success: true, message: "Notebook atualizado" });
  } catch (error) {
    console.error("Erro ao atualizar notebook:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
