"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Laptop,
  DoorOpen,
  Wrench,
  AlertTriangle,
  Send,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function NewIncidentModal({
  isOpen,
  onClose,
  onSuccess,
  notebooks = [],
  rooms = [],
  equipment = [],
  initialTargetType = "notebook",
  initialTargetItem = null,
}) {
  const [targetType, setTargetType] = useState(initialTargetType);
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("media");
  const [category, setCategory] = useState("hardware");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterRole, setRequesterRole] = useState("professor");
  const [roomLocation, setRoomLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Presets comuns para preenchimento com 1 clique
  const notebookPresets = [
    { title: "Bateria não carrega ou estufada", cat: "hardware", prio: "critica", desc: "Notebook não retém carga desconectado da fonte ou apresenta carcaça estufada na região da bateria." },
    { title: "Teclado com teclas travadas ou falhando", cat: "hardware", prio: "alta", desc: "Diversas teclas não respondem à digitação ou estão emperradas com resíduos." },
    { title: "Tela LCD com linhas, sem vídeo ou trincada", cat: "hardware", prio: "alta", desc: "Display apresenta linha colorida vertical, falha de iluminação ou trincado físico." },
    { title: "Carregador / Fonte com mau contato ou danificada", cat: "hardware", prio: "media", desc: "Cabo de alimentação partido próximo ao conector ou adaptador não envia energia." },
    { title: "Sistema travando / Lentidão excessiva (Reinstalar SO)", cat: "software", prio: "media", desc: "Sistema operacional com erros de inicialização constantes ou tela azul." },
    { title: "Não liga / Não dá sinal de energia", cat: "hardware", prio: "alta", desc: "Pressionar o botão power não acende nenhum LED indicativo nem gira os coolers." },
  ];

  const roomPresets = [
    { title: "Ar-condicionado sem gelar / pingando água", cat: "climatizacao", prio: "media", desc: "Aparelho de ar-condicionado não resfria o ambiente e apresenta gotejamento interno." },
    { title: "Projetor não liga ou sem sinal de vídeo HDMI", cat: "audiovisual", prio: "alta", desc: "Projetor acusa lâmpada queimada ou o cabo HDMI na mesa do professor não transmite vídeo." },
    { title: "Tomadas das bancadas sem alimentação elétrica", cat: "eletrica", prio: "alta", desc: "Fileira de tomadas das bancadas de alunos desarmou ou não possui tensão 127V/220V." },
    { title: "Iluminação com lâmpadas piscando ou queimadas", cat: "eletrica", prio: "baixa", desc: "Lâmpadas LED do teto piscando intermitentemente ou totalmente inoperantes." },
  ];

  const equipmentPresets = [
    { title: "Impressora 3D com bico entupido / falha de extrusão", cat: "maker", prio: "media", desc: "Bico extrusor não alimenta filamento ou motor de tração patinando." },
    { title: "Falha de conectividade de rede no equipamento", cat: "rede", prio: "alta", desc: "Porta Ethernet inoperante ou perda constante de pacotes." },
  ];

  // Sincronizar com props iniciais quando aberto
  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setTargetType(initialTargetType);
      if (initialTargetItem) {
        setSelectedTargetId(initialTargetItem.id || initialTargetItem.asset_tag);
        if (initialTargetType === "notebook") {
          setRoomLocation(initialTargetItem.cart_group || "");
        } else if (initialTargetType === "sala") {
          setRoomLocation(`${initialTargetItem.name} (${initialTargetItem.block})`);
        } else if (initialTargetType === "equipamento") {
          setRoomLocation(initialTargetItem.room_name || "");
        }
      } else {
        setSelectedTargetId("");
      }
    }
  }, [isOpen, initialTargetType, initialTargetItem]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset) => {
    setTitle(preset.title);
    setDescription(preset.desc);
    setCategory(preset.cat);
    setPriority(preset.prio);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title || !description || !selectedTargetId || !requesterName) {
      setErrorMsg("Preencha todos os campos obrigatórios (*).");
      return;
    }

    let targetName = "";
    if (targetType === "notebook") {
      const nb = notebooks.find((n) => n.id === selectedTargetId || n.asset_tag === selectedTargetId);
      targetName = nb ? `Notebook ${nb.brand} ${nb.model} (${nb.asset_tag}) - ${nb.slot_number}` : selectedTargetId;
    } else if (targetType === "sala") {
      const r = rooms.find((x) => x.id === selectedTargetId || x.code === selectedTargetId);
      targetName = r ? `${r.name} (${r.code})` : selectedTargetId;
    } else {
      const eq = equipment.find((x) => x.id === selectedTargetId || x.asset_tag === selectedTargetId);
      targetName = eq ? `${eq.name} (${eq.asset_tag})` : selectedTargetId;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          target_type: targetType,
          target_id: selectedTargetId,
          target_name: targetName,
          category,
          priority,
          requester_name: requesterName,
          requester_email: requesterEmail,
          requester_role: requesterRole,
          room_location: roomLocation,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao registrar incidente");
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
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-red-600 text-white">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold uppercase tracking-wide font-heading">
                Abrir Novo Chamado de Manutenção
              </h2>
              <p className="text-xs text-slate-400">
                UniSENAI Sorocaba &bull; Atendimento TI & Predial
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
              {errorMsg}
            </div>
          )}

          {/* 1. Escolha do Recurso / Tipo */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Selecione o Tipo de Recurso Afetado *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTargetType("notebook");
                  setSelectedTargetId("");
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  targetType === "notebook"
                    ? "bg-red-50 border-red-600 text-red-700 ring-1 ring-red-600"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Laptop className="w-4 h-4 text-red-600" />
                <span>Notebook</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetType("sala");
                  setSelectedTargetId("");
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  targetType === "sala"
                    ? "bg-red-50 border-red-600 text-red-700 ring-1 ring-red-600"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <DoorOpen className="w-4 h-4 text-blue-600" />
                <span>Sala / Lab</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetType("equipamento");
                  setSelectedTargetId("");
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  targetType === "equipamento"
                    ? "bg-red-50 border-red-600 text-red-700 ring-1 ring-red-600"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Equipamento</span>
              </button>
            </div>
          </div>

          {/* 2. Item Específico do Recurso */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Identificação do Item *
            </label>
            {targetType === "notebook" && (
              <select
                value={selectedTargetId}
                onChange={(e) => {
                  setSelectedTargetId(e.target.value);
                  const nb = notebooks.find((n) => n.id === e.target.value);
                  if (nb) setRoomLocation(nb.cart_group);
                }}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              >
                <option value="">-- Selecione o Notebook (Patrimônio / Carrinho) --</option>
                {notebooks.map((nb) => (
                  <option key={nb.id} value={nb.id}>
                    {nb.asset_tag} &bull; {nb.brand} {nb.model} &bull; {nb.cart_group} ({nb.slot_number})
                  </option>
                ))}
              </select>
            )}

            {targetType === "sala" && (
              <select
                value={selectedTargetId}
                onChange={(e) => {
                  setSelectedTargetId(e.target.value);
                  const r = rooms.find((x) => x.id === e.target.value);
                  if (r) setRoomLocation(`${r.name} - ${r.block}`);
                }}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              >
                <option value="">-- Selecione a Sala ou Laboratório --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.code} - {room.name} ({room.block} - {room.floor})
                  </option>
                ))}
              </select>
            )}

            {targetType === "equipamento" && (
              <select
                value={selectedTargetId}
                onChange={(e) => {
                  setSelectedTargetId(e.target.value);
                  const eq = equipment.find((x) => x.id === e.target.value);
                  if (eq) setRoomLocation(eq.room_name || "");
                }}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              >
                <option value="">-- Selecione o Equipamento --</option>
                {equipment.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.asset_tag} &bull; {eq.name} ({eq.room_name || "Sem sala"})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 3. Atalhos Rápidos de Problemas Comuns */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Problemas comuns frequentes (clique para autocompletar):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(targetType === "notebook"
                ? notebookPresets
                : targetType === "sala"
                ? roomPresets
                : equipmentPresets
              ).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded border border-slate-200 text-slate-700 transition-colors cursor-pointer text-left"
                >
                  + {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Título & Categoria & Severidade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Título Resumido *
              </label>
              <input
                type="text"
                placeholder="Ex: Teclas W e A não funcionam"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Prioridade / Severidade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica (Urgente)</option>
              </select>
            </div>
          </div>

          {/* 5. Descrição Detalhada */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Descrição Detalhada do Problema *
            </label>
            <textarea
              rows={3}
              placeholder="Descreva o que ocorreu, sintomas observados, códigos de erro ou circunstâncias..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600 leading-relaxed"
            ></textarea>
          </div>

          {/* 6. Dados do Solicitante */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Dados do Solicitante
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Seu Nome Completo *"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                required
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
              <input
                type="email"
                placeholder="E-mail Institucional"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
              <select
                value={requesterRole}
                onChange={(e) => setRequesterRole(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              >
                <option value="professor">Professor(a)</option>
                <option value="aluno">Aluno(a) / Monitor</option>
                <option value="tecnico">Técnico de Laboratório</option>
                <option value="coordenador">Coordenador(a)</option>
                <option value="funcionario">Manutenção Predial</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 rounded-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-800 rounded-sm shadow-sm transition-all hover:shadow cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Gravando no Turso...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Registrar Chamado</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
