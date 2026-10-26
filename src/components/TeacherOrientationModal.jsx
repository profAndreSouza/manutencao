"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Printer,
  CheckCircle2,
  AlertTriangle,
  User,
  Clock,
  ShieldCheck,
  Send,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function TeacherOrientationModal({
  incident,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [orientationText, setOrientationText] = useState("");
  const [targetStudentOrTurma, setTargetStudentOrTurma] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (incident && isOpen) {
      setSavedSuccess(false);
      const defaultTarget = incident.turma || "Turma do período anterior";
      setTargetStudentOrTurma(defaultTarget);

      const template =
        `TERMO DE ORIENTAÇÃO PEDAGÓGICA FORMAL - UNISENAI SOROCABA\n\n` +
        `Ref.: Ocorrência registrada no equipamento ${incident.target_name} (${incident.code}).\n` +
        `Destinatário: Alunos da ${defaultTarget} (${incident.periodo ? incident.periodo.toUpperCase() : "DIURNO/NOTURNO"} - ${incident.modalidade || "CAI/CT/CST"})\n\n` +
        `Prezados alunos,\n\n` +
        `Constatamos a reincidência de irregularidades no uso do notebook indicado (relato: "${incident.title}"). ` +
        `Reiteramos que os equipamentos são bens públicos de uso compartilhado entre os períodos diurno e noturno. ` +
        `É dever de cada estudante zelar pela integridade física do teclado, tela, fontes e cabos de alimentação.\n\n` +
        `Determinações de Trabalho:\n` +
        `1. Ao término de cada aula, cada aluno deve guardar o notebook em sua respectiva vaga numerada no carrinho e plugar o carregador correspondente.\n` +
        `2. Qualquer avaria identificada deve ser imediatamente comunicada via sistema de manutenção na retirada do equipamento.\n` +
        `3. O não cumprimento das normas de conservação poderá acarretar sanções disciplinares regimentais conforme as diretrizes do UniSENAI SP.\n\n` +
        `Sorocaba, ${new Date().toLocaleDateString("pt-BR")}.\n` +
        `Coordenação de Curso & Corpo Docente - UniSENAI SP`;

      setOrientationText(incident.orientacao_formal || template);
    }
  }, [incident, isOpen]);

  if (!isOpen || !incident) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/incidents/${incident.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orientacao_formal: orientationText,
          author_name: "Prof. Carlos Roberto (Docente / Coordenador)",
          author_role: "professor",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        if (onSuccess) onSuccess();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-red-700 text-white">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold uppercase tracking-wide font-heading">
                Emissão de Orientação Formal por Escrito
              </h2>
              <p className="text-xs text-slate-400">
                Acompanhamento Pedagógico entre Períodos (CAI / CT / CST / FIC)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Orientação formal registrada e vinculada com sucesso ao histórico do chamado!</span>
            </div>
          )}

          {/* Context Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-red-700">{incident.code}</span>
              <span className="text-slate-500">{formatDate(incident.created_at)}</span>
            </div>
            <h4 className="font-bold text-slate-900">{incident.title}</h4>
            <p className="text-slate-600 italic">&ldquo;{incident.description}&rdquo;</p>
            <div className="pt-1 border-t border-slate-200 text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
              <span>Recurso: <strong>{incident.target_name}</strong></span>
              <span>Turma de registro: <strong>{incident.turma || "Não informada"}</strong></span>
              <span>Turno: <strong>{incident.periodo ? incident.periodo.toUpperCase() : "Geral"}</strong></span>
            </div>
          </div>

          {/* Editable Orientation Text */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Texto da Orientação / Advertência Pedagógica Formal
            </label>
            <textarea
              rows={12}
              value={orientationText}
              onChange={(e) => setOrientationText(e.target.value)}
              className="w-full font-mono text-xs p-3 bg-slate-50 border border-slate-300 rounded-sm text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-red-600 leading-relaxed"
            ></textarea>
            <p className="text-[11px] text-slate-500">
              Este termo pode ser impresso para assinatura dos alunos/representantes de turma e fica registrado digitalmente para histórico e comprovação de orientação.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Termo</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200 rounded-sm transition-colors cursor-pointer"
            >
              Fechar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white rounded-sm transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSaving ? "Salvando..." : "Salvar no Chamado"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
