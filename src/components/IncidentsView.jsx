"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Laptop,
  DoorOpen,
  Wrench,
  Clock,
  User,
  ChevronRight,
  Download,
} from "lucide-react";
import { formatTimeAgo, formatDate } from "@/lib/utils";

export default function IncidentsView({
  incidents = [],
  isLoading,
  onRefresh,
  onSelectIncident,
  onOpenNewIncident,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [priorityFilter, setPriorityFilter] = useState("todas");
  const [targetTypeFilter, setTargetTypeFilter] = useState("todos");

  const filteredIncidents = incidents.filter((inc) => {
    const matchSearch =
      search === "" ||
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.code.toLowerCase().includes(search.toLowerCase()) ||
      inc.description.toLowerCase().includes(search.toLowerCase()) ||
      inc.target_name.toLowerCase().includes(search.toLowerCase()) ||
      inc.requester_name.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "todos" || inc.status === statusFilter;
    const matchPriority = priorityFilter === "todas" || inc.priority === priorityFilter;
    const matchType = targetTypeFilter === "todos" || inc.target_type === targetTypeFilter;

    return matchSearch && matchStatus && matchPriority && matchType;
  });

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
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            Aberto
          </span>
        );
      case "em_atendimento":
      case "em_analise":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
            Em Atendimento
          </span>
        );
      case "aguardando_peca":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
            Aguardando Peça
          </span>
        );
      case "resolvido":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Resolvido
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  const getTargetIcon = (type) => {
    switch (type) {
      case "notebook":
        return <Laptop className="w-3.5 h-3.5 text-red-600" />;
      case "sala":
        return <DoorOpen className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-700" />
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-slate-900 font-heading">
              Registro de Incidentes & Manutenção
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Triagem, histórico, atribuição de técnicos e resolução de ocorrências na unidade.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onRefresh}
            title="Atualizar lista"
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-red-700" : ""}`} />
          </button>

          <button
            onClick={() => onOpenNewIncident()}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-800 rounded-sm transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Chamado</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar título, código, tag ou solicitante..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-hidden focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-900"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-600"
          >
            <option value="todos">Todos os Status</option>
            <option value="aberto">Abertos</option>
            <option value="em_atendimento">Em Atendimento</option>
            <option value="aguardando_peca">Aguardando Peça</option>
            <option value="resolvido">Resolvidos</option>
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-600"
          >
            <option value="todas">Todas as Prioridades</option>
            <option value="critica">Crítica (Urgente)</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          {/* Target Type */}
          <select
            value={targetTypeFilter}
            onChange={(e) => setTargetTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-600"
          >
            <option value="todos">Todos os Recursos</option>
            <option value="notebook">Notebooks</option>
            <option value="sala">Salas & Laboratórios</option>
            <option value="equipamento">Equipamentos Gerais</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Exibindo <strong>{filteredIncidents.length}</strong> de{" "}
            <strong>{incidents.length}</strong> chamados
          </span>
          {(statusFilter !== "todos" ||
            priorityFilter !== "todas" ||
            targetTypeFilter !== "todos" ||
            search) && (
            <button
              onClick={() => {
                setStatusFilter("todos");
                setPriorityFilter("todas");
                setTargetTypeFilter("todos");
                setSearch("");
              }}
              className="text-red-700 hover:underline font-semibold cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Código & Prioridade</th>
                <th className="py-3 px-4">Incidente / Ocorrência</th>
                <th className="py-3 px-4">Recurso & Local</th>
                <th className="py-3 px-4">Solicitante</th>
                <th className="py-3 px-4">Técnico</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Nenhum incidente encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => onSelectIncident(inc)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Código & Prioridade */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                        {inc.code}
                      </div>
                      <div className="mt-1">{getPriorityBadge(inc.priority)}</div>
                    </td>

                    {/* Incidente / Título */}
                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <div className="font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-1">
                        {inc.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {inc.description}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDate(inc.created_at)} ({formatTimeAgo(inc.created_at)})
                      </div>
                    </td>

                    {/* Recurso & Local */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        {getTargetIcon(inc.target_type)}
                        <span className="truncate max-w-[180px]">{inc.target_name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {inc.room_location || "-"}
                      </div>
                    </td>

                    {/* Solicitante */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{inc.requester_name}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                        {inc.requester_role}
                      </div>
                    </td>

                    {/* Técnico */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {inc.assigned_to ? (
                        <div className="font-semibold text-slate-800">{inc.assigned_to}</div>
                      ) : (
                        <span className="text-[11px] italic text-slate-400">Não atribuído</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(inc.status)}</td>

                    {/* Ação */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-700 group-hover:underline">
                        Atender
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
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
