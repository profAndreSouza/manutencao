"use client";

import React, { useState } from "react";
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
  Menu,
  X,
  ArrowLeftRight,
  PanelLeft,
  Rows,
  ChevronDown,
  GraduationCap,
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
  layoutMode = "sidebar", // "sidebar" | "topbar"
  onToggleLayoutMode,
  onOpenSidebarMobile,
}) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDocente = currentUser?.role === "docente";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "notebooks",
      label: "Notebooks",
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
          badge: "Docente",
          badgeColor: "bg-red-700 text-white",
        },
      ]
      : []),
    { id: "rooms", label: "Salas & Ambientes", icon: DoorOpen },
    { id: "equipment", label: "Equipamentos & Projetos", icon: Wrench },
  ];

  const breadcrumbs = {
    dashboard: {
      title: "Painel Geral & Indicadores",
      subtitle:
        "Visão consolidada de chamados, disponibilidade da frota e status dos laboratórios.",
    },
    notebooks: {
      title: "Frota de Notebooks",
      subtitle:
        "128 notebooks distribuídos em carrinhos inteligentes de 32 unidades por sala.",
    },
    incidents: {
      title: "Fila de Chamados de Manutenção",
      subtitle: "Triagem, histórico e atendimento técnico de ocorrências patrimoniais.",
    },
    turnos: {
      title: "Acompanhamento Docente (Diurno x Noturno)",
      subtitle:
        "Rastreamento de reincidências entre períodos e emissão de orientações formais.",
    },
    rooms: {
      title: "Salas & Ambientes de Aprendizagem",
      subtitle:
        "Salas 1 a 5, Informática 4, Lab de Projetos e CNC • Infraestrutura predial.",
    },
    equipment: {
      title: "Equipamentos, Bancadas & Kits Didáticos",
      subtitle:
        "Computadores de bancada, fontes DC ajustáveis, multímetros e kits didáticos.",
    },
  };

  const currentBreadcrumb = breadcrumbs[activeTab] || breadcrumbs.dashboard;

  const handleExport = () => {
    window.open("/api/export", "_blank");
  };

  // ==========================================
  // MODO 1: BARRA SUPERIOR PARA MENU LATERAL (SIDEBAR)
  // ==========================================
  if (layoutMode === "sidebar") {
    return (
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onOpenSidebarMobile}
                className="p-2 -ml-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md xl:hidden"
                title="Abrir menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
                    {currentBreadcrumb.title}
                  </h1>
                  <span
                    className={`hidden sm:inline-flex items-center text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${currentUser.role === "docente"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                  >
                    Visão {currentUser.role}
                  </span>
                </div>
                <p className="hidden md:block text-xs text-slate-500 truncate">
                  {currentBreadcrumb.subtitle}
                </p>
              </div>
            </div>

            {/* Right: Actions, Layout Switcher & User Pill */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Layout Switcher (Alternar para Menu Superior 2 Linhas) */}
              {onToggleLayoutMode && (
                <button
                  onClick={onToggleLayoutMode}
                  className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                  title="Alternar para visualização com Menu Superior em 2 Linhas"
                >
                  <Rows className="w-3.5 h-3.5 text-slate-500" />
                  <span>Menu em 2 Linhas</span>
                </button>
              )}

              {/* Botão Na Retirada (Aluno) */}
              <button
                onClick={onOpenStudentIntake}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-xs transition-colors cursor-pointer"
                title="Registro imediato ao retirar o notebook da vaga"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Na Retirada</span>
              </button>

              {/* Botão Novo Chamado */}
              <button
                onClick={onOpenNewIncident}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-800 rounded-md shadow-xs transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Chamado</span>
              </button>

              {/* User Dropdown Pill */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${currentUser.avatarColor}`}
                  >
                    {currentUser.role === "docente" ? "D" : "A"}
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      Alternar Perfil:
                    </div>

                    <button
                      onClick={() => {
                        onSwitchUser("docente");
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2 hover:bg-slate-50 transition-colors cursor-pointer ${currentUser.role === "docente"
                        ? "bg-red-50/70 font-bold text-red-800"
                        : "text-slate-700"
                        }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-red-700 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                        D
                      </div>
                      <div>
                        <div className="font-bold">Docente</div>
                        <div className="text-[10px] text-slate-500">
                          Prof. André Souza (Engenharia / Automação)
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onSwitchUser("aluno");
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2 hover:bg-slate-50 transition-colors cursor-pointer ${currentUser.role === "aluno"
                        ? "bg-blue-50/70 font-bold text-blue-800"
                        : "text-slate-700"
                        }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                        A
                      </div>
                      <div>
                        <div className="font-bold">Aluno</div>
                        <div className="text-[10px] text-slate-500">
                          Lucas Silva (4º Período ADS)
                        </div>
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
            </div>
          </div>
        </div>
      </header>
    );
  }

  // ==========================================
  // MODO 2: MENU SUPERIOR EM 2 LINHAS
  // ==========================================
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* LINHA 1: Top Bar (Logo, Sorocaba, Ações e Usuário) */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marca UniSENAI */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-3 text-left focus:outline-hidden group cursor-pointer"
            >
              <img
                src="/logo_unisenai.png"
                alt="UniSENAI"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-102"
              />
              <div className="hidden sm:block border-l border-slate-300 pl-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black uppercase tracking-widest text-red-700">
                    Campus Sorocaba
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-800">
                    CAI &bull; CT &bull; CST
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-700 leading-tight">
                  Gestão de Manutenção & Ocorrências
                </p>
              </div>
            </button>
          </div>

          {/* Right Action Buttons, Layout Switcher & User Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Alternar de volta para Menu Lateral */}
            {onToggleLayoutMode && (
              <button
                onClick={onToggleLayoutMode}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                title="Mudar para visualização com Menu Lateral (Sidebar)"
              >
                <PanelLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>Menu Lateral</span>
              </button>
            )}

            {/* Quick Intake Button */}
            <button
              onClick={onOpenStudentIntake}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-xs transition-colors cursor-pointer"
              title="Registro imediato ao retirar o notebook da vaga"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Na Retirada</span>
            </button>

            {/* Novo Chamado Button */}
            <button
              onClick={onOpenNewIncident}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-800 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Chamado</span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-left"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${currentUser.avatarColor}`}
                >
                  {currentUser.role === "docente" ? "D" : "A"}
                </div>
                <div className="hidden md:block leading-tight pr-1">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-slate-200 text-slate-700">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {currentUser.badge}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Alternar Perfil:
                  </div>

                  <button
                    onClick={() => {
                      onSwitchUser("docente");
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2 hover:bg-slate-50 transition-colors cursor-pointer ${currentUser.role === "docente"
                      ? "bg-red-50/70 font-bold text-red-800"
                      : "text-slate-700"
                      }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-red-700 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      D
                    </div>
                    <div>
                      <div className="font-bold">Docente</div>
                      <div className="text-[10px] text-slate-500">
                        Docente & Coordenador (Diurno & Noturno)
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchUser("aluno");
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2 hover:bg-slate-50 transition-colors cursor-pointer ${currentUser.role === "aluno"
                      ? "bg-blue-50/70 font-bold text-blue-800"
                      : "text-slate-700"
                      }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      A
                    </div>
                    <div>
                      <div className="font-bold">Aluno</div>
                      <div className="text-[10px] text-slate-500">
                        Aluno CST ADS (Noturno)
                      </div>
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

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 xl:hidden text-slate-700 hover:text-slate-900 rounded-md"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* LINHA 2: Sub-barra de Navegação Completa e Espaçosa */}
      <div className="border-t border-slate-200 bg-slate-50/90 backdrop-blur-xs hidden xl:block">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-1 py-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${isActive
                      ? "text-red-700 bg-white shadow-xs border-b-2 border-red-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                      }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${isActive ? "text-red-700" : "text-slate-500"
                        }`}
                    />
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

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Linha 2 no Mobile) */}
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
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md ${isActive
                  ? "bg-red-50 text-red-700 font-extrabold"
                  : "text-slate-700 hover:bg-slate-100"
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
