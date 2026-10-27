'use client';

import React, { useState } from 'react';
import { PriceDropOpportunity } from '@/types/market';
import { buildUruguayWhatsAppUrl } from '@/lib/whatsapp';
import {
  TrendingDown,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface PriceDropModuleProps {
  opportunities: PriceDropOpportunity[];
}

export function PriceDropModule({ opportunities }: PriceDropModuleProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPitch = (opp: PriceDropOpportunity) => {
    const textToCopy = `OPORTUNIDAD DE CAPTACIÓN POR REBAJA:
Inmueble: ${opp.title} (${opp.neighborhood})
Precio Anterior: ${opp.currency} ${opp.previousPrice.toLocaleString('es-UY')}
Precio Actual: ${opp.currency} ${opp.currentPrice.toLocaleString('es-UY')} (${opp.dropPercentage}%)
Días en mercado: ${opp.totalDaysOnMarket} días
Agencia/Propietario: ${opp.competitorOrOwner}

Diagnóstico de Mercado:
${opp.diagnosis}

Argumentario de Captación:
${opp.negotiationPitch}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(opp.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (opportunities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        <p className="font-bold text-sm">No hay rebajas registradas en los últimos 30 días.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span>Radar de Rebajas de Competidores</span>
            <span className="bg-red-50 text-red-700 text-xs font-black px-2 py-0.5 rounded-full border border-red-200">
              {opportunities.length} detectadas
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Inmuebles que redujeron su valor en agencias locales y portales. Oportunidades de captación por sobretasación inicial o estancamiento.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {opportunities.map((opp) => {
          const isCopied = copiedId === opp.id;
          const currencySymbol = opp.currency === 'USD' ? 'USD ' : '$ ';

          return (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-purple-200 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Encabezado: Título + Badge de Reducción */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {opp.neighborhood} · {opp.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1" title={opp.title}>
                      {opp.title}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-xl shrink-0 tabular-nums">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>{opp.dropPercentage}%</span>
                  </span>
                </div>

                {/* Precios: Anterior vs Actual */}
                <div className="flex items-baseline gap-3 pt-1">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      Precio Actual
                    </span>
                    <span className="text-xl font-black text-[#5E1754] tabular-nums">
                      {currencySymbol}{opp.currentPrice.toLocaleString('es-UY')}
                    </span>
                  </div>
                  <div className="text-slate-400 line-through text-xs font-semibold tabular-nums">
                    {currencySymbol}{opp.previousPrice.toLocaleString('es-UY')}
                  </div>
                </div>

                {/* Metadatos: Días en mercado y Agencia */}
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{opp.totalDaysOnMarket} días en mercado</span>
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-slate-700">
                    {opp.competitorOrOwner} ({opp.sourceName})
                  </span>
                </div>
              </div>

              {/* Diagnóstico de Mercado */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Diagnóstico Técnico</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {opp.diagnosis}
                </p>
              </div>

              {/* Argumentario de Negociación */}
              <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#5E1754] text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#E85D04]" />
                    <span>Argumentario de Captación</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyPitch(opp)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#5E1754] hover:text-[#7A1E6E] bg-white px-2 py-0.5 rounded-md border border-purple-200 shadow-2xs transition-all cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar Argumento</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {opp.negotiationPitch}
                </p>
              </div>

              {/* Acciones Rápidas */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  {opp.ownerPhone && (
                    <a
                      href={buildUruguayWhatsAppUrl(
                        opp.ownerPhone,
                        `Hola, me comunico de Inmobiliaria Montaño respecto a su propiedad en ${opp.neighborhood}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp Propietario</span>
                    </a>
                  )}
                  {opp.sourceUrl && (
                    <a
                      href={opp.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 text-[11px] font-semibold transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                      <span>Ver aviso</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
