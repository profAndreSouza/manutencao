import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDb();
    const result = await db.execute("SELECT * FROM incidents ORDER BY created_at DESC");

    // CSV header
    const headers = [
      "Código",
      "Título",
      "Tipo",
      "Recurso / Equipamento",
      "Local",
      "Prioridade",
      "Status",
      "Solicitante",
      "E-mail",
      "Técnico Atribuído",
      "Data Abertura",
      "Data Resolução",
    ];

    const rows = result.rows.map((inc) => [
      `"${inc.code || ""}"`,
      `"${(inc.title || "").replace(/"/g, '""')}"`,
      `"${inc.target_type || ""}"`,
      `"${(inc.target_name || "").replace(/"/g, '""')}"`,
      `"${(inc.room_location || "").replace(/"/g, '""')}"`,
      `"${inc.priority || ""}"`,
      `"${inc.status || ""}"`,
      `"${(inc.requester_name || "").replace(/"/g, '""')}"`,
      `"${inc.requester_email || ""}"`,
      `"${(inc.assigned_to || "Não atribuído").replace(/"/g, '""')}"`,
      `"${inc.created_at || ""}"`,
      `"${inc.resolved_at || ""}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="relatorio-manutencao-unisenai-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
