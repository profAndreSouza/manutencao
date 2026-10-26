"use client";

import React from "react";
import {
  Laptop,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DoorOpen,
  Wrench,
  ArrowRight,
  TrendingUp,
  Flame,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Users,
  Cpu,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

export default function StatsOverview({
  stats,
  currentUser,
  onNavigateTab,
  onOpenNewIncident,
  onOpenStudentIntake,
  onSelectIncident,
}) {
  const incidents = stats?.incidents || {
    total: 0,
    abertos: 0,
    em_andamento: 0,
    resolvidos: 0,
    criticos: 0,
  };

  const notebooks = stats?.notebooks || {
    total: 128,
    operacionais: 124,
    defeito: 4,
    availabilityRate: 96.8,
  };

  const rooms = stats?.rooms || { total: 8, com_interdicao: 1 };
  const equipment = stats?.equipment || { total: 63, em_manutencao: 3 };
  const recentIncidents = stats?.recentIncidents || [];

  const isProfessor = currentUser?.role === "professor";

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "critica":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse-subtle"></span>
            Crítica
          </span>
        );
      case "alta":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
            Alta
          </span>
        );
      case "media":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
            Média
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            Baixa
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "aberto":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Aberto
          </span>
        );
      case "em_atendimento":
      case "em_analise":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            Em Atendimento
          </span>
        );
      case "aguardando_peca":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            Aguardando Peça
          </span>
        );
      case "resolvido":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Resolvido
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Boas-vindas / Alerta Operacional com Contexto do Usuário Demo */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-lg p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white">
                UniSENAI SP
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Sessão Ativa: <strong className="text-white">{currentUser.name}</strong> ({currentUser.badge})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
              Gestão de Ocorrências & Procedimento de Trabalho
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Sistema unificado para acompanhamento de irregularidades nos notebooks das Salas 1, 2, 4 e 5 (128 notebooks), Informática 4 (21 computadores), CNC (21 computadores) e Projetos (10 computadores + multímetros, fontes e kits didáticos).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Botão de Registro na Retirada (Substituindo o antigo Forms) */}
            <button
              onClick={onOpenStudentIntake}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm shadow-md transition-all cursor-pointer active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Registrar na Retirada</span>
            </button>

            {isProfessor && (
              <button
                onClick={() => onNavigateTab("turnos")}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-sm transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Acompanhamento Diurno / Noturno</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alerta Institucional Educativo */}
      <div className="bg-amber-50/90 border border-amber-300/80 rounded-lg p-4 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold text-amber-900 block mb-0.5">
              Procedimento de Resguardo e Alinhamento Pedagógico:
            </strong>
            Ao retirar um notebook no início da aula, o aluno deve verificar teclas, tela e carregador. Registrando a ocorrência na hora, você resguarda sua turma e permite que os professores realizem orientações formais por escrito para turmas do CAI, CT, CST e FIC.
          </div>
        </div>
        <button
          onClick={onOpenStudentIntake}
          className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-amber-700 hover:bg-amber-800 text-white rounded-xs shrink-0 self-end sm:self-auto cursor-pointer"
        >
          Check-in de Retirada
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Disponibilidade de Notebooks */}
        <div
          onClick={() => onNavigateTab("notebooks")}
          className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs hover:border-red-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Frota de Notebooks (Salas 1,2,4,5)
            </span>
            <div className="p-2 rounded-md bg-red-50 text-red-700 group-hover:scale-110 transition-transform">
              <Laptop className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              {notebooks.availabilityRate}%
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {notebooks.operacionais} de {notebooks.total} ativos
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${notebooks.availabilityRate}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="text-red-700 font-semibold flex items-center gap-1">
              {notebooks.defeito} em reparo/avaria
            </span>
            <span className="text-slate-400 group-hover:text-red-700 transition-colors flex items-center">
              Ver salas <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Chamados em Aberto */}
        <div
          onClick={() => onNavigateTab("incidents")}
          className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Chamados Abertos
            </span>
            <div className="p-2 rounded-md bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              {incidents.abertos}
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {incidents.em_andamento} em triagem
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Ocorrências registradas na retirada ou aula
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Total histórico: {incidents.total}</span>
            <span className="text-slate-400 group-hover:text-amber-700 transition-colors flex items-center">
              Acompanhar <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Computadores de Laboratórios */}
        <div
          onClick={() => onNavigateTab("equipment")}
          className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Computadores & Projetos
            </span>
            <div className="p-2 rounded-md bg-slate-100 text-slate-700 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              52 PCs
            </div>
            <span className="text-xs font-semibold text-slate-600">
              Inf 4, CNC e Projetos
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            + Multímetros, Fontes e Kits Didáticos
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>{equipment.total} ativos totais</span>
            <span className="text-slate-400 group-hover:text-slate-900 transition-colors flex items-center">
              Ver bancadas <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Salas Mapeadas */}
        <div
          onClick={() => onNavigateTab("rooms")}
          className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Salas & Laboratórios
            </span>
            <div className="p-2 rounded-md bg-slate-100 text-slate-700 group-hover:scale-110 transition-transform">
              <DoorOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              {rooms.total} Ambientes
            </div>
            <span className="text-xs font-semibold text-slate-600">
              1, 2, 3, 4, 5, Inf 4, Proj, CNC
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {rooms.com_interdicao > 0
              ? `${rooms.com_interdicao} ambiente com ocorrência ativa`
              : "Ambientes 100% operacionais"}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Infraestrutura predial</span>
            <span className="text-slate-400 group-hover:text-slate-900 transition-colors flex items-center">
              Ver salas <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Destaque para as Salas com Carrinhos de 32 Notebooks */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-red-700" />
              <h2 className="text-base font-bold uppercase tracking-wide text-slate-900 font-heading">
                Status das Salas com Carrinhos Móveis (32 Notebooks cada)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Salas 1, 2, 4 e 5: Total de 128 notebooks compartilhados entre os períodos matutino, vespertino e noturno.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("notebooks")}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Ver matriz completa de vagas (1 a 32)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {/* Sala 1 */}
          <div
            onClick={() => onNavigateTab("notebooks")}
            className="border border-slate-200 hover:border-red-400 rounded-md p-4 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wide">
                Sala 1
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Lenovo ThinkPad
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Carrinho Móvel &bull; 32 Notebooks</p>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-emerald-700 font-bold">30 Operacionais</span>
              <span className="text-red-700 font-bold">2 c/ Ocorrência</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "93.7%" }}></div>
            </div>
          </div>

          {/* Sala 2 */}
          <div
            onClick={() => onNavigateTab("notebooks")}
            className="border border-slate-200 hover:border-red-400 rounded-md p-4 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wide">
                Sala 2
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Lenovo ThinkPad
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Carrinho Móvel &bull; 32 Notebooks</p>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-emerald-700 font-bold">31 Operacionais</span>
              <span className="text-amber-700 font-bold">1 Fonte Rompida</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "96.8%" }}></div>
            </div>
          </div>

          {/* Sala 4 */}
          <div
            onClick={() => onNavigateTab("notebooks")}
            className="border border-slate-200 hover:border-red-400 rounded-md p-4 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wide">
                Sala 4
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                Dell Latitude
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Carrinho Móvel &bull; 32 Notebooks</p>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-emerald-700 font-bold">31 Operacionais</span>
              <span className="text-red-700 font-bold">1 Linha LCD</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "96.8%" }}></div>
            </div>
          </div>

          {/* Sala 5 */}
          <div
            onClick={() => onNavigateTab("notebooks")}
            className="border border-slate-200 hover:border-red-400 rounded-md p-4 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wide">
                Sala 5
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                Dell Latitude
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Carrinho Móvel &bull; 32 Notebooks</p>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-emerald-700 font-bold">31 Operacionais</span>
              <span className="text-amber-700 font-bold">1 Imagem SO</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "96.8%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Chamados Recentes */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wide text-slate-900 font-heading">
              Últimas Ocorrências Registradas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Incidentes reportados na retirada ou identificados pelos docentes
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("incidents")}
            className="text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-800 transition-colors cursor-pointer"
          >
            Ver todos ({incidents.total})
          </button>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {recentIncidents.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-500">
              Nenhuma ocorrência registrada no momento.
            </p>
          ) : (
            recentIncidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-md transition-colors cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-800 group-hover:text-red-700 transition-colors">
                      {inc.code}
                    </span>
                    {getPriorityBadge(inc.priority)}
                    {getStatusBadge(inc.status)}
                    <span className="text-xs font-semibold text-slate-500">
                      &bull; {formatTimeAgo(inc.created_at)}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {inc.title}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="font-medium text-slate-700">{inc.target_name}</span>
                    <span>&bull;</span>
                    <span>Solicitado por {inc.requester_name}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-bold uppercase text-red-700 group-hover:underline flex items-center gap-1">
                    Atender / Detalhes
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
