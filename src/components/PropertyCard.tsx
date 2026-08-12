'use client';

import React from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { buildPropertyWhatsAppLink } from '@/utils/whatsapp';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { Bed, Bath, Maximize2, Car, MapPin, Landmark, ShieldCheck, Sparkles, Clock, CheckCircle2, AlertCircle, FileCheck, ArrowLeftRight, Compass, Trees, Building, Ruler } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const whatsappUrl = buildPropertyWhatsAppLink(property);

  // Status Badge
  const renderStatusBadge = () => {
    switch (property.status) {
      case 'nuevo':
        return (
          <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg shadow-sm border border-white/20 tracking-wider">
            NUEVO INGRESO
          </span>
        );
      case 'reservado':
        return (
          <span className="bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg shadow-sm border border-white/20 tracking-wider">
            RESERVADO
          </span>
        );
      case 'vendido':
        return (
          <span className="bg-slate-700/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg shadow-sm border border-white/20 tracking-wider">
            VENDIDO
          </span>
        );
      case 'alquilado':
        return (
          <span className="bg-purple-900/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg shadow-sm border border-white/20 tracking-wider">
            ALQUILADO
          </span>
        );
      case 'oportunidad':
        return (
          <span className="bg-orange-500/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg shadow-sm border border-white/20 tracking-wider">
            OPORTUNIDAD
          </span>
        );
      default:
        return null;
    }
  };

  // Operation Badge
  const renderOperationBadge = () => {
    switch (property.operation) {
      case 'alquiler':
        return (
          <span className="bg-[#5e1754]/95 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-sm border border-white/20 tracking-wider">
            ALQUILER
          </span>
        );
      case 'proyecto':
        return (
          <span className="bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-sm border border-white/20 tracking-wider">
            PROYECTO
          </span>
        );
      default:
        return (
          <span className="bg-[#e85d04]/95 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-sm border border-white/20 tracking-wider">
            EN VENTA
          </span>
        );
    }
  };

  // Human Readable Category Label
  const getCategoryLabel = () => {
    switch (property.category) {
      case 'casa':
        return 'Casa';
      case 'apartamento':
        return 'Apartamento';
      case 'terreno':
        return 'Terreno / Solar';
      case 'chacra':
        return 'Chacra / Campo';
      case 'local':
        return 'Local Comercial';
      case 'deposito':
        return 'Depósito / Galpón';
      case 'proyecto':
        return 'Proyecto';
      case 'modulo':
        return 'Módulo Habitacional';
      default:
        return 'Inmueble';
    }
  };

  const isUnavailable = property.status === 'vendido' || property.status === 'alquilado';
  const isReserved = property.status === 'reservado';

  const mainImage = property.images && property.images.length > 0 ? (
    typeof property.images[0] === 'string' ? property.images[0] : (property.images.find((img) => img.isMain) || property.images[0])?.webpUrl || (property.images.find((img) => img.isMain) || property.images[0])?.blobUrl
  ) : null;

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-[#5e1754]/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group ${
        isUnavailable
          ? 'opacity-75 grayscale hover:grayscale-0 transition-all duration-500'
          : isReserved
          ? 'opacity-90 hover:-translate-y-1'
          : 'hover:-translate-y-1.5'
      }`}
    >
      {/* Clickable Card Area linking to /propiedad/[slug] */}
      <Link href={`/propiedad/${property.slug}`} className="flex flex-col flex-1 text-left cursor-pointer group/link">
        
        {/* Aspect Ratio 4:3 Image Container */}
        <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/25 to-transparent z-10 pointer-events-none" />

          <img
            src={mainImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
            alt={property.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
              (e.target as HTMLImageElement).className = 'w-full h-full object-contain p-6 bg-[#350A2F]';
            }}
            className="w-full h-full object-cover group-hover/link:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Top Dominant Operation Badge (Upper Left) */}
          <div className="absolute top-3 left-3 z-20">
            {renderOperationBadge()}
          </div>

          {/* Commercial Status Badge (Upper Right - Only if applies) */}
          <div className="absolute top-3 right-3 z-20">
            {renderStatusBadge()}
          </div>

          {/* Location Overlay (Bottom Left on Image) */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
            <div className="flex items-center space-x-1.5 text-white text-xs font-bold drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">
                {property.location.neighborhood}, {property.location.city}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body Info */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 text-left">
          <div>
            {/* Header Row: Category Label (Left) & Ref Code (Right) */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#5e1754]">
                {getCategoryLabel()}
              </span>
              <span className="font-mono text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                Ref. #{property.codeRef}
              </span>
            </div>

            {/* Price Header */}
            <div className="flex items-baseline space-x-1.5 mb-1.5">
              <span className="text-2xl font-black text-[#5e1754]">
                {property.price.currency === 'USD' ? 'USD' : 'UYU $'} {property.price.amount.toLocaleString('es-UY')}
                {property.operation === 'alquiler' && property.price.period && property.price.period !== 'total' && (
                  <span className="text-xs text-slate-500 font-bold"> / {property.price.period}</span>
                )}
              </span>
              {property.price.priceDrop && property.price.originalAmount && (
                <span className="text-xs line-through text-slate-400 ml-2 font-semibold">
                  {property.price.currency === 'USD' ? 'USD' : 'UYU $'} {property.price.originalAmount.toLocaleString('es-UY')}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.75rem] flex items-center group-hover/link:text-[#5e1754] transition-colors">
              {property.title}
            </h3>

            {/* Quantitative Features Grid */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 my-3 py-2 px-2.5 bg-slate-50 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-700 border border-slate-100">
              {!!property.features.bedrooms && property.features.bedrooms > 0 && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Dormitorios">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Bed className="w-3.5 h-3.5" />
                  </span>
                  <span>{property.features.bedrooms} Dorm</span>
                </div>
              )}
              {!!property.features.bathrooms && property.features.bathrooms > 0 && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Baños">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Bath className="w-3.5 h-3.5" />
                  </span>
                  <span>{property.features.bathrooms} Baño</span>
                </div>
              )}
              {!!property.features.builtAreaM2 && property.features.builtAreaM2 > 0 && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Superficie Edificada">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Building className="w-3.5 h-3.5" />
                  </span>
                  <span>{property.features.builtAreaM2} m² edif.</span>
                </div>
              )}
              {!!property.features.plotAreaM2 && property.features.plotAreaM2 > 0 && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Superficie del Terreno">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                  <span>{property.features.plotAreaM2} m² terr.</span>
                </div>
              )}
              {property.features.garage && !property.features.builtAreaM2 && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Garage">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Car className="w-3.5 h-3.5" />
                  </span>
                  <span>1 Garage</span>
                </div>
              )}
            </div>

            {/* Outlined Minimalist Contextual Badges */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {!!property.features.coneatIndex && property.features.coneatIndex > 0 && (
                <span className="bg-slate-50 text-slate-700 border border-slate-200/80 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <Trees className="w-3 h-3 text-[#5e1754]" />
                  <span>CONEAT {property.features.coneatIndex}</span>
                </span>
              )}
              {!!property.features.frontMeters && property.features.frontMeters > 0 && (
                <span className="bg-slate-50 text-slate-700 border border-slate-200/80 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <Compass className="w-3 h-3 text-[#5e1754]" />
                  <span>{property.features.frontMeters}m Frente</span>
                </span>
              )}
              {property.guarantees && property.guarantees.length > 0 && (
                <span className="bg-slate-50 text-slate-700 border border-slate-200/80 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-[#5e1754]" />
                  <span>Garantías: {property.guarantees.join(', ')}</span>
                </span>
              )}
              {property.features.titlesUpToDate && (
                <span className="bg-slate-50 text-slate-700 border border-slate-200/80 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <FileCheck className="w-3 h-3 text-[#5e1754]" />
                  <span>Títulos al Día</span>
                </span>
              )}
              {property.features.bankCreditEligible && (
                <span className="bg-slate-50 text-slate-700 border border-slate-200/80 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <Landmark className="w-3 h-3 text-[#5e1754]" />
                  <span>Apta Crédito</span>
                </span>
              )}
              {property.features.acceptsTradeIn && (
                <span className="bg-slate-50 text-slate-700 border border-slate-200/80 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <ArrowLeftRight className="w-3 h-3 text-[#5e1754]" />
                  <span>Acepta Permuta</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* WhatsApp Conversion CTA Button Outside Link */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-slate-100 mt-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#e85d04] hover:bg-[#ff7518] active:scale-98 text-white py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm shadow-xs flex items-center justify-center space-x-2 transition-all hover:shadow-orange-500/20"
        >
          <WhatsAppIcon className="w-4 h-4 text-white" />
          <span>Consultar por WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
