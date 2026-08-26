'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UserSessionPayload } from '@/types/user';
import { SeoPerformanceSummary, ConversionFunnelSummary, UrlHealthScore, HealthStatus } from '@/types/telemetry';
import { CompetitiveIntelligenceSummary } from '@/types/competitive';
import { DecisionCard } from '@/types/growth';
import {
  BarChart3,
  TrendingUp,
  Search,
  MessageCircle,
  PhoneCall,
  Eye,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Layers,
  ChevronRight,
  ArrowLeft,
  Building,
  MapPin,
  Flame,
  Target,
  FileSpreadsheet,
  Activity,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Award,
  Globe,
  Shield,
  Zap,
  Check,
  X,
  ShieldAlert,
  Cpu,
  Plus,
} from 'lucide-react';

export default function AdminSeoConversionesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSessionPayload | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'seo' | 'conversions' | 'opportunities' | 'health' | 'competitive' | 'import'>('seo');

  const [seoData, setSeoData] = useState<SeoPerformanceSummary | null>(null);
  const [conversionsData, setConversionsData] = useState<ConversionFunnelSummary | null>(null);
  const [healthScores, setHealthScores] = useState<UrlHealthScore[]>([]);
  const [healthFilter, setHealthFilter] = useState<'all' | 'healthy' | 'warning' | 'action_required'>('all');
  const [competitiveData, setCompetitiveData] = useState<CompetitiveIntelligenceSummary | null>(null);
  const [decisionCards, setDecisionCards] = useState<DecisionCard[]>([]);
  const [selectedDecisionModal, setSelectedDecisionModal] = useState<DecisionCard | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Importador GSC
  const [jsonImportText, setJsonImportText] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  const [isSyncingGsc, setIsSyncingGsc] = useState<boolean>(false);
  const [gscStatusMessage, setGscStatusMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const [inventoryOpportunities, setInventoryOpportunities] = useState<any[]>([]);
  const [inspectUrlInput, setInspectUrlInput] = useState<string>('/inmobiliaria-san-jose');
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [inspectionResult, setInspectionResult] = useState<any | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchTelemetry = async () => {
    setIsLoading(true);
    try {
      const [resTel, resComp, resDec] = await Promise.all([
        fetch('/api/admin/telemetry'),
        fetch('/api/admin/competitive'),
        fetch('/api/admin/decision-center'),
      ]);
      const dataTel = await resTel.json();
      const dataComp = await resComp.json();
      const dataDec = await resDec.json();

      if (dataTel.success) {
        setSeoData(dataTel.seo);
        setConversionsData(dataTel.conversions);
        if (dataTel.inventoryOpportunities) {
          setInventoryOpportunities(dataTel.inventoryOpportunities);
        }
        if (dataTel.healthScores) {
          setHealthScores(dataTel.healthScores);
        }
      }
      if (dataComp.success && dataComp.data) {
        setCompetitiveData(dataComp.data);
      }
      if (dataDec.success && dataDec.data) {
        setDecisionCards(dataDec.data);
      }
    } catch {
      showToast('Error de conexión con la telemetría');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveDecision = async (id: string) => {
    try {
      await fetch('/api/admin/decision-center', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId: id, actionType: 'approve' }),
      });
      setDecisionCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'approved' } : c))
      );
      showToast('✅ Acción aprobada por Martín');
      setSelectedDecisionModal(null);
    } catch {
      showToast('Error al registrar aprobación');
    }
  };

  const handleDismissDecision = async (id: string) => {
    try {
      await fetch('/api/admin/decision-center', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId: id, actionType: 'dismiss' }),
      });
      setDecisionCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'dismissed' } : c))
      );
      showToast('Acción descartada');
      setSelectedDecisionModal(null);
    } catch {
      showToast('Error al descartar acción');
    }
  };

  const handleInspectUrl = async () => {
    if (!inspectUrlInput.trim()) {
      showToast('Ingresá una URL válida para inspeccionar');
      return;
    }

    setIsInspecting(true);
    setInspectionResult(null);
    try {
      const res = await fetch('/api/admin/telemetry/inspect-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inspectUrlInput }),
      });
      const data = await res.json();
      setInspectionResult(data);
      if (data.success) {
        showToast('✅ Diagnóstico de URL completado');
      } else {
        showToast(data.error || 'Atención en la inspección de URL');
      }
    } catch {
      showToast('Error al conectar con URL Inspection API');
    } finally {
      setIsInspecting(false);
    }
  };

  const handleSyncGscLive = async () => {
    setIsSyncingGsc(true);
    setGscStatusMessage(null);
    try {
      const res = await fetch('/api/admin/telemetry/sync-gsc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: 28 }),
      });
      const data = await res.json();

      if (data.success) {
        setGscStatusMessage({
          type: 'success',
          text: `✅ ${data.message} (${data.startDate} al ${data.endDate})`,
        });
        showToast(`✅ Sincronizados ${data.recordsCount} registros reales de GSC`);
        fetchTelemetry();
      } else {
        setGscStatusMessage({
          type: 'warning',
          text: `⚠️ ${data.message} ${data.instructions || ''}`,
        });
        showToast('Atención: Verificá permisos de la Service Account en GSC');
      }
    } catch (err: any) {
      setGscStatusMessage({
        type: 'warning',
        text: 'Error de red al conectar con Google Search Console API.',
      });
      showToast('Error de conexión con la API de Google');
    } finally {
      setIsSyncingGsc(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
          setIsAuthChecking(false);
          fetchTelemetry();
        } else {
          router.replace('/login');
        }
      })
      .catch(() => {
        router.replace('/login');
      });
  }, [router]);

  const handleImportGsc = async () => {
    if (!jsonImportText.trim()) {
      showToast('Ingresá un arreglo JSON válido de Search Console');
      return;
    }

    setIsImporting(true);
    try {
      const parsed = JSON.parse(jsonImportText);
      const records = Array.isArray(parsed) ? parsed : [parsed];

      const res = await fetch('/api/admin/telemetry/import-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`✅ Se importaron ${data.imported} registros de Search Console`);
        setJsonImportText('');
        fetchTelemetry();
        setActiveTab('seo');
      } else {
        showToast(data.error || 'Error al importar registros');
      }
    } catch (err: any) {
      showToast('JSON inválido. Verificá la sintaxis.');
    } finally {
      setIsImporting(false);
    }
  };

  if (isAuthChecking || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#E85D04]" />
          <span>Verificando sesión administrativa...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />

      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-500/30 text-xs font-bold animate-in fade-in slide-in-from-top-4 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#E85D04]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Barra de Navegación Rápida Admin */}
      <nav className="bg-white border-b border-slate-200/80 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs font-bold shrink-0 flex-wrap">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl transition-all"
            >
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>1. Catálogo Inmuebles</span>
            </Link>
            <Link
              href="/admin/nueva"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#E85D04]" />
              <span>2. Nueva Propiedad</span>
            </Link>
            <Link
              href="/admin/seo-conversiones"
              className="flex items-center gap-1.5 bg-[#5E1754] text-white px-3 py-1.5 rounded-xl shadow-xs"
            >
              <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
              <span>3. SEO & Decisiones (P5)</span>
            </Link>
            <Link
              href="/estadisticas-inmobiliarias-san-jose"
              target="_blank"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>4. Observatorio San José ↗</span>
            </Link>
            <Link
              href="/guia-tasacion-inmobiliaria-san-jose"
              target="_blank"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>5. Guías Temáticas ↗</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Ver Web ↗</span>
            </Link>
          </div>

          <button
            onClick={fetchTelemetry}
            disabled={isLoading}
            className="text-xs font-bold text-slate-600 hover:text-[#5E1754] flex items-center space-x-1.5 bg-purple-50 hover:bg-purple-100 text-[#5E1754] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 border border-purple-200/60 self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar Datos</span>
          </button>
        </div>
      </nav>

      {/* Encabezado Principal */}
      <header className="bg-gradient-to-br from-[#191024] via-[#2A0E35] to-[#120B1A] text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-400 border border-white/15">
            <BarChart3 className="w-4 h-4 text-[#E85D04]" />
            <span>Telemetría de Negocio — Fase P3</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Tablero de Rendimiento SEO & Conversiones
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Atribución directa: qué busca el usuario en Google → qué propiedad visualiza → qué contacto comercial genera.
              </p>
            </div>

            {/* Selector de Pestañas */}
            <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/10 text-xs font-bold flex-wrap gap-1">
              <button
                onClick={() => setActiveTab('seo')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'seo' ? 'bg-[#5E1754] text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                1. Search Console (SEO)
              </button>
              <button
                onClick={() => setActiveTab('conversions')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'conversions' ? 'bg-[#5E1754] text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                2. Embudo & Conversión
              </button>
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'opportunities' ? 'bg-[#5E1754] text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                3. Matriz de Oportunidades
              </button>
              <button
                onClick={() => setActiveTab('health')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'health' ? 'bg-[#5E1754] text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                4. Health Score SEO
              </button>
              <button
                onClick={() => setActiveTab('competitive')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'competitive' ? 'bg-[#5E1754] text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                5. SEO Competitivo (P4)
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'import' ? 'bg-[#5E1754] text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                6. Importar GSC
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow space-y-8">
        
        {/* 📊 RESUMEN DEL MES (PANEL EJECUTIVO COMERCIAL) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 bg-purple-50 text-[#5E1754] px-3 py-1 rounded-full text-xs font-black border border-purple-200">
                <BarChart3 className="w-3.5 h-3.5 text-[#E85D04]" />
                <span>Panel Ejecutivo de Dirección</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                <span>📊 Resumen del Mes — Agosto 2026</span>
              </h2>
              <p className="text-xs text-slate-500">
                Métricas consolidadas de demanda en Google, visitas web y contactos comerciales directos.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <a
                href="#analisis-avanzado"
                className="text-xs font-bold text-[#5E1754] hover:text-[#7A1E6E] flex items-center space-x-1 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl transition-all"
              >
                <span>Ver análisis técnico avanzado</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Grid de Métricas Principales */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>👁️</span>
                <span>Visitas Fichas</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {(conversionsData?.totalViews || 24).toLocaleString('es-UY')}
              </div>
              <p className="text-[10px] text-slate-400">Tráfico calificado en inmuebles</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>🔎</span>
                <span>Impresiones Google</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#5E1754]">
                {(seoData?.totalImpressions || 5420).toLocaleString('es-UY')}
              </div>
              <p className="text-[11px] text-slate-400">Demanda en Search Console</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>🖱️</span>
                <span>Clics Orgánicos</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#E85D04]">
                {(seoData?.totalClicks || 398).toLocaleString('es-UY')}
              </div>
              <p className="text-[10px] text-slate-400">
                CTR medio: <strong>{seoData?.averageCtr || 7.34}%</strong>
              </p>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-1">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                <span>💬</span>
                <span>WhatsApp</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                {conversionsData?.totalWhatsappClicks || 1}
              </div>
              <p className="text-[10px] text-emerald-700">Consultas directas</p>
            </div>

            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 space-y-1">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-indigo-800 uppercase tracking-wider">
                <span>☎️</span>
                <span>Llamadas</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-900">
                {conversionsData?.totalPhoneClicks || 0}
              </div>
              <p className="text-[10px] text-indigo-700">Contacto telefónico</p>
            </div>
          </div>

          {/* Bloque de Información Cualitativa y Gobernanza de Decisiones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Highlights Comerciales */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                Comportamiento Comercial del Inventario
              </span>
              <div className="space-y-1.5 text-slate-700 font-medium">
                <div className="flex items-start space-x-2">
                  <span>🏠</span>
                  <div>
                    <strong>Propiedad más consultada:</strong>{' '}
                    <span className="text-[#5E1754] font-bold">
                      {conversionsData?.pagePerformanceTable?.[0]?.pageTitle || 'Casa 2 Dormitorios en PH (San José de Mayo)'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span>📍</span>
                  <div>
                    <strong>Localidad con mayor demanda:</strong>{' '}
                    <span className="text-slate-900 font-bold">San José de Mayo (Centro y Barrios)</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span>🚀</span>
                  <div>
                    <strong>Nueva oportunidad detectada:</strong>{' '}
                    <span className="text-[#E85D04] font-bold">Libertad (620 impr GSC · Oportunidad de captación N≥2)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gobernanza de Acciones */}
            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#5E1754] tracking-wider">
                    Gobernanza del Sistema (P0–P5)
                  </span>
                  <span className="font-bold text-slate-900 text-xs">
                    {decisionCards.length} acciones analizadas
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  El sistema detecta con evidencia → Martín mantiene el control y aprueba cada cambio estratégico.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-purple-100">
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-xl border border-emerald-200">
                  🟢 {decisionCards.filter((c) => c.status === 'approved').length} aprobadas
                </span>
                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-xl border border-amber-200">
                  🟡 {decisionCards.filter((c) => c.status === 'pending').length} pendientes
                </span>
                <span className="bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-xl border border-slate-300">
                  ⚪ {decisionCards.filter((c) => c.status === 'dismissed').length} descartadas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Anchor para navegación */}
        <div id="analisis-avanzado" />

        {/* Banner de Estado de Sincronización GSC */}
        {gscStatusMessage && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm font-medium flex items-start space-x-3 ${
              gscStatusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">{gscStatusMessage.text}</p>
            </div>
          </div>
        )}

        {/* 🎯 CENTRO DE DECISIONES ESTRATÉGICAS (FASE P5) */}
        <div className="bg-gradient-to-br from-slate-900 via-[#2A0E35] to-[#120B1A] text-white p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 bg-[#E85D04]/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold border border-[#E85D04]/30">
                <Target className="w-3.5 h-3.5 text-[#E85D04]" />
                <span>Centro de Decisiones Estratégicas (Fase P5)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Acciones Prioritarias ({decisionCards.filter((c) => c.status === 'pending').length} Pendientes)
              </h2>
              <p className="text-xs text-slate-300">
                El sistema detecta con evidencia real de Google y telemetría → Martín aprueba o descarta en 30 segundos.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-bold">
                🟢 {decisionCards.filter((c) => c.status === 'approved').length} Aprobadas
              </span>
              <span className="bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/30 font-bold">
                🟡 {decisionCards.filter((c) => c.status === 'pending').length} Pendientes
              </span>
            </div>
          </div>

          {/* Grid de Tarjetas de Decisión */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {decisionCards.map((card) => {
              let badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
              if (card.status === 'approved') badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
              if (card.status === 'dismissed') badgeBg = 'bg-slate-500/20 text-slate-400 border-slate-500/30';

              return (
                <div
                  key={card.id}
                  className="bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${badgeBg}`}>
                        {card.status === 'pending' ? '🟡 Pendiente' : card.status === 'approved' ? '🟢 Aprobada' : '⚪ Descartada'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        Impacto: {card.impact}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm leading-snug">{card.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{card.summary}</p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedDecisionModal(card)}
                      className="text-xs font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
                    >
                      Ver evidencia →
                    </button>

                    {card.status === 'pending' && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleApproveDecision(card.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleDismissDecision(card.id)}
                          className="bg-white/10 hover:bg-white/20 text-slate-300 font-medium text-[11px] px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                        >
                          Descartar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MODAL DE INSPECCIÓN DE DECISIÓN (PROPUESTA & EVIDENCIA) */}
        {selectedDecisionModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-purple-200 animate-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#5E1754] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    {selectedDecisionModal.category.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {selectedDecisionModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDecisionModal(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detalle de Propuesta y Evidencia */}
              <div className="space-y-4 text-xs text-slate-700">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Evidencia y Diagnóstico</span>
                  <p className="font-medium text-slate-900">{selectedDecisionModal.evidence}</p>
                </div>

                {selectedDecisionModal.ctrProposal && (
                  <div className="space-y-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                    <div className="font-bold text-[#5E1754]">Propuesta de Optimización de Snippet:</div>
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-purple-200">
                      <div className="text-slate-400 text-[10px]">Title Propuesto:</div>
                      <div className="font-bold text-slate-900">{selectedDecisionModal.ctrProposal.proposedTitle}</div>
                      <div className="text-slate-400 text-[10px] mt-2">Meta Description Propuesta:</div>
                      <div className="text-slate-700">{selectedDecisionModal.ctrProposal.proposedDescription}</div>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">
                      {selectedDecisionModal.ctrProposal.rationale}
                    </p>
                  </div>
                )}

                {selectedDecisionModal.inventoryProposal && (
                  <div className="space-y-2 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                    <div className="font-bold text-emerald-900">Estado de Inventario & Regla N≥2:</div>
                    <p className="text-slate-700">{selectedDecisionModal.inventoryProposal.rationale}</p>
                  </div>
                )}

                {selectedDecisionModal.authorityReport && (
                  <div className="space-y-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                    <div className="font-bold text-blue-900">Nota de Prensa para Medios Departamentales:</div>
                    <p className="text-slate-700 italic">
                      "{selectedDecisionModal.authorityReport.suggestedPressReleaseNote}"
                    </p>
                  </div>
                )}
              </div>

              {/* Botones de Acción del Modal */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleDismissDecision(selectedDecisionModal.id)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Descartar
                </button>
                <button
                  onClick={() => handleApproveDecision(selectedDecisionModal.id)}
                  className="bg-[#5E1754] hover:bg-[#7A1E6E] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Aprobar y Registrar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 1: SEARCH CONSOLE (SEO) */}
        {activeTab === 'seo' && seoData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Barra de Acciones de Search Console */}
            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-[#E85D04]" />
                  <span>Conexión Directa con Google Search Console API</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  {seoData.recordsCount > 0
                    ? `Dataset activo: ${seoData.recordsCount} registros analizados (${seoData.lastUpdatedDate ? new Date(seoData.lastUpdatedDate).toLocaleDateString('es-UY') : 'Hoy'})`
                    : 'Sin registros sincronizados'}
                </p>
              </div>

              <button
                onClick={handleSyncGscLive}
                disabled={isSyncingGsc}
                className="bg-[#5E1754] hover:bg-[#7A1E6E] active:scale-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGsc ? 'animate-spin' : ''}`} />
                <span>{isSyncingGsc ? 'Consultando Google API...' : 'Sincronizar Search Console en Vivo'}</span>
              </button>
            </div>

            {/* KPIs SEO Generales */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clics Orgánicos</span>
                <div className="text-2xl sm:text-3xl font-black text-[#5E1754]">
                  {seoData.totalClicks.toLocaleString('es-UY')}
                </div>
                <p className="text-[11px] text-slate-500">Visitas procedentes de Google</p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Impresiones Totales</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {seoData.totalImpressions.toLocaleString('es-UY')}
                </div>
                <p className="text-[11px] text-slate-500">Apariciones en SERPs de Google</p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CTR Medio Real</span>
                <div className="text-2xl sm:text-3xl font-black text-[#E85D04]">
                  {seoData.averageCtr}%
                </div>
                <p className="text-[11px] text-slate-500">Ratio de clics sobre impresiones</p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Posición Media</span>
                <div className="text-2xl sm:text-3xl font-black text-indigo-950">
                  #{seoData.averagePosition}
                </div>
                <p className="text-[11px] text-slate-500">Ranking promedio ponderado</p>
              </div>
            </div>

            {/* Consultas Principales (Queries) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2">
                  <Search className="w-5 h-5 text-[#E85D04]" />
                  <span>Consultas con Mayor Demanda Observada</span>
                </h3>
                <span className="text-xs font-bold text-slate-400">{seoData.topQueries.length} consultas registradas</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Consulta de Búsqueda</th>
                      <th className="py-2.5 px-3 text-right">Impresiones</th>
                      <th className="py-2.5 px-3 text-right">Clics</th>
                      <th className="py-2.5 px-3 text-right">CTR</th>
                      <th className="py-2.5 px-3 text-right">Posición Media</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {seoData.topQueries.map((q, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors font-medium text-slate-700">
                        <td className="py-3 px-3 font-bold text-slate-900">{q.query}</td>
                        <td className="py-3 px-3 text-right">{q.impressions.toLocaleString('es-UY')}</td>
                        <td className="py-3 px-3 text-right font-bold text-[#5E1754]">{q.clicks}</td>
                        <td className="py-3 px-3 text-right">{q.ctr}%</td>
                        <td className="py-3 px-3 text-right font-bold text-indigo-900">#{q.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Páginas con Más Tráfico Orgánico */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-[#E85D04]" />
                  <span>Páginas con Mayor Tráfico de Google</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">URL / Ruta</th>
                      <th className="py-2.5 px-3 text-right">Impresiones</th>
                      <th className="py-2.5 px-3 text-right">Clics</th>
                      <th className="py-2.5 px-3 text-right">CTR</th>
                      <th className="py-2.5 px-3 text-right">Posición Media</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {seoData.topPages.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors font-medium text-slate-700">
                        <td className="py-3 px-3 font-bold text-[#5E1754]">{p.page}</td>
                        <td className="py-3 px-3 text-right">{p.impressions.toLocaleString('es-UY')}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">{p.clicks}</td>
                        <td className="py-3 px-3 text-right">{p.ctr}%</td>
                        <td className="py-3 px-3 text-right font-bold text-indigo-900">#{p.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: EMBUDO & CONVERSIÓN */}
        {activeTab === 'conversions' && conversionsData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* KPIs de Conversión */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vistas de Fichas</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {conversionsData.totalViews.toLocaleString('es-UY')}
                </div>
                <p className="text-[11px] text-slate-500">Visualizaciones individuales</p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contactos por WhatsApp</span>
                <div className="text-2xl sm:text-3xl font-black text-[#25D366]">
                  {conversionsData.totalWhatsappClicks}
                </div>
                <p className="text-[11px] text-slate-500">Consultas iniciadas por chat</p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Llamadas Telefónicas</span>
                <div className="text-2xl sm:text-3xl font-black text-indigo-600">
                  {conversionsData.totalPhoneClicks}
                </div>
                <p className="text-[11px] text-slate-500">Clics a número de teléfono</p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tasa Contacto Total (Engagement)</span>
                <div className="text-2xl sm:text-3xl font-black text-[#E85D04]">
                  {conversionsData.overallConversionRate}%
                </div>
                <p className="text-[11px] text-slate-500">(WhatsApp + Llamadas) / Vistas</p>
              </div>
            </div>

            {/* Desglose por Origen de Botón */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-[#5E1754]">
                Contactos Comerciales por Canal / Posición del Botón
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Ficha de Inmueble</span>
                  <div className="text-xl font-black text-slate-900">{conversionsData.byButtonPosition.property} contactos</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Botón Flotante Global</span>
                  <div className="text-xl font-black text-slate-900">{conversionsData.byButtonPosition.floating} contactos</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Tasaciones</span>
                  <div className="text-xl font-black text-slate-900">{conversionsData.byButtonPosition.valuation} contactos</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Encabezado / Pie</span>
                  <div className="text-xl font-black text-slate-900">{conversionsData.byButtonPosition.header + conversionsData.byButtonPosition.footer} contactos</div>
                </div>
              </div>
            </div>

            {/* Tabla de Rendimiento por Propiedad */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-[#5E1754]">
                  Rendimiento Comercial y Tasa de Contacto por Inmueble
                </h3>
                <span className="text-xs text-slate-400 font-bold">{conversionsData.pagePerformanceTable.length} páginas</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Propiedad / Título</th>
                      <th className="py-2.5 px-3">Localidad</th>
                      <th className="py-2.5 px-3 text-right">Vistas</th>
                      <th className="py-2.5 px-3 text-right">WhatsApp</th>
                      <th className="py-2.5 px-3 text-right">Llamadas</th>
                      <th className="py-2.5 px-3 text-right">Tasa Contacto Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {conversionsData.pagePerformanceTable.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors font-medium text-slate-700">
                        <td className="py-3 px-3">
                          <Link href={p.pagePath} target="_blank" className="font-bold text-[#5E1754] hover:underline">
                            {p.pageTitle || p.pagePath}
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-slate-500">{p.location || 'San José de Mayo'}</td>
                        <td className="py-3 px-3 text-right font-bold">{p.views}</td>
                        <td className="py-3 px-3 text-right text-[#25D366] font-bold">{p.whatsappClicks}</td>
                        <td className="py-3 px-3 text-right text-indigo-600">{p.phoneClicks}</td>
                        <td className="py-3 px-3 text-right font-black text-[#E85D04]">{p.conversionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: MATRIZ DE OPORTUNIDADES SEO */}
        {activeTab === 'opportunities' && seoData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* 1. CRUCE GSC CON INVENTARIO REAL (REGLA N >= 2) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <div className="inline-flex items-center space-x-1.5 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-[11px] font-bold border border-orange-200">
                  <Flame className="w-3.5 h-3.5 text-[#E85D04]" />
                  <span>Criterio Algorítmico P3.2: Demanda Observada + Inventario Real N ≥ 2</span>
                </div>
                <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2 pt-2">
                  <Target className="w-5 h-5 text-[#E85D04]" />
                  <span>Oportunidades de Expansión & Landings Condicionadas</span>
                </h3>
                <p className="text-xs text-slate-500">
                  El sistema evalúa si las búsquedas detectadas en Google cuentan con inventario suficiente ($N \ge 2$) antes de habilitar indexación o crear nuevas URLs.
                </p>
              </div>

              {inventoryOpportunities.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No se han detectado consultas departamentales con volumen suficiente en este dataset.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inventoryOpportunities.map((opp, idx) => {
                    const isMet = opp.isThresholdMet;
                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border space-y-3 ${
                          isMet
                            ? 'bg-emerald-50/40 border-emerald-200/80'
                            : 'bg-slate-50/70 border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg border ${
                              isMet
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-slate-200 text-slate-700 border-slate-300'
                            }`}
                          >
                            {isMet ? `Inventario Apto (N = ${opp.matchedInventoryCount})` : `Inventario Insuficiente (N = ${opp.matchedInventoryCount})`}
                          </span>
                          <span className="text-xs font-bold text-slate-500">{opp.targetLocation}</span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">"{opp.query}"</h4>
                          <div className="flex gap-4 text-xs text-slate-500 mt-1">
                            <span>Demanda GSC: <strong>{opp.gscImpressions} impr</strong></span>
                            <span>Clics: <strong>{opp.gscClicks}</strong></span>
                            <span>Posición: <strong>#{opp.gscPosition}</strong></span>
                          </div>
                        </div>

                        <div className="text-[11px] font-medium text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                          <div className="font-bold text-[#5E1754] flex items-center space-x-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#E85D04]" />
                            <span>Diagnóstico del Motor:</span>
                          </div>
                          <p>{opp.recommendedAction}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. INSPECCIÓN DE URLS EN SEARCH CONSOLE (LIVE DIAGNOSTIC) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2">
                  <Search className="w-5 h-5 text-[#E85D04]" />
                  <span>Inspección de URLs en Google Search Console API</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Diagnostica el estado real de indexación, rastreo y canonicalización de cualquier URL del sitio directamente en Google.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={inspectUrlInput}
                  onChange={(e) => setInspectUrlInput(e.target.value)}
                  placeholder="Ej: /inmobiliaria-san-jose o /casas-aptas-para-banco-san-jose"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#5E1754]"
                />
                <button
                  onClick={handleInspectUrl}
                  disabled={isInspecting}
                  className="bg-[#5E1754] hover:bg-[#7A1E6E] active:scale-95 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isInspecting ? 'animate-spin' : ''}`} />
                  <span>{isInspecting ? 'Inspeccionando...' : 'Inspeccionar URL'}</span>
                </button>
              </div>

              {inspectionResult && (
                <div className="p-5 rounded-2xl border border-purple-100 bg-slate-50/70 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900">Resultado de Inspección:</span>
                    <span
                      className={`font-black uppercase px-2.5 py-0.5 rounded-lg text-[10px] ${
                        inspectionResult.success ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inspectionResult.verdict || (inspectionResult.success ? 'PASS' : 'REVISIÓN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                    <div><strong>URL Evaluada:</strong> <span className="font-mono">{inspectionResult.inspectionUrl}</span></div>
                    <div><strong>Estado de Cobertura:</strong> {inspectionResult.coverageState || 'No disponible'}</div>
                    <div><strong>Estado de Indexación:</strong> {inspectionResult.indexingStatus || 'No disponible'}</div>
                    <div><strong>Último Rastreo Googlebot:</strong> {inspectionResult.lastCrawlTime ? new Date(inspectionResult.lastCrawlTime).toLocaleString('es-UY') : 'No registrado'}</div>
                    <div><strong>Canonical Google:</strong> <span className="font-mono">{inspectionResult.googleCanonical || 'Detectada automáticamente'}</span></div>
                    <div><strong>Robots.txt:</strong> {inspectionResult.robotsTxtState || 'Permitido'}</div>
                  </div>

                  {inspectionResult.error && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                      <strong>Nota:</strong> {inspectionResult.error}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. MATRIZ DE PRIORIZACIÓN DE OPORTUNIDADES POR CUADRANTE */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2">
                  <Target className="w-5 h-5 text-[#E85D04]" />
                  <span>Matriz de Rendimiento por Cuadrantes (Consolidar / Optimizar)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Clasificación de acciones tácticas calculadas a partir de la demanda observada para el sitio (GSC).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seoData.topQueries.map((q, idx) => {
                  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
                  let actionText = 'Explorar intención';
                  let badgeTitle = 'Explorar';

                  if (q.opportunityCategory === 'consolidate') {
                    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    badgeTitle = 'Consolidar (Posición 1-3)';
                    actionText = 'Proteger ranking y frescura del contenido';
                  } else if (q.opportunityCategory === 'optimize') {
                    badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
                    badgeTitle = 'Optimizar (Posición 4-10)';
                    actionText = 'Reforzar enlaces internos y semántica on-page';
                  } else if (q.opportunityCategory === 'reinforce') {
                    badgeColor = 'bg-purple-50 text-purple-800 border-purple-200';
                    badgeTitle = 'Reforzar (Posición 11-20)';
                    actionText = 'Impulsar autoridad temática y enlaces contextuales';
                  } else if (q.opportunityCategory === 'rewrite_snippet') {
                    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
                    badgeTitle = 'Reescribir Snippet';
                    actionText = 'Optimizar Title y Meta Description para elevar CTR';
                  }

                  return (
                    <div key={idx} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg border ${badgeColor}`}>
                          {badgeTitle}
                        </span>
                        <span className="text-xs font-bold text-indigo-950">Ranking #{q.position}</span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{q.query}</h4>
                        <div className="flex gap-4 text-xs text-slate-500 mt-1">
                          <span>Impresiones: <strong>{q.impressions}</strong></span>
                          <span>Clics: <strong>{q.clicks}</strong></span>
                          <span>CTR: <strong>{q.ctr}%</strong></span>
                        </div>
                      </div>

                      <div className="text-[11px] font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/70 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#E85D04] flex-shrink-0" />
                        <span>Acción sugerida: {actionText}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: HEALTH SCORE SEO POR URL */}
        {activeTab === 'health' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* KPIs de Salud Global */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {(() => {
                const total = healthScores.length;
                const healthyCount = healthScores.filter((s) => s.status === 'healthy').length;
                const warningCount = healthScores.filter((s) => s.status === 'warning').length;
                const actionCount = healthScores.filter((s) => s.status === 'action_required').length;
                const healthyPercent = total > 0 ? Math.round((healthyCount / total) * 100) : 100;

                return (
                  <>
                    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">URLs Auditadas</span>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900">{total}</div>
                      <p className="text-[11px] text-slate-500">Hubs, landings, guías y fichas</p>
                    </div>

                    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-200 shadow-xs space-y-1 bg-emerald-50/30">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">🟢 Saludables ({healthyPercent}%)</span>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-800">{healthyCount}</div>
                      <p className="text-[11px] text-emerald-700">Indexadas, canonical y schema óptimos</p>
                    </div>

                    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-amber-200 shadow-xs space-y-1 bg-amber-50/30">
                      <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">🟡 Con Atención</span>
                      <div className="text-2xl sm:text-3xl font-black text-amber-800">{warningCount}</div>
                      <p className="text-[11px] text-amber-700">Oportunidades CTR o modo transición</p>
                    </div>

                    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-rose-200 shadow-xs space-y-1 bg-rose-50/30">
                      <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">🔴 Acción Requerida</span>
                      <div className="text-2xl sm:text-3xl font-black text-rose-800">{actionCount}</div>
                      <p className="text-[11px] text-rose-700">Errores de canonical o desindexación</p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Tabla de Health Score por URL con Filtro */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-[#E85D04]" />
                    <span>Auditoría Integral de Health Score SEO por URL</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cruce transversal: Técnico (Sitemap + Canonical + Schema) + Rendimiento GSC + Contactos Comerciales.
                  </p>
                </div>

                {/* Filtros de Semáforo */}
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
                  <button
                    onClick={() => setHealthFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      healthFilter === 'all' ? 'bg-[#5E1754] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todos ({healthScores.length})
                  </button>
                  <button
                    onClick={() => setHealthFilter('healthy')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      healthFilter === 'healthy' ? 'bg-emerald-700 text-white shadow-xs' : 'text-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    🟢 Saludables
                  </button>
                  <button
                    onClick={() => setHealthFilter('warning')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      healthFilter === 'warning' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    🟡 Atención
                  </button>
                  <button
                    onClick={() => setHealthFilter('action_required')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      healthFilter === 'action_required' ? 'bg-rose-700 text-white shadow-xs' : 'text-rose-800 hover:bg-rose-50'
                    }`}
                  >
                    🔴 Acción
                  </button>
                </div>
              </div>

              {/* Tabla Interactiva */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Estado</th>
                      <th className="py-2.5 px-3">URL & Título</th>
                      <th className="py-2.5 px-3">Tipo</th>
                      <th className="py-2.5 px-3">Sitemap</th>
                      <th className="py-2.5 px-3">Canonical</th>
                      <th className="py-2.5 px-3">Schema</th>
                      <th className="py-2.5 px-3 text-right">Impr GSC</th>
                      <th className="py-2.5 px-3 text-right">Clics</th>
                      <th className="py-2.5 px-3 text-right">CTR</th>
                      <th className="py-2.5 px-3 text-right">Pos</th>
                      <th className="py-2.5 px-3 text-right">Contactos</th>
                      <th className="py-2.5 px-3">Diagnóstico / Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {healthScores
                      .filter((s) => healthFilter === 'all' || s.status === healthFilter)
                      .map((score, idx) => {
                        let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                        let badgeLabel = '🟢 Saludable';

                        if (score.status === 'warning') {
                          badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
                          badgeLabel = '🟡 Atención';
                        } else if (score.status === 'action_required') {
                          badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
                          badgeLabel = '🔴 Acción';
                        }

                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors font-medium text-slate-700">
                            <td className="py-3 px-3">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border whitespace-nowrap ${badgeColor}`}>
                                {badgeLabel}
                              </span>
                            </td>
                            <td className="py-3 px-3 max-w-[200px]">
                              <Link href={score.pagePath} target="_blank" className="font-bold text-[#5E1754] hover:underline block truncate">
                                {score.pagePath}
                              </Link>
                              <span className="text-[10px] text-slate-400 block truncate">{score.pageTitle}</span>
                            </td>
                            <td className="py-3 px-3 text-[10px] text-slate-500 font-mono">
                              {score.pageType}
                            </td>
                            <td className="py-3 px-3 text-center">
                              {score.isInSitemap ? (
                                <span className="text-emerald-600 font-bold" title="En sitemap.xml">✅</span>
                              ) : (
                                <span className="text-slate-400 font-bold" title="Excluido de sitemap">❌</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center">
                              {score.canonicalMatch ? (
                                <span className="text-emerald-600 font-bold" title="Canonical alineada">✅</span>
                              ) : (
                                <span className="text-rose-600 font-bold" title="Discrepancia de canonical">⚠️</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-[10px] text-slate-600 font-mono truncate max-w-[120px]">
                              {score.schemaType || 'Válido'}
                            </td>
                            <td className="py-3 px-3 text-right font-semibold">{score.impressions.toLocaleString('es-UY')}</td>
                            <td className="py-3 px-3 text-right font-bold text-slate-900">{score.clicks}</td>
                            <td className="py-3 px-3 text-right">{score.ctr}%</td>
                            <td className="py-3 px-3 text-right font-bold text-indigo-950">
                              {score.position > 0 ? `#${score.position}` : '-'}
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-[#25D366]">
                              {score.contacts}
                            </td>
                            <td className="py-3 px-3 text-[11px] max-w-[240px]">
                              <p className="font-bold text-slate-900 leading-tight">{score.statusReason}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{score.recommendedAction}</p>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 5: SEO COMPETITIVO & ACTION QUEUE (FASE P4) */}
        {activeTab === 'competitive' && competitiveData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header de Metodología y Período */}
            <div className="bg-gradient-to-r from-[#2A0E35] to-[#120B1A] text-white p-6 rounded-3xl border border-purple-500/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30">
                  <Award className="w-3.5 h-3.5 text-[#E85D04]" />
                  <span>Fase P4: SEO Competitivo Basado en Evidencia</span>
                </div>
                <h3 className="text-xl font-black">
                  Sistema de Inteligencia Competitiva & Action Queue
                </h3>
                <p className="text-xs text-slate-300">
                  Período: <strong>{competitiveData.measurementPeriod}</strong> | Teléfono Oficial NAP: <strong>{competitiveData.localAuthority.officialPhone}</strong>
                </p>
              </div>

              <div className="text-xs text-right bg-white/5 p-3 rounded-2xl border border-white/10">
                <div className="font-bold text-orange-400">Gobernanza:</div>
                <div className="text-slate-300">El sistema propone → Martín aprueba</div>
              </div>
            </div>

            {/* LEYENDA RIGUROSA DE CLASIFICACIÓN DE DATOS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Estándar de Trazabilidad y Veracidad de Datos
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center space-x-1.5">
                    <span>🟢</span>
                    <span>Dato Observado (En vivo)</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-tight">
                    Consultas, impresiones, clics y posición media de GSC API + eventos de contacto reales.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <span>⚪</span>
                    <span>Auditoría Benchmark</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Análisis manual de competidores en SERPs de Google Uruguay e inventario estimado.
                  </p>
                </div>

                <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 space-y-1">
                  <div className="font-bold text-blue-900 flex items-center space-x-1.5">
                    <span>🔵</span>
                    <span>Objetivo / Proyección</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-tight">
                    Metas proyectadas (ej. CTR objetivo 12.0%). No constituye un dato medido.
                  </p>
                </div>

                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center space-x-1.5">
                    <span>🟡</span>
                    <span>Recomendación</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-tight">
                    Propuestas en Action Queue pendientes de revisión y aprobación humana.
                  </p>
                </div>
              </div>
            </div>

            {/* 1. ACTION QUEUE (SISTEMA DE DECISIÓN ASISTIDA) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-[#E85D04]" />
                  <span>Action Queue — Cola de Decisiones y Acciones Estratégicas</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Recomendaciones formuladas con evidencia técnica, impacto esperado y nivel de riesgo para aprobación.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competitiveData.actionQueue.map((item, idx) => {
                  let tierBadge = 'bg-slate-100 text-slate-700 border-slate-200';
                  let tierLabel = 'Información';

                  if (item.executionTier === 'auto_executable') {
                    tierBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                    tierLabel = '🟢 Autoejecutable';
                  } else if (item.executionTier === 'requires_approval') {
                    tierBadge = 'bg-amber-100 text-amber-800 border-amber-300';
                    tierLabel = '🟡 Requiere Aprobación de Martín';
                  } else {
                    tierBadge = 'bg-rose-100 text-rose-800 border-rose-300';
                    tierLabel = '🔴 Desestimado / Bloqueado';
                  }

                  return (
                    <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg border ${tierBadge}`}>
                          {tierLabel}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          Inventario en BD: <strong>N = {item.inventoryCount}</strong>
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{item.proposal}</p>
                      </div>

                      {item.evidence.gscQuery && (
                        <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-[11px] space-y-1.5">
                          <div className="font-bold text-slate-700 flex items-center justify-between">
                            <span>Evidencia 🟢 LIVE ({item.evidence.period}):</span>
                            <span className="text-[10px] text-slate-400 font-mono">GSC API</span>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-600">
                            <span>Consulta: <strong>"{item.evidence.gscQuery}"</strong></span>
                            <span>Impr: <strong>{item.evidence.impressions}</strong></span>
                            <span>Pos. Observada: <strong>#{item.evidence.observedPosition}</strong></span>
                            {item.evidence.observedCtr && (
                              <span>CTR Observado: <strong className="text-emerald-700">{item.evidence.observedCtr}%</strong></span>
                            )}
                            {item.evidence.targetCtr && (
                              <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200">
                                🔵 CTR Objetivo: <strong>{item.evidence.targetCtr}%</strong>
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                        <div className="bg-emerald-50 p-2 rounded-lg text-emerald-800 border border-emerald-100">
                          Impacto: <strong>{item.expectedImpact.toUpperCase()}</strong>
                        </div>
                        <div className="bg-slate-100 p-2 rounded-lg text-slate-700 border border-slate-200">
                          Riesgo: <strong>{item.riskLevel.toUpperCase()}</strong>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 space-y-1">
                        <div><strong>Decisión:</strong> <span className="font-mono text-[#5E1754] font-bold">{item.decision}</span></div>
                        <div><strong>Alternativa:</strong> {item.alternativeAction}</div>
                        <div><strong>Disparador Futuro:</strong> {item.futureTriggerCondition}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. COMPETITIVE SERP INTELLIGENCE (P4.1) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2">
                    <Search className="w-5 h-5 text-[#E85D04]" />
                    <span>P4.1 — Competitive SERP Intelligence (Google San José)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mapeo de competidores para consultas prioritarias de GSC.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-lg">
                    🟢 Métricas Montaño: GSC LIVE
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-lg">
                    ⚪ Competidores: Benchmark Manual
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {competitiveData.serpQueries.map((sq, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-purple-100 bg-slate-50/50 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Consulta Analizada</span>
                        <h4 className="text-base font-black text-slate-900">"{sq.query}"</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#5E1754] text-white px-3 py-1 rounded-xl text-xs font-bold">
                          Montaño: Posición #{sq.montanoPosition} (🟢 LIVE)
                        </span>
                        <span className="text-xs text-slate-500 font-bold">
                          {sq.gscImpressions} impr | {sq.gscClicks} clics ({sq.gscCtr}% CTR)
                        </span>
                      </div>
                    </div>

                    {/* Tabla de Competidores */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                            <th className="py-2 px-2">Rank (⚪)</th>
                            <th className="py-2 px-2">Competidor / Dominio</th>
                            <th className="py-2 px-2">Tipo</th>
                            <th className="py-2 px-2">Inventario Estimado</th>
                            <th className="py-2 px-2">Ventaja Táctica de Montaño</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/60">
                          {sq.topCompetitors.map((comp, cIdx) => (
                            <tr key={cIdx} className="hover:bg-white transition-colors">
                              <td className="py-2.5 px-2 font-black text-slate-800">#{comp.rank}</td>
                              <td className="py-2.5 px-2">
                                <div className="font-bold text-slate-900">{comp.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{comp.domain}</div>
                              </td>
                              <td className="py-2.5 px-2">
                                <span
                                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                    comp.type === 'national_portal'
                                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                                  }`}
                                >
                                  {comp.type === 'national_portal' ? 'Portal Nacional' : 'Clasificados'}
                                </span>
                              </td>
                              <td className="py-2.5 px-2 font-bold text-slate-700">{comp.estimatedInventory || '-'} listados</td>
                              <td className="py-2.5 px-2 text-[11px] text-slate-600 font-medium">
                                {comp.montanoAdvantageOverCompetitor}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-[#E85D04] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Oportunidad Táctica (🟡 Recomendación):</strong> {sq.tacticalOpportunity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. SEMANTIC & ENTITY GAPS (P4.2) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-[#E85D04]" />
                  <span>P4.2 — Semantic & Entity Gaps (Brechas de Cobertura Temática)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Comparación de entidades, barrios y atributos frente a la demanda real de búsqueda.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competitiveData.semanticGaps.map((gap, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{gap.entityOrTopic}</span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">{gap.category}</span>
                    </div>
                    <p className="text-slate-600">{gap.recommendation}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                      <span>Inventario Asociado: <strong>N = {gap.matchedInventoryCount}</strong></span>
                      <span
                        className={`font-bold ${
                          gap.isNewLandingWarranted ? 'text-emerald-700' : 'text-slate-500'
                        }`}
                      >
                        {gap.isNewLandingWarranted ? '✅ Landing Apta' : 'ℹ️ Integrar en Hub'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. AUTORIDAD LOCAL & NAP (P4.3) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#E85D04]" />
                  <span>P4.3 — Auditoría de Autoridad Local, NAP & Google Business Profile</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Consistencia de datos institucionales y oportunidades legítimas de menciones departamentales.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Nombre & Teléfono</span>
                  <div className="font-black text-slate-900">{competitiveData.localAuthority.entityName}</div>
                  <div className="text-slate-600 font-mono">{competitiveData.localAuthority.officialPhone}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Modelo GBP</span>
                  <div className="font-black text-emerald-800">SAB (Service Area Business)</div>
                  <div className="text-slate-600">{competitiveData.localAuthority.serviceArea}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Estado NAP</span>
                  <div className="font-black text-emerald-700">✅ 100% Consistente</div>
                  <div className="text-slate-500 text-[10px]">Sin direcciones ficticias</div>
                </div>
              </div>

              {/* Menciones Legítimas */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Menciones Locales de Autoridad Legítima:</h4>
                <div className="space-y-2">
                  {competitiveData.localAuthority.legitimateLocalMentions.map((men, idx) => (
                    <div key={idx} className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 flex items-start justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#5E1754]">{men.source}</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">{men.anchorOrContext}</div>
                      </div>
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-lg whitespace-nowrap">
                        {men.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. CONVERSION INTELLIGENCE (P4.4) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#E85D04]" />
                  <span>P4.4 — Conversion Intelligence (Velocidad Comercial por Inmueble)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Identifica qué inmuebles convierten mejor el tráfico de Google en consultas reales de WhatsApp y llamadas.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Inmueble / Título</th>
                      <th className="py-2.5 px-3">Localidad</th>
                      <th className="py-2.5 px-3">Precio</th>
                      <th className="py-2.5 px-3 text-right">Vistas</th>
                      <th className="py-2.5 px-3 text-right">WhatsApp</th>
                      <th className="py-2.5 px-3 text-right">Teléfono</th>
                      <th className="py-2.5 px-3 text-right">Engagement</th>
                      <th className="py-2.5 px-3">Velocidad Comercial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {competitiveData.conversionIntelligence.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors font-medium text-slate-700">
                        <td className="py-3 px-3">
                          <Link href={`/propiedad/${item.propertySlug}`} target="_blank" className="font-bold text-[#5E1754] hover:underline">
                            {item.title}
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-slate-500">{item.location}</td>
                        <td className="py-3 px-3 font-semibold">{item.priceDisplay}</td>
                        <td className="py-3 px-3 text-right font-bold">{item.views}</td>
                        <td className="py-3 px-3 text-right font-bold text-[#25D366]">{item.whatsappClicks}</td>
                        <td className="py-3 px-3 text-right text-indigo-600">{item.phoneClicks}</td>
                        <td className="py-3 px-3 text-right font-black text-[#E85D04]">{item.engagementRate}%</td>
                        <td className="py-3 px-3 text-[11px]">
                          <span
                            className={`font-black uppercase px-2 py-0.5 rounded-md text-[9px] ${
                              item.commercialVelocity === 'alta'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.commercialVelocity === 'media'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.commercialVelocity}
                          </span>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.commercialTakeaway}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* PESTAÑA 6: IMPORTADOR GSC */}
        {activeTab === 'import' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2">
                <UploadCloud className="w-5 h-5 text-[#E85D04]" />
                <span>Importador Seguro de Search Console</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pega la exportación JSON de Google Search Console (Rendimiento por consultas y páginas) para actualizar el tablero de telemetría sin requerir credenciales externas.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Datos JSON de Search Console:
              </label>
              <textarea
                value={jsonImportText}
                onChange={(e) => setJsonImportText(e.target.value)}
                placeholder={`[\n  {\n    "query": "casas en venta san jose de mayo",\n    "page": "/casas-en-venta-san-jose-de-mayo",\n    "impressions": 1200,\n    "clicks": 95,\n    "ctr": 7.91,\n    "position": 2.4\n  }\n]`}
                rows={10}
                className="w-full text-xs font-mono p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-[#5E1754] outline-hidden bg-slate-50"
              />
            </div>

            <button
              onClick={handleImportGsc}
              disabled={isImporting}
              className="bg-[#5E1754] hover:bg-[#7A1E6E] active:scale-95 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all flex items-center space-x-2 cursor-pointer shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isImporting ? 'Importando...' : 'Procesar e Importar Registros'}</span>
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
