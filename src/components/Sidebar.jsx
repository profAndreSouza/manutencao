"use client";

import React from "react";
import {
  LayoutDashboard,
  Laptop,
  AlertCircle,
  DoorOpen,
  Wrench,
  Users,
  ShieldCheck,
  PlusCircle,
  Download,
  LogOut,
  Database,
  ArrowLeftRight,
  Sparkles,
  X,
  GraduationCap,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenNewIncident,
  onOpenStudentIntake,
  currentUser,
  onSwitchUser,
  onLogout,
  notebooksDefectCount = 0,
  openIncidentsCount = 0,
  isOpen = false,
  onClose,
}) {
  const isDocente = currentUser?.role === "docente";

  const mainNav = [
    {
      id: "dashboard",
      label: "Dashboard",
      subtitle: "Visão Geral & Indicadores",
      icon: LayoutDashboard,
    },
    {
      id: "notebooks",
      label: "Notebooks",
      subtitle: "128 máquinas em carrinhos",
      icon: Laptop,
      badge: notebooksDefectCount > 0 ? `${notebooksDefectCount} defeito` : null,
      badgeColor: "bg-red-600 text-white font-bold",
    },
    {
      id: "incidents",
      label: "Chamados de Manutenção",
      subtitle: "Fila de ocorrências",
      icon: AlertCircle,
      badge: openIncidentsCount > 0 ? `${openIncidentsCount} abertos` : null,
      badgeColor: "bg-amber-500 text-slate-900 font-bold",
    },
  ];

  const pedNav = [
    {
      id: "turnos",
      label: "Acompanhamento (Turnos)",
      subtitle: "Diurno x Noturno & Reincidências",
      icon: Users,
      badge: "Docente",
      badgeColor: "bg-red-700 text-white font-bold",
    },
  ];

  const infraNav = [
    {
      id: "rooms",
      label: "Salas & Ambientes",
      subtitle: "8 salas e laboratórios",
      icon: DoorOpen,
    },
    {
      id: "equipment",
      label: "Equipamentos & Projetos",
      subtitle: "PCs, Fontes, Multímetros, Kits",
      icon: Wrench,
    },
  ];

  const handleExport = () => {
    window.open("/api/export", "_blank");
  };

  const navButton = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => {
          setActiveTab(item.id);
          if (onClose) onClose();
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-all cursor-pointer group ${isActive
            ? "bg-red-700 text-white shadow-md shadow-red-900/10 font-bold"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium"
          }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon
            className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-500 group-hover:text-red-700"
              }`}
          />
          <div className="min-w-0 truncate">
            <div className="text-xs tracking-tight truncate">{item.label}</div>
            <div
              className={`text-[10px] truncate ${isActive ? "text-red-100 font-normal" : "text-slate-600"
                }`}
            >
              {item.subtitle}
            </div>
          </div>
        </div>
        {item.badge && (
          <span
            className={`shrink-0 ml-2 text-[10px] px-2 py-0.5 rounded-full shadow-2xs ${item.badgeColor}`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 xl:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed xl:sticky top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col h-screen transition-transform duration-200 ease-in-out shrink-0 ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full xl:translate-x-0"
          }`}
      >
        {/* Top Branding */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                if (onClose) onClose();
              }}
              className="flex items-center gap-2.5 text-left focus:outline-hidden group"
            >
              <img
                src="/logo_unisenai.png"
                alt="UniSENAI"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-102"
              />
              <div className="border-l border-slate-300 pl-2.5">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-700">
                    Sorocaba
                  </span>
                  <span className="text-[9px] font-semibold bg-red-100 text-red-800 px-1 py-0.2 rounded">
                    CAI &bull; CT &bull; CST
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight">
                  Manutenção & Chamados
                </div>
              </div>
            </button>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md xl:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons in Sidebar */}
        <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/70">
          <button
            onClick={() => {
              onOpenStudentIntake();
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-xs transition-colors cursor-pointer"
            title="Registro rápido na retirada do notebook pelo aluno"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Na Retirada</span>
          </button>

          <button
            onClick={() => {
              onOpenNewIncident();
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-800 rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Novo Chamado</span>
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Principal */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
              Principal
            </div>
            <div className="space-y-1">{mainNav.map(navButton)}</div>
          </div>

          {/* Pedagógico (Visível para Docente) */}
          {isDocente && (
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-red-700 flex items-center gap-1.5">
                <GraduationCap className="w-3 h-3" />
                <span>Gestão Pedagógica</span>
              </div>
              <div className="space-y-1">{pedNav.map(navButton)}</div>
            </div>
          )}

          {/* Infraestrutura */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
              Infraestrutura & Salas
            </div>
            <div className="space-y-1">{infraNav.map(navButton)}</div>
          </div>

          {/* Relatórios */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
              Exportação
            </div>
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-left text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-slate-500" />
                <span>Exportar Relatório CSV</span>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Footer: Current User Card & DB Status */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2.5">
          {/* User profile card */}
          <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentUser.avatarColor}`}
              >
                {currentUser.role === "docente" ? "D" : "A"}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="text-xs font-extrabold text-slate-900 truncate">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${currentUser.role === "docente"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-slate-600 truncate">
                    {currentUser.shift}
                  </span>
                </div>
              </div>
            </div>

            {/* Switch User and Logout */}
            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <button
                onClick={() =>
                  onSwitchUser(currentUser.role === "docente" ? "aluno" : "docente")
                }
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                title={`Alternar para ${currentUser.role === "docente" ? "Aluno" : "Docente"}`}
              >
                <ArrowLeftRight className="w-3 h-3 text-slate-500" />
                <span>
                  Mudar p/ {currentUser.role === "docente" ? "Aluno" : "Docente"}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center justify-center p-1 text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                title="Sair / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Database indicator */}
          <div className="flex items-center justify-between text-[10px] text-slate-600 px-1 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Turso DB Conectado
            </span>
            <span>v2.1</span>
          </div>
        </div>
      </aside>
    </>
  );
}
