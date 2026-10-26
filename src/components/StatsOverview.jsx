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
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

export default function StatsOverview({
  stats,
  onNavigateTab,
  onOpenNewIncident,
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
    total: 0,
    operacionais: 0,
    defeito: 0,
    availabilityRate: 100,
  };

  const rooms = stats?.rooms || { total: 0, com_interdicao: 0 };
  const equipment = stats?.equipment || { total: 0, em_manutencao: 0 };
  const recentIncidents = stats?.recentIncidents || [];

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
      {/* Banner de Boas-vindas / Alerta Operacional */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-lg p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white">
                UniSENAI SP
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Campus Sorocaba &bull; Monitoramento Ativo
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
              Painel Integrado de Manutenção e Suporte
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Gerencie incidentes em tempo real, acompanhe a disponibilidade da frota de notebooks nos carrinhos móveis e garanta o funcionamento das salas de aula e laboratórios.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenNewIncident("notebook")}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-sm shadow-sm transition-colors cursor-pointer"
            >
              <Laptop className="w-4 h-4" />
              <span>Incidente em Notebook</span>
            </button>
            <button
              onClick={() => onOpenNewIncident("sala")}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-sm transition-colors cursor-pointer"
            >
              <DoorOpen className="w-4 h-4" />
              <span>Manutenção de Sala</span>
            </button>
          </div>
        </div>
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
              Frota de Notebooks
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
              className={`h-2 rounded-full transition-all duration-500 ${
                notebooks.availabilityRate >= 90
                  ? "bg-emerald-500"
                  : notebooks.availabilityRate >= 75
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${notebooks.availabilityRate}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="text-red-700 font-semibold flex items-center gap-1">
              {notebooks.defeito} em reparo/defeito
            </span>
            <span className="text-slate-400 group-hover:text-red-700 transition-colors flex items-center">
              Ver carrinhos <ChevronRight className="w-3.5 h-3.5" />
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
              {incidents.em_andamento} em atendimento
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Aguardando triagem técnica inicial
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Total histórico: {incidents.total}</span>
            <span className="text-slate-400 group-hover:text-amber-700 transition-colors flex items-center">
              Gerenciar <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Chamados Críticos */}
        <div
          onClick={() => onNavigateTab("incidents")}
          className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs hover:border-red-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Incidentes Críticos
            </span>
            <div className="p-2 rounded-md bg-red-100 text-red-700 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-3xl font-extrabold text-red-700 tracking-tight font-heading">
              {incidents.criticos}
            </div>
            {incidents.criticos > 0 ? (
              <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                Urgência Máxima
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Sem bloqueios
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Requerem intervenção imediata da equipe
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Resolvidos: {incidents.resolvidos}</span>
            <span className="text-slate-400 group-hover:text-red-700 transition-colors flex items-center">
              Filtrar <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Salas & Equipamentos */}
        <div
          onClick={() => onNavigateTab("rooms")}
          className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Salas & Infraestrutura
            </span>
            <div className="p-2 rounded-md bg-slate-100 text-slate-700 group-hover:scale-110 transition-transform">
              <DoorOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              {rooms.total}
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {equipment.total} equipamentos
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {rooms.com_interdicao > 0
              ? `${rooms.com_interdicao} sala(s) com atenção necessária`
              : "Todas as salas 100% operacionais"}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>{equipment.em_manutencao} em manutenção</span>
            <span className="text-slate-400 group-hover:text-slate-900 transition-colors flex items-center">
              Ver salas <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Destaque para Frota de Notebooks (O Foco Principal Solicitado) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-red-700" />
              <h2 className="text-base font-bold uppercase tracking-wide text-slate-900 font-heading">
                Gestão dos Carrinhos de Notebooks
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Controle rápido de status, slots e integridade dos notebooks por carrinho móvel
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("notebooks")}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Ver matriz completa de vagas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carts preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Carrinho A */}
          <div
            onClick={() => onNavigateTab("notebooks")}
            className="border border-slate-200 hover:border-red-400 rounded-md p-4 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wide">
                Carrinho Móvel A
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Lab Informática
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">20x Lenovo ThinkPad E14 Gen 4</p>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-emerald-700 font-bold">18 Operacionais</span>
              <span className="text-red-700 font-bold">2 Em Reparo</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "90%" }}></div>
            </div>
          </div>

          {/* Carrinho B */}
          <div
            onClick={() => onNavigateTab("notebooks")}
            className="border border-slate-200 hover:border-red-400 rounded-md p-4 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wide">
                Carrinho Móvel B
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                Maker & Projetos
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">15x Dell Latitude 3420</p>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-emerald-700 font-bold">14 Operacionais</span>
              <span className="text-amber-700 font-bold">1 Aguardando Peça</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "93.3%" }}></div>
            </div>
          </div>

          {/* Reserva Docente */}
          <div
            onClick={() => onNavigateTab("notebooks")}
            className="border border-slate-200 hover:border-red-400 rounded-md p-4 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wide">
                Armário Docente
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Professores
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">5x Lenovo ThinkPad L14 Gen 3</p>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-emerald-700 font-bold">5 Operacionais</span>
              <span className="text-slate-500">100% Disponibilidade</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Chamados Recentes */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wide text-slate-900 font-heading">
              Últimos Chamados Registrados
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Incidentes em andamento ou recentemente submetidos por professores e alunos
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
              Nenhum chamado registrado no momento.
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
