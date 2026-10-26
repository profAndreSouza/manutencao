"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Clock,
  User,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ShieldAlert,
  Send,
  Laptop,
  DoorOpen,
  Calendar,
} from "lucide-react";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export default function IncidentDetailModal({
  incident,
  isOpen,
  onClose,
  onUpdateSuccess,
}) {
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("aberto");
  const [currentPriority, setCurrentPriority] = useState("media");
  const [assignedTo, setAssignedTo] = useState("");
  const [solutionNotes, setSolutionNotes] = useState("");
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("Suporte TI / Manutenção");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const technicianList = [
    "Lucas Mendes (Suporte TI)",
    "Carlos Roberto (Manutenção Predial)",
    "Eng. Daniela Prado (Lab Maker)",
    "Rodrigo Souza (Redes & Infra)",
    "Marcos Oliveira (Técnico de Laboratório)",
  ];

  useEffect(() => {
    if (incident && isOpen) {
      setCurrentStatus(incident.status);
      setCurrentPriority(incident.priority);
      setAssignedTo(incident.assigned_to || "");
      setSolutionNotes(incident.solution_notes || "");
      setNewComment("");
      setMessage("");
      loadHistory();
    }
  }, [incident, isOpen]);

  const loadHistory = async () => {
    if (!incident) return;
    try {
      setIsLoadingHistory(true);
      const res = await fetch(`/api/incidents/${incident.id}`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.history || []);
      }
    } catch (e) {
      console.error("Erro ao carregar histórico:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  if (!isOpen || !incident) return null;

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/incidents/${incident.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: currentStatus,
          priority: currentPriority,
          assigned_to: assignedTo,
          solution_notes: solutionNotes,
          comment: newComment,
          author_name: authorName,
          author_role: "tecnico",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao salvar atualização");
      }

      setMessage("Atualização salva com sucesso no Turso!");
      setNewComment("");
      loadHistory();
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      setMessage(`Erro: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "critica":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800">Crítica</span>;
      case "alta":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-800">Alta</span>;
      case "media":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">Média</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">Baixa</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-extrabold px-2.5 py-1 rounded bg-red-700 text-white">
              {incident.code}
            </span>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white font-heading">
                {incident.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{incident.target_name}</span>
                <span>&bull;</span>
                <span>{formatTimeAgo(incident.created_at)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {message && (
            <div className={`p-3 text-xs rounded-md ${message.startsWith("Erro") ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
              {message}
            </div>
          )}

          {/* Resumo do Incidente */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Prioridade:</span>
                {getPriorityBadge(incident.priority)}
                <span className="font-semibold text-slate-500 ml-2">Local:</span>
                <span className="font-medium text-slate-800">{incident.room_location || "Campus Sorocaba"}</span>
              </div>
              <div className="text-slate-500 text-[11px]">
                Aberto em {formatDate(incident.created_at)}
              </div>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200/80">
              <p className="font-semibold text-slate-900 mb-1">Descrição do Solicitante:</p>
              {incident.description}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <div>
                Solicitado por: <strong className="text-slate-800">{incident.requester_name}</strong> ({incident.requester_role})
              </div>
              <div>{incident.requester_email}</div>
            </div>
          </div>

          {/* Painel de Atendimento Técnico (Formulário) */}
          <form onSubmit={handleSaveUpdate} className="border border-red-200 bg-red-50/30 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-red-200/60">
              <Wrench className="w-4 h-4 text-red-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                Painel de Atendimento Técnico
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Status */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Status do Chamado
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-sm text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                >
                  <option value="aberto">Aberto</option>
                  <option value="em_analise">Em Análise</option>
                  <option value="em_atendimento">Em Atendimento</option>
                  <option value="aguardando_peca">Aguardando Peça</option>
                  <option value="resolvido">Resolvido (Finalizar)</option>
                  <option value="fechado">Fechado / Cancelado</option>
                </select>
              </div>

              {/* Técnico Responsável */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Técnico Atribuído
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-sm text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                >
                  <option value="">-- Não atribuído --</option>
                  {technicianList.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severidade */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Reclassificar Severidade
                </label>
                <select
                  value={currentPriority}
                  onChange={(e) => setCurrentPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-sm text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica (Urgente)</option>
                </select>
              </div>
            </div>

            {/* Solução / Peças */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Laudo Técnico / Solução Aplicada (Peças trocadas, procedimentos)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Teclado substituído por peça original do almoxarifado. Teste de funcionamento OK."
                value={solutionNotes}
                onChange={(e) => setSolutionNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              ></textarea>
            </div>

            {/* Novo Comentário */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Adicionar Atualização / Comentário no Histórico
              </label>
              <input
                type="text"
                placeholder="Adicione uma nota sobre o andamento do chamado..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Ao marcar como <strong>Resolvido</strong>, o status do recurso (notebook ou sala) é restabelecido automaticamente.
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white rounded-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isSaving ? "Gravando..." : "Salvar Alterações"}</span>
              </button>
            </div>
          </form>

          {/* Linha do Tempo / Histórico de Ações */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading">
              Linha do Tempo de Atualizações & Intervenções
            </h4>

            {isLoadingHistory ? (
              <p className="text-xs text-slate-400">Carregando histórico...</p>
            ) : history.length === 0 ? (
              <p className="text-xs text-slate-400">Nenhum evento registrado ainda.</p>
            ) : (
              <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {history.map((h, i) => (
                  <div key={h.id || i} className="relative flex items-start gap-2.5">
                    <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white"></span>
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-800">{h.author_name}</strong>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(h.created_at)} ({formatTimeAgo(h.created_at)})
                        </span>
                      </div>
                      <p className="text-slate-600 leading-normal">{h.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-200 rounded-sm transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
