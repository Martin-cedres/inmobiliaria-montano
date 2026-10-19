'use client';

import React, { useState } from 'react';
import { WeeklyExecutiveReportData } from '@/types/market';
import {
  FileText,
  Copy,
  Check,
  Calendar,
  Building2,
  TrendingDown,
  PieChart,
  UserCheck,
  CheckCircle2,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface ExecutiveWeeklyReportProps {
  reports: WeeklyExecutiveReportData[];
}

export function ExecutiveWeeklyReport({ reports }: ExecutiveWeeklyReportProps) {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        <p className="font-bold text-sm">No hay reportes ejecutivos semanales generados.</p>
      </div>
    );
  }

  const currentReport = reports[selectedWeekIndex] || reports[0];

  const handleCopyReport = () => {
    const textLines: string[] = [
      `INFORME EJECUTIVO DE MERCADO INMOBILIARIO — SAN JOSE DE MAYO`,
      `Inmobiliaria Montano · Inteligencia de Mercado`,
      `Periodo: ${currentReport.period} (${currentReport.weekIdentifier})`,
      ``,
      `--- METRICAS CLAVE ---`,
      `- Stock Activo Departamental: ${currentReport.totalActiveStock} avisos`,
      `- Cuota de Cartera Montano: ${currentReport.montanoSharePercentage.toFixed(1)}% (${currentReport.montanoStock} inmuebles verificados)`,
      `- Nuevas Captaciones / Ingresos: ${currentReport.newCapturesTotal}`,
      `- Rebajas de Precio en Competidores: ${currentReport.priceDropCount}`,
      `- Alertas Dueno Vende Identificadas: ${currentReport.directOwnerAlerts}`,
      ``,
      `--- RESUMEN ESTRATEGICO ---`,
      currentReport.strategicSummary,
      ``,
      `--- PUNTOS DESTACADOS ---`,
      ...currentReport.bulletPoints.map((bp) => `* ${bp}`),
      ``,
      `--- OPORTUNIDAD PRIORITARIA DE CAPTACION ---`,
      `Inmueble: ${currentReport.topOpportunity.title} (${currentReport.topOpportunity.neighborhood})`,
      `Precio: ${currentReport.topOpportunity.currentPrice} (antes ${currentReport.topOpportunity.previousPrice}, rebaja de ${currentReport.topOpportunity.dropPercentage}%)`,
      `Diagnostico: ${currentReport.topOpportunity.diagnosis}`,
      `Plan de Accion: ${currentReport.topOpportunity.actionPlan}`,
      ``,
      `--- TENDENCIA POR MICROZONAS ---`,
      ...currentReport.microzoneHighlights.map(
        (m) =>
          `* ${m.zone}: ${m.avgPriceM2Usd} | Alquiler ref: ${m.avgRentUyu} | Stock: ${m.inventoryCount} avisos | ${m.demandProfile}`
      ),
      ``,
      `Generado por Sistema de Inteligencia de Mercado - Inmobiliaria Montano`,
    ];

    const fullText = textLines.join('\n');
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Barra Superior: Selector de Semanas & Botón Copiar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#5E1754] uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4 text-[#E85D04]" />
            <span>Briefing Semanal para Dirección</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Informe Ejecutivo de Mercado
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Período evaluado: <strong>{currentReport.period}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Selector de Semanas */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedWeekIndex}
              onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
              aria-label="Seleccionar semana del informe ejecutivo"
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5E1754]/30 cursor-pointer"
            >
              {reports.map((rep, idx) => (
                <option key={rep.weekIdentifier} value={idx}>
                  {rep.weekIdentifier}
                </option>
              ))}
            </select>
          </div>

          {/* Botón 1-Clic: Copiar Reporte */}
          <button
            type="button"
            onClick={handleCopyReport}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#5E1754] hover:bg-[#7A1E6E] active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Reporte Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Reporte</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tira de Resumen Métrico Rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Stock Departamental</div>
          <div className="text-xl font-black text-slate-900 tabular-nums">
            {currentReport.totalActiveStock}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Avisos totales</div>
        </div>

        <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
          <div className="text-[10px] font-bold text-[#5E1754] uppercase">Cuota Montaño</div>
          <div className="text-xl font-black text-[#5E1754] tabular-nums">
            {currentReport.montanoSharePercentage.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            {currentReport.montanoStock} inmuebles
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Rebajas Registradas</div>
          <div className="text-xl font-black text-red-600 tabular-nums">
            {currentReport.priceDropCount}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">En competidores</div>
        </div>

        <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-100">
          <div className="text-[10px] font-bold text-[#E85D04] uppercase">Alertas Dueño Vende</div>
          <div className="text-xl font-black text-[#E85D04] tabular-nums">
            {currentReport.directOwnerAlerts}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Particulares directos</div>
        </div>
      </div>

      {/* Resumen Estratégico & Puntos Clave */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Diagnóstico y Resumen Estratégico
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
          {currentReport.strategicSummary}
        </p>
      </div>

      {/* Puntos Destacados de la Semana */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Movimientos Relevantes del Mercado
        </h3>
        <div className="space-y-2">
          {currentReport.bulletPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Oportunidad Prioritaria de la Semana */}
      <div className="bg-gradient-to-br from-[#191024] to-[#2E1235] text-white p-6 rounded-2xl border border-purple-500/20 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E85D04]" />
            Oportunidad Prioritaria de Captación
          </span>
          <span className="text-xs font-black bg-red-500/20 text-red-300 border border-red-500/40 px-2.5 py-0.5 rounded-full tabular-nums">
            {currentReport.topOpportunity.dropPercentage}%
          </span>
        </div>

        <div>
          <h4 className="text-base font-bold text-white">
            {currentReport.topOpportunity.title}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Ubicación: <strong>{currentReport.topOpportunity.neighborhood}</strong> · Precio actual: <strong className="text-orange-400 tabular-nums">{currentReport.topOpportunity.currentPrice}</strong> (anterior {currentReport.topOpportunity.previousPrice})
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs border-t border-white/10">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Diagnóstico:</span>
            <p className="text-slate-200 mt-0.5">{currentReport.topOpportunity.diagnosis}</p>
          </div>
          <div>
            <span className="text-[10px] text-orange-300 font-bold uppercase block">Plan de Acción Sugerido:</span>
            <p className="text-slate-200 mt-0.5">{currentReport.topOpportunity.actionPlan}</p>
          </div>
        </div>
      </div>

      {/* Desglose por Microzonas */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Pulso de Mercado por Microzonas (San José)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentReport.microzoneHighlights.map((micro) => {
            const trendLabel = micro.trend === 'alza' ? 'En alza'
              : micro.trend === 'alta_rotacion' ? 'Alta rotación'
              : micro.trend === 'expansion' ? 'En expansión'
              : 'Estable';

            const trendBadgeClass = micro.trend === 'alza'
              ? 'bg-purple-100 text-[#5E1754] border-purple-200'
              : micro.trend === 'alta_rotacion'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
              : micro.trend === 'expansion'
              ? 'bg-blue-100 text-blue-800 border-blue-200'
              : 'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <div
                key={micro.zone}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#5E1754]" />
                      {micro.zone}
                    </span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${trendBadgeClass}`}>
                      {trendLabel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-0.5">
                    <div className="tabular-nums">
                      Venta ref: <strong>{micro.avgPriceM2Usd}</strong>
                    </div>
                    <div className="tabular-nums text-[11px] text-slate-500">
                      Alquiler ref: <strong>{micro.avgRentUyu}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <p>{micro.demandProfile}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
