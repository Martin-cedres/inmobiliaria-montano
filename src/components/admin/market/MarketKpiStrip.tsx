'use client';

import React from 'react';
import { MarketKpis } from '@/types/market';
import { UserCheck, MessageCircle, CalendarCheck, CheckCircle2, Phone } from 'lucide-react';

interface MarketKpiStripProps {
  kpis: MarketKpis;
}

export function MarketKpiStrip({ kpis }: MarketKpiStripProps) {
  const pendingCount = kpis.pendingContactCount ?? kpis.ownerAlertsCount ?? 0;
  const contactedCount = kpis.contactedCount ?? 0;
  const scheduledCount = kpis.scheduledCount ?? 0;
  const capturedCount = kpis.capturedCount ?? 0;
  const withPhoneCount = kpis.withPhoneCount ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Pendientes de Contactar */}
      <div className="bg-white p-5 rounded-2xl border border-orange-200/80 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-[#E85D04] uppercase tracking-wider">
              1. Nuevos Detectados
            </span>
            {pendingCount > 0 && (
              <span className="inline-flex items-center text-[10px] font-black text-orange-800 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                Por escribir
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            {pendingCount}
          </div>
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <Phone className="w-3 h-3 text-emerald-600" />
            <span><strong className="text-slate-800">{withPhoneCount}</strong> con teléfono directo en radar</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#E85D04] border border-orange-100 flex items-center justify-center shrink-0">
          <UserCheck className="w-6 h-6 text-[#E85D04]" />
        </div>
      </div>

      {/* KPI 2: Contactados por WhatsApp */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              2. Contactados
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 tabular-nums">
            {contactedCount}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Propietarios gestionados por WhatsApp
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
          <MessageCircle className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      {/* KPI 3: Reuniones / Tasaciones Agendadas */}
      <div className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-[#5E1754] uppercase tracking-wider">
              3. Tasación / Visita
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#5E1754] tabular-nums">
            {scheduledCount}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Reuniones agendadas con dueños
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5E1754] border border-purple-100 flex items-center justify-center shrink-0">
          <CalendarCheck className="w-6 h-6 text-[#5E1754]" />
        </div>
      </div>

      {/* KPI 4: Propiedades Captadas */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              4. Captados a Cartera
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            {capturedCount}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Sumados a Inmobiliaria Montaño
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
      </div>
    </div>
  );
}
