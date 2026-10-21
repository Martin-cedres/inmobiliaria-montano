'use client';

import React from 'react';
import { MarketRadarFilters } from '@/types/market';
import { Search, Filter, RotateCcw, Plus } from 'lucide-react';

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
      {/* Fila 1: Búsqueda y Origen de Captación */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Input de Búsqueda */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, contacto, teléfono o notas..."
            value={filters.search}
            onChange={(e) => handleFieldChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5E1754]/30 focus:border-[#5E1754]"
          />
        </div>

        {/* Selector de Origen (Dueño vs Competencia) */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0">
          {[
            { key: 'todos', label: 'Todos los Orígenes' },
            { key: 'dueno_directo', label: 'Dueño Directo' },
            { key: 'inmobiliaria_competencia', label: 'Competencia' },
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

        {/* Botón de Carga Express de Dueño Vende */}
        {onOpenAddOwnerModal && (
          <button
            type="button"
            onClick={onOpenAddOwnerModal}
            className="inline-flex items-center space-x-1.5 bg-[#E85D04] hover:bg-[#FF8500] text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cargar Dueño Vende</span>
          </button>
        )}
      </div>

      {/* Fila 2: Selectores Secundarios (Zona, Categoría, Operación, Estado) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-3 border-t border-slate-100 text-xs">
        {/* Microzona */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Microzona
          </label>
          <select
            value={filters.neighborhood}
            onChange={(e) => handleFieldChange('neighborhood', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
          >
            <option value="todos">Todas las zonas</option>
            <option value="Centro">Centro / Plazas</option>
            <option value="Barrio Molino">Barrio Molino</option>
            <option value="Barrio Arriaga">Barrio Arriaga</option>
            <option value="Parquización Arroyo Mallada">Arroyo Mallada</option>
            <option value="Eje Rutas / Libertad">Eje Rutas / Libertad</option>
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
            <option value="apartamento">Apartamentos</option>
            <option value="terreno">Terrenos / Solares</option>
            <option value="chacra">Chacras / Fracciones</option>
            <option value="local">Locales Comerciales</option>
            <option value="deposito">Depósitos</option>
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
            <option value="detectado">Detectado</option>
            <option value="en_analisis">En análisis</option>
            <option value="contactado">Contactado</option>
            <option value="reunion_agendada">Reunión agendada</option>
            <option value="captado">Captado</option>
            <option value="descartado">Descartado</option>
          </select>
        </div>

        {/* Contador y Reset */}
        <div className="flex items-end justify-between col-span-2 sm:col-span-4 lg:col-span-1 gap-2">
          <div className="text-[11px] font-bold text-slate-500 py-1.5">
            <span className="text-slate-900 font-black">{totalFiltered}</span> avisos
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
