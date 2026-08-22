'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, Navigation, ShieldCheck, Eye } from 'lucide-react';

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

// Custom Leaflet Pin Icon in Montaño Brand colors (#5E1754 Purple & #E85D04 Orange)
const createCustomPin = (titleText: string) => {
  return L.divIcon({
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
          <span>${titleText}</span>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

export const PropertyMap: React.FC<PropertyMapProps> = ({
  lat,
  lng,
  title,
  neighborhood,
  isExactLocation = false,
  radiusMeters = 300,
  zoom = 15,
  heightClass = 'h-[380px] sm:h-[450px]',
}) => {
  const [mapType, setMapType] = useState<'vector' | 'satellite'>('vector');

  const tileLayers = {
    vector: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 group z-0 isolate">
      
      {/* Top Map Floating Header (Barra unificada responsiva: Badge a la izquierda, Toggle a la derecha sin colisiones) */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Privacy Badge */}
        <div className="pointer-events-auto flex-shrink-0">
          {!isExactLocation ? (
            <div className="bg-[#191024]/90 backdrop-blur-md text-amber-300 text-xs px-2.5 sm:px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-md border border-purple-500/30">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
              <span className="hidden sm:inline">Ubicación Aproximada (~{radiusMeters}m)</span>
              <span className="sm:hidden text-[11px]">Zona Aprox. (~{radiusMeters}m)</span>
            </div>
          ) : (
            <div className="bg-[#5E1754]/90 backdrop-blur-md text-white text-xs px-2.5 sm:px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-md border border-amber-500/30">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 flex-shrink-0" />
              <span className="text-[11px] sm:text-xs">Ubicación Exacta</span>
            </div>
          )}
        </div>

        {/* Right: Vector vs Satellite Layer Toggle Button */}
        <div className="pointer-events-auto flex-shrink-0 bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200 flex items-center space-x-0.5 sm:space-x-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMapType('vector')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center space-x-1 sm:space-x-1.5 text-[11px] sm:text-xs ${
              mapType === 'vector'
                ? 'bg-[#5E1754] text-white shadow'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Mapa</span>
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center space-x-1 sm:space-x-1.5 text-[11px] sm:text-xs ${
              mapType === 'satellite'
                ? 'bg-[#E85D04] text-white shadow'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Satelital</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map React Container */}
      <div className={`w-full ${heightClass}`}>
        <style>{`
          .leaflet-control-attribution {
            display: none !important;
          }
        `}</style>
        <MapContainer
          center={[lat, lng]}
          zoom={zoom}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution={tileLayers[mapType].attribution}
            url={tileLayers[mapType].url}
            maxZoom={19}
          />
          {mapType === 'satellite' && (
            <TileLayer
              attribution='&copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
              maxZoom={19}
              opacity={0.9}
            />
          )}

          {/* Zoom Control posicionado limpiamente en bottomright */}
          <ZoomControl position="bottomright" />

          {isExactLocation ? (
            /* Pin Exacto */
            <Marker position={[lat, lng]} icon={createCustomPin(neighborhood)}>
              <Popup className="custom-leaflet-popup">
                <div className="p-1 space-y-1 text-slate-800">
                  <h4 className="font-bold text-sm text-[#5E1754]">{title}</h4>
                  <p className="text-xs text-slate-600 font-semibold">{neighborhood}, San José de Mayo</p>
                </div>
              </Popup>
            </Marker>
          ) : (
            /* Círculo de Zona Aproximada por Privacidad */
            <Circle
              center={[lat, lng]}
              radius={radiusMeters}
              pathOptions={{
                color: '#5E1754',
                fillColor: '#E85D04',
                fillOpacity: 0.25,
                weight: 2.5,
                dashArray: '6, 6',
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-slate-800">
                  <h4 className="font-bold text-xs text-[#5E1754]">Zona {neighborhood}</h4>
                  <p className="text-xs text-slate-600">
                    Ubicación aproximada del inmueble por razones de seguridad.
                  </p>
                </div>
              </Popup>
            </Circle>
          )}
        </MapContainer>
      </div>

      {/* Bottom Bar: External Navigation Links (Google Maps & Waze) */}
      <div className="bg-[#191024] text-slate-300 px-4 py-3 border-t border-[#2D1D42] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-[#E85D04]" />
          <span className="font-medium text-slate-300">
            {isExactLocation
              ? `Ubicación: ${neighborhood}, San José de Mayo`
              : `Radio de referencia: ${neighborhood} (~${radiusMeters}m de cobertura)`}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white text-slate-400 font-bold transition-colors underline decoration-amber-500/50 flex items-center space-x-1"
          >
            <span>Abrir en Google Maps</span>
          </a>
          <span className="text-slate-600">•</span>
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 text-slate-400 font-bold transition-colors underline decoration-sky-500/50 flex items-center space-x-1"
          >
            <span>Abrir en Waze</span>
          </a>
        </div>
      </div>

    </div>
  );
};

export default PropertyMap;
