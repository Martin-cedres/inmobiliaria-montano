'use client';

import React from 'react';
import { Star, ExternalLink, ShieldCheck, Quote, Award, CheckCircle2 } from 'lucide-react';
import {
  GOOGLE_MAPS_STATS,
  VERIFIED_GOOGLE_REVIEWS,
} from '@/data/reviewsAndDemands';

interface GoogleReviewsSectionProps {
  compact?: boolean;
  className?: string;
}

function renderStars(count: number) {
  return (
    <div className="flex items-center space-x-0.5" aria-label={`${count} de 5 estrellas`}>
      {Array.from({ length: count }).map((_, idx) => (
        <Star
          key={idx}
          className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export const GoogleReviewsSection: React.FC<GoogleReviewsSectionProps> = ({
  compact = false,
  className = '',
}) => {
  // En modo compacto (Home) mostramos las 4 reseñas más representativas en una fila ejecutiva limpia
  const reviewsToDisplay = compact
    ? VERIFIED_GOOGLE_REVIEWS.slice(0, 4)
    : VERIFIED_GOOGLE_REVIEWS.slice(0, 6);

  return (
    <section
      aria-label="Opiniones verificadas de clientes en Google Maps"
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
        compact ? 'py-6 sm:py-8' : 'py-10 sm:py-12'
      } w-full ${className}`}
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
        {/* Cabecera Ejecutiva con Calificación Oficial Google Maps */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5 text-left">
            <div className="inline-flex items-center space-x-2 bg-purple-50 text-[#5E1754] border border-purple-200/80 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E85D04]" />
              <span>Reputación Verificada en Google Maps</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Lo que opinan clientes e instituciones en San José
              </h2>
              <div className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
                <span className="text-sm font-black text-slate-900 tabular-nums">
                  {GOOGLE_MAPS_STATS.ratingValue.toFixed(1)}
                </span>
                {renderStars(5)}
                <span className="text-xs font-semibold text-slate-500">
                  en Google Maps
                </span>
              </div>
            </div>
          </div>

          <a
            href={GOOGLE_MAPS_STATS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-slate-50 hover:bg-[#5E1754] text-[#5E1754] hover:text-white border border-purple-200 hover:border-[#5E1754] font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors self-start md:self-auto group flex-shrink-0"
          >
            <span>Ver perfil y reseñas en Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Grid de Reseñas */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            compact ? 'lg:grid-cols-4 gap-4' : 'lg:grid-cols-3 gap-5'
          }`}
        >
          {reviewsToDisplay.map((rev) => {
            const isInstitutional = rev.authorName.toLowerCase().includes('círculo policial');

            return (
              <article
                key={rev.id}
                className={`rounded-2xl p-4 sm:p-5 border flex flex-col justify-between space-y-3 text-left transition-[box-shadow,border-color] ${
                  isInstitutional
                    ? 'bg-purple-50/45 border-[#5E1754]/25 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200/80 hover:border-purple-200'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    {renderStars(rev.rating)}
                    {isInstitutional ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#5E1754] bg-white px-2 py-0.5 rounded-md border border-purple-200">
                        <Award className="w-3 h-3 text-[#E85D04]" />
                        <span>Convenio</span>
                      </span>
                    ) : (
                      <Quote className="w-4 h-4 text-purple-200" aria-hidden="true" />
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <a
                        href={rev.authorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-black text-slate-900 hover:text-[#5E1754] transition-colors truncate block"
                      >
                        {rev.authorName}
                      </a>
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{rev.roleBadge}</span>
                      </span>
                    </div>
                  </div>

                  {!compact && rev.ownerReply && (
                    <div className="bg-white/90 rounded-xl p-2.5 border border-slate-200/70 text-[11px] text-slate-600 leading-snug">
                      <span className="font-bold text-[#5E1754]">Respuesta de Inmobiliaria Montaño: </span>
                      {rev.ownerReply}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
