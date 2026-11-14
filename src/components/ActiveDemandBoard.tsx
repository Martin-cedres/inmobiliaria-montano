'use client';

import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  ArrowRight,
  Search,
  Home,
  KeyRound,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import {
  ACTIVE_DEMAND_PROFILES,
  buildDemandWhatsAppUrl,
} from '@/data/reviewsAndDemands';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { trackWhatsappClick } from '@/utils/telemetry';

interface ActiveDemandBoardProps {
  defaultFilter?: 'todos' | 'venta' | 'alquiler';
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ActiveDemandBoard: React.FC<ActiveDemandBoardProps> = ({
  defaultFilter = 'todos',
  title = 'Demanda Activa en San José: Propiedades que Hoy Nos Consultan',
  subtitle = 'Compradores e inquilinos reales nos consultan todas las semanas por estas tipologías. Si tenés un inmueble similar para vender o alquilar, conversalo directo con Daniel Montaño.',
  className = '',
}) => {
  const [filter, setFilter] = useState<'todos' | 'venta' | 'alquiler'>(defaultFilter);

  const filteredDemands = ACTIVE_DEMAND_PROFILES.filter((item) =>
    filter === 'todos' ? true : item.operation === filter
  );

  const handleDemandWhatsappClick = () => {
    trackWhatsappClick({
      buttonPosition: 'owner_lead',
      pagePath: typeof window !== 'undefined' ? window.location.pathname : '/',
    });
  };

  return (
    <section
      aria-label="Cartelera de demanda activa de propiedades en San José"
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${className}`}
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-purple-100 shadow-sm space-y-7">
        {/* Cabecera + Filtros */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-slate-100 pb-6">
          <div className="space-y-2 max-w-2xl text-left">
            <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] border border-[#5E1754]/15 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Search className="w-3.5 h-3.5 text-[#E85D04]" />
              <span>Búsquedas Activas de Clientes</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Selector de operación */}
          <div
            role="tablist"
            aria-label="Filtrar búsquedas por tipo de operación"
            className="inline-flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 self-start lg:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'todos'}
              onClick={() => setFilter('todos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                filter === 'todos'
                  ? 'bg-[#5E1754] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#5E1754]'
              }`}
            >
              Todas ({ACTIVE_DEMAND_PROFILES.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'venta'}
              onClick={() => setFilter('venta')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                filter === 'venta'
                  ? 'bg-[#C2410C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#C2410C]'
              }`}
            >
              Compra / Venta
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'alquiler'}
              onClick={() => setFilter('alquiler')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                filter === 'alquiler'
                  ? 'bg-[#5E1754] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#5E1754]'
              }`}
            >
              Alquileres
            </button>
          </div>
        </div>

        {/* Grid de Perfiles de Demanda */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDemands.map((item) => {
            const isAlquiler = item.operation === 'alquiler';
            const whatsappUrl = buildDemandWhatsAppUrl(item);

            return (
              <article
                key={item.id}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-[#5E1754]/35 hover:shadow-md transition-[transform,box-shadow,border-color,background-color] flex flex-col justify-between space-y-4 text-left"
              >
                <div className="space-y-3">
                  {/* Badges superiores */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                        isAlquiler
                          ? 'bg-[#5E1754] text-white'
                          : 'bg-[#C2410C] text-white'
                      }`}
                    >
                      {isAlquiler ? (
                        <KeyRound className="w-3 h-3" />
                      ) : (
                        <Home className="w-3 h-3" />
                      )}
                      <span>
                        {isAlquiler ? 'Búsqueda de Alquiler' : 'Búsqueda de Compra'}
                      </span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {item.categoryTag}
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Ficha técnica de zona y respaldo */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-start space-x-2 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-[#E85D04] mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="font-bold text-slate-900">Zonas:</strong>{' '}
                        {item.zones}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="font-bold text-slate-900">Respaldo:</strong>{' '}
                        {item.backing}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Directo */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDemandWhatsappClick}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-white hover:bg-[#5E1754] text-[#5E1754] hover:text-white border border-[#5E1754]/25 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600 group-hover:text-emerald-300 flex-shrink-0" />
                  <span>Tengo una propiedad así</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </article>
            );
          })}
        </div>

        {/* Sello de Asesoramiento Notarial Flexible */}
        <div className="bg-gradient-to-r from-purple-50 via-white to-amber-50/70 rounded-2xl p-4 sm:p-5 border border-purple-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>Asesoramiento Notarial Flexible y Seguro</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contamos con <strong>escribana de confianza que trabaja con la inmobiliaria</strong> para revisar tu documentación, títulos o contratos sin demoras, o trabajamos libremente con <strong>tu propio escribano de elección</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] font-black text-[#5E1754] bg-white px-3 py-1.5 rounded-xl border border-purple-200 flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sin exclusividad abusiva</span>
          </div>
        </div>
      </div>
    </section>
  );
};
