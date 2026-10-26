"use client";

import React, { useState } from "react";
import {
  Wrench,
  Search,
  Filter,
  RefreshCw,
  Plus,
  DoorOpen,
  Tag,
  Cpu,
  Layers,
} from "lucide-react";

export default function EquipmentView({
  equipment = [],
  isLoading,
  onRefresh,
  onOpenNewIncidentForEquipment,
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredEquipment = equipment.filter((eq) => {
    const matchSearch =
      search === "" ||
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.asset_tag.toLowerCase().includes(search.toLowerCase()) ||
      (eq.serial_number && eq.serial_number.toLowerCase().includes(search.toLowerCase())) ||
      (eq.room_name && eq.room_name.toLowerCase().includes(search.toLowerCase()));

    const matchCategory = categoryFilter === "todas" || eq.category === categoryFilter;
    const matchStatus = statusFilter === "todos" || eq.status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  const getCategoryBadge = (category) => {
    const map = {
      audiovisual: { label: "Audiovisual", color: "bg-indigo-100 text-indigo-800" },
      climatizacao: { label: "Climatização", color: "bg-cyan-100 text-cyan-800" },
      maker: { label: "Maker / 3D", color: "bg-amber-100 text-amber-800" },
      rede: { label: "Redes & Infra", color: "bg-blue-100 text-blue-800" },
      maquinario: { label: "Maquinário", color: "bg-slate-100 text-slate-800" },
      eletrica: { label: "Elétrica", color: "bg-yellow-100 text-yellow-800" },
    };

    const c = map[category] || { label: category, color: "bg-slate-100 text-slate-800" };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${c.color}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-red-700" />
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-slate-900 font-heading">
              Equipamentos Gerais & Laboratoriais
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Controle de projetores, aparelhos de ar-condicionado, impressoras 3D, osciloscópios e ativos de TI.
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
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por equipamento, patrimônio, sala ou série..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-hidden focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-600"
          >
            <option value="todas">Todas Categorias</option>
            <option value="audiovisual">Audiovisual</option>
            <option value="climatizacao">Climatização</option>
            <option value="maker">Maker / 3D</option>
            <option value="rede">Redes & TI</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-600"
          >
            <option value="todos">Todos Status</option>
            <option value="disponivel">Disponível</option>
            <option value="em_manutencao">Em Manutenção</option>
            <option value="defeituoso">Com Defeito</option>
          </select>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map((eq) => {
          const isDown = eq.status !== "disponivel";
          return (
            <div
              key={eq.id}
              className={`bg-white rounded-lg border p-4 flex flex-col justify-between transition-all hover:shadow-md ${
                isDown ? "border-red-300 ring-1 ring-red-100" : "border-slate-200"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {eq.asset_tag}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 font-heading">
                      {eq.name}
                    </h3>
                  </div>
                  {getCategoryBadge(eq.category)}
                </div>

                <p className="text-xs text-slate-600">
                  {eq.description || "Equipamento institucional de uso acadêmico."}
                </p>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">{eq.room_name || "Sem sala fixa"}</span>
                  </div>
                  {eq.serial_number && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                      <span>S/N: {eq.serial_number}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    eq.status === "disponivel"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {eq.status === "disponivel" ? "Disponível" : "Em Manutenção"}
                </span>

                <button
                  onClick={() => onOpenNewIncidentForEquipment(eq)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white rounded-xs transition-colors cursor-pointer"
                >
                  <Wrench className="w-3 h-3" />
                  <span>Reportar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
