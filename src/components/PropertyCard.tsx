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

            {/* Unified Features & Badges Grid (Un Solo Recuadro Gris con Iconos Homogéneos) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 my-3 py-2 px-2.5 bg-slate-50 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-700 border border-slate-100">
              {/* Badges de Gran Predio / Industrial / Rural (Opcionales) */}
              {(property.features?.hectaresAmount || property.features?.isHectares || (property.features?.plotAreaM2 && property.features.plotAreaM2 >= 10000)) ? (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap text-slate-700" title="Superficie Total">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    {property.features.hectaresAmount
                      ? `${property.features.hectaresAmount.toLocaleString('es-UY')} Ha`
                      : property.features.isHectares && property.features.plotAreaM2 && property.features.plotAreaM2 < 1000
                      ? `${property.features.plotAreaM2} Ha`
                      : `${((property.features?.plotAreaM2 || 0) / 10000).toLocaleString('es-UY')} Ha`}
                  </span>
                </div>
              ) : null}

              {property.features?.fractionable ? (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap text-slate-700" title="Fraccionamiento">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    {property.features?.minFractionM2
                      ? `Fracc. desde ${property.features.minFractionM2.toLocaleString('es-UY')} m²`
                      : 'Fraccionable'}
                  </span>
                </div>
              ) : null}

              {property.features?.routeFrontage ? (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap text-slate-700" title="Frente sobre Ruta / Conectividad">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Milestone className="w-3.5 h-3.5" />
                  </span>
                  <span>{property.features.routeFrontage}</span>
                </div>
              ) : null}

              {!!property.features?.pricePerM2 && property.features.pricePerM2 > 0 ? (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap text-slate-700" title="Precio por Unidad">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <DollarSign className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    USD {property.features.pricePerM2.toLocaleString('es-UY')} / {property.features.priceUnitType || 'm²'}
                  </span>
                </div>
              ) : null}

              {property.features?.soilTopography ? (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap text-slate-700" title="Topografía">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Layers className="w-3.5 h-3.5" />
                  </span>
                  <span>{property.features.soilTopography}</span>
                </div>
              ) : null}

              {property.features?.gatedPerimeter ? (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap text-slate-700" title="Seguridad">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                  <span>Predio Cerrado</span>
                </div>
              ) : null}

              {/* Comodidades estándar */}
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
              {!!property.features.floors && property.features.floors > 1 && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Plantas / Pisos">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Building className="w-3.5 h-3.5" />
                  </span>
                  <span>{property.features.floors} Plantas</span>
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
              {!property.features?.hectaresAmount && !property.features?.isHectares && !!property.features.plotAreaM2 && property.features.plotAreaM2 > 0 && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Superficie del Terreno">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                  <span>{property.features.plotAreaM2.toLocaleString('es-UY')} m² terr.</span>
                </div>
              )}
              {!!property.features.frontMeters && property.features.frontMeters > 0 && !property.features.routeFrontage && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Metros de Frente">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Compass className="w-3.5 h-3.5" />
                  </span>
                  <span>{property.features.frontMeters}m Frente</span>
                </div>
              )}
              {(property.features.fondo || property.features.garden) && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Fondo">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Trees className="w-3.5 h-3.5" />
                  </span>
                  <span>Fondo</span>
                </div>
              )}
              {property.features.patio && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Patio">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Trees className="w-3.5 h-3.5" />
                  </span>
                  <span>Patio</span>
                </div>
              )}
              {property.features.barbacoa && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Barbacoa">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Flame className="w-3.5 h-3.5" />
                  </span>
                  <span>Barbacoa</span>
                </div>
              )}
              {(property.features.parrillero || property.features.barbecue) && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Parrillero">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Flame className="w-3.5 h-3.5" />
                  </span>
                  <span>Parrillero</span>
                </div>
              )}
              {(property.features.cochera || (property.features.carAccess && !property.features.cocheraTechada && !property.features.garage)) && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Cochera">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Car className="w-3.5 h-3.5" />
                  </span>
                  <span>Cochera</span>
                </div>
              )}
              {(property.features.cocheraTechada || property.features.garage) && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Cochera Techada">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Car className="w-3.5 h-3.5" />
                  </span>
                  <span>Cochera Techada</span>
                </div>
              )}
              {property.features.oseWater && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Agua de OSE">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Droplets className="w-3.5 h-3.5" />
                  </span>
                  <span>Agua OSE</span>
                </div>
              )}
              {!!property.features.coneatIndex && property.features.coneatIndex > 0 && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Índice CONEAT">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Trees className="w-3.5 h-3.5" />
                  </span>
                  <span>CONEAT {property.features.coneatIndex}</span>
                </div>
              )}
              {property.guarantees && property.guarantees.length > 0 && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Garantías Aceptadas">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                  <span>Garantías: {property.guarantees.join(', ')}</span>
                </div>
              )}
              {property.features.titlesUpToDate && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Títulos al Día">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <FileCheck className="w-3.5 h-3.5" />
                  </span>
                  <span>Títulos al Día</span>
                </div>
              )}
              {property.features.bankCreditEligible && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Apta Crédito Bancario">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <Landmark className="w-3.5 h-3.5" />
                  </span>
                  <span>Apta Crédito</span>
                </div>
              )}
              {property.features.acceptsTradeIn && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs whitespace-nowrap" title="Acepta Permuta">
                  <span className="p-0.5 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </span>
                  <span>Acepta Permuta</span>
                </div>
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
