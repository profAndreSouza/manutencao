import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await initDb();
    const { id } = await params;

    const incidentRes = await db.execute({
      sql: `SELECT * FROM incidents WHERE id = ? OR code = ?`,
      args: [id, id],
    });

    if (incidentRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Incidente não encontrado" }, { status: 404 });
    }

    const incident = incidentRes.rows[0];

    // Buscar histórico de ações
    const historyRes = await db.execute({
      sql: `SELECT * FROM incident_history WHERE incident_id = ? ORDER BY created_at ASC`,
      args: [incident.id],
    });

    return NextResponse.json({
      success: true,
      incident,
      history: historyRes.rows,
    });
  } catch (error) {
    console.error("Erro ao obter incidente:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();

    const incidentRes = await db.execute({
      sql: `SELECT * FROM incidents WHERE id = ? OR code = ?`,
      args: [id, id],
    });

    if (incidentRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Incidente não encontrado" }, { status: 404 });
    }

    const current = incidentRes.rows[0];
    const now = new Date().toISOString();

    const {
      status,
      assigned_to,
      solution_notes,
      comment,
      author_name = "Técnico de Suporte",
      author_role = "tecnico",
      priority,
      orientacao_formal,
    } = body;

    const newStatus = status || current.status;
    const newAssigned = assigned_to !== undefined ? assigned_to : current.assigned_to;
    const newSolution = solution_notes !== undefined ? solution_notes : current.solution_notes;
    const newPriority = priority || current.priority;
    const resolvedAt = (newStatus === "resolvido" && !current.resolved_at) ? now : current.resolved_at;
    const newOrientacao = orientacao_formal !== undefined ? orientacao_formal : current.orientacao_formal;
    const orientacaoDate = orientacao_formal ? now : current.orientacao_gerada_em;

    await db.execute({
      sql: `UPDATE incidents 
            SET status = ?, assigned_to = ?, solution_notes = ?, priority = ?, orientacao_formal = ?, orientacao_gerada_em = ?, updated_at = ?, resolved_at = ?
            WHERE id = ?`,
      args: [newStatus, newAssigned, newSolution, newPriority, newOrientacao, orientacaoDate, now, resolvedAt, current.id],
    });

    // Se houve emissão de orientação formal por escrito pelo professor
    if (orientacao_formal && orientacao_formal !== current.orientacao_formal) {
      await db.execute({
        sql: `INSERT INTO incident_history (id, incident_id, author_name, author_role, action_type, message, created_at)
              VALUES (?, ?, ?, ?, 'orientacao_formal', ?, ?)`,
        args: [
          `hist-${Date.now()}-orient`,
          current.id,
          author_name,
          author_role,
          `Orientação Formal por Escrito registrada pelo docente: "${orientacao_formal}"`,
          now,
        ],
      });
    }

    // Se houve mudança de status, registrar no histórico
    if (status && status !== current.status) {
      await db.execute({
        sql: `INSERT INTO incident_history (id, incident_id, author_name, author_role, action_type, message, created_at)
              VALUES (?, ?, ?, ?, 'status_change', ?, ?)`,
        args: [
          `hist-${Date.now()}-1`,
          current.id,
          author_name,
          author_role,
          `Status alterado de "${current.status}" para "${newStatus}".`,
          now,
        ],
      });
    }

    // Se foi atribuído novo técnico
    if (assigned_to && assigned_to !== current.assigned_to) {
      await db.execute({
        sql: `INSERT INTO incident_history (id, incident_id, author_name, author_role, action_type, message, created_at)
              VALUES (?, ?, ?, ?, 'atribuicao', ?, ?)`,
        args: [
          `hist-${Date.now()}-2`,
          current.id,
          author_name,
          author_role,
          `Chamado atribuído ao técnico: ${assigned_to}`,
          now,
        ],
      });
    }

    // Se há comentário adicional ou nota de resolução
    if (comment) {
      await db.execute({
        sql: `INSERT INTO incident_history (id, incident_id, author_name, author_role, action_type, message, created_at)
              VALUES (?, ?, ?, ?, 'comentario', ?, ?)`,
        args: [
          `hist-${Date.now()}-3`,
          current.id,
          author_name,
          author_role,
          comment,
          now,
        ],
      });
    }

    // Se foi marcado como resolvido, atualizar o status do equipamento / notebook de volta para operacional
    if (newStatus === "resolvido") {
      if (current.target_type === "notebook") {
        await db.execute({
          sql: `UPDATE notebooks SET status = 'disponivel', notes = 'Manutenção concluída via chamado ' || ? WHERE id = ? OR asset_tag = ?`,
          args: [current.code, current.target_id, current.target_id],
        });
      } else if (current.target_type === "equipamento" || current.target_type === "computador") {
        await db.execute({
          sql: `UPDATE equipment SET status = 'disponivel' WHERE id = ? OR asset_tag = ?`,
          args: [current.target_id, current.target_id],
        });
      } else if (current.target_type === "sala") {
        await db.execute({
          sql: `UPDATE rooms SET status = 'operacional' WHERE id = ? OR code = ?`,
          args: [current.target_id, current.target_id],
        });
      }
    } else if (newStatus === "em_atendimento") {
      if (current.target_type === "notebook") {
        await db.execute({
          sql: `UPDATE notebooks SET status = 'em_manutencao' WHERE id = ? OR asset_tag = ?`,
          args: [current.target_id, current.target_id],
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Incidente atualizado com sucesso",
      incident: {
        id: current.id,
        code: current.code,
        status: newStatus,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar incidente:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
