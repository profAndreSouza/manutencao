"use client";

import React, { useState } from "react";
import {
  Users,
  Sun,
  Moon,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  ShieldCheck,
  Search,
  Filter,
  Printer,
  ChevronRight,
  Laptop,
} from "lucide-react";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export default function TeacherShiftsView({
  incidents = [],
  notebooks = [],
  onSelectIncident,
  onOpenOrientationModal,
}) {
  const [filterPeriodo, setFilterPeriodo] = useState("todos");
  const [filterModalidade, setFilterModalidade] = useState("todas");
  const [search, setSearch] = useState("");

  // Estatísticas de turnos
  const manhaCount = incidents.filter((x) => x.periodo === "manha").length;
  const tardeCount = incidents.filter((x) => x.periodo === "tarde").length;
  const noiteCount = incidents.filter((x) => x.periodo === "noite").length;
  const retiradaCount = incidents.filter((x) => Number(x.is_retirada) === 1).length;

  // Filtragem
  const filteredIncidents = incidents.filter((inc) => {
    const matchSearch =
      search === "" ||
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.target_name.toLowerCase().includes(search.toLowerCase()) ||
      (inc.turma && inc.turma.toLowerCase().includes(search.toLowerCase())) ||
      inc.requester_name.toLowerCase().includes(search.toLowerCase());

    const matchPeriodo = filterPeriodo === "todos" || inc.periodo === filterPeriodo;
    const matchModalidade = filterModalidade === "todas" || inc.modalidade === filterModalidade;

    return matchSearch && matchPeriodo && matchModalidade;
  });

  return (
    <div className="space-y-6">
      {/* Header Institucional de Mediação & Acompanhamento */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-lg p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white">
                Gestão Pedagógica
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Conferência entre Turnos & Denominador Comum
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
              Acompanhamento de Ocorrências Diurno & Noturno
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Procedimento oficial de trabalho para acompanhamento compartilhado entre professores de todos os períodos. Permite identificar reincidências nos notebooks das Salas 1, 2, 4 e 5, verificar a origem das avarias sem transferir responsabilidades generalizadas e emitir orientações formais por escrito para turmas do CAI, CT, CST e FIC.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards dos Turnos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-1">
            <span>Período Manhã</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">
            {manhaCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Registros de turmas CAI / CT</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-1">
            <span>Período Tarde</span>
            <Sun className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">
            {tardeCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Registros de turmas CAI / CT / FIC</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-1">
            <span>Período Noite</span>
            <Moon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">
            {noiteCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Registros CST Superior e CT Noturno</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-1">
            <span>Registrados na Retirada</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-heading">
            {retiradaCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Alunos resguardados por aviso prévio</p>
        </div>
      </div>

      {/* Protocolo Operacional Padrão (POP) Institucional */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading mb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-red-700" />
          Procedimento Operacional Padrão de Notebooks (UniSENAI Sorocaba)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <strong className="text-slate-900 block mb-1">1. Na Retirada pelo Aluno:</strong>
            O aluno confere o notebook da sua vaga numerada. Ao notar qualquer falha (tecla, tela ou fonte), registra imediatamente no sistema para não ser responsabilizado.
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <strong className="text-slate-900 block mb-1">2. Cruzamento entre Turnos:</strong>
            Os professores do turno diurno e noturno analisam os registros de quem utilizou o equipamento no período anterior, sem julgamentos prévios.
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <strong className="text-slate-900 block mb-1">3. Orientação Formal por Escrito:</strong>
            Identificada a turma de origem ou reincidência, o professor emite a orientação formal impressa ou digital para alinhamento pedagógico dos estudantes.
          </div>
        </div>
      </div>

      {/* Tabela de Ocorrências com Filtro de Turnos e Ação de Orientação */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por turma, solicitante, notebook ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-hidden focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterPeriodo}
              onChange={(e) => setFilterPeriodo(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-700"
            >
              <option value="todos">Todos os Turnos</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
            </select>

            <select
              value={filterModalidade}
              onChange={(e) => setFilterModalidade(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-700"
            >
              <option value="todas">Todas Modalidades</option>
              <option value="CAI">CAI (Aprendizagem)</option>
              <option value="CT">CT (Técnico)</option>
              <option value="CST">CST (Superior)</option>
              <option value="FIC">FIC (Formação)</option>
            </select>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Código & Data</th>
                <th className="py-3 px-4">Recurso / Vaga</th>
                <th className="py-3 px-4">Turno & Turma</th>
                <th className="py-3 px-4">Ocorrência Registrada</th>
                <th className="py-3 px-4">Orientação Formal</th>
                <th className="py-3 px-4 text-right">Ações Pedagógicas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Nenhum registro encontrado para este filtro.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 block">{inc.code}</span>
                      <span className="text-[11px] text-slate-500">{formatTimeAgo(inc.created_at)}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-red-700" />
                        <span>{inc.target_name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{inc.room_location}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                          {inc.periodo || "Geral"}
                        </span>
                        <span className="font-bold text-slate-800">{inc.modalidade || "CT"}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{inc.turma || "Turma regular"}</div>
                      <div className="text-[10px] text-slate-400">Por: {inc.requester_name}</div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900">{inc.title}</div>
                      {inc.is_retirada ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Na Retirada
                        </span>
                      ) : null}
                    </td>

                    <td className="py-3 px-4">
                      {inc.orientacao_formal ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          <FileText className="w-3.5 h-3.5" />
                          Emitida
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Pendente</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => onOpenOrientationModal(inc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white rounded-xs transition-colors cursor-pointer"
                        title="Emitir Orientação Formal por Escrito"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Orientação</span>
                      </button>

                      <button
                        onClick={() => onSelectIncident(inc)}
                        className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white rounded-xs transition-colors cursor-pointer"
                      >
                        Atender
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
