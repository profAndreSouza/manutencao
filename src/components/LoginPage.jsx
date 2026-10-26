"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  User,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  Laptop,
} from "lucide-react";
import { DEMO_USERS } from "@/lib/demoUsers";

export default function LoginPage({ onLoginSuccess }) {
  const [selectedProfile, setSelectedProfile] = useState("docente");
  const [email, setEmail] = useState(DEMO_USERS.docente.email);
  const [password, setPassword] = useState("******");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectProfile = (key) => {
    setSelectedProfile(key);
    setEmail(DEMO_USERS[key].email);
    setPassword("******");
    setError("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const user = DEMO_USERS[selectedProfile];
      if (user) {
        localStorage.setItem("senai_user_session", JSON.stringify(user));
        onLoginSuccess(user);
      } else {
        setError("Credenciais inválidas. Selecione Docente ou Aluno.");
      }
      setLoading(false);
    }, 400);
  };

  const handleQuickLogin = (key) => {
    setLoading(true);
    const user = DEMO_USERS[key];
    localStorage.setItem("senai_user_session", JSON.stringify(user));
    setTimeout(() => {
      onLoginSuccess(user);
      setLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center mb-1">
            <img
              src="/logo_unisenai.png"
              alt="UniSENAI"
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-red-700">
              Campus Sorocaba
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-xs font-semibold text-slate-500 uppercase">
              TI & Manutenção
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-heading">
            Gestão de Manutenção & Ocorrências
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Acompanhamento integrado de notebooks, salas e equipamentos para os períodos diurno e noturno.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Selecione o Perfil de Acesso:
            </label>

            {/* Profile Cards Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Docente Card */}
              <button
                type="button"
                onClick={() => handleSelectProfile("docente")}
                className={`p-4 rounded-md border text-left transition-all cursor-pointer relative ${
                  selectedProfile === "docente"
                    ? "bg-red-50/70 border-red-600 ring-1 ring-red-600 shadow-2xs"
                    : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-bold">
                      D
                    </div>
                    <span className="font-bold text-sm text-slate-900">Docente</span>
                  </div>
                  {selectedProfile === "docente" && (
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Gestão de chamados, turnos (diurno/noturno) e emissão de orientações formais.
                </p>
              </button>

              {/* Aluno Card */}
              <button
                type="button"
                onClick={() => handleSelectProfile("aluno")}
                className={`p-4 rounded-md border text-left transition-all cursor-pointer relative ${
                  selectedProfile === "aluno"
                    ? "bg-blue-50/70 border-blue-600 ring-1 ring-blue-600 shadow-2xs"
                    : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      A
                    </div>
                    <span className="font-bold text-sm text-slate-900">Aluno</span>
                  </div>
                  {selectedProfile === "aluno" && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Check-in na retirada de notebook, resguardo de avarias e abertura rápida.
                </p>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2 border-t border-slate-100">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                E-mail Institucional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-800 rounded-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Acessando..." : `Entrar como ${selectedProfile === "docente" ? "Docente" : "Aluno"}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Access Buttons */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="block text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Acesso Direto Rápido para Demonstração:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("docente")}
                className="py-1.5 px-2 text-[11px] font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xs transition-colors cursor-pointer text-center"
              >
                1-Clique: Docente
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("aluno")}
                className="py-1.5 px-2 text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xs transition-colors cursor-pointer text-center"
              >
                1-Clique: Aluno
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400">
          UniSENAI SP &bull; Faculdade de Tecnologia SENAI Sorocaba
        </div>
      </div>
    </div>
  );
}
