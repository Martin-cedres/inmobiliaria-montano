'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ShieldCheck, Eye, Compass } from 'lucide-react';

interface AdminLocationPickerProps {
  lat: number;
  lng: number;
  isExactLocation: boolean;
  radiusMeters: number;
  onChangeLocation: (lat: number, lng: number) => void;
  onChangeExactLocation: (isExact: boolean) => void;
  onChangeRadiusMeters: (radius: number) => void;
}

const customIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div style="position: relative; display: inline-flex; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
      <span style="position: absolute; width: 44px; height: 44px; background-color: rgba(232, 93, 4, 0.25); border-radius: 9999px; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <div style="
        background: linear-gradient(135deg, #5E1754 0%, #350A2F 100%);
        border: 2.5px solid #E85D04;
        color: white;
        border-radius: 9999px;
        padding: 6px 14px;
        font-weight: 900;
        font-size: 11px;
        letter-spacing: 0.025em;
        box-shadow: 0 10px 20px -3px rgba(94, 23, 84, 0.6), 0 4px 10px rgba(232, 93, 4, 0.4);
        display: flex;
        align-items: center;
        gap: 7px;
        white-space: nowrap;
      ">
        <span style="width: 8px; height: 8px; background-color: #E85D04; border-radius: 9999px; display: inline-block; box-shadow: 0 0 8px #E85D04;"></span>
        <span>Arrastrar o Hacer clic</span>
      </div>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// Click Handler Sub-component for Leaflet Map
function LocationMarker({
  lat,
  lng,
  isExactLocation,
  radiusMeters,
  onMapClick,
}: {
  lat: number;
  lng: number;
  isExactLocation: boolean;
  radiusMeters: number;
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <>
      {isExactLocation ? (
        <Marker position={[lat, lng]} icon={customIcon} />
      ) : (
        <Circle
          center={[lat, lng]}
          radius={radiusMeters}
          pathOptions={{
            color: '#5E1754',
            fillColor: '#E85D04',
            fillOpacity: 0.3,
            weight: 2,
            dashArray: '6, 6',
          }}
        />
      )}
    </>
  );
}

export const AdminLocationPicker: React.FC<AdminLocationPickerProps> = ({
  lat,
  lng,
  isExactLocation,
  radiusMeters,
  onChangeLocation,
  onChangeExactLocation,
  onChangeRadiusMeters,
}) => {
  const [tempLat, setTempLat] = useState(lat.toString());
  const [tempLng, setTempLng] = useState(lng.toString());

  const handleManualLatChange = (val: string) => {
    setTempLat(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      onChangeLocation(parsed, lng);
    }
  };

  const handleManualLngChange = (val: string) => {
    setTempLng(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      onChangeLocation(lat, parsed);
    }
  };

  return (
    <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2 text-[#5E1754] font-black text-sm uppercase tracking-wider">
          <Compass className="w-4 h-4 text-[#E85D04]" />
          <span>Ubicación Geográfica en el Mapa</span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Hacé clic en el mapa para posicionar el marcador en San José de Mayo.
        </p>
      </div>

      {/* Map Privacy Switch & Radio Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Toggle Exact Pin vs Approximate Area Circle */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <label className="block text-xs font-extrabold uppercase text-slate-700">
            Modo de Privacidad del Mapa
          </label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => onChangeExactLocation(false)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                !isExactLocation
                  ? 'bg-[#191024] text-amber-300 shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zona (~{radiusMeters}m)</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeExactLocation(true)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                isExactLocation
                  ? 'bg-[#5E1754] text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>Pin Exacto</span>
            </button>
          </div>
        </div>

        {/* Coordenadas & Radius Input */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          {!isExactLocation ? (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Radio de Cobertura (metros)
              </label>
              <select
                value={radiusMeters}
                onChange={(e) => onChangeRadiusMeters(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
              >
                <option value={200}>200 metros (Radio pequeño)</option>
                <option value={300}>300 metros (Recomendado estándar)</option>
                <option value={500}>500 metros (Zona amplia / Sub Urbana)</option>
                <option value={1000}>1000 metros (1 km / Chacras)</option>
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Latitud</label>
                <input
                  type="text"
                  value={tempLat}
                  onChange={(e) => handleManualLatChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Longitud</label>
                <input
                  type="text"
                  value={tempLng}
                  onChange={(e) => handleManualLngChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-mono font-bold"
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Picker Leaflet Map */}
      <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-300 shadow-inner relative">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomright" />
          <LocationMarker
            lat={lat}
            lng={lng}
            isExactLocation={isExactLocation}
            radiusMeters={radiusMeters}
            onMapClick={(newLat, newLng) => {
              onChangeLocation(newLat, newLng);
              setTempLat(newLat.toFixed(6));
              setTempLng(newLng.toFixed(6));
            }}
          />
        </MapContainer>

        <div className="absolute bottom-2 left-2 z-[1000] bg-black/75 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-mono font-semibold">
          Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}
        </div>
      </div>

    </div>
  );
};

export default AdminLocationPicker;
