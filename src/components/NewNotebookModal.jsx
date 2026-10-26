"use client";

import React, { useState } from "react";
import { X, Laptop, Plus, Check } from "lucide-react";

export default function NewNotebookModal({ isOpen, onClose, onSuccess }) {
  const [assetTag, setAssetTag] = useState("");
  const [cartGroup, setCartGroup] = useState("Carrinho Móvel A (Lab Informática)");
  const [slotNumber, setSlotNumber] = useState("");
  const [brand, setBrand] = useState("Lenovo");
  const [model, setModel] = useState("ThinkPad E14 Gen 4");
  const [processor, setProcessor] = useState("Intel Core i5-1235U");
  const [ram, setRam] = useState("16 GB DDR4");
  const [storage, setStorage] = useState("512 GB SSD NVMe");
  const [serialNumber, setSerialNumber] = useState("");
  const [chargerTag, setChargerTag] = useState("");
  const [batteryHealth, setBatteryHealth] = useState("100%");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!assetTag || !slotNumber || !brand || !model) {
      setErrorMsg("Preencha todos os campos obrigatórios (*).");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/notebooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_tag: assetTag.toUpperCase().trim(),
          cart_group: cartGroup,
          slot_number: slotNumber,
          brand,
          model,
          processor,
          ram,
          storage,
          serial_number: serialNumber.trim(),
          charger_tag: chargerTag.trim(),
          battery_health: batteryHealth,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao cadastrar notebook");
      }

      onSuccess(data);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-red-600 text-white">
              <Laptop className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold uppercase tracking-wide font-heading">
              Cadastrar Novo Notebook na Frota
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Patrimônio SENAI *
              </label>
              <input
                type="text"
                placeholder="Ex: NOTE-SEN-0125"
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm font-mono text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Vaga / Slot no Carrinho *
              </label>
              <input
                type="text"
                placeholder="Ex: Vaga 21"
                value={slotNumber}
                onChange={(e) => setSlotNumber(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Carrinho / Local de Guarda *
            </label>
            <select
              value={cartGroup}
              onChange={(e) => setCartGroup(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
            >
              <option value="Carrinho Móvel A (Lab Informática)">Carrinho Móvel A (Lab Informática)</option>
              <option value="Carrinho Móvel B (Maker / Projetos)">Carrinho Móvel B (Maker / Projetos)</option>
              <option value="Armário de Reserva Docente">Armário de Reserva Docente</option>
              <option value="Bancada de Manutenção TI">Bancada de Manutenção TI</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Fabricante / Marca *
              </label>
              <input
                type="text"
                placeholder="Ex: Lenovo ou Dell"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Modelo *
              </label>
              <input
                type="text"
                placeholder="Ex: ThinkPad E14"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                Processador
              </label>
              <input
                type="text"
                value={processor}
                onChange={(e) => setProcessor(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                Memória RAM
              </label>
              <input
                type="text"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                SSD / Disco
              </label>
              <input
                type="text"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tag da Fonte / Carregador
              </label>
              <input
                type="text"
                placeholder="Ex: FNT-SEN-0125"
                value={chargerTag}
                onChange={(e) => setChargerTag(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm font-mono text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Saúde da Bateria
              </label>
              <input
                type="text"
                placeholder="Ex: 100%"
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

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
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Cadastrando..." : "Cadastrar Notebook"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
