"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import StatsOverview from "@/components/StatsOverview";
import NotebooksView from "@/components/NotebooksView";
import IncidentsView from "@/components/IncidentsView";
import RoomsView from "@/components/RoomsView";
import EquipmentView from "@/components/EquipmentView";
import NewIncidentModal from "@/components/NewIncidentModal";
import IncidentDetailModal from "@/components/IncidentDetailModal";
import NewNotebookModal from "@/components/NewNotebookModal";
import { Database, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data states
  const [stats, setStats] = useState(null);
  const [notebooks, setNotebooks] = useState([]);
  const [carts, setCarts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [equipment, setEquipment] = useState([]);

  // Loadings
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [targetTypeForNew, setTargetTypeForNew] = useState("notebook");
  const [targetItemForNew, setTargetItemForNew] = useState(null);

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isNewNotebookOpen, setIsNewNotebookOpen] = useState(false);

  // Success toast notification
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4500);
  };

  // Carregar dados gerais
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statsRes, nbRes, incRes, roomsRes, eqRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/notebooks"),
        fetch("/api/incidents"),
        fetch("/api/rooms"),
        fetch("/api/equipment"),
      ]);

      const [statsData, nbData, incData, roomsData, eqData] = await Promise.all([
        statsRes.json(),
        nbRes.json(),
        incRes.json(),
        roomsRes.json(),
        eqRes.json(),
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (nbData.success) {
        setNotebooks(nbData.notebooks || []);
        setCarts(nbData.carts || []);
      }
      if (incData.success) setIncidents(incData.incidents || []);
      if (roomsData.success) setRooms(roomsData.rooms || []);
      if (eqData.success) setEquipment(eqData.equipment || []);
    } catch (error) {
      console.error("Erro ao carregar dados do sistema:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Ações de abertura de chamados direcionados
  const handleOpenNewIncident = (targetType = "notebook", targetItem = null) => {
    setTargetTypeForNew(targetType);
    setTargetItemForNew(targetItem);
    setIsNewIncidentOpen(true);
  };

  const handleOpenNewIncidentForNotebook = (notebook) => {
    handleOpenNewIncident("notebook", notebook);
  };

  const handleOpenNewIncidentForRoom = (room) => {
    handleOpenNewIncident("sala", room);
  };

  const handleOpenNewIncidentForEquipment = (eq) => {
    handleOpenNewIncident("equipamento", eq);
  };

  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
    setIsDetailOpen(true);
  };

  const handleSelectNotebook = (notebook) => {
    // Ao clicar em detalhes do notebook, podemos abrir chamado ou filtrar
    handleOpenNewIncidentForNotebook(notebook);
  };

  const handleIncidentCreated = (newIncident) => {
    showToast(`Chamado ${newIncident.code} registrado com sucesso!`);
    fetchAllData();
  };

  const handleNotebookCreated = (nb) => {
    showToast(`Notebook ${nb.asset_tag} cadastrado na frota com sucesso!`);
    fetchAllData();
  };

  const handleIncidentUpdated = () => {
    showToast("Incidente e status de atendimento atualizados!");
    fetchAllData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-md bg-slate-900 text-white shadow-xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header Principal UniSENAI */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewIncident={() => handleOpenNewIncident("notebook")}
        notebooksDefectCount={stats?.notebooks?.defeito || 0}
        openIncidentsCount={stats?.incidents?.abertos || 0}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "dashboard" && (
          <StatsOverview
            stats={stats}
            onNavigateTab={setActiveTab}
            onOpenNewIncident={handleOpenNewIncident}
            onSelectIncident={handleSelectIncident}
          />
        )}

        {activeTab === "notebooks" && (
          <NotebooksView
            notebooks={notebooks}
            carts={carts}
            isLoading={isLoading}
            onRefresh={fetchAllData}
            onOpenNewIncidentForNotebook={handleOpenNewIncidentForNotebook}
            onOpenNewNotebookModal={() => setIsNewNotebookOpen(true)}
            onSelectNotebook={handleSelectNotebook}
          />
        )}

        {activeTab === "incidents" && (
          <IncidentsView
            incidents={incidents}
            isLoading={isLoading}
            onRefresh={fetchAllData}
            onSelectIncident={handleSelectIncident}
            onOpenNewIncident={() => handleOpenNewIncident("notebook")}
          />
        )}

        {activeTab === "rooms" && (
          <RoomsView
            rooms={rooms}
            isLoading={isLoading}
            onRefresh={fetchAllData}
            onOpenNewIncidentForRoom={handleOpenNewIncidentForRoom}
          />
        )}

        {activeTab === "equipment" && (
          <EquipmentView
            equipment={equipment}
            isLoading={isLoading}
            onRefresh={fetchAllData}
            onOpenNewIncidentForEquipment={handleOpenNewIncidentForEquipment}
          />
        )}
      </main>

      {/* Modal: Novo Chamado */}
      <NewIncidentModal
        isOpen={isNewIncidentOpen}
        onClose={() => setIsNewIncidentOpen(false)}
        onSuccess={handleIncidentCreated}
        notebooks={notebooks}
        rooms={rooms}
        equipment={equipment}
        initialTargetType={targetTypeForNew}
        initialTargetItem={targetItemForNew}
      />

      {/* Modal: Detalhes do Incidente & Atendimento */}
      <IncidentDetailModal
        incident={selectedIncident}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdateSuccess={handleIncidentUpdated}
      />

      {/* Modal: Novo Notebook */}
      <NewNotebookModal
        isOpen={isNewNotebookOpen}
        onClose={() => setIsNewNotebookOpen(false)}
        onSuccess={handleNotebookCreated}
      />

      {/* Rodapé Institucional */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-bold uppercase tracking-wider text-red-700">
              UniSENAI SP
            </span>
            <span>&bull;</span>
            <span>Faculdade de Tecnologia SENAI Sorocaba</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Turso Database (LibSQL)</span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Vercel Edge Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
