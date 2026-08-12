'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Property } from '@/types/property';
import { Loader2, MapPin } from 'lucide-react';

interface CatalogMapWrapperProps {
  properties: Property[];
  heightClass?: string;
  activePropertyId?: string | null;
  onSelectProperty?: (propertyId: string) => void;
}

const CatalogMap = dynamic(() => import('./CatalogMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] lg:h-[650px] rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center space-y-3 text-white">
      <Loader2 className="w-8 h-8 text-[#E85D04] animate-spin" />
      <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
        <MapPin className="w-4 h-4 text-amber-400" />
        <span>Cargando mapa interactivo de propiedades...</span>
      </div>
    </div>
  ),
});

export const CatalogMapWrapper: React.FC<CatalogMapWrapperProps> = (props) => {
  return <CatalogMap {...props} />;
};
