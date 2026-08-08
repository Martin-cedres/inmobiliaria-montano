'use client';

import React from 'react';
import { Property } from '@/types/property';
import { buildPropertyWhatsAppLink } from '@/utils/whatsapp';
import { Bed, Bath, Maximize2, Car, MapPin, CheckCircle2, MessageCircle, Building } from 'lucide-react';

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
        return <span className="bg-[#E85D04] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow tracking-wider">Oportunidad / Rebajado</span>;
      default:
        return <span className="bg-[#5E1754] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow tracking-wider">Disponible</span>;
    }
  };

  const mainImage = property.images.find((img) => img.isMain) || property.images[0];

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-purple-100/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      
      {/* Image Container */}
      <div className="relative h-52 sm:h-56 bg-slate-900 overflow-hidden">
        {/* Placeholder gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent z-10" />
        
        <img
          src={mainImage?.webpUrl || mainImage?.blobUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
          {getStatusBadge()}
          <span className="bg-[#350A2F]/90 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-amber-400/30">
            Ref. #{property.codeRef}
          </span>
        </div>

        {/* Operation Badge Tag */}
        <div className="absolute top-3 right-3 z-20">
          <span className="bg-[#E85D04] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow">
            {property.operation === 'alquiler' ? 'Alquiler' : property.operation === 'proyecto' ? 'Proyecto' : 'En Venta'}
          </span>
        </div>

        {/* Bottom Location & Price Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
          <div className="flex items-center space-x-1 text-white text-xs font-semibold drop-shadow">
            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">{property.location.neighborhood}, {property.location.city}</span>
          </div>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline space-x-1.5 mb-1.5">
            <span className="text-2xl font-black text-[#5E1754]">
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
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#5E1754] transition-colors">
            {property.title}
          </h3>

          {/* Quantitative Attributes Bar */}
          <div className="grid grid-cols-3 gap-2 my-3.5 py-2.5 px-3 bg-purple-50/50 rounded-xl text-xs font-semibold text-slate-700">
            {property.features.bedrooms !== undefined && (
              <div className="flex items-center space-x-1.5" title="Dormitorios">
                <Bed className="w-4 h-4 text-[#5E1754]" />
                <span>{property.features.bedrooms} Dorm</span>
              </div>
            )}
            {property.features.bathrooms !== undefined && (
              <div className="flex items-center space-x-1.5" title="Baños">
                <Bath className="w-4 h-4 text-[#5E1754]" />
                <span>{property.features.bathrooms} Baño</span>
              </div>
            )}
            {property.features.builtAreaM2 !== undefined && (
              <div className="flex items-center space-x-1.5" title="m² Edificados">
                <Maximize2 className="w-4 h-4 text-[#E85D04]" />
                <span>{property.features.builtAreaM2} m²</span>
              </div>
            )}
            {property.features.garage && (
              <div className="flex items-center space-x-1.5" title="Garage">
                <Car className="w-4 h-4 text-[#5E1754]" />
                <span>Garage</span>
              </div>
            )}
            {property.features.floors !== undefined && (
              <div className="flex items-center space-x-1.5" title="Plantas / Niveles">
                <Building className="w-4 h-4 text-[#5E1754]" />
                <span>{property.features.floors} Nivel</span>
              </div>
            )}
          </div>

          {/* Special Feature Badges (Credito Bancario, OSE, PH, Garantias) */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {property.features.bankCreditEligible && (
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center space-x-1">
                <span>🏛️ Apta Crédito</span>
              </span>
            )}
            {property.features.oseWater && (
              <span className="bg-sky-100 text-sky-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center space-x-1">
                <span>💧 Agua OSE</span>
              </span>
            )}
            {property.features.phRegime && (
              <span className="bg-purple-100 text-purple-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                📜 Régimen PH
              </span>
            )}
            {property.guarantees && property.guarantees.length > 0 && (
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                🛡️ Garantías: {property.guarantees.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Action Button: Direct WhatsApp Consultation */}
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#E85D04] hover:bg-[#FF8500] active:scale-98 text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow flex items-center justify-center space-x-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#E85D04]" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
