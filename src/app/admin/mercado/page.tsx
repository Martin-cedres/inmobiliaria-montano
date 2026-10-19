'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UserSessionPayload } from '@/types/user';
import {
  MarketListing,
  MarketListingStatus,
  MarketKpis,
  PriceDropOpportunity,
  WeeklyExecutiveReportData,
  MarketRadarFilters,
} from '@/types/market';
import { MarketKpiStrip } from '@/components/admin/market/MarketKpiStrip';
import { CaptacionRadarToolbar } from '@/components/admin/market/CaptacionRadarToolbar';
import { CaptacionRadarTable } from '@/components/admin/market/CaptacionRadarTable';
import { PriceDropModule } from '@/components/admin/market/PriceDropModule';
import { ExecutiveWeeklyReport } from '@/components/admin/market/ExecutiveWeeklyReport';
import {
  Building2,
  Plus,
  TrendingUp,
  Flame,
  Sparkles,
  Eye,
  RefreshCw,
  Radar,
  TrendingDown,
  FileText,
  ShieldCheck,
  LogOut,
  Users,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const INITIAL_FILTERS: MarketRadarFilters = {
  search: '',
  neighborhood: 'todos',
  category: 'todos',
  origin: 'todos',
  operation: 'todos',
  status: 'todos',
};

export default function AdminMercadoPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSessionPayload | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<'radar' | 'pricedrops' | 'report'>('radar');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Datos
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [kpis, setKpis] = useState<MarketKpis | null>(null);
  const [priceDrops, setPriceDrops] = useState<PriceDropOpportunity[]>([]);
  const [reports, setReports] = useState<WeeklyExecutiveReportData[]>([]);

  // Filtros del Radar
  const [filters, setFilters] = useState<MarketRadarFilters>(INITIAL_FILTERS);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/market');
      const data = await res.json();
      if (data.success && data.data) {
        setListings(data.data.listings || []);
        setKpis(data.data.kpis || null);
        setPriceDrops(data.data.priceDrops || []);
        setReports(data.data.reports || []);
      } else {
        showToast('Error al cargar datos del mercado');
      }
    } catch (err) {
      console.error('Error cargando datos de mercado:', err);
      showToast('Error de conexión al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleRunScan = async () => {
    setIsScanning(true);
    showToast('Iniciando escaneo de portales en vivo para San José...');
    try {
      const res = await fetch('/api/admin/market/scan', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data) {
        setListings(data.data.listings || []);
        setKpis(data.data.kpis || null);
        setPriceDrops(data.data.priceDrops || []);
        setReports(data.data.reports || []);
        showToast('Escaneo completado: Base de datos y radar actualizados');
      } else {
        showToast(data.error || 'Error al ejecutar escaneo');
      }
    } catch (err) {
      console.error('Error al escanear mercado:', err);
      showToast('Error de red al ejecutar escaneo');
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
          setIsAuthChecking(false);
          fetchMarketData();
        } else {
          router.replace('/login');
        }
      })
      .catch(() => {
        router.replace('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/login');
    } catch {
      window.location.href = '/login';
    }
  };

  const handleStatusChange = async (id: string, newStatus: MarketListingStatus) => {
    try {
      const res = await fetch(`/api/admin/market/listing/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
        showToast(`Estado actualizado a "${newStatus.replace('_', ' ').toUpperCase()}"`);
      } else {
        showToast(data.error || 'No se pudo actualizar el estado');
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      showToast('Error de red al actualizar estado');
    }
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    try {
      const listing = listings.find((l) => l.id === id);
      const res = await fetch(`/api/admin/market/listing/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: listing?.status || 'detectado', internalNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, internalNotes: notes } : l))
        );
        showToast('Notas de gestión guardadas');
      }
    } catch (err) {
      console.error('Error guardando notas:', err);
      showToast('Error de red al guardar notas');
    }
  };

  // Filtrado de avisos
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      // Búsqueda por texto
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          l.title.toLowerCase().includes(q) ||
          l.neighborhood.toLowerCase().includes(q) ||
          (l.contactName && l.contactName.toLowerCase().includes(q)) ||
          (l.contactPhone && l.contactPhone.toLowerCase().includes(q)) ||
          (l.internalNotes && l.internalNotes.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Zona
      if (filters.neighborhood !== 'todos' && l.neighborhood !== filters.neighborhood) {
        return false;
      }

      // Categoría
      if (filters.category !== 'todos' && l.category !== filters.category) {
        return false;
      }

      // Origen
      if (filters.origin !== 'todos' && l.origin !== filters.origin) {
        return false;
      }

      // Operación
      if (filters.operation !== 'todos' && l.operation !== filters.operation) {
        return false;
      }

      // Estado
      if (filters.status !== 'todos' && l.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [listings, filters]);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Verificando credenciales...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Header />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#350A2F] text-amber-300 px-5 py-3.5 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center space-x-3 text-xs sm:text-sm font-bold animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Barra de Sesión de Usuario */}
        {currentUser && (
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-md">
            <div className="flex items-center gap-3">
              {currentUser.image ? (
                <img
                  src={currentUser.image}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{currentUser.name}</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      currentUser.role === 'superadmin'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">{currentUser.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                <Building2 className="w-4 h-4 text-orange-400" />
                <span>Panel Catálogo</span>
              </Link>
              {currentUser.role === 'superadmin' && (
                <Link
                  href="/admin/usuarios"
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Gestionar Usuarios</span>
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/40 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}

        {/* Barra Rápida de Módulos */}
        <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl transition-all shrink-0"
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>1. Catálogo Inmuebles</span>
          </Link>
          <Link
            href="/admin/nueva"
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl transition-all shrink-0"
          >
            <Plus className="w-4 h-4 text-[#E85D04]" />
            <span>2. Nueva Propiedad</span>
          </Link>
          <Link
            href="/admin/mercado"
            className="flex items-center gap-1.5 bg-[#5E1754] text-white px-3.5 py-2 rounded-xl shadow-xs shrink-0"
          >
            <Radar className="w-4 h-4 text-orange-400" />
            <span>3. Inteligencia de Mercado</span>
          </Link>
          <Link
            href="/admin/seo-conversiones"
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl transition-all shrink-0"
          >
            <TrendingUp className="w-4 h-4 text-purple-700" />
            <span>4. SEO & Decisiones</span>
          </Link>
          <Link
            href="/estadisticas-inmobiliarias-san-jose"
            target="_blank"
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl transition-all shrink-0"
          >
            <Flame className="w-4 h-4 text-amber-600" />
            <span>5. Observatorio San José</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl transition-all shrink-0 ml-auto"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Ver Web Pública</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Encabezado del Módulo de Mercado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-xs">
          <div>
            <div className="flex items-center space-x-2 text-[#E85D04] font-bold text-xs uppercase tracking-wider mb-1">
              <Radar className="w-4 h-4 text-[#5E1754]" />
              <span>Inteligencia de Mercado Departamental</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Radar de Captación & Benchmarking
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Monitoreo activo de avisos particulares (Dueño Vende), rebajas de precios de competidores y cuota de mercado en San José de Mayo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRunScan}
              disabled={isScanning || isLoading}
              className="bg-[#E85D04] hover:bg-[#d05303] active:scale-95 disabled:opacity-60 text-white font-bold px-4 py-3 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer shrink-0"
              title="Rastrear y actualizar la oferta real de San José en vivo"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Escaneando Mercado...' : 'Escanear Mercado en Vivo'}</span>
            </button>

            <button
              type="button"
              onClick={fetchMarketData}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Recargar datos del mercado"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              href="/estadisticas-inmobiliarias-san-jose"
              target="_blank"
              className="flex-1 sm:flex-initial bg-[#5E1754] hover:bg-[#7A1E6E] active:scale-95 text-white font-bold px-4 py-3 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Observatorio Público</span>
            </Link>
          </div>
        </div>

        {/* KPI Strip (4 Tarjetas sin emojis) */}
        {kpis && <MarketKpiStrip kpis={kpis} />}

        {/* Barra de Pestañas / Navegación Interna */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('radar')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'radar'
                ? 'bg-[#5E1754] text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radar className="w-4 h-4 text-orange-400" />
            <span>Radar de Captación ({listings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricedrops')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pricedrops'
                ? 'bg-[#5E1754] text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span>Rebajas de Competidores ({priceDrops.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-[#5E1754] text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-500" />
            <span>Informe Ejecutivo Semanal</span>
          </button>
        </div>

        {/* Contenido según Pestaña Activa */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#5E1754]" />
            <span className="font-bold text-sm">Cargando inteligencia de mercado...</span>
          </div>
        ) : (
          <>
            {activeTab === 'radar' && (
              <div className="space-y-4">
                <CaptacionRadarToolbar
                  filters={filters}
                  onChange={setFilters}
                  onReset={() => setFilters(INITIAL_FILTERS)}
                  totalFiltered={filteredListings.length}
                />
                <CaptacionRadarTable
                  listings={filteredListings}
                  onStatusChange={handleStatusChange}
                  onSaveNotes={handleSaveNotes}
                />
              </div>
            )}

            {activeTab === 'pricedrops' && (
              <PriceDropModule opportunities={priceDrops} />
            )}

            {activeTab === 'report' && (
              <ExecutiveWeeklyReport reports={reports} />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
