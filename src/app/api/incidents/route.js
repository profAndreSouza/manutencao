import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";
    const targetType = searchParams.get("target_type") || "";
    const periodo = searchParams.get("periodo") || "";
    const modalidade = searchParams.get("modalidade") || "";

    let sql = `SELECT * FROM incidents WHERE 1=1`;
    const args = [];

    if (search) {
      sql += ` AND (title LIKE ? OR code LIKE ? OR description LIKE ? OR target_name LIKE ? OR requester_name LIKE ? OR turma LIKE ?)`;
      const term = `%${search}%`;
      args.push(term, term, term, term, term, term);
    }

    if (status && status !== "todos") {
      sql += ` AND status = ?`;
      args.push(status);
    }

    if (priority && priority !== "todas") {
      sql += ` AND priority = ?`;
      args.push(priority);
    }

    if (targetType && targetType !== "todos") {
      sql += ` AND target_type = ?`;
      args.push(targetType);
    }

    if (periodo && periodo !== "todos") {
      sql += ` AND periodo = ?`;
      args.push(periodo);
    }

    if (modalidade && modalidade !== "todas") {
      sql += ` AND modalidade = ?`;
      args.push(modalidade);
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await db.execute({ sql, args });

    return NextResponse.json({
      success: true,
      incidents: result.rows,
    });
  } catch (error) {
    console.error("Erro ao listar incidentes:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();

    const {
      title,
      description,
      target_type,
      target_id,
      target_name,
      category = "hardware",
      priority = "media",
      requester_name,
      requester_email,
      requester_role = "aluno",
      periodo = "manha",
      modalidade = "CT",
      turma = "Turma Geral",
      is_retirada = 1,
      room_location = "",
      photo_url = "",
    } = body;

    if (!title || !description || !target_type || !target_name || !requester_name) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    // Gerar código do chamado
    const countRes = await db.execute("SELECT COUNT(*) as total FROM incidents");
    const nextNum = Number(countRes.rows[0].total) + 1;
    const code = `INC-${new Date().getFullYear()}-${String(nextNum).padStart(3, "0")}`;
    const id = `inc-${Date.now()}`;
    const now = new Date().toISOString();

    // Inserir chamado
    await db.execute({
      sql: `INSERT INTO incidents (
        id, code, title, description, target_type, target_id, target_name,
        category, priority, status, requester_name, requester_email,
        requester_role, periodo, modalidade, turma, is_retirada,
        assigned_to, room_location, solution_notes, photo_url,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'aberto', ?, ?, ?, ?, ?, ?, ?, NULL, ?, NULL, ?, ?, ?)`,
      args: [
        id,
        code,
        title,
        description,
        target_type,
        target_id,
        target_name,
        category,
        priority,
        requester_name,
        requester_email || "contato@sp.senai.br",
        requester_role,
        periodo,
        modalidade,
        turma,
        is_retirada ? 1 : 0,
        room_location,
        photo_url,
        now,
        now,
      ],
    });

    // Inserir histórico inicial
    const contextAction = is_retirada ? "registro_retirada" : "abertura";
    const contextMsg = is_retirada
      ? `Ocorrência registrada no momento da retirada pelo ${requester_role} ${requester_name} (Turma ${turma} - ${periodo.toUpperCase()}) para resguardar o aluno e notificar os docentes.`
      : `Chamado registrado por ${requester_name} (${turma}): ${title}`;

    await db.execute({
      sql: `INSERT INTO incident_history (id, incident_id, author_name, author_role, action_type, message, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        `hist-${Date.now()}`,
        id,
        requester_name,
        requester_role,
        contextAction,
        contextMsg,
        now,
      ],
    });

    // Atualizar status do equipamento / notebook / sala afetada
    if (target_type === "notebook" && target_id) {
      await db.execute({
        sql: `UPDATE notebooks 
              SET status = 'danificado', notes = ?, last_user = ?, last_turma = ?, last_periodo = ?
              WHERE id = ? OR asset_tag = ?`,
        args: [
          `Chamado ${code} aberto na retirada: ${title}`,
          requester_name,
          turma,
          periodo,
          target_id,
          target_id,
        ],
      });
    } else if (target_type === "equipamento" && target_id) {
      await db.execute({
        sql: `UPDATE equipment SET status = 'defeituoso' WHERE id = ? OR asset_tag = ?`,
        args: [target_id, target_id],
      });
    } else if (target_type === "sala" && target_id) {
      await db.execute({
        sql: `UPDATE rooms SET status = 'atencao' WHERE id = ? OR code = ?`,
        args: [target_id, target_id],
      });
    }

    return NextResponse.json({
      success: true,
      incident: {
        id,
        code,
        title,
        status: "aberto",
        periodo,
        modalidade,
        turma,
      },
    });
  } catch (error) {
    console.error("Erro ao criar incidente:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
