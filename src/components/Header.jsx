"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Laptop,
  AlertCircle,
  DoorOpen,
  Wrench,
  PlusCircle,
  Download,
  Users,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  LogOut,
} from "lucide-react";

export default function Header({
  activeTab,
  setActiveTab,
  onOpenNewIncident,
  onOpenStudentIntake,
  currentUser,
  onSwitchUser,
  onLogout,
  notebooksDefectCount = 0,
  openIncidentsCount = 0,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isDocente = currentUser?.role === "docente";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "notebooks",
      label: "Notebooks (Salas 1,2,4,5)",
      icon: Laptop,
      badge: notebooksDefectCount > 0 ? notebooksDefectCount : null,
      badgeColor: "bg-red-600 text-white",
    },
    {
      id: "incidents",
      label: "Chamados",
      icon: AlertCircle,
      badge: openIncidentsCount > 0 ? openIncidentsCount : null,
      badgeColor: "bg-amber-500 text-slate-900",
    },
    ...(isDocente
      ? [
          {
            id: "turnos",
            label: "Acompanhamento (Turnos)",
            icon: Users,
            badge: "Pedagógico",
            badgeColor: "bg-slate-900 text-white",
          },
        ]
      : []),
    { id: "rooms", label: "Salas & Labs", icon: DoorOpen },
    { id: "equipment", label: "Equipamentos & Projetos", icon: Wrench },
  ];

  const handleExport = () => {
    window.open("/api/export", "_blank");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Marca UniSENAI */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-3 text-left focus:outline-hidden group"
            >
              <div className="relative h-11 w-32 sm:w-36 flex items-center">
                <img
                  src="/logo_unisenai.png"
                  alt="UniSENAI"
                  className="h-10 w-auto object-contain transition-transform group-hover:scale-102"
                />
              </div>
              <div className="hidden sm:block border-l border-slate-300 pl-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-red-700">
                    Campus Sorocaba
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-800">
                    CAI &bull; CT &bull; CST
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-tight">
                  Gestão de Manutenção & Ocorrências
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    isActive
                      ? "text-red-700 bg-red-50 border-b-2 border-red-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-red-700" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons & User Switcher */}
          <div className="flex items-center gap-2">
            {/* User Dropdown with Logout */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-left"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${currentUser.avatarColor}`}
                >
                  {currentUser.role === "docente" ? "D" : "A"}
                </div>
                <div className="hidden md:block leading-tight pr-1">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-slate-200 text-slate-700">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {currentUser.badge}
                  </div>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Alternar Perfil:
                  </div>

                  <button
                    onClick={() => {
                      onSwitchUser("docente");
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2 hover:bg-slate-50 transition-colors cursor-pointer ${
                      currentUser.role === "docente" ? "bg-red-50/70 font-bold text-red-800" : "text-slate-700"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-red-700 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      D
                    </div>
                    <div>
                      <div className="font-bold">Docente</div>
                      <div className="text-[10px] text-slate-500">Docente & Coordenador (Diurno & Noturno)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchUser("aluno");
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2 hover:bg-slate-50 transition-colors cursor-pointer ${
                      currentUser.role === "aluno" ? "bg-blue-50/70 font-bold text-blue-800" : "text-slate-700"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      A
                    </div>
                    <div>
                      <div className="font-bold">Aluno</div>
                      <div className="text-[10px] text-slate-500">Aluno CST ADS (Noturno)</div>
                    </div>
                  </button>

                  <div className="pt-1.5 mt-1.5 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-red-700 hover:bg-red-50 font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair / Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Intake Button for Students (Replacing Forms) */}
            <button
              onClick={onOpenStudentIntake}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 rounded-sm shadow-xs transition-colors cursor-pointer"
              title="Registro imediato ao retirar o notebook da vaga"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Na Retirada</span>
            </button>

            {/* Novo Chamado Button */}
            <button
              onClick={onOpenNewIncident}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-800 rounded-sm shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Chamado</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 xl:hidden text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md ${
                  isActive ? "bg-red-50 text-red-700" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenStudentIntake();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 rounded-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Registro de Retirada de Notebook</span>
            </button>
            <button
              onClick={() => {
                handleExport();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Exportar Relatório CSV</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 hover:bg-red-100 rounded-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair / Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
