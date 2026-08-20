import React from 'react';
import { FlyerData } from './flyerTypes';
import {
  PinLocationIcon,
  WaterIcon,
  AreaM2Icon,
  PhoneCallIcon,
  GlobeWebIcon,
  CheckCircleIcon,
  TreeFondoIcon,
  HouseExtraIcon,
  CommercialIcon,
} from './FlyerIcons';

interface TemplateProps {
  data: FlyerData;
}

export const FlyerTemplateChacra: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div
      id="flyer-chacra-canvas"
      className="relative w-[600px] h-[900px] bg-gradient-to-b from-[#120A24] via-[#0E061C] to-[#07030E] text-white font-sans overflow-hidden select-none flex flex-col justify-between"
      style={{
        boxSizing: 'border-box',
        letterSpacing: '-0.01em',
      }}
    >
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* TOP SECTION: LOGO PROMINENTE & PRECIO */}
      <div className="relative z-10 px-7 pt-6 pb-1">
        <div className="flex items-center justify-between">
          {/* LOGO PROMINENTE */}
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-clean.png"
              alt="Inmobiliaria Montaño"
              className="h-16 w-auto object-contain drop-shadow-lg"
            />
          </div>

          {/* PRECIO BOX HERO */}
          {data.priceAmount && (
            <div className="bg-gradient-to-br from-[#1E1038] to-[#0E061D] border-2 border-[#E85D04] shadow-[0_0_20px_rgba(232,93,4,0.4)] rounded-2xl px-4 py-2 flex flex-col items-end min-w-[160px]">
              <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">
                {data.pricePrefix || 'POR SOLO'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-white leading-none mt-0.5">{data.priceAmount}</span>
            </div>
          )}
        </div>

        {/* HEADLINE */}
        <div className="mt-2.5 flex flex-col">
          <span className="text-[30px] sm:text-[34px] font-black leading-none text-white tracking-tight uppercase">
            {data.mainHeadline || 'CHACRA EN VENTA'}
          </span>
          {data.subHeadline && (
            <div className="mt-1.5 bg-[#1B1033] border border-orange-500/40 rounded-xl px-3.5 py-1 self-start shadow-sm max-w-[420px]">
              <span className="text-xs sm:text-sm font-black text-orange-400 uppercase tracking-wide truncate block">
                {data.subHeadline}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MIDDLE SECTION: BADGES & PHOTO */}
      <div className="relative z-10 px-7 grid grid-cols-12 gap-3.5 flex-1 items-center my-1">
        {/* LEFT COLUMN: CHACRA HIGHLIGHT BADGES */}
        <div className="col-span-5 flex flex-col gap-2">
          {data.chacraBadges && data.chacraBadges.length > 0 ? (
            data.chacraBadges.map((badge, idx) => (
              <div key={idx} className="flex gap-2.5 items-start bg-gradient-to-r from-[#1E1038] to-[#120824] border border-[#5E1754]/40 p-2.5 rounded-xl shadow-xs">
                <div className="bg-[#E85D04] text-white p-1.5 rounded-md shrink-0 mt-0.5 shadow-xs">
                  {badge.icon === 'water' ? (
                    <WaterIcon size={14} color="#ffffff" />
                  ) : badge.icon === 'area' ? (
                    <AreaM2Icon size={14} color="#ffffff" />
                  ) : badge.icon === 'tree' ? (
                    <TreeFondoIcon size={14} color="#ffffff" />
                  ) : (
                    <PinLocationIcon size={14} color="#ffffff" />
                  )}
                </div>
                <div className="flex flex-col leading-tight overflow-hidden">
                  <span className="text-xs font-black text-white uppercase tracking-tight truncate">
                    {badge.title}
                  </span>
                  <span className="text-[10px] text-slate-300 font-medium mt-0.5 leading-snug line-clamp-2">
                    {badge.desc}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="flex gap-2.5 items-start bg-gradient-to-r from-[#1E1038] to-[#120824] border border-[#5E1754]/40 p-2.5 rounded-xl">
                <div className="bg-[#E85D04] text-white p-1.5 rounded-md shrink-0">
                  <PinLocationIcon size={14} color="#ffffff" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-black text-white uppercase">ZONA SUB URBANA</span>
                  <span className="text-[10px] text-slate-300 mt-0.5">Entorno natural y pacífico</span>
                </div>
              </div>
              <div className="flex gap-2.5 items-start bg-gradient-to-r from-[#1E1038] to-[#120824] border border-[#5E1754]/40 p-2.5 rounded-xl">
                <div className="bg-[#E85D04] text-white p-1.5 rounded-md shrink-0">
                  <WaterIcon size={14} color="#ffffff" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-black text-white uppercase">AGUA DE OSE</span>
                  <span className="text-[10px] text-slate-300 mt-0.5">Servicio disponible</span>
                </div>
              </div>
              <div className="flex gap-2.5 items-start bg-gradient-to-r from-[#1E1038] to-[#120824] border border-[#5E1754]/40 p-2.5 rounded-xl">
                <div className="bg-[#E85D04] text-white p-1.5 rounded-md shrink-0">
                  <AreaM2Icon size={14} color="#ffffff" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-black text-white uppercase">GRAN POTENCIAL</span>
                  <span className="text-[10px] text-slate-300 mt-0.5">Excelente inversión</span>
                </div>
              </div>
            </>
          )}

          {/* Checklist */}
          {data.bulletPoints && data.bulletPoints.length > 0 && (
            <div className="flex flex-col gap-1 mt-0.5">
              {data.bulletPoints.slice(0, 3).map((bp, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-200">
                  <CheckCircleIcon size={12} color="#E85D04" />
                  <span className="leading-tight truncate font-semibold">{bp}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LARGE MAIN PHOTO */}
        <div className="col-span-7 h-[330px] relative rounded-2xl overflow-hidden border-2 border-[#E85D04] shadow-[0_0_25px_rgba(232,93,4,0.35)]">
          {data.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.imageUrl}
              alt="Propiedad"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </div>

      {/* SPECS & SLOGAN BAR (PROMINENTE) */}
      <div className="relative z-10 px-7 py-2 flex items-center justify-between">
        {/* AMENITIES PILLS */}
        <div className="flex items-center gap-2">
          {data.amenities.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-[#190E30] border border-[#5E1754]/50 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-xs">
              <div className="text-orange-400">
                {item.icon === 'm2' ? (
                  <AreaM2Icon size={16} color="#E85D04" />
                ) : item.icon === 'house' ? (
                  <HouseExtraIcon size={16} color="#E85D04" />
                ) : item.icon === 'commercial' ? (
                  <CommercialIcon size={16} color="#E85D04" />
                ) : (
                  <TreeFondoIcon size={16} color="#E85D04" />
                )}
              </div>
              <span className="text-[11px] font-black text-white uppercase tracking-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* SLOGAN (GRANDE Y PROTAGONISTA) */}
        <div className="flex flex-col items-end text-right">
          <span className="text-sm font-black text-white tracking-wider uppercase">
            {data.sloganTop || 'TU LUGAR'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#FF6B00] tracking-tight uppercase leading-none mt-0.5 drop-shadow-sm">
            {data.sloganBottom || 'PARA VIVIR MEJOR'}
          </span>
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
