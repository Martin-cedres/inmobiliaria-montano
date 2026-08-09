'use client';

import dynamic from 'next/dynamic';
import React from 'react';

interface AdminLocationPickerProps {
  lat: number;
  lng: number;
  isExactLocation: boolean;
  radiusMeters: number;
  onChangeLocation: (lat: number, lng: number) => void;
  onChangeExactLocation: (isExact: boolean) => void;
  onChangeRadiusMeters: (radius: number) => void;
}

const DynamicAdminLocationPicker = dynamic<AdminLocationPickerProps>(
  () => import('@/components/AdminLocationPicker'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 space-y-2 animate-pulse border border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cargando Selector de Ubicación...</span>
      </div>
    ),
  }
);

export const AdminLocationPickerWrapper: React.FC<AdminLocationPickerProps> = (props) => {
  return <DynamicAdminLocationPicker {...props} />;
};

export default AdminLocationPickerWrapper;
