'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
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
      <div style="
        background-color: #5E1754;
        border: 2.5px solid #E85D04;
        color: white;
        border-radius: 9999px;
        padding: 6px 12px;
        font-weight: 800;
        font-size: 11px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        transform: translate(-50%, -100%);
      ">
        <span style="width: 8px; height: 8px; background-color: #E85D04; border-radius: 9999px; display: inline-block;"></span>
        <span>${titleText}</span>
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
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 group">
      
      {/* Top Map Toolbar / Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center space-x-2">
        
        {/* Vector vs Satellite Layer Toggle Button */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200 flex items-center space-x-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMapType('vector')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              mapType === 'vector'
                ? 'bg-[#5E1754] text-white shadow'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Mapa</span>
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              mapType === 'satellite'
                ? 'bg-[#E85D04] text-white shadow'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Satelital</span>
          </button>
        </div>
      </div>

      {/* Top Left Privacy Badge */}
      <div className="absolute top-3 left-3 z-[1000]">
        {!isExactLocation ? (
          <div className="bg-[#191024]/90 backdrop-blur-md text-amber-300 text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-md border border-purple-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ubicación Aproximada (~{radiusMeters}m)</span>
          </div>
        ) : (
          <div className="bg-[#5E1754]/90 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-md border border-amber-500/30">
            <Eye className="w-4 h-4 text-amber-300" />
            <span>Ubicación Exacta</span>
          </div>
        )}
      </div>

      {/* Leaflet Map React Container */}
      <div className={`w-full ${heightClass}`}>
        <MapContainer
          center={[lat, lng]}
          zoom={zoom}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution={tileLayers[mapType].attribution}
            url={tileLayers[mapType].url}
            maxZoom={19}
          />

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
