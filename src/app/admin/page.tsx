'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Property, PropertyStatus } from '@/types/property';
import { Plus, Trash2, Eye, Edit3, CheckCircle2, Sparkles, Search, RefreshCw, AlertCircle, Building2, Key, Tag, Check } from 'lucide-react';

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/properties');
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setProperties(result.data);
      }
    } catch (error) {
      console.error('Error cargando propiedades:', error);
      showToast('Error de conexión al cargar propiedades');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleStatusChange = async (id: string, codeRef: string, newStatus: PropertyStatus) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
        showToast(`¡Estado de Ref. #${codeRef} actualizado a "${newStatus.toUpperCase()}"!`);
      } else {
        showToast(`Error: ${data.error || 'No se pudo actualizar el estado'}`);
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      showToast('Ocurrió un error al intentar cambiar el estado');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, codeRef: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente la propiedad Ref. #${codeRef}?`)) {
      try {
        const response = await fetch(`/api/properties/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          setProperties((prev) => prev.filter((p) => p.id !== id));
          showToast(`¡Propiedad Ref. #${codeRef} eliminada correctamente!`);
        } else {
          showToast('Error al eliminar la propiedad');
        }
      } catch (error) {
        console.error('Error al eliminar:', error);
        showToast('Error de conexión al eliminar la propiedad');
      }
    }
  };

  // Metrics KPIs
  const totalCount = properties.length;
  const ventaCount = properties.filter((p) => p.operation === 'venta').length;
  const alquilerCount = properties.filter((p) => p.operation === 'alquiler').length;
  const reservadoVendidoCount = properties.filter((p) => ['reservado', 'vendido', 'alquilado'].includes(p.status)).length;

  // Filtered properties
  const filteredProperties = properties.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.codeRef.toLowerCase().includes(query) ||
      p.title.toLowerCase().includes(query) ||
      p.location.neighborhood.toLowerCase().includes(query) ||
      p.operation.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Header />

      {/* Floating Toast Notification (Recomendación Técnica #3) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#350A2F] text-amber-300 px-5 py-3.5 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center space-x-3 text-xs sm:text-sm font-bold animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Admin & Action CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-xs">
          <div>
            <div className="flex items-center space-x-2 text-[#E85D04] font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Panel de Administración Montaño</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Gestión de Propiedades
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Administrá los inmuebles en tiempo real. Al modificar el estado o publicar una nueva propiedad, **Next.js purga la caché e inyecta los cambios al instante en el Home**.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={fetchProperties}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
              title="Recargar datos"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/admin/nueva"
              className="flex-1 sm:flex-initial bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-black px-6 py-3.5 rounded-full shadow-md hover:shadow-orange-500/30 transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Publicar Nueva Propiedad</span>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Total Inmuebles</p>
              <p className="text-2xl font-black text-slate-900">{totalCount}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl text-[#5E1754]">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">En Venta</p>
              <p className="text-2xl font-black text-slate-900">{ventaCount}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-[#E85D04]">
              <Tag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Alquileres</p>
              <p className="text-2xl font-black text-slate-900">{alquilerCount}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Key className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Reservadas / Vendidas</p>
              <p className="text-2xl font-black text-slate-900">{reservadoVendidoCount}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Properties Management Table */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden text-left">
          
          {/* Table Toolbar & Search */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <span>Propiedades Registradas</span>
              <span className="bg-purple-100 text-[#5E1754] text-xs font-black px-2.5 py-0.5 rounded-full">
                {filteredProperties.length}
              </span>
            </h3>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por ref, título o barrio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5E1754]/30"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-bold text-sm flex items-center justify-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[#5E1754]" />
              <span>Cargando propiedades desde la base de datos...</span>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="font-bold text-sm">No se encontraron propiedades que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-3 sm:px-4">Ref. & Propiedad</th>
                    <th className="py-3 px-2 hidden sm:table-cell">Tipo</th>
                    <th className="py-3 px-2">Precio</th>
                    <th className="py-3 px-2">Estado</th>
                    <th className="py-3 px-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProperties.map((prop) => {
                    const categoryLabel = prop.category === 'casa' ? 'Casa'
                      : prop.category === 'apartamento' ? 'Apto'
                      : prop.category === 'terreno' ? 'Terreno'
                      : prop.category === 'chacra' ? 'Chacra'
                      : prop.category === 'local' ? 'Local'
                      : prop.category === 'deposito' ? 'Depósito'
                      : prop.category === 'proyecto' ? 'Proyecto'
                      : prop.category === 'modulo' ? 'Módulo'
                      : 'Inmueble';

                    return (
                    <tr key={prop.id} className="hover:bg-purple-50/20 transition-colors">
                      {/* Col 1: Ref + Título + Categoría (compactado) */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex items-center space-x-2">
                          <span className="bg-[#350A2F] text-amber-300 font-extrabold text-[9px] px-1.5 py-0.5 rounded flex-shrink-0">
                            #{prop.codeRef}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate max-w-[180px] sm:max-w-[280px] lg:max-w-none">{prop.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {prop.location.neighborhood} · <span className="text-[#5E1754] font-bold">{prop.operation.toUpperCase()}</span> · <span className="sm:hidden">{categoryLabel}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Col 2: Categoría (oculta en móvil, visible en sm+) */}
                      <td className="py-3 px-2 hidden sm:table-cell">
                        <span className="text-[10px] font-bold uppercase text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                          {categoryLabel}
                        </span>
                      </td>

                      {/* Col 3: Precio */}
                      <td className="py-3 px-2 font-extrabold text-[#5E1754] text-xs whitespace-nowrap">
                        {prop.price.currency} {prop.price.currency === 'UYU' ? '$ ' : ''}{prop.price.amount.toLocaleString('es-UY')}
                      </td>

                      {/* Col 4: Estado (En Vivo) */}
                      <td className="py-3 px-2">
                        <select
                          value={prop.status}
                          disabled={updatingId === prop.id}
                          onChange={(e) => handleStatusChange(prop.id, prop.codeRef, e.target.value as PropertyStatus)}
                          className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full border cursor-pointer focus:outline-none transition-all ${
                            prop.status === 'disponible'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : prop.status === 'nuevo'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : prop.status === 'reservado'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : prop.status === 'vendido'
                              ? 'bg-slate-200 text-slate-700 border-slate-300'
                              : prop.status === 'alquilado'
                              ? 'bg-purple-100 text-purple-900 border-purple-200'
                              : 'bg-orange-50 text-orange-800 border-orange-200'
                          }`}
                        >
                          <option value="disponible">Disponible</option>
                          <option value="nuevo">Nuevo</option>
                          <option value="reservado">Reservado</option>
                          <option value="vendido">Vendido</option>
                          <option value="alquilado">Alquilado</option>
                          <option value="oportunidad">Oportunidad</option>
                        </select>
                      </td>

                      {/* Col 5: Acciones (siempre visible) */}
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end space-x-0.5">
                          <Link
                            href={`/propiedad/${prop.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-500 hover:text-[#5E1754] hover:bg-purple-50 rounded-lg transition-colors"
                            title="Ver Ficha"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/editar/${prop.id}`}
                            className="p-1.5 text-[#E85D04] hover:bg-orange-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(prop.id, prop.codeRef)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}

