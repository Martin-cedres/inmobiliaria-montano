'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { MapPin } from 'lucide-react';

interface PropertyMapProps {
  lat: number;
  lng: number;
  title: string;
  neighborhood: string;
  isExactLocation?: boolean;
  radiusMeters?: number;
  zoom?: number;
  heightClass?: string;
}

// Next.js Dynamic Import with SSR disabled for Leaflet compatibility
const DynamicPropertyMap = dynamic<PropertyMapProps>(
  () => import('@/components/PropertyMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] sm:h-[450px] bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-400 space-y-3 animate-pulse border border-slate-800">
        <div className="w-12 h-12 rounded-full bg-[#5E1754]/50 flex items-center justify-center text-amber-400">
          <MapPin className="w-6 h-6 animate-bounce" />
        </div>
        <p className="text-xs font-bold tracking-wider uppercase text-slate-300">Cargando Mapa Interactivo...</p>
        <p className="text-[11px] text-slate-500">San José de Mayo, Uruguay</p>
      </div>
    ),
  }
);

export const PropertyMapWrapper: React.FC<PropertyMapProps> = (props) => {
  return <DynamicPropertyMap {...props} />;
};

export default PropertyMapWrapper;
