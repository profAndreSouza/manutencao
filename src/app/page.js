"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StatsOverview from "@/components/StatsOverview";
import NotebooksView from "@/components/NotebooksView";
import IncidentsView from "@/components/IncidentsView";
import RoomsView from "@/components/RoomsView";
import EquipmentView from "@/components/EquipmentView";
import TeacherShiftsView from "@/components/TeacherShiftsView";
import NewIncidentModal from "@/components/NewIncidentModal";
import IncidentDetailModal from "@/components/IncidentDetailModal";
import NewNotebookModal from "@/components/NewNotebookModal";
import StudentQuickIntakeModal from "@/components/StudentQuickIntakeModal";
import TeacherOrientationModal from "@/components/TeacherOrientationModal";
import LoginPage from "@/components/LoginPage";
import { DEMO_USERS } from "@/lib/demoUsers";
import { Database, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sessão de Usuário (Docente x Aluno)
  const [currentUserKey, setCurrentUserKey] = useState("docente");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Layout mode: "sidebar" (menu lateral padrão) | "topbar" (menu superior 2 linhas)
  const [layoutMode, setLayoutMode] = useState("sidebar");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentUser = DEMO_USERS[currentUserKey] || DEMO_USERS.docente;

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
  const [isStudentIntakeOpen, setIsStudentIntakeOpen] = useState(false);
  const [isOrientationOpen, setIsOrientationOpen] = useState(false);
  const [incidentForOrientation, setIncidentForOrientation] = useState(null);

  // Success toast notification
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 5000);
  };

  // Restaurar sessão e preferência de layout ao carregar
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("senai_user_session");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.role === "docente" || parsed?.role === "aluno") {
          setCurrentUserKey(parsed.role);
          setIsLoggedIn(true);
        }
      }

      const savedLayout = localStorage.getItem("senai_menu_layout");
      if (savedLayout === "sidebar" || savedLayout === "topbar") {
        setLayoutMode(savedLayout);
      }
    } catch (e) {
      console.error("Erro ao carregar sessão / layout:", e);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  // Alternar entre Menu Lateral (Sidebar) e Menu Superior (2 Linhas)
  const handleToggleLayoutMode = () => {
    const next = layoutMode === "sidebar" ? "topbar" : "sidebar";
    setLayoutMode(next);
    try {
      localStorage.setItem("senai_menu_layout", next);
    } catch (e) {
      console.error(e);
    }
    showToast(
      `Layout alterado para: ${
        next === "sidebar" ? "Menu Vertical (Sidebar)" : "Menu Superior em 2 Linhas"
      }`
    );
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
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn, fetchAllData]);

  // Login handler
  const handleLoginSuccess = (user) => {
    setCurrentUserKey(user.role);
    setIsLoggedIn(true);
    showToast(`Bem-vindo ao sistema, ${user.name}!`);
  };

  // Logout handler
  const handleLogout = () => {
    try {
      localStorage.removeItem("senai_user_session");
    } catch (e) {
      console.error(e);
    }
    setIsLoggedIn(false);
    showToast("Sessão finalizada com sucesso.");
  };

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
    handleOpenNewIncidentForNotebook(notebook);
  };

  const handleOpenOrientationModal = (incident) => {
    setIncidentForOrientation(incident);
    setIsOrientationOpen(true);
  };

  const handleIncidentCreated = (newIncident) => {
    showToast(`Chamado ${newIncident.code} registrado com sucesso no Turso!`);
    fetchAllData();
  };

  const handleStudentIntakeSuccess = (newIncident) => {
    showToast(
      `Protocolo ${newIncident.code} gerado! Sua turma está resguardada e os docentes foram notificados.`
    );
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

  const handleOrientationSuccess = () => {
    showToast("Orientação formal por escrito gerada e vinculada ao chamado!");
    fetchAllData();
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-red-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500">Iniciando UniSENAI Manutenção...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, exibe a tela de Login
  if (!isLoggedIn) {
    return (
      <>
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-md bg-slate-900 text-white shadow-xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200 max-w-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold leading-snug">{toastMsg}</span>
          </div>
        )}
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  // Visualização de cada aba ativa
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <StatsOverview
            stats={stats}
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
            onOpenNewIncident={handleOpenNewIncident}
            onOpenStudentIntake={() => setIsStudentIntakeOpen(true)}
            onSelectIncident={handleSelectIncident}
          />
        );
      case "notebooks":
        return (
          <NotebooksView
            notebooks={notebooks}
            carts={carts}
            isLoading={isLoading}
            onRefresh={fetchAllData}
            onOpenNewIncidentForNotebook={handleOpenNewIncidentForNotebook}
            onOpenStudentIntakeForNotebook={() => setIsStudentIntakeOpen(true)}
            onOpenNewNotebookModal={() => setIsNewNotebookOpen(true)}
            onSelectNotebook={handleSelectNotebook}
          />
        );
      case "incidents":
        return (
          <IncidentsView
            incidents={incidents}
            isLoading={isLoading}
            onRefresh={fetchAllData}
            onSelectIncident={handleSelectIncident}
            onOpenNewIncident={() => handleOpenNewIncident("notebook")}
          />
        );
      case "turnos":
        return (
          <TeacherShiftsView
            incidents={incidents}
            notebooks={notebooks}
            onSelectIncident={handleSelectIncident}
            onOpenOrientationModal={handleOpenOrientationModal}
          />
        );
      case "rooms":
        return (
          <RoomsView
            rooms={rooms}
            isLoading={isLoading}
            onRefresh={fetchAllData}
            onOpenNewIncidentForRoom={handleOpenNewIncidentForRoom}
          />
        );
      case "equipment":
        return (
          <EquipmentView
            equipment={equipment}
            isLoading={isLoading}
            onRefresh={fetchAllData}
            onOpenNewIncidentForEquipment={handleOpenNewIncidentForEquipment}
          />
        );
      default:
        return null;
    }
  };

  const footerComponent = (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
            <span>Procedimento Operacional Padrão Ativo</span>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-md bg-slate-900 text-white shadow-xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold leading-snug">{toastMsg}</span>
        </div>
      )}

      {layoutMode === "sidebar" ? (
        /* ========================================================
           LAYOUT MODO 1: MENU VERTICAL (SIDEBAR) ESTILO SITE-MOSTRA
           ======================================================== */
        <div className="min-h-screen flex">
          {/* Sidebar Lateral */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenNewIncident={() => handleOpenNewIncident("notebook")}
            onOpenStudentIntake={() => setIsStudentIntakeOpen(true)}
            currentUser={currentUser}
            onSwitchUser={(role) => {
              setCurrentUserKey(role);
              try {
                localStorage.setItem("senai_user_session", JSON.stringify(DEMO_USERS[role]));
              } catch (e) {
                console.error(e);
              }
              showToast(`Perfil ativo: ${DEMO_USERS[role].name}`);
            }}
            onLogout={handleLogout}
            notebooksDefectCount={stats?.notebooks?.defeito || 0}
            openIncidentsCount={stats?.incidents?.abertos || 0}
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />

          {/* Área Principal de Conteúdo (Wide) */}
          <div className="flex-1 flex flex-col min-w-0">
            <Header
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenNewIncident={() => handleOpenNewIncident("notebook")}
              onOpenStudentIntake={() => setIsStudentIntakeOpen(true)}
              currentUser={currentUser}
              onSwitchUser={(role) => {
                setCurrentUserKey(role);
                try {
                  localStorage.setItem("senai_user_session", JSON.stringify(DEMO_USERS[role]));
                } catch (e) {
                  console.error(e);
                }
                showToast(`Perfil ativo: ${DEMO_USERS[role].name}`);
              }}
              onLogout={handleLogout}
              notebooksDefectCount={stats?.notebooks?.defeito || 0}
              openIncidentsCount={stats?.incidents?.abertos || 0}
              layoutMode="sidebar"
              onToggleLayoutMode={handleToggleLayoutMode}
              onOpenSidebarMobile={() => setMobileSidebarOpen(true)}
            />

            <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {renderActiveView()}
            </main>

            {footerComponent}
          </div>
        </div>
      ) : (
        /* ========================================================
           LAYOUT MODO 2: MENU SUPERIOR EM 2 LINHAS
           ======================================================== */
        <div className="min-h-screen flex flex-col">
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenNewIncident={() => handleOpenNewIncident("notebook")}
            onOpenStudentIntake={() => setIsStudentIntakeOpen(true)}
            currentUser={currentUser}
            onSwitchUser={(role) => {
              setCurrentUserKey(role);
              try {
                localStorage.setItem("senai_user_session", JSON.stringify(DEMO_USERS[role]));
              } catch (e) {
                console.error(e);
              }
              showToast(`Perfil ativo: ${DEMO_USERS[role].name}`);
            }}
            onLogout={handleLogout}
            notebooksDefectCount={stats?.notebooks?.defeito || 0}
            openIncidentsCount={stats?.incidents?.abertos || 0}
            layoutMode="topbar"
            onToggleLayoutMode={handleToggleLayoutMode}
          />

          <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {renderActiveView()}
          </main>

          {footerComponent}
        </div>
      )}

      {/* Modal: Formulário Rápido de Retirada do Aluno (Substitui o Forms) */}
      <StudentQuickIntakeModal
        isOpen={isStudentIntakeOpen}
        onClose={() => setIsStudentIntakeOpen(false)}
        onSuccess={handleStudentIntakeSuccess}
        currentUser={currentUser}
      />

      {/* Modal: Emissão de Orientação Formal por Escrito (Para Docentes) */}
      <TeacherOrientationModal
        incident={incidentForOrientation}
        isOpen={isOrientationOpen}
        onClose={() => setIsOrientationOpen(false)}
        onSuccess={handleOrientationSuccess}
      />

      {/* Modal: Novo Chamado Geral */}
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

      {/* Modal: Detalhes do Incidente & Atendimento Técnico */}
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
    </div>
  );
}
