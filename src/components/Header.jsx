"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Laptop,
  AlertCircle,
  DoorOpen,
  Wrench,
  PlusCircle,
  Download,
  Database,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

export default function Header({
  activeTab,
  setActiveTab,
  onOpenNewIncident,
  notebooksDefectCount = 0,
  openIncidentsCount = 0,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { id: "rooms", label: "Salas & Labs", icon: DoorOpen },
    { id: "equipment", label: "Equipamentos", icon: Wrench },
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
                    TI & Predial
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-tight">
                  Gestão de Manutenção & Incidentes
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    isActive
                      ? "text-red-700 bg-red-50 border-b-2 border-red-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-red-700" : "text-slate-500"}`} />
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

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={handleExport}
              title="Baixar Relatório CSV"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm border border-slate-300 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>CSV</span>
            </button>

            <button
              onClick={onOpenNewIncident}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-800 rounded-sm shadow-sm transition-all hover:shadow cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Chamado</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenNewIncident}
              className="p-2 text-white bg-red-700 rounded-sm"
              title="Novo Chamado"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
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
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                handleExport();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 rounded-md"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Exportar Relatório CSV</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
