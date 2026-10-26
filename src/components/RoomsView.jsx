"use client";

import React, { useState } from "react";
import {
  DoorOpen,
  Search,
  Filter,
  Users,
  Building,
  AlertTriangle,
  CheckCircle,
  Plus,
  RefreshCw,
  Wrench,
  ChevronRight,
  Laptop,
  Cpu,
} from "lucide-react";

export default function RoomsView({
  rooms = [],
  isLoading,
  onRefresh,
  onOpenNewIncidentForRoom,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredRooms = rooms.filter((room) => {
    const matchSearch =
      search === "" ||
      room.name.toLowerCase().includes(search.toLowerCase()) ||
      room.code.toLowerCase().includes(search.toLowerCase()) ||
      room.block.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "todos" || room.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const getRoomEquipBadge = (room) => {
    if (["sala-1", "sala-2", "sala-4", "sala-5"].includes(room.id)) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded">
          <Laptop className="w-3 h-3" /> 32 Notebooks
        </span>
      );
    }
    if (room.id === "lab-inf-4" || room.id === "lab-cnc") {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
          <Cpu className="w-3 h-3" /> 21 Computadores
        </span>
      );
    }
    if (room.id === "lab-projetos") {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
          <Wrench className="w-3 h-3" /> 10 PCs + Bancadas & Kits
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
        Sala Teórica
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DoorOpen className="w-6 h-6 text-red-700" />
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-slate-900 font-heading">
              Salas & Ambientes de Aprendizagem
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Salas 1, 2, 3, 4, 5, Informática 4, Projetos e CNC &bull; Gestão de infraestrutura predial e chamados de manutenção.
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

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome da sala, código ou bloco..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-hidden focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-900"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-600"
        >
          <option value="todos">Todos os Status</option>
          <option value="operacional">100% Operacional</option>
          <option value="atencao">Com Ocorrência / Atenção</option>
          <option value="manutencao">Interditada para Manutenção</option>
        </select>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          const hasIssues = Number(room.active_incidents) > 0 || room.status !== "operacional";
          return (
            <div
              key={room.id}
              className={`bg-white rounded-lg border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                hasIssues ? "border-amber-300 ring-1 ring-amber-100" : "border-slate-200"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {room.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 font-heading">
                      {room.name}
                    </h3>
                  </div>
                  {getRoomEquipBadge(room)}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {room.description || "Ambiente acadêmico do campus."}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{room.block} &bull; {room.floor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Capacidade: {room.capacity}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {Number(room.active_incidents) > 0 ? (
                    <span className="text-amber-700 font-bold">
                      {room.active_incidents} incidente(s) ativo(s)
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">Tudo em ordem</span>
                  )}
                </span>

                <button
                  onClick={() => onOpenNewIncidentForRoom(room)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white rounded-xs transition-colors cursor-pointer shadow-2xs"
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
