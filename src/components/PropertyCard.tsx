'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';
import { buildPropertyWhatsAppLink } from '@/utils/whatsapp';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { Bed, Bath, Maximize2, Car, MapPin, Landmark, ShieldCheck, Sparkles, Clock, CheckCircle2, AlertCircle, FileCheck, ArrowLeftRight, Compass, Trees, Building, Ruler, Flame, Droplets, LayoutGrid, Milestone, DollarSign, Layers, Zap } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, index }) => {
  const [imageError, setImageError] = useState<boolean>(false);
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
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10 pointer-events-none" />

          <Image
            src={imageError || !mainImage ? '/logo.png' : mainImage}
            alt={property.title}
            fill
            unoptimized={true}
            priority={index !== undefined && index < 2}
            loading={index !== undefined && index < 2 ? 'eager' : 'lazy'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover w-full h-full group-hover/link:scale-105 transition-transform duration-500 ${
              imageError ? 'object-contain p-6 bg-[#350A2F]' : ''
            }`}
            onError={() => setImageError(true)}
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
                {property.location.neighborhood || property.location.address}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body Info */}
        <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3 text-left">
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
            <div className="flex items-baseline space-x-1.5 mb-1.5 min-h-[2rem]">
              {property.price.priceMode === 'consultar' || property.price.amount === 0 ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center text-xs sm:text-sm font-black text-white bg-[#5e1754] hover:bg-[#45103e] active:scale-95 px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
                  title="Consultar precio"
                >
                  Consultar Precio
                </a>
              ) : property.price.priceMode === 'reservado' ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center text-xs sm:text-sm font-black text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  title="Precio Reservado"
                >
                  Precio Reservado
                </a>
              ) : (
                <>
                  <span className="text-2xl font-black text-[#5e1754]">
                    {property.price.priceMode === 'desde' && <span className="text-sm font-extrabold text-slate-500 mr-1.5">Desde</span>}
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
                </>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.75rem] flex items-center group-hover/link:text-[#5e1754] transition-colors">
              {property.title}
            </h3>

            {/* Compact Primary Features Bar */}
            {(() => {
              const f = property.features || {};
              const items: { icon: React.ElementType; label: string; title: string }[] = [];

              // 1. Superficie Rural / Hectáreas
              if (f.hectaresAmount || f.isHectares || (f.plotAreaM2 && f.plotAreaM2 >= 10000)) {
                const ha = f.hectaresAmount
                  ? `${f.hectaresAmount.toLocaleString('es-UY')} Ha`
                  : f.isHectares && f.plotAreaM2 && f.plotAreaM2 < 1000
                  ? `${f.plotAreaM2} Ha`
                  : `${((f.plotAreaM2 || 0) / 10000).toLocaleString('es-UY')} Ha`;
                items.push({ icon: Maximize2, label: ha, title: 'Superficie Rural' });
              }

              // 2. Dormitorios
              if (f.bedrooms && f.bedrooms > 0) {
                items.push({ icon: Bed, label: `${f.bedrooms} Dorm`, title: 'Dormitorios' });
              }

              // 3. Baños
              if (f.bathrooms && f.bathrooms > 0) {
                items.push({ icon: Bath, label: `${f.bathrooms} Baño${f.bathrooms > 1 ? 's' : ''}`, title: 'Baños' });
              }

              // 4. Superficie Edificada
              if (f.builtAreaM2 && f.builtAreaM2 > 0 && items.length < 3) {
                items.push({ icon: Building, label: `${f.builtAreaM2} m² edif.`, title: 'Superficie Edificada' });
              }

              // 5. Superficie Terreno (si no es campo y no se superó límite)
              if (!f.hectaresAmount && !f.isHectares && f.plotAreaM2 && f.plotAreaM2 > 0 && items.length < 3) {
                items.push({ icon: Maximize2, label: `${f.plotAreaM2.toLocaleString('es-UY')} m² terr.`, title: 'Superficie Terreno' });
              }

              // 6. Cochera / Garage
              if ((f.cocheraTechada || f.garage || f.cochera || f.carAccess) && items.length < 3) {
                items.push({ icon: Car, label: f.cocheraTechada || f.garage ? 'Garage' : 'Cochera', title: 'Acceso Vehicular' });
              }

              // 7. Fondo / Barbacoa / Parrillero (si aún hay espacio)
              if ((f.barbacoa || f.parrillero || f.barbecue) && items.length < 3) {
                items.push({ icon: Flame, label: f.barbacoa ? 'Barbacoa' : 'Parrillero', title: 'Parrillero / Barbacoa' });
              } else if ((f.fondo || f.garden || f.patio) && items.length < 3) {
                items.push({ icon: Trees, label: f.fondo || f.garden ? 'Fondo' : 'Patio', title: 'Espacio Exterior' });
              }

              // 8. Títulos / Apta Crédito (si quedan huecos)
              if (f.bankCreditEligible && items.length < 3) {
                items.push({ icon: Landmark, label: 'Apta Banco', title: 'Apta Crédito Bancario' });
              }

              // Conteo total de características
              let totalCount = 0;
              if (f.bedrooms) totalCount++;
              if (f.bathrooms) totalCount++;
              if (f.floors && f.floors > 1) totalCount++;
              if (f.builtAreaM2) totalCount++;
              if (f.plotAreaM2 || f.hectaresAmount) totalCount++;
              if (f.frontMeters || f.routeFrontage) totalCount++;
              if (f.cochera || f.cocheraTechada || f.garage || f.carAccess) totalCount++;
              if (f.fondo || f.garden || f.patio) totalCount++;
              if (f.barbacoa || f.parrillero || f.barbecue) totalCount++;
              if (f.oseWater) totalCount++;
              if (f.uteElectric) totalCount++;
              if (f.sanitation) totalCount++;
              if (f.fiberOptic) totalCount++;
              if (f.titlesUpToDate) totalCount++;
              if (f.bankCreditEligible) totalCount++;
              if (f.acceptsTradeIn) totalCount++;
              if (f.fractionable) totalCount++;
              if (f.gatedPerimeter || f.perimeterFence) totalCount++;
              if (property.guarantees && property.guarantees.length > 0) totalCount++;

              const displayItems = items.slice(0, 3);
              const remaining = Math.max(0, totalCount - displayItems.length);

              if (displayItems.length === 0) return null;

              return (
                <div className="flex items-center gap-1.5 my-2.5 py-1.5 px-2 bg-slate-50 rounded-xl text-[11px] font-semibold text-slate-700 border border-slate-100 overflow-hidden">
                  {displayItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center space-x-1 px-1.5 py-0.5 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap min-w-0"
                        title={item.title}
                      >
                        <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754] flex-shrink-0">
                          <Icon className="w-3 h-3" />
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                    );
                  })}

                  {remaining > 0 && (
                    <span className="text-[10px] font-bold text-[#5e1754] bg-[#5e1754]/10 px-1.5 py-0.5 rounded-md flex-shrink-0 whitespace-nowrap" title="Ver todas las comodidades en la ficha">
                      +{remaining} más
                    </span>
                  )}
                </div>
              );
            })()}
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
