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
  Zap,
  Activity,
  Box,
} from "lucide-react";

export default function EquipmentView({
  equipment = [],
  isLoading,
  onRefresh,
  onOpenNewIncidentForEquipment,
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [roomFilter, setRoomFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredEquipment = equipment.filter((eq) => {
    const matchSearch =
      search === "" ||
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.asset_tag.toLowerCase().includes(search.toLowerCase()) ||
      (eq.serial_number && eq.serial_number.toLowerCase().includes(search.toLowerCase())) ||
      (eq.room_name && eq.room_name.toLowerCase().includes(search.toLowerCase()));

    const matchCategory = categoryFilter === "todas" || eq.category === categoryFilter;
    const matchRoom = roomFilter === "todos" || eq.room_id === roomFilter || (eq.room_name && eq.room_name.includes(roomFilter));
    const matchStatus = statusFilter === "todos" || eq.status === statusFilter;

    return matchSearch && matchCategory && matchRoom && matchStatus;
  });

  const getCategoryBadge = (category) => {
    const map = {
      computador: { label: "Computador Desktop", color: "bg-blue-100 text-blue-800", icon: Cpu },
      multimetro: { label: "Multímetro Digital", color: "bg-amber-100 text-amber-800", icon: Activity },
      fonte_bancada: { label: "Fonte de Bancada", color: "bg-rose-100 text-rose-800", icon: Zap },
      kit_didatico: { label: "Kit Didático IoT", color: "bg-emerald-100 text-emerald-800", icon: Box },
      audiovisual: { label: "Audiovisual", color: "bg-indigo-100 text-indigo-800", icon: Layers },
      maker: { label: "Maker / Prototipagem", color: "bg-purple-100 text-purple-800", icon: Wrench },
    };

    const c = map[category] || { label: category, color: "bg-slate-100 text-slate-800", icon: Wrench };
    const Icon = c.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${c.color}`}>
        <Icon className="w-3 h-3" />
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
            <Cpu className="w-6 h-6 text-red-700" />
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-slate-900 font-heading">
              Computadores & Equipamentos de Bancada
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Informática 4 (21 PCs), CNC (21 PCs) e Laboratório de Projetos (10 PCs + Multímetros, Fontes e Caixas de Kits Didáticos).
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

      {/* Summary KPI Cards of the Requested Labs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => {
            setRoomFilter("Informática 4");
            setCategoryFilter("todas");
          }}
          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
            roomFilter === "Informática 4"
              ? "bg-red-50/70 border-red-600 shadow-2xs ring-1 ring-red-600"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-600 mb-1">
            <span>Informática 4</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">
            21 Computadores
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Desktops Core i7 para desenvolvimento</p>
        </div>

        <div
          onClick={() => {
            setRoomFilter("Laboratório CNC");
            setCategoryFilter("todas");
          }}
          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
            roomFilter === "Laboratório CNC"
              ? "bg-red-50/70 border-red-600 shadow-2xs ring-1 ring-red-600"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-600 mb-1">
            <span>Laboratório CNC</span>
            <Wrench className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">
            21 Computadores
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Estações CAD/CAM e usinagem CNC</p>
        </div>

        <div
          onClick={() => {
            setRoomFilter("Laboratório de Projetos");
            setCategoryFilter("todas");
          }}
          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
            roomFilter === "Laboratório de Projetos"
              ? "bg-red-50/70 border-red-600 shadow-2xs ring-1 ring-red-600"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-600 mb-1">
            <span>Lab de Projetos</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">
            10 PCs + Bancadas
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Multímetros, Fontes e Kits Didáticos IoT</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por tag, equipamento, sala ou série..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-hidden focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-900"
            />
          </div>

          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-700"
          >
            <option value="todos">Todos os Ambientes</option>
            <option value="Informática 4">Informática 4 (21 PCs)</option>
            <option value="Laboratório CNC">Laboratório CNC (21 PCs)</option>
            <option value="Laboratório de Projetos">Lab de Projetos (PCs, Multímetros, Fontes, Kits)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-700"
          >
            <option value="todas">Todas as Categorias</option>
            <option value="computador">Computadores Desktop</option>
            <option value="multimetro">Multímetros Digitais</option>
            <option value="fonte_bancada">Fontes de Bancada DC</option>
            <option value="kit_didatico">Caixas de Kits Didáticos</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-700"
          >
            <option value="todos">Todos Status</option>
            <option value="disponivel">Disponível</option>
            <option value="em_manutencao">Em Manutenção</option>
            <option value="defeituoso">Com Defeito / Avaria</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Exibindo <strong>{filteredEquipment.length}</strong> de{" "}
            <strong>{equipment.length}</strong> equipamentos
          </span>
          {(roomFilter !== "todos" || categoryFilter !== "todas" || statusFilter !== "todos" || search) && (
            <button
              onClick={() => {
                setRoomFilter("todos");
                setCategoryFilter("todas");
                setStatusFilter("todos");
                setSearch("");
              }}
              className="text-red-700 hover:underline font-semibold cursor-pointer"
            >
              Resetar filtros
            </button>
          )}
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

                <p className="text-xs text-slate-600 line-clamp-2">
                  {eq.description || "Equipamento institucional de uso acadêmico."}
                </p>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">{eq.room_name}</span>
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
                  {eq.status === "disponivel" ? "Disponível" : "Com Avaria / Reparo"}
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
