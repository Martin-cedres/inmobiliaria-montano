'use client';

import React from 'react';
import { Property } from '@/types/property';
import { buildPropertyWhatsAppLink } from '@/utils/whatsapp';
import { Bed, Bath, Maximize2, Car, MapPin, MessageCircle, Building } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const whatsappUrl = buildPropertyWhatsAppLink(property);

  // Status Badge Colors & Labels
  const getStatusBadge = () => {
    switch (property.status) {
      case 'nuevo':
        return <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow tracking-wider">Nuevo Ingreso</span>;
      case 'reservado':
        return <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow tracking-wider">Reservado</span>;
      case 'vendido':
        return <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow tracking-wider">Vendido</span>;
      case 'alquilado':
        return <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow tracking-wider">Alquilado</span>;
      case 'oportunidad':
        return <span className="bg-[#e85d04] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow tracking-wider">Oportunidad / Rebajado</span>;
      default:
        return <span className="bg-[#5e1754] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow tracking-wider">Disponible</span>;
    }
  };

  const mainImage = property.images.find((img) => img.isMain) || property.images[0];

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-[#5e1754] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5">
      
      {/* Image Container with Gradient Mask */}
      <div className="relative h-52 sm:h-56 bg-slate-900 overflow-hidden">
        {/* Gradiente de Máscara sobre la Imagen para alto contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent z-10 pointer-events-none" />
        
        <img
          src={mainImage?.webpUrl || mainImage?.blobUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges Overlay (Glassmorphism) */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
          {getStatusBadge()}
          <span className="bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-amber-400/30">
            Ref. #{property.codeRef}
          </span>
        </div>

        {/* Operation Badge Tag (10% Accent Color) */}
        <div className="absolute top-3 right-3 z-20">
          <span className="bg-[#e85d04] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow">
            {property.operation === 'alquiler' ? 'Alquiler' : property.operation === 'proyecto' ? 'Proyecto' : 'En Venta'}
          </span>
        </div>

        {/* Bottom Location Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
          <div className="flex items-center space-x-1.5 text-white text-xs font-semibold drop-shadow">
            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">{property.location.neighborhood}, {property.location.city}</span>
          </div>
        </div>
      </div>

      {/* Card Details Body (60-30-10 Rule) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Price Header (Accent Color) */}
          <div className="flex items-baseline space-x-1.5 mb-1.5">
            <span className="text-2xl font-black text-[#5e1754]">
              {property.price.currency} ${property.price.amount.toLocaleString()}
            </span>
            {property.price.period && (
              <span className="text-xs text-slate-500 font-medium">/{property.price.period}</span>
            )}
            {property.price.priceDrop && property.price.originalAmount && (
              <span className="text-xs line-through text-slate-400 ml-2">
                ${property.price.originalAmount.toLocaleString()}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#5e1754] transition-colors">
            {property.title}
          </h3>

          {/* Iconography Treatment: Unified Rounded Containers */}
          <div className="grid grid-cols-3 gap-2 my-3.5 py-2.5 px-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 border border-slate-100">
            {property.features.bedrooms !== undefined && (
              <div className="flex items-center space-x-1.5" title="Dormitorios">
                <span className="p-1 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                  <Bed className="w-3.5 h-3.5" />
                </span>
                <span>{property.features.bedrooms} Dorm</span>
              </div>
            )}
            {property.features.bathrooms !== undefined && (
              <div className="flex items-center space-x-1.5" title="Baños">
                <span className="p-1 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                  <Bath className="w-3.5 h-3.5" />
                </span>
                <span>{property.features.bathrooms} Baño</span>
              </div>
            )}
            {property.features.builtAreaM2 !== undefined && (
              <div className="flex items-center space-x-1.5" title="m² Edificados">
                <span className="p-1 rounded-md bg-[#e85d04]/10 text-[#e85d04]">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
                <span>{property.features.builtAreaM2} m²</span>
              </div>
            )}
            {property.features.garage && (
              <div className="flex items-center space-x-1.5" title="Garage">
                <span className="p-1 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                  <Car className="w-3.5 h-3.5" />
                </span>
                <span>Garage</span>
              </div>
            )}
            {property.features.floors !== undefined && (
              <div className="flex items-center space-x-1.5" title="Plantas / Niveles">
                <span className="p-1 rounded-md bg-[#5e1754]/10 text-[#5e1754]">
                  <Building className="w-3.5 h-3.5" />
                </span>
                <span>{property.features.floors} Nivel</span>
              </div>
            )}
          </div>

          {/* Special Feature Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {property.features.bankCreditEligible && (
              <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center space-x-1">
                <span>🏛️ Apta Crédito</span>
              </span>
            )}
            {property.features.oseWater && (
              <span className="bg-sky-50 text-sky-900 border border-sky-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center space-x-1">
                <span>💧 Agua OSE</span>
              </span>
            )}
            {property.features.phRegime && (
              <span className="bg-purple-50 text-purple-900 border border-purple-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                📜 Régimen PH
              </span>
            )}
            {property.guarantees && property.guarantees.length > 0 && (
              <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                🛡️ Garantías: {property.guarantees.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* 10% Conversion Button (CTA WhatsApp) */}
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#e85d04] hover:bg-[#ff7518] active:scale-98 text-white py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm shadow flex items-center justify-center space-x-2 transition-all hover:shadow-orange-500/20"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#e85d04]" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
