import React from 'react';
import { FlyerData } from './flyerTypes';
import { CLOSURE_THEME_MAP } from './closurePresets';
import { PinLocationIcon } from './FlyerIcons';

interface FlyerCanvasSocialProofProps {
  data: FlyerData;
}

export const FlyerCanvasSocialProof: React.FC<FlyerCanvasSocialProofProps> = ({ data }) => {
  const ratio = data.aspectRatio || '9:16';
  const isStory = ratio === '9:16';
  const isSquare = ratio === '1:1';

  const width = 720;
  const height = isStory ? 1280 : isSquare ? 720 : 900;

  const outcome = data.closureOutcome || 'VENDIÓ';
  const theme = CLOSURE_THEME_MAP[outcome];

  const photoHeight = isStory ? 330 : isSquare ? 210 : 250;
  const paddingClass = isStory
    ? 'pt-14 pb-16 px-8'
    : isSquare
    ? 'pt-4 pb-4 px-5'
    : 'pt-6 pb-6 px-6';

  const zoneText = data.locationBadgeSubtitle || data.locationCity || 'San José de Mayo';
  const refBadge = data.codeRef
    ? `Ref. #${data.codeRef}`
    : data.locationBadgeTitle
    ? data.locationBadgeTitle.split('•')[0].trim()
    : 'MONTAÑO';

  return (
    <div
      id="flyer-social-proof-canvas"
      className={`relative overflow-hidden select-none flex flex-col justify-between font-sans ${paddingClass}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'linear-gradient(165deg, #2D0B28 0%, #4A1142 42%, #23071F 100%)',
        boxSizing: 'border-box',
        letterSpacing: '-0.01em',
      }}
    >
      {/* Fondo fotográfico sutil + degradado corporativo */}
      {data.imageUrl && (
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ height: `${Math.round(height * 0.48)}px`, opacity: 0.16 }}
        >
          <img
            src={data.imageUrl}
            alt=""
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(45,11,40,0.65) 0%, rgba(45,11,40,0.45) 45%, #3B0E35 96%)',
            }}
          />
        </div>
      )}

      {/* Resplandores ambientales */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,184,0,0.20) 0%, rgba(255,184,0,0) 70%)',
        }}
      />
      <div
        className="absolute -bottom-20 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(232,93,4,0.22) 0%, rgba(232,93,4,0) 70%)',
        }}
      />

      {/* 1. CABECERA CORPORATIVA BLANCA */}
      <header
        className={`relative z-10 bg-white/98 rounded-2xl flex items-center justify-between gap-3 border-2 border-[#FFB800]/45 shadow-xl shrink-0 ${
          isSquare ? 'px-4 py-2.5' : 'px-5 py-3'
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src="/logo-clean.png"
            alt="Inmobiliaria Montaño"
            crossOrigin="anonymous"
            className={`${isSquare ? 'h-12' : isStory ? 'h-16' : 'h-14'} w-auto object-contain shrink-0`}
          />
          <div className="flex flex-col leading-tight min-w-0">
            <span
              className={`${
                isSquare ? 'text-sm' : 'text-base'
              } font-black tracking-tight text-[#5E1754] uppercase truncate`}
            >
              Inmobiliaria Montaño
            </span>
            <span className={`${isSquare ? 'text-[11px]' : 'text-xs'} font-bold text-slate-500 truncate`}>
              Ventas • Alquileres • Tasaciones
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end pl-3 border-l-2 border-slate-200 shrink-0 leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500 text-xs tracking-wider">★★★★★</span>
            <span className="text-sm font-black text-slate-900">5.0</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 mt-0.5">Calificación en Google</span>
          {!isSquare && (
            <span className="mt-1 text-[10px] font-extrabold text-[#5E1754] bg-[#F5EAF4] px-2 py-0.5 rounded-full">
              San José de Mayo
            </span>
          )}
        </div>
      </header>

      {/* 2. GANCHO SUPERIOR (VISIBLE EN 9:16 Y 4:5; COMPACTO EN 1:1) */}
      {!isSquare && (
        <div className={`relative z-10 text-center shrink-0 ${isStory ? 'my-2' : 'my-1'}`}>
          <div className="inline-flex items-center gap-1.5 bg-[#FFB800]/15 border border-[#FFB800]/55 text-[#FFD166] text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full mb-1.5">
            <span>{theme.kicker}</span>
          </div>
          <h2
            className={`${
              isStory ? 'text-[40px]' : 'text-[33px]'
            } font-black text-white leading-[1.08] tracking-tight drop-shadow`}
          >
            {theme.hookTitle}
          </h2>
        </div>
      )}

      {/* 3. TARJETA BLANCA PROTAGONISTA */}
      <main
        className={`relative z-10 bg-white rounded-[28px] shadow-2xl border-2 border-white/95 overflow-hidden flex flex-col justify-between ${
          isSquare ? 'p-4 gap-2.5 flex-1 my-2.5' : isStory ? 'p-6 gap-4' : 'p-5 gap-3'
        }`}
      >
        {/* Barra superior de acento */}
        <div
          className="absolute top-0 inset-x-0 h-2"
          style={{ background: theme.accentGradient }}
        />

        {/* Foto Real + Faja Diagonal Oficial (VENDIÓ / ALQUILÓ / RESERVÓ) */}
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md shrink-0 mt-1"
          style={{ height: `${photoHeight}px` }}
        >
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt={data.closurePropertyTitle || 'Propiedad'}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${data.imageScale || 1}) translate(${data.imageOffsetX || 0}px, ${data.imageOffsetY || 0}px)`,
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
              Sin Fotografía
            </div>
          )}

          {/* Gradiente sutil inferior para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25 pointer-events-none" />

          {/* Badge superior categoría + referencia */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20">
            <span className="bg-white/95 text-[#5E1754] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-sm">
              {data.subHeadline || 'Propiedad en San José'}
            </span>
            <span className="bg-black/65 backdrop-blur-sm text-white font-mono text-[11px] font-extrabold px-2.5 py-1 rounded-lg border border-white/25">
              {refBadge}
            </span>
          </div>

          {/* Faja Diagonal Oficial de Alto Impacto */}
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center py-2.5 rotate-[-11deg] scale-x-125 pointer-events-none border-y-[3px] border-white shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
            style={{ backgroundColor: theme.ribbonBg }}
          >
            <span
              className={`font-black ${
                isStory ? 'text-4xl' : 'text-3xl'
              } leading-none uppercase tracking-widest text-white drop-shadow`}
            >
              {outcome}
            </span>
          </div>

          {/* Zona abajo a la izquierda */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-20">
            <div className="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 shadow-sm max-w-full">
              <PinLocationIcon size={14} color="#FFB800" />
              <span className="truncate">{zoneText}</span>
            </div>
          </div>
        </div>

        {/* Título limpio (sin precio por privacidad) */}
        <h3
          className={`${
            isStory ? 'text-[23px]' : isSquare ? 'text-lg' : 'text-xl'
          } font-black text-slate-900 leading-snug tracking-tight`}
        >
          {data.closurePropertyTitle || 'Propiedad gestionada con éxito en San José'}
        </h3>

        {/* Dos cajas de información: Prueba Social + Demanda Activa en Espera */}
        <div className={`grid ${isSquare ? 'grid-cols-2 gap-2' : 'grid-cols-1 gap-2.5'}`}>
          <div
            className={`bg-slate-50 border border-slate-200 rounded-2xl ${
              isSquare ? 'p-2.5' : 'px-4 py-3'
            }`}
          >
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Operación Concretada
              </div>
              <p
                className={`${
                  isSquare ? 'text-[11px] leading-snug' : isStory ? 'text-[15px] leading-snug' : 'text-xs leading-snug'
                } font-bold text-slate-800 mt-0.5`}
              >
                {data.closureProofText}
              </p>
            </div>
          </div>

          <div
            className={`bg-slate-50 border border-slate-200 rounded-2xl ${
              isSquare ? 'p-2.5' : 'px-4 py-3'
            }`}
          >
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Clientes en Espera
              </div>
              <p
                className={`${
                  isSquare ? 'text-[11px] leading-snug' : isStory ? 'text-[15px] leading-snug' : 'text-xs leading-snug'
                } font-bold text-slate-800 mt-0.5`}
              >
                {data.closureDemandText}
              </p>
            </div>
          </div>
        </div>

        {/* CTA WhatsApp Captación Propietarios */}
        <div
          className={`rounded-2xl text-white flex items-center justify-between gap-3 shadow-lg ${
            isSquare ? 'px-4 py-2.5' : 'px-5 py-3.5'
          }`}
          style={{ background: theme.ctaGradient }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`${
                isSquare ? 'w-9 h-9' : 'w-11 h-11'
              } rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-md`}
            >
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.72 2.74 4.23 3.73.59.23 1.05.37 1.41.48.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43z" />
              </svg>
            </div>
            <div className="min-w-0 leading-tight">
              <div className={`${isSquare ? 'text-xs' : 'text-base'} font-black truncate`}>
                {data.closureCtaTitle || '¿Querés vender o alquilar tu propiedad?'}
              </div>
              <div className={`${isSquare ? 'text-[10px]' : 'text-xs'} font-semibold text-white/90 mt-0.5`}>
                {isStory ? 'Respondé este estado o escribinos' : 'Escribinos directo por WhatsApp'}
              </div>
            </div>
          </div>

          <div
            className={`bg-white/15 border border-white/40 rounded-xl font-black whitespace-nowrap shrink-0 ${
              isSquare ? 'px-2.5 py-1 text-sm' : 'px-3.5 py-2 text-base'
            }`}
          >
            {data.phone || '092 776 715'}
          </div>
        </div>
      </main>

      {/* 4. FOOTER CORPORATIVO (SIN MENCIÓN DE ESCRIBANO) */}
      <footer className="relative z-10 flex items-center justify-center gap-3 shrink-0">
        <div
          className={`inline-flex items-center bg-white/10 border border-[#FFB800]/35 rounded-full text-[#FFD166] font-extrabold ${
            isSquare ? 'px-4 py-1.5 text-xs' : 'px-6 py-2.5 text-sm'
          }`}
        >
          25 de Mayo 338, San José • {data.website || 'www.inmobiliariamontano.uy'}
        </div>

        {data.showQrCode && data.qrCodeDataUrl && !isStory && (
          <div className="bg-white p-1 rounded-xl shadow-md shrink-0">
            <img
              src={data.qrCodeDataUrl}
              alt="QR Web"
              crossOrigin="anonymous"
              className="w-10 h-10 object-contain"
            />
          </div>
        )}
      </footer>
    </div>
  );
};
