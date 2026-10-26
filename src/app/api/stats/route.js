import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDb();

    // Incidentes contadores
    const incidentsRes = await db.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'aberto' THEN 1 ELSE 0 END) as abertos,
        SUM(CASE WHEN status IN ('em_analise', 'em_atendimento', 'aguardando_peca') THEN 1 ELSE 0 END) as em_andamento,
        SUM(CASE WHEN status = 'resolvido' THEN 1 ELSE 0 END) as resolvidos,
        SUM(CASE WHEN priority = 'critica' AND status != 'resolvido' AND status != 'fechado' THEN 1 ELSE 0 END) as criticos
      FROM incidents
    `);

    // Notebooks contadores
    const notebooksRes = await db.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status IN ('disponivel', 'em_uso') THEN 1 ELSE 0 END) as operacionais,
        SUM(CASE WHEN status IN ('em_manutencao', 'danificado', 'aguardando_peca') THEN 1 ELSE 0 END) as defeito
      FROM notebooks
    `);

    // Salas contadores
    const roomsRes = await db.execute(`
      SELECT COUNT(*) as total,
      SUM(CASE WHEN status != 'operacional' THEN 1 ELSE 0 END) as com_interdicao
      FROM rooms
    `);

    // Equipamentos contadores
    const equipmentRes = await db.execute(`
      SELECT COUNT(*) as total,
      SUM(CASE WHEN status != 'disponivel' THEN 1 ELSE 0 END) as em_manutencao
      FROM equipment
    `);

    // Distribuição por target_type
    const typeDistRes = await db.execute(`
      SELECT target_type, COUNT(*) as count
      FROM incidents
      GROUP BY target_type
    `);

    // Incidentes recentes
    const recentIncidentsRes = await db.execute(`
      SELECT id, code, title, target_name, target_type, priority, status, requester_name, created_at
      FROM incidents
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const nbTotal = Number(notebooksRes.rows[0]?.total || 0);
    const nbOperacionais = Number(notebooksRes.rows[0]?.operacionais || 0);
    const availabilityRate = nbTotal > 0 ? ((nbOperacionais / nbTotal) * 100).toFixed(1) : 100;

    return NextResponse.json({
      success: true,
      stats: {
        incidents: {
          total: Number(incidentsRes.rows[0]?.total || 0),
          abertos: Number(incidentsRes.rows[0]?.abertos || 0),
          em_andamento: Number(incidentsRes.rows[0]?.em_andamento || 0),
          resolvidos: Number(incidentsRes.rows[0]?.resolvidos || 0),
          criticos: Number(incidentsRes.rows[0]?.criticos || 0),
        },
        notebooks: {
          total: nbTotal,
          operacionais: nbOperacionais,
          defeito: Number(notebooksRes.rows[0]?.defeito || 0),
          availabilityRate: Number(availabilityRate),
        },
        rooms: {
          total: Number(roomsRes.rows[0]?.total || 0),
          com_interdicao: Number(roomsRes.rows[0]?.com_interdicao || 0),
        },
        equipment: {
          total: Number(equipmentRes.rows[0]?.total || 0),
          em_manutencao: Number(equipmentRes.rows[0]?.em_manutencao || 0),
        },
        typeDistribution: typeDistRes.rows,
        recentIncidents: recentIncidentsRes.rows,
      },
    });
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
