import React from 'react';
import { FlyerData } from './flyerTypes';
import {
  PinLocationIcon,
  PhoneCallIcon,
  GlobeWebIcon,
  FireIcon,
} from './FlyerIcons';

interface TemplateProps {
  data: FlyerData;
}

export const FlyerTemplateModular: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div
      id="flyer-modular-canvas"
      className="relative w-[600px] h-[900px] bg-gradient-to-b from-[#140A26] via-[#0E061B] to-[#070312] text-white font-sans overflow-hidden select-none flex flex-col justify-between"
      style={{
        boxSizing: 'border-box',
        letterSpacing: '-0.01em',
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER SECTION */}
      <div className="relative z-10 px-7 pt-6 pb-1">
        {/* LOGO PROMINENTE & CO-BRANDING */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-clean.png"
              alt="Inmobiliaria Montaño"
              className="h-16 w-auto object-contain drop-shadow-lg"
            />
            {data.coBrandingTitle && (
              <span className="text-xs font-black tracking-wider text-orange-400 uppercase bg-[#1D0F38] px-3 py-1.5 rounded-lg border border-[#5E1754]/50">
                {data.coBrandingTitle}
              </span>
            )}
          </div>

          {/* PRICE PILL HEADER */}
          <div className="bg-gradient-to-br from-[#1E1038] to-[#0E061D] border-2 border-[#E85D04] rounded-2xl px-4 py-2 shadow-[0_0_20px_rgba(232,93,4,0.4)] flex flex-col items-end min-w-[160px]">
            <span className="text-[9px] font-black text-orange-400 tracking-widest uppercase">
              {data.pricePrefix || 'VALOR DEL MÓDULO'}
            </span>
            <span className="text-xl sm:text-2xl font-black text-white leading-none mt-0.5">
              {data.priceAmount}
            </span>
          </div>
        </div>

        {/* HERO TITLE CON AUTO-AJUSTE */}
        <div className="mt-2.5 flex flex-col">
          <span className="text-[28px] sm:text-[32px] font-black leading-[0.95] text-white tracking-tight uppercase">
            {data.mainHeadline || 'TU CASA LISTA PARA VIVIR'}
          </span>
          {data.subHeadline && (
            <span className="text-xs sm:text-sm font-black text-[#FF6B00] tracking-wide uppercase truncate mt-0.5 max-w-[420px]">
              {data.subHeadline}
            </span>
          )}
          <div className="w-16 h-1 bg-[#FF6B00] rounded-full my-1.5" />
        </div>
      </div>

      {/* MIDDLE SECTION: SPECS & PHOTO */}
      <div className="relative z-10 px-7 grid grid-cols-12 gap-3.5 my-auto items-center">
        {/* LEFT COLUMN: SPECS BADGE */}
        <div className="col-span-5 flex flex-col gap-2">
          {/* MODEL / AREA BADGE */}
          <div className="bg-[#1D0F38] border border-[#5E1754]/60 rounded-2xl p-3 shadow-xl flex flex-col">
            <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider">
              {data.locationBadgeTitle || 'VIVIENDA MODULAR'}
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {data.amenities[0]?.label || '32 M²'}
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-300">
              {data.locationBadgeSubtitle || 'Llave en mano'}
            </span>
          </div>

          {/* AMENITIES BADGES */}
          <div className="flex flex-col gap-1.5">
            {data.amenities.slice(1, 4).map((item) => (
              <div key={item.id} className="bg-[#160B2C] border border-[#5E1754]/40 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-200 truncate">
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: HOUSE PHOTO */}
        <div className="col-span-7 h-[260px] relative rounded-2xl overflow-hidden border-2 border-[#E85D04] shadow-[0_0_25px_rgba(232,93,4,0.35)]">
          {data.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.imageUrl}
              alt="Módulo / Proyecto"
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${data.imageScale || 1}) translate(${data.imageOffsetX || 0}px, ${data.imageOffsetY || 0}px)`,
              }}
            />
          ) : (
            <div className="w-full h-full bg-[#1A1230] flex items-center justify-center text-slate-400 text-sm">
              Sin imagen
            </div>
          )}
        </div>
      </div>

      {/* LAUNCH OFFER / BONUS BANNER (PROMINENTE) */}
      <div className="relative z-10 mx-7 my-1">
        <div className="bg-gradient-to-r from-[#E85D04] via-[#FF6B00] to-[#E85D04] rounded-xl p-3 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/20 p-1.5 rounded-lg shrink-0">
              <FireIcon size={18} color="#ffffff" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-wider uppercase text-white">
                {data.sloganBottom || '¡OFERTA LANZAMIENTO!'}
              </span>
              <span className="text-xs font-bold text-orange-100">
                Consultá por planes de financiación y opciones a medida
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER RIBBON CON MÁXIMO PROTAGONISMO WEB */}
      <div className="relative z-10 mx-6 mb-4">
        <div className="bg-[#0E061B] border-2 border-[#E85D04]/80 shadow-[0_0_25px_rgba(232,93,4,0.4)] rounded-2xl px-5 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <PinLocationIcon size={18} color="#FF7A00" />
            <span className="font-extrabold text-slate-100 text-xs tracking-tight">
              {data.locationCity || 'San José'}
            </span>
          </div>

          <div className="h-5 w-px bg-orange-500/40" />

          <div className="flex items-center gap-2">
            <PhoneCallIcon size={18} color="#FF7A00" />
            <span className="font-black text-white text-xs tracking-wider">
              {data.phone || '092 776 715'}
            </span>
          </div>

          <div className="h-5 w-px bg-orange-500/40" />

          {/* WEBSITE URL DESTACADO */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#E85D04]/30 to-[#FFA000]/30 px-3 py-1.5 rounded-xl border border-[#E85D04] shadow-xs">
            <GlobeWebIcon size={17} color="#FFA500" />
            <span className="font-black text-amber-300 text-xs tracking-tight">
              www.inmobiliariamontano.uy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
