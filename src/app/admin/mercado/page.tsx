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
  MarketRadarFilters,
} from '@/types/market';
import { MarketKpiStrip } from '@/components/admin/market/MarketKpiStrip';
import { CaptacionRadarToolbar } from '@/components/admin/market/CaptacionRadarToolbar';
import { CaptacionRadarTable } from '@/components/admin/market/CaptacionRadarTable';
import { AddOwnerModal } from '@/components/admin/market/AddOwnerModal';
import {
  Building2,
  Plus,
  TrendingUp,
  Flame,
  Eye,
  RefreshCw,
  Radar,
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

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddOwnerModalOpen, setIsAddOwnerModalOpen] = useState<boolean>(false);

  // Datos exclusivos de Dueños Directos
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [kpis, setKpis] = useState<MarketKpis | null>(null);

  // Filtros del Radar
  const [filters, setFilters] = useState<MarketRadarFilters>(INITIAL_FILTERS);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/market');
      const data = await res.json();
      if (data.success && data.data) {
        setListings(data.data.listings || []);
        setKpis(data.data.kpis || null);
      } else {
        showToast('Error al cargar datos del radar');
      }
    } catch (err) {
      console.error('Error cargando datos de mercado:', err);
      showToast('Error de conexión al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOwnerCreated = (newListing: MarketListing) => {
    setListings((prev) => [newListing, ...prev]);
    showToast('Aviso de dueño particular guardado con éxito en el Radar');
    fetchMarketData();
  };

  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleRunScan = async () => {
    setIsScanning(true);
    showToast('Rastreando Dueños Directos en El Gallito, InfoCasas y Mercado Libre (San José)...');
    try {
      const res = await fetch('/api/admin/market/scan', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data) {
        setListings(data.data.listings || []);
        setKpis(data.data.kpis || null);
        const novos = data.scanResult?.newEntriesCount ?? 0;
        showToast(
          `Escaneo completado: ${data.data.listings?.length || 0} dueños directos en radar (${novos} nuevos detectados)`
        );
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

  const handleStatusChange = async (
    id: string,
    newStatus: MarketListingStatus,
    extra?: { contactPhone?: string; contactName?: string }
  ) => {
    try {
      const res = await fetch(`/api/admin/market/listing/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ...(extra?.contactPhone ? { contactPhone: extra.contactPhone } : {}),
          ...(extra?.contactName ? { contactName: extra.contactName } : {}),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setListings((prev) =>
          prev.map((l) =>
            l.id === id
              ? {
                  ...l,
                  status: newStatus,
                  contactPhone: extra?.contactPhone || l.contactPhone,
                  contactName: extra?.contactName || l.contactName,
                }
              : l
          )
        );
        if (data.kpis) {
          setKpis(data.kpis);
        }
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

  // Filtrado de avisos de dueños directos
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      // Búsqueda por texto
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          l.title.toLowerCase().includes(q) ||
          l.neighborhood.toLowerCase().includes(q) ||
          l.sourceName.toLowerCase().includes(q) ||
          (l.contactName && l.contactName.toLowerCase().includes(q)) ||
          (l.contactPhone && l.contactPhone.toLowerCase().includes(q)) ||
          (l.internalNotes && l.internalNotes.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Zona / Localidad
      if (filters.neighborhood !== 'todos' && l.neighborhood !== filters.neighborhood) {
        return false;
      }

      // Categoría
      if (filters.category !== 'todos' && l.category !== filters.category) {
        return false;
      }

      // Filtro por Portal / Fuente (usando el campo origin del filtro)
      if (filters.origin !== 'todos') {
        const src = l.sourceName.toLowerCase();
        if (filters.origin === 'gallito' && !src.includes('gallito')) return false;
        if (filters.origin === 'infocasas' && !src.includes('infocasas')) return false;
        if (filters.origin === 'mercadolibre' && !src.includes('mercado')) return false;
        if (
          filters.origin === 'manual' &&
          (src.includes('gallito') || src.includes('infocasas') || src.includes('mercado'))
        ) {
          return false;
        }
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
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
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
            <span>3. Captación Dueño Vende</span>
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

        {/* Encabezado del Radar de Dueños Vende */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-xs">
          <div>
            <div className="flex items-center space-x-2 text-[#E85D04] font-bold text-xs uppercase tracking-wider mb-1">
              <Radar className="w-4 h-4 text-[#5E1754]" />
              <span>Captación Exclusiva en San José (Venta y Alquiler)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Radar de Dueños Vende
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Rastreo limpio de particulares en todo el departamento de San José (El Gallito Luis, InfoCasas, Mercado Libre y carga rápida de Facebook/Calle), libre de inmobiliarias competidoras.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setIsAddOwnerModalOpen(true)}
              className="bg-[#5E1754] hover:bg-[#7A1E6E] active:scale-95 text-white font-bold px-4 py-3 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer shrink-0"
              title="Pegar aviso de Facebook Marketplace, Mercado Libre o cartel de calle"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Cargar / Pegar Aviso</span>
            </button>

            <button
              type="button"
              onClick={handleRunScan}
              disabled={isScanning || isLoading}
              className="bg-[#E85D04] hover:bg-[#d05303] active:scale-95 disabled:opacity-60 text-white font-bold px-4 py-3 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer shrink-0"
              title="Ejecutar el robot local para buscar nuevos dueños directos en San José"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Buscando Dueños (~25s)...' : 'Escanear Dueños en Vivo'}</span>
            </button>

            <button
              type="button"
              onClick={fetchMarketData}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Recargar tabla"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Accesos Directos a Portales Filtrados por San José (Para revisión o copia rápida) */}
        <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-300">
            🔍 Atajos directos a búsquedas de particulares en San José:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://inmuebles.mercadolibre.com.uy/san-jose/_OrderId_BEGINS*DESC_NoIndex_True"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-yellow-400/15 hover:bg-yellow-400/25 text-yellow-300 border border-yellow-400/30 px-3 py-1.5 rounded-xl font-bold transition-colors"
            >
              <span>Mercado Libre (Recientes San José)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.gallito.com.uy/inmuebles/san-jose!cant=80"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-400/15 hover:bg-emerald-400/25 text-emerald-300 border border-emerald-400/30 px-3 py-1.5 rounded-xl font-bold transition-colors"
            >
              <span>Gallito Luis (San José)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.facebook.com/marketplace/category/propertyrentals?query=san%20jose%20uruguay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-blue-400/15 hover:bg-blue-400/25 text-blue-300 border border-blue-400/30 px-3 py-1.5 rounded-xl font-bold transition-colors"
            >
              <span>Facebook Marketplace (San José)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Embudo Real de Captación (4 Tarjetas) */}
        {kpis && <MarketKpiStrip kpis={kpis} />}

        {/* Tabla y Filtros del Radar */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#5E1754]" />
            <span className="font-bold text-sm">Cargando dueños directos...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <CaptacionRadarToolbar
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(INITIAL_FILTERS)}
              totalFiltered={filteredListings.length}
              onOpenAddOwnerModal={() => setIsAddOwnerModalOpen(true)}
            />
            <CaptacionRadarTable
              listings={filteredListings}
              onStatusChange={handleStatusChange}
              onSaveNotes={handleSaveNotes}
            />
          </div>
        )}

        {/* Modal de Carga / Pegado Inteligente de Dueño Vende */}
        <AddOwnerModal
          isOpen={isAddOwnerModalOpen}
          onClose={() => setIsAddOwnerModalOpen(false)}
          onSuccess={handleOwnerCreated}
        />
      </main>

      <Footer />
    </div>
  );
}
