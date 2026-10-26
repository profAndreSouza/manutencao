"use client";

import React, { useState } from "react";
import {
  X,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  ShieldCheck,
  Clock,
  DoorOpen,
} from "lucide-react";

export default function StudentQuickIntakeModal({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
}) {
  const [selectedRoom, setSelectedRoom] = useState("sala-1");
  const [notebookNumber, setNotebookNumber] = useState("");
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [periodo, setPeriodo] = useState(currentUser?.periodo || "noite");
  const [turma, setTurma] = useState(currentUser?.turma || "CST ADS - 3º Termo");
  const [modalidade, setModalidade] = useState(currentUser?.modalidade || "CST");
  const [studentName, setStudentName] = useState(currentUser?.name || "Lucas Silva");
  const [studentEmail, setStudentEmail] = useState(currentUser?.email || "lucas.silva@aluno.senai.br");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const commonIssues = [
    { id: "tecla_solta", label: "Teclado com teclas soltas ou não respondem", category: "hardware", prio: "alta" },
    { id: "tela_trincada", label: "Tela LCD com linha vertical / trincada / sem imagem", category: "hardware", prio: "alta" },
    { id: "fonte_ausente", label: "Carregador / Fonte não estava na vaga ou cabo quebrado", category: "hardware", prio: "media" },
    { id: "bateria_zerada", label: "Bateria não segura carga ou estufada", category: "hardware", prio: "alta" },
    { id: "adesivo_dano_fisico", label: "Carcaça riscada / adesivo colado / danos visíveis", category: "estrutural", prio: "baixa" },
    { id: "nao_liga", label: "Notebook não liga / travado em tela azul", category: "hardware", prio: "alta" },
    { id: "sujeira", label: "Resíduos / sujeira sobre o teclado", category: "limpeza", prio: "baixa" },
  ];

  if (!isOpen) return null;

  const toggleIssue = (issue) => {
    if (selectedIssues.some((x) => x.id === issue.id)) {
      setSelectedIssues(selectedIssues.filter((x) => x.id !== issue.id));
    } else {
      setSelectedIssues([...selectedIssues, issue]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!notebookNumber) {
      setErrorMsg("Informe o número do notebook (ex: 14).");
      return;
    }

    if (selectedIssues.length === 0 && !additionalDetails) {
      setErrorMsg("Selecione ao menos uma irregularidade encontrada ou descreva o problema.");
      return;
    }

    const roomNameMap = {
      "sala-1": "Sala 1",
      "sala-2": "Sala 2",
      "sala-4": "Sala 4",
      "sala-5": "Sala 5",
    };

    const roomCodeMap = {
      "sala-1": "S01",
      "sala-2": "S02",
      "sala-4": "S04",
      "sala-5": "S05",
    };

    const roomLabel = roomNameMap[selectedRoom] || selectedRoom;
    const padNumber = String(parseInt(notebookNumber, 10)).padStart(2, "0");
    const assetTag = `NOTE-${roomCodeMap[selectedRoom] || "S01"}-${padNumber}`;
    const targetName = `Notebook ${assetTag} (${roomLabel} - Vaga ${padNumber})`;

    const issuesTitle = selectedIssues.length > 0
      ? selectedIssues.map((x) => x.label.split("/")[0].trim()).join(", ")
      : "Irregularidade relatada na retirada";

    const title = `[Retirada ${roomLabel}] ${issuesTitle}`;

    const description = `REGISTRO DE RETIRADA PELO ALUNO:\n` +
      `Aluno: ${studentName} | Turma: ${turma} (${periodo.toUpperCase()} - ${modalidade})\n` +
      `Irregularidades observadas na retirada da vaga:\n` +
      selectedIssues.map((x) => `- ${x.label}`).join("\n") +
      (additionalDetails ? `\nDetalhes adicionais: ${additionalDetails}` : "") +
      `\n\n(Registro oficial gerado para comprovação de recebimento e notificação aos professores dos períodos diurno/noturno).`;

    const highestPrio = selectedIssues.some((x) => x.prio === "critica")
      ? "critica"
      : selectedIssues.some((x) => x.prio === "alta")
      ? "alta"
      : "media";

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          target_type: "notebook",
          target_id: assetTag,
          target_name: targetName,
          category: selectedIssues[0]?.category || "hardware",
          priority: highestPrio,
          requester_name: studentName,
          requester_email: studentEmail,
          requester_role: "aluno",
          periodo,
          modalidade,
          turma,
          is_retirada: 1,
          room_location: `${roomLabel} - Campus Sorocaba`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao registrar ocorrência.");
      }

      onSuccess(data.incident);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-white/20 text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold uppercase tracking-wide font-heading">
                Registro de Irregularidade na Retirada
              </h2>
              <p className="text-xs text-red-100">
                Formulário oficial para alunos &bull; Resguarde-se ao iniciar sua aula
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-200 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Alert */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-3 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Identificou alguma avaria ao retirar o notebook da vaga? Registre agora informando a sala, o número e os problemas. Os professores de todos os períodos acompanharão a ocorrência para verificar reincidências e orientar as turmas anteriores.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
              {errorMsg}
            </div>
          )}

          {/* Sala e Número do Notebook */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Sala do Carrinho *
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              >
                <option value="sala-1">Sala 1 (32 Notebooks)</option>
                <option value="sala-2">Sala 2 (32 Notebooks)</option>
                <option value="sala-4">Sala 4 (32 Notebooks)</option>
                <option value="sala-5">Sala 5 (32 Notebooks)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Número do Notebook *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="32"
                  placeholder="Ex: 14"
                  value={notebookNumber}
                  onChange={(e) => setNotebookNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs font-bold font-mono bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                  (1 a 32)
                </span>
              </div>
            </div>
          </div>

          {/* Dados do Aluno e Turma */}
          <div className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
              Identificação do Solicitante
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 text-[11px]">Aluno:</span>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-xs text-slate-800"
                />
              </div>

              <div>
                <span className="text-slate-500 text-[11px]">Turma:</span>
                <input
                  type="text"
                  value={turma}
                  onChange={(e) => setTurma(e.target.value)}
                  required
                  placeholder="Ex: CST ADS 3º Termo"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-xs text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-500 text-[11px]">Período da Aula:</span>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-xs text-slate-800"
                >
                  <option value="manha">Manhã (Diurno)</option>
                  <option value="tarde">Tarde (Diurno)</option>
                  <option value="noite">Noite (Noturno)</option>
                </select>
              </div>

              <div>
                <span className="text-slate-500 text-[11px]">Nível / Modalidade:</span>
                <select
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                  className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-xs text-slate-800"
                >
                  <option value="CST">CST (Superior de Tecnologia)</option>
                  <option value="CT">CT (Curso Técnico)</option>
                  <option value="CAI">CAI (Aprendizagem Industrial)</option>
                  <option value="FIC">FIC (Formação Inicial)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Checklist de Irregularidades Encontradas */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              O que você identificou no notebook? (Selecione um ou mais)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {commonIssues.map((issue) => {
                const isChecked = selectedIssues.some((x) => x.id === issue.id);
                return (
                  <button
                    key={issue.id}
                    type="button"
                    onClick={() => toggleIssue(issue)}
                    className={`flex items-start gap-2 p-2.5 text-left text-xs rounded-sm border transition-all cursor-pointer ${
                      isChecked
                        ? "bg-red-50 border-red-600 text-red-900 font-bold ring-1 ring-red-600 shadow-2xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked ? "bg-red-700 border-red-700 text-white" : "border-slate-400 bg-white"
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-[11px] leading-tight">{issue.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detalhes Adicionais */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Observações Adicionais (opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: A vaga estava com a tomada desligada; notei sujeira com aspecto de café no teclado..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">
              Protocolo registrado diretamente no Turso Database.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 rounded-sm transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-800 rounded-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Registrando..." : "Confirmar e Registrar"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
