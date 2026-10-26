"use client";

import React, { useState } from "react";
import {
  Laptop,
  Search,
  Filter,
  Plus,
  Battery,
  BatteryCharging,
  BatteryWarning,
  Zap,
  HardDrive,
  Cpu,
  Layers,
  Wrench,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Check,
  RefreshCw,
  User,
  Clock,
  ShieldCheck,
  DoorOpen,
} from "lucide-react";

export default function NotebooksView({
  notebooks = [],
  carts = [],
  isLoading,
  onRefresh,
  onOpenNewIncidentForNotebook,
  onOpenStudentIntakeForNotebook,
  onOpenNewNotebookModal,
  onSelectNotebook,
}) {
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("todos");
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Filtragem
  const filteredNotebooks = notebooks.filter((nb) => {
    const matchSearch =
      search === "" ||
      nb.asset_tag.toLowerCase().includes(search.toLowerCase()) ||
      nb.brand.toLowerCase().includes(search.toLowerCase()) ||
      nb.model.toLowerCase().includes(search.toLowerCase()) ||
      (nb.serial_number && nb.serial_number.toLowerCase().includes(search.toLowerCase())) ||
      nb.slot_number.toLowerCase().includes(search.toLowerCase()) ||
      (nb.room_name && nb.room_name.toLowerCase().includes(search.toLowerCase()));

    const matchRoom = selectedRoom === "todos" || nb.room_name === selectedRoom || nb.cart_group.includes(selectedRoom);
    const matchStatus = selectedStatus === "todos" || nb.status === selectedStatus;

    return matchSearch && matchRoom && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "disponivel":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Disponível
          </span>
        );
      case "em_uso":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Em Uso
          </span>
        );
      case "em_manutencao":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Em Manutenção
          </span>
        );
      case "danificado":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            Danificado
          </span>
        );
      case "aguardando_peca":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            Aguardando Peça
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

  const getBatteryColor = (health) => {
    if (!health) return "text-slate-500";
    if (health.includes("100%") || health.includes("9") || health.includes("8")) {
      return "text-emerald-600";
    }
    if (health.includes("7") || health.includes("6") || health.includes("5")) {
      return "text-amber-600";
    }
    return "text-red-600";
  };

  const roomFilters = [
    { label: "Todas as Salas", value: "todos" },
    { label: "Sala 1 (32 Notebooks)", value: "Sala 1" },
    { label: "Sala 2 (32 Notebooks)", value: "Sala 2" },
    { label: "Sala 4 (32 Notebooks)", value: "Sala 4" },
    { label: "Sala 5 (32 Notebooks)", value: "Sala 5" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Laptop className="w-6 h-6 text-red-700" />
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-slate-900 font-heading">
              Gestão de Frota de Notebooks (128 Unidades)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Salas 1, 2, 4 e 5: 32 notebooks numerados por carrinho, controle de carregadores e rastreamento de uso compartilhado.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onRefresh}
            title="Atualizar dados"
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-red-700" : ""}`} />
          </button>

          <button
            onClick={onOpenNewNotebookModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-sm transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Notebook</span>
          </button>
        </div>
      </div>

      {/* Cart / Room Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {roomFilters.map((rf) => {
          const isSelected = selectedRoom === rf.value;
          const count = rf.value === "todos"
            ? notebooks.length
            : notebooks.filter((n) => n.room_name === rf.value).length;
          const defects = rf.value === "todos"
            ? notebooks.filter((n) => n.status !== "disponivel" && n.status !== "em_uso").length
            : notebooks.filter((n) => n.room_name === rf.value && n.status !== "disponivel" && n.status !== "em_uso").length;

          return (
            <button
              key={rf.value}
              onClick={() => setSelectedRoom(rf.value)}
              className={`p-3 rounded-md border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-red-50/70 border-red-600 ring-1 ring-red-600 shadow-2xs"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-600">
                <span className="truncate">{rf.label.split("(")[0]}</span>
                <DoorOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-heading mt-1">
                {count} <span className="text-[10px] font-normal text-slate-500">unid.</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                <span className="text-emerald-700 font-semibold">{count - defects} OK</span>
                {defects > 0 ? (
                  <span className="text-red-700 font-bold">{defects} avaria</span>
                ) : (
                  <span className="text-slate-400">100%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por Patrimônio (ex: NOTE-S01-14), Sala, modelo, série ou vaga..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-hidden focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-900"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-600"
            >
              <option value="todos">Todos os Status</option>
              <option value="disponivel">Disponível</option>
              <option value="em_uso">Em Uso</option>
              <option value="em_manutencao">Em Manutenção</option>
              <option value="danificado">Danificado / Avaria</option>
              <option value="aguardando_peca">Aguardando Peça</option>
            </select>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-sm border border-slate-200 p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1 text-xs font-bold uppercase rounded-xs transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-red-700 shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Grade
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-2.5 py-1 text-xs font-bold uppercase rounded-xs transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-red-700 shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Lista
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Exibindo <strong>{filteredNotebooks.length}</strong> de{" "}
            <strong>{notebooks.length}</strong> notebooks
          </span>
          {(selectedRoom !== "todos" || selectedStatus !== "todos" || search) && (
            <button
              onClick={() => {
                setSelectedRoom("todos");
                setSelectedStatus("todos");
                setSearch("");
              }}
              className="text-red-700 hover:underline font-semibold cursor-pointer"
            >
              Resetar filtros
            </button>
          )}
        </div>
      </div>

      {/* Notebooks Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotebooks.map((nb) => {
            const hasIssue = nb.status !== "disponivel" && nb.status !== "em_uso";
            return (
              <div
                key={nb.id}
                className={`bg-white rounded-lg border transition-all hover:shadow-md flex flex-col justify-between ${
                  hasIssue ? "border-red-300 ring-1 ring-red-100" : "border-slate-200"
                }`}
              >
                {/* Card Header */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-extrabold tracking-tight text-slate-900">
                          {nb.asset_tag}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {nb.slot_number}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        {nb.room_name} &bull; {nb.brand} {nb.model}
                      </p>
                    </div>
                    {getStatusBadge(nb.status)}
                  </div>

                  {/* Hardware Specs & Fonte */}
                  <div className="bg-slate-50 rounded-md p-2.5 space-y-1 text-[11px] text-slate-600 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Zap className="w-3 h-3 text-slate-400" /> Carregador:
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {nb.charger_tag || "FNT-PADRÃO"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Battery className="w-3 h-3 text-slate-400" /> Bateria:
                      </span>
                      <span className={`font-bold ${getBatteryColor(nb.battery_health)}`}>
                        {nb.battery_health || "100%"}
                      </span>
                    </div>

                    {/* Rastreabilidade de Usuário / Turma Anterior */}
                    <div className="pt-1.5 mt-1 border-t border-slate-200/70 text-[10px] text-slate-500 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" /> Último usuário:
                        </span>
                        <span className="font-medium text-slate-800 truncate max-w-[130px]">
                          {nb.last_user || "Não registrado"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> Turma / Turno:
                        </span>
                        <span className="font-medium text-slate-700 truncate max-w-[130px]">
                          {nb.last_turma || "Regular"} ({nb.last_periodo || "Turno"})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Issue description */}
                  {nb.notes && (
                    <div className="text-[11px] text-slate-700 italic bg-amber-50/70 p-2 rounded border border-amber-200/80 leading-snug">
                      &ldquo;{nb.notes}&rdquo;
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectNotebook(nb)}
                    className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Detalhes
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenNewIncidentForNotebook(nb)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white rounded-xs transition-colors cursor-pointer shadow-2xs"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>Chamado</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notebooks Table View */}
      {viewMode === "table" && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Patrimônio / Vaga</th>
                  <th className="py-3 px-4">Sala & Modelo</th>
                  <th className="py-3 px-4">Carregador</th>
                  <th className="py-3 px-4">Bateria</th>
                  <th className="py-3 px-4">Último Usuário & Turno</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNotebooks.map((nb) => (
                  <tr key={nb.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">{nb.asset_tag}</div>
                      <div className="text-[11px] text-slate-500">{nb.slot_number}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{nb.room_name}</div>
                      <div className="text-[11px] text-slate-500">{nb.brand} {nb.model}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                      {nb.charger_tag || "-"}
                    </td>
                    <td className="py-3 px-4 font-bold whitespace-nowrap">
                      <span className={getBatteryColor(nb.battery_health)}>
                        {nb.battery_health || "100%"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{nb.last_user || "Uso regular"}</div>
                      <div className="text-[10px] text-slate-500">
                        {nb.last_turma || "-"} &bull; {nb.last_periodo || "-"}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(nb.status)}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => onSelectNotebook(nb)}
                        className="px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => onOpenNewIncidentForNotebook(nb)}
                        className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white rounded-xs"
                      >
                        Chamado
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
