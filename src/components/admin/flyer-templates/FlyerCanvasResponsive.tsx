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

export const FlyerCanvasResponsive: React.FC<TemplateProps> = ({ data }) => {
  const ratio = data.aspectRatio || '1:1';
  const isCollage = data.layoutMode === 'collage';

  // Configuración de dimensiones según formato
  let width = 720;
  let height = 720;
  if (ratio === '9:16') {
    width = 720;
    height = 1280;
  } else if (ratio === '4:5') {
    width = 720;
    height = 900;
  }

  // Altura del bloque fotográfico según aspect ratio
  let photoHeight = ratio === '9:16' ? 680 : ratio === '4:5' ? 490 : 380;
  if (isCollage && ratio === '9:16') {
    photoHeight = 700;
  }

  // Operación y estilo
  const isAlquiler = (data.mainHeadline || '').toLowerCase().includes('alquiler');
  const isProyecto = (data.mainHeadline || '').toLowerCase().includes('proyecto') || (data.mainHeadline || '').toLowerCase().includes('modulo');

  const opBg = isAlquiler
    ? 'bg-gradient-to-r from-[#5E1754] to-[#7A1E6E]'
    : isProyecto
    ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
    : 'bg-gradient-to-r from-[#E85D04] to-[#FF7A00]';

  const displayedAmenities = (data.amenities || []).slice(0, ratio === '9:16' ? 6 : ratio === '4:5' ? 6 : 4);

  return (
    <div
      id="flyer-responsive-canvas"
      className="relative bg-[#FAF9F6] text-slate-900 font-sans overflow-hidden select-none flex flex-col justify-between"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        boxSizing: 'border-box',
        letterSpacing: '-0.01em',
      }}
    >
      {/* 1. CABECERA SUPERIOR INSTITUCIONAL */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between bg-white border-b border-slate-200/80 shadow-2xs z-20 shrink-0">
        <div className="flex items-center gap-3">
          {/* Logo Isotipo */}
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Inmobiliaria Montaño"
              className="h-10 w-auto object-contain drop-shadow-xs"
              crossOrigin="anonymous"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E85D04]">Inmobiliaria</span>
              <span className="text-sm font-black tracking-tight text-[#5E1754]">MONTAÑO</span>
            </div>
          </div>
        </div>

        {/* Badges de Operación y Referencia */}
        <div className="flex items-center gap-2">
          <span className={`${opBg} text-white font-black text-xs uppercase px-3.5 py-1 rounded-full shadow-sm tracking-wider`}>
            {data.mainHeadline || 'EN VENTA'}
          </span>
          <span className="bg-slate-100 text-slate-700 border border-slate-200 font-mono font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-2xs">
            {data.locationBadgeTitle ? data.locationBadgeTitle.split('•')[0].trim() : 'REF. #MON'}
          </span>
        </div>
      </div>

      {/* 2. ÁREA FOTOGRÁFICA (SIN RECORTES DIAGONALES) */}
      <div className="px-6 pt-3 pb-1 shrink-0" style={{ height: `${photoHeight}px` }}>
        {!isCollage ? (
          // MODO SINGLE: 1 Foto Gigante Protagonista
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-md border-2 border-slate-200/80 bg-slate-900 group">
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt="Propiedad"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${data.imageScale || 1}) translate(${data.imageOffsetX || 0}px, ${data.imageOffsetY || 0}px)`,
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                Sin Fotografía
              </div>
            )}
            {/* Ubicación Overlay inferior sobre la foto */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="bg-black/65 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 shadow-sm">
                <PinLocationIcon size={14} color="#FFA000" />
                <span>{data.locationBadgeSubtitle || data.locationCity || 'San José de Mayo'}</span>
              </div>
            </div>
          </div>
        ) : (
          // MODO COLLAGE: 1 Principal + 2 Secundarias
          <div className="w-full h-full grid grid-cols-12 gap-2.5">
            {/* Foto Principal (Izquierda / Dominante) */}
            <div className="col-span-8 relative rounded-2xl overflow-hidden shadow-md border-2 border-slate-200/80 bg-slate-900">
              {data.imageUrl ? (
                <img
                  src={data.imageUrl}
                  alt="Principal"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${data.imageScale || 1}) translate(${data.imageOffsetX || 0}px, ${data.imageOffsetY || 0}px)`,
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Principal</div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/65 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1">
                <PinLocationIcon size={12} color="#FFA000" />
                <span>{data.locationBadgeSubtitle || data.locationCity || 'San José'}</span>
              </div>
            </div>

            {/* 2 Fotos Secundarias (Derecha Apiladas) */}
            <div className="col-span-4 flex flex-col gap-2 h-full">
              <div className="flex-1 relative rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-800">
                {data.secondaryImage1Url ? (
                  <img
                    src={data.secondaryImage1Url}
                    alt="Detalle 1"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] font-medium p-2 text-center bg-slate-100">
                    Foto 2
                  </div>
                )}
              </div>
              <div className="flex-1 relative rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-800">
                {data.secondaryImage2Url ? (
                  <img
                    src={data.secondaryImage2Url}
                    alt="Detalle 2"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] font-medium p-2 text-center bg-slate-100">
                    Foto 3
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. BLOQUE COMERCIAL: PRECIO, TÍTULO Y AMENITIES */}
      <div className="px-6 py-2 flex-1 flex flex-col justify-around">
        {/* Fila de Precio & Título */}
        <div className="flex items-baseline justify-between gap-3 border-b border-slate-200/60 pb-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {data.pricePrefix || 'VALOR DE PUBLICACIÓN'}
            </span>
            <span className="text-3xl sm:text-4xl font-black text-[#5E1754] tracking-tight">
              {data.priceAmount || 'U$S CONSULTAR'}
            </span>
          </div>

          {/* Slogan o Subtítulo Destacado */}
          {(data.sloganTop || data.subHeadline) && (
            <div className="text-right max-w-[340px]">
              <span className="text-xs font-extrabold text-[#E85D04] uppercase block leading-tight">
                {data.subHeadline || data.sloganTop}
              </span>
              {data.sloganBottom && (
                <span className="text-[11px] font-semibold text-slate-600 block mt-0.5 leading-snug">
                  {data.sloganBottom}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Grilla de Características / Comodidades */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-1">
          {displayedAmenities.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden"
            >
              <div className="p-1 rounded-md bg-[#5E1754]/10 text-[#5E1754] shrink-0">
                {renderAmenityIcon(item.icon, '#5E1754', 16)}
              </div>
              <span className="text-xs font-bold text-slate-800 truncate uppercase tracking-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FOOTER DE CONVERSIÓN CON QR Y CONTACTO */}
      <div className="bg-[#1D102F] text-white px-6 py-3 flex items-center justify-between border-t-2 border-[#E85D04] shadow-lg shrink-0 z-20">
        {/* Contacto Directo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 shrink-0">
            {/* WhatsApp Logo SVG */}
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Atención Personalizada • Daniel Montaño
            </span>
            <span className="text-base sm:text-lg font-black text-amber-300 tracking-tight">
              {data.phone || '092 776 715'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {data.website || 'inmobiliariamontano.uy'}
            </span>
          </div>
        </div>

        {/* Código QR Dinámico (si está habilitado) */}
        {data.showQrCode && data.qrCodeDataUrl && (
          <div className="flex items-center gap-2.5 bg-white p-1.5 rounded-xl shadow-md shrink-0">
            <img
              src={data.qrCodeDataUrl}
              alt="QR Ficha Web"
              className="w-14 h-14 object-contain"
            />
            <div className="flex flex-col text-slate-900 leading-tight max-w-[85px]">
              <span className="text-[9px] font-black uppercase text-[#5E1754]">Escaneá</span>
              <span className="text-[8px] font-medium text-slate-600">para ver fotos y mapa</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
