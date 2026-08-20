import React from 'react';
import { FlyerData } from './flyerTypes';
import {
  BedIcon,
  BathIcon,
  KitchenIcon,
  GarageIcon,
  TreeFondoIcon,
  BbqIcon,
  AreaM2Icon,
  HouseExtraIcon,
  CommercialIcon,
  WaterIcon,
  FireIcon,
  PoolIcon,
  PinLocationIcon,
  PhoneCallIcon,
  GlobeWebIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from './FlyerIcons';

interface TemplateProps {
  data: FlyerData;
}

const renderAmenityIcon = (iconName: string, color = '#E85D04', size = 18) => {
  switch (iconName) {
    case 'bed':
      return <BedIcon size={size} color={color} />;
    case 'bath':
      return <BathIcon size={size} color={color} />;
    case 'kitchen':
      return <KitchenIcon size={size} color={color} />;
    case 'garage':
      return <GarageIcon size={size} color={color} />;
    case 'tree':
      return <TreeFondoIcon size={size} color={color} />;
    case 'bbq':
      return <BbqIcon size={size} color={color} />;
    case 'm2':
      return <AreaM2Icon size={size} color={color} />;
    case 'commercial':
      return <CommercialIcon size={size} color={color} />;
    case 'water':
      return <WaterIcon size={size} color={color} />;
    case 'fire':
      return <FireIcon size={size} color={color} />;
    case 'pool':
      return <PoolIcon size={size} color={color} />;
    case 'house':
      return <HouseExtraIcon size={size} color={color} />;
    case 'shield':
      return <ShieldCheckIcon size={size} color={color} />;
    case 'check':
    default:
      return <CheckCircleIcon size={size} color={color} />;
  }
};

export const FlyerTemplateClassic: React.FC<TemplateProps> = ({ data }) => {
  const words = (data.mainHeadline || 'EN VENTA').trim().split(' ');
  const firstWord = words[0] || 'EN';
  const restWords = words.slice(1).join(' ') || 'VENTA';
  const isMultiWord = words.length > 2;

  return (
    <div
      id="flyer-classic-canvas"
      className="relative w-[600px] h-[900px] bg-[#FAF9F6] text-slate-900 font-sans overflow-hidden select-none flex flex-col justify-between"
      style={{
        boxSizing: 'border-box',
        letterSpacing: '-0.01em',
      }}
    >
      {/* ============================================================ */}
      {/* 1. BACKGROUND SVG LAYERS: PHOTO + DARK ANGULAR SECTION + NEON */}
      {/* ============================================================ */}
      <div className="absolute inset-0 w-[600px] h-[900px] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 600 900" preserveAspectRatio="none">
          <defs>
            {/* Top-Right Angular Property Photo Mask */}
            <clipPath id="photoAngleClipClassicV4">
              <polygon points="270,0 600,0 600,560 210,630" />
            </clipPath>

            {/* Bottom Dark Navy/Purple Angular Section */}
            <linearGradient id="darkNavyGradClassicV4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1038" />
              <stop offset="40%" stopColor="#140A26" />
              <stop offset="100%" stopColor="#0B0515" />
            </linearGradient>

            {/* Laser Line Gradient */}
            <linearGradient id="laserLineGradClassicV4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE600" />
              <stop offset="40%" stopColor="#FF7A00" />
              <stop offset="80%" stopColor="#E85D04" />
              <stop offset="100%" stopColor="#FF9500" />
            </linearGradient>

            {/* Neon Glow Filter */}
            <filter id="neonLaserGlowClassicV4" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#FF6B00" floodOpacity="1" />
              <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor="#FFA000" floodOpacity="0.8" />
              <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor="#E85D04" floodOpacity="0.5" />
            </filter>

            {/* Light ambient gradient for left side */}
            <linearGradient id="lightBgGradClassicV4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F9F8F5" />
              <stop offset="100%" stopColor="#EAE7E0" />
            </linearGradient>
          </defs>

          {/* Light Left Side Base */}
          <rect x="0" y="0" width="600" height="900" fill="url(#lightBgGradClassicV4)" />

          {/* Property Image */}
          {data.imageUrl && (
            <g clipPath="url(#photoAngleClipClassicV4)">
              <image
                href={data.imageUrl}
                x="200"
                y="0"
                width="400"
                height="630"
                preserveAspectRatio="xMidYMid slice"
                transform={`scale(${data.imageScale || 1}) translate(${data.imageOffsetX || 0}, ${data.imageOffsetY || 0})`}
                style={{ transformOrigin: 'center' }}
              />
              <linearGradient id="photoSkyGlowClassicV4" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
              </linearGradient>
              <rect x="200" y="0" width="400" height="630" fill="url(#photoSkyGlowClassicV4)" />
            </g>
          )}

          {/* Golden Upper Diagonal Edge */}
          <line
            x1="270"
            y1="0"
            x2="210"
            y2="630"
            stroke="url(#laserLineGradClassicV4)"
            strokeWidth="3.5"
            filter="url(#neonLaserGlowClassicV4)"
          />

          {/* Dark Navy Lower/Right Angular Section */}
          <polygon
            points="0,770 210,630 330,630 600,340 600,900 0,900"
            fill="url(#darkNavyGradClassicV4)"
          />

          {/* Striking Neon Laser Cut separating Light and Dark zones */}
          <polyline
            points="0,770 210,630 330,630 600,340"
            fill="none"
            stroke="url(#laserLineGradClassicV4)"
            strokeWidth="4"
            filter="url(#neonLaserGlowClassicV4)"
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 2. TOP-LEFT SECTION: LOGO PROMINENTE, TITLES, BADGES         */}
      {/* ============================================================ */}
      <div className="relative z-10 px-7 pt-6 pb-0 flex flex-col max-w-[265px]">
        {/* LOGO INMOBILIARIA MONTAÑO (GRANDE Y PROTAGONISTA) */}
        <div className="flex items-center mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-clean.png"
            alt="Inmobiliaria Montaño"
            className="h-16 sm:h-18 w-auto object-contain drop-shadow-sm"
          />
        </div>

        {/* HEADLINE: "EN VENTA" */}
        <div className="flex flex-col mt-0.5">
          {isMultiWord ? (
            <span className="text-[28px] font-black leading-[0.92] tracking-tight text-[#160F2B] uppercase">
              {data.mainHeadline}
            </span>
          ) : (
            <>
              <span className="text-[48px] font-black leading-[0.88] tracking-tight text-[#160F2B] uppercase">
                {firstWord}
              </span>
              <span className="text-[60px] font-black leading-[0.88] tracking-tight text-[#E85D04] uppercase drop-shadow-xs">
                {restWords}
              </span>
            </>
          )}
        </div>

        {/* SUBTITLE BADGE: "CASA EN ESQUINA" */}
        {data.subHeadline && (
          <div className="mt-2.5 bg-[#140E26] text-white px-3.5 py-1.5 rounded-xl shadow-md self-start border border-[#2A1D4E] max-w-[245px]">
            <span className="text-xs font-black tracking-wide uppercase truncate block leading-tight">
              {data.subHeadline}
            </span>
          </div>
        )}

        {/* LOCATION BADGE WITH ORANGE PIN */}
        <div className="mt-2.5 flex items-center gap-1.5">
          <div className="text-[#E85D04] shrink-0">
            <PinLocationIcon size={20} color="#E85D04" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-[#160F2B] tracking-tight uppercase leading-none truncate max-w-[210px]">
              {data.locationBadgeTitle || 'SAN JOSÉ'}
            </span>
            {data.locationBadgeSubtitle && (
              <span className="text-[10px] font-bold text-slate-600 uppercase mt-0.5 truncate max-w-[210px]">
                {data.locationBadgeSubtitle}
              </span>
            )}
          </div>
        </div>

        {/* AMENITIES & FEATURES LIST (ESTILO CORPORATIVO MONTAÑO: PÚRPURA Y NARANJA) */}
        <div className="mt-3 flex flex-col gap-2 max-w-[240px]">
          {data.amenities.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2.5 pb-1.5 border-b border-orange-200"
            >
              {/* Box de Ícono estilo Corporativo Web (#5E1754 Púrpura Soft con Ícono Naranja) */}
              <div className="bg-[#5E1754]/10 border border-[#5E1754]/20 p-1.5 rounded-lg shrink-0 shadow-2xs flex items-center justify-center">
                {renderAmenityIcon(item.icon, '#E85D04', 16)}
              </div>
              <span className="text-xs font-black text-[#160F2B] uppercase tracking-wide truncate">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MIDDLE-BOTTOM SECTION: PRICE BOX (LEFT) & SLOGAN (RIGHT)  */}
      {/* ============================================================ */}
      <div className="relative z-10 px-7 flex items-end justify-between mt-auto mb-3">
        {/* PRICE PILL BOX (LEFT) */}
        <div className="bg-gradient-to-br from-[#1E1038] to-[#0E061B] border-2 border-[#E85D04] shadow-[0_0_25px_rgba(232,93,4,0.4)] rounded-2xl px-4 py-3 flex flex-col min-w-[190px] max-w-[220px]">
          <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">
            {data.pricePrefix || 'POR SOLO'}
          </span>
          <div className="flex items-baseline mt-1">
            <span className="text-[28px] font-black text-[#FF6B00] tracking-tight drop-shadow-sm leading-none truncate">
              {data.priceAmount}
            </span>
          </div>
        </div>

        {/* SLOGAN & BULLETS (RIGHT - TIPOGRAFÍA DESTACADA Y VISIBLE) */}
        <div className="flex flex-col items-end text-right max-w-[300px]">
          {/* SLOGAN PRINCIPAL */}
          <span className="text-lg sm:text-xl font-black text-white uppercase tracking-wider leading-tight">
            {data.sloganTop || 'EL HOGAR QUE'}
          </span>
          <span className="text-2xl sm:text-[28px] font-black text-[#FF6B00] uppercase tracking-tight leading-none mt-1 drop-shadow-sm">
            {data.sloganBottom || 'TU FAMILIA MERECE'}
          </span>

          <div className="w-24 h-1.5 bg-[#FF6B00] rounded-full my-2.5 shadow-xs" />

          {/* BULLETS WITH ORANGE CHECKS (LEGIBLES Y PROTAGONISTAS) */}
          <div className="flex flex-col gap-2 items-end">
            {(data.bulletPoints && data.bulletPoints.length > 0
              ? data.bulletPoints
              : ['Ubicación privilegiada', 'Ambientes amplios y luminosos', 'Ideal para tu familia']
            ).slice(0, 3).map((bp, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-100">
                <div className="border-2 border-[#FF6B00] rounded-full p-0.5 text-[#FF6B00] shrink-0">
                  <CheckCircleIcon size={12} color="#FF6B00" />
                </div>
                <span className="font-extrabold text-xs tracking-tight truncate max-w-[240px]">{bp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. BOTTOM FOOTER CONTACT RIBBON CON MÁXIMO PROTAGONISMO WEB  */}
      {/* ============================================================ */}
      <div className="relative z-10 mx-6 mb-4">
        <div className="bg-[#0E061B] border-2 border-[#E85D04]/80 shadow-[0_0_25px_rgba(232,93,4,0.4)] rounded-2xl px-5 py-3 flex items-center justify-between text-xs">
          {/* LOCATION */}
          <div className="flex items-center gap-2">
            <PinLocationIcon size={18} color="#FF7A00" />
            <span className="font-extrabold text-slate-100 text-xs tracking-tight">
              {data.locationCity || 'San José'}
            </span>
          </div>

          <div className="h-5 w-px bg-orange-500/40" />

          {/* PHONE */}
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
