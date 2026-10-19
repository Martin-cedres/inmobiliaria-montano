'use client';

import React from 'react';
import { MarketKpis } from '@/types/market';
import { Building2, PieChart, CalendarPlus, UserCheck, ArrowUpRight } from 'lucide-react';

interface MarketKpiStripProps {
  kpis: MarketKpis;
}

export function MarketKpiStrip({ kpis }: MarketKpiStripProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Stock Total */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Stock Departamental
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            {kpis.totalStock.toLocaleString('es-UY')}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Avisos activos en San José de Mayo
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5E1754] border border-purple-100 flex items-center justify-center shrink-0">
          <Building2 className="w-6 h-6 text-[#5E1754]" />
        </div>
      </div>

      {/* KPI 2: Cuota de Mercado Montaño */}
      <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-[#5E1754] uppercase tracking-wider">
              Cuota Montaño
            </span>
            <span className="inline-flex items-center text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <ArrowUpRight className="w-3 h-3" />
              Líder
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#5E1754] tabular-nums">
            {kpis.montanoSharePercentage.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            <strong className="text-slate-800">{kpis.montanoStock}</strong> inmuebles con títulos verificados
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#5E1754]/10 text-[#5E1754] border border-[#5E1754]/20 flex items-center justify-center shrink-0">
          <PieChart className="w-6 h-6 text-[#5E1754]" />
        </div>
      </div>

      {/* KPI 3: Nuevos Ingresos 7d */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Nuevos Ingresos (7d)
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            +{kpis.newEntriesLast7Days}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Avisos detectados esta semana
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
          <CalendarPlus className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* KPI 4: Alertas Dueño Vende */}
      <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-[#E85D04] uppercase tracking-wider">
              Alertas Dueño Vende
            </span>
            <span className="inline-flex items-center text-[10px] font-black text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
              Prioridad
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#E85D04] tabular-nums">
            {kpis.ownerAlertsCount}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Particulares para captación directa
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#E85D04] border border-orange-100 flex items-center justify-center shrink-0">
          <UserCheck className="w-6 h-6 text-[#E85D04]" />
        </div>
      </div>
    </div>
  );
}
