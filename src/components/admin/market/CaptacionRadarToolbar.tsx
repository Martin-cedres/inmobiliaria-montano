'use client';

import React from 'react';
import { MarketRadarFilters } from '@/types/market';
import { Search, RotateCcw, Plus } from 'lucide-react';

interface CaptacionRadarToolbarProps {
  filters: MarketRadarFilters;
  onChange: (filters: MarketRadarFilters) => void;
  onReset: () => void;
  totalFiltered: number;
  onOpenAddOwnerModal?: () => void;
}

export function CaptacionRadarToolbar({
  filters,
  onChange,
  onReset,
  totalFiltered,
  onOpenAddOwnerModal,
}: CaptacionRadarToolbarProps) {
  const handleFieldChange = (field: keyof MarketRadarFilters, value: string) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const isFiltered =
    filters.search !== '' ||
    filters.neighborhood !== 'todos' ||
    filters.category !== 'todos' ||
    filters.origin !== 'todos' ||
    filters.operation !== 'todos' ||
    filters.status !== 'todos';

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      {/* Fila 1: Búsqueda y Filtro Rápido por Portal */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Input de Búsqueda */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, dueño, teléfono, localidad o notas..."
            value={filters.search}
            onChange={(e) => handleFieldChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5E1754]/30 focus:border-[#5E1754]"
          />
        </div>

        {/* Selector Rápido de Portal / Fuente */}
        <div className="flex items-center gap-1 overflow-x-auto bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0">
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'gallito', label: 'Gallito Luis' },
            { key: 'infocasas', label: 'InfoCasas' },
            { key: 'mercadolibre', label: 'Mercado Libre' },
            { key: 'manual', label: 'Facebook / Manual' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleFieldChange('origin', item.key)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filters.origin === item.key
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fila 2: Selectores Secundarios (Zona de San José, Categoría, Operación, Estado) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-3 border-t border-slate-100 text-xs">
        {/* Localidad / Zona en San José */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Zona / Localidad (San José)
          </label>
          <select
            value={filters.neighborhood}
            onChange={(e) => handleFieldChange('neighborhood', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
          >
            <option value="todos">Todo el Dpto. de San José</option>
            <option value="Centro">Centro / Plazas (SJM)</option>
            <option value="Barrio Molino">Barrio Molino (SJM)</option>
            <option value="Barrio Arriaga">Barrio Arriaga (SJM)</option>
            <option value="Zona Hospital">Zona Hospital (SJM)</option>
            <option value="Parquización Arroyo Mallada">Arroyo Mallada (SJM)</option>
            <option value="San José de Mayo">San José de Mayo (General)</option>
            <option value="Ciudad del Plata">Ciudad del Plata / Sta. Mónica</option>
            <option value="Playa Pascual">Playa Pascual</option>
            <option value="Libertad">Libertad</option>
            <option value="Ecilda Paullier">Ecilda Paullier</option>
            <option value="Kiyú">Balneario Kiyú / Costa</option>
            <option value="Eje Rutas / Libertad">Eje Rutas 1, 3 y 11 / Rural</option>
          </select>
        </div>

        {/* Tipología */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Tipología
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
          >
            <option value="todos">Todas las tipologías</option>
            <option value="casa">Casas</option>
            <option value="chacra">Campos y Chacras</option>
            <option value="terreno">Terrenos / Solares</option>
            <option value="apartamento">Apartamentos</option>
            <option value="local">Locales / Comercios</option>
            <option value="deposito">Galpones / Depósitos</option>
          </select>
        </div>

        {/* Operación */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Operación
          </label>
          <select
            value={filters.operation}
            onChange={(e) => handleFieldChange('operation', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
          >
            <option value="todos">Venta y Alquiler</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        {/* Estado Interno de Gestión */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Estado de Gestión
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
          >
            <option value="todos">Todos los estados</option>
            <option value="detectado">Detectado (Sin contactar)</option>
            <option value="en_analisis">En análisis</option>
            <option value="contactado">Contactado por WhatsApp</option>
            <option value="reunion_agendada">Reunión / Tasación agendada</option>
            <option value="captado">Captado a cartera</option>
            <option value="descartado">Descartado</option>
          </select>
        </div>

        {/* Contador y Reset */}
        <div className="flex items-end justify-between col-span-2 sm:col-span-4 lg:col-span-1 gap-2">
          <div className="text-[11px] font-bold text-slate-500 py-1.5">
            <span className="text-slate-900 font-black">{totalFiltered}</span> dueños
          </div>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Restablecer filtros"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
