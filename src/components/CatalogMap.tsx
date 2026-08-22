'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '@/types/property';
import { Bed, Bath, MapPin, ShieldCheck, Layers, Compass, Plus, Minus } from 'lucide-react';

interface CatalogMapProps {
  properties: Property[];
  heightClass?: string;
  activePropertyId?: string | null;
  onSelectProperty?: (propertyId: string) => void;
}

// Formatear precio compacto estilo Airbnb/Zillow (ej. U$S 145k / $ 16.5k)
function formatCompactPrice(amount: number, currency: string) {
  if (amount >= 1000) {
    const kValue = (amount / 1000).toLocaleString('es-UY', {
      maximumFractionDigits: amount % 1000 === 0 ? 0 : 1,
    });
    return currency === 'USD' ? `U$S ${kValue}k` : `$ ${kValue}k`;
  }
  return `${currency === 'USD' ? 'U$S' : '$'} ${amount}`;
}

// Generar desfasaje determinístico suave (~120m) para propiedades con ubicación confidencial
function getJitteredCoords(id: string, lat: number, lng: number, isExact?: boolean): [number, number] {
  if (isExact !== false) return [lat, lng];
  
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  // Generar desfasaje entre -0.0012 y +0.0012 grados (~100-140 metros)
  const latOffset = (((Math.abs(hash) % 100) / 100) - 0.5) * 0.0024;
  const lngOffset = ((((Math.abs(hash >> 3)) % 100) / 100) - 0.5) * 0.0024;
  
  return [lat + latOffset, lng + lngOffset];
}

// Function to generate compact Leaflet Pin in Montaño Brand Colors
const createCompactPricePin = (priceText: string, isRent: boolean, propId: string) => {
  const badgeBg = isRent ? '#059669' : '#5E1754';
  const borderColor = isRent ? '#10B981' : '#E85D04';

  return L.divIcon({
    className: `custom-catalog-pin pin-${propId}`,
    html: `
      <div class="pin-pill-wrapper" style="position: relative; display: inline-flex; align-items: center; justify-content: center; transform: translate(-50%, -100%); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);">
        <div class="pin-pill" style="
          background: ${badgeBg};
          border: 2px solid ${borderColor};
          color: white;
          border-radius: 9999px;
          padding: 4px 10px;
          font-weight: 900;
          font-size: 11px;
          letter-spacing: -0.01em;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        ">
          <span style="width: 6px; height: 6px; background-color: ${borderColor}; border-radius: 9999px; display: inline-block; box-shadow: 0 0 6px ${borderColor};"></span>
          <span>${priceText}</span>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -30],
  });
};

// Custom Cluster Icon in Montaño Purple & Orange
const createCustomClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, #5E1754 0%, #350A2F 100%);
        border: 2.5px solid #E85D04;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 12px;
        box-shadow: 0 8px 24px rgba(94, 23, 84, 0.65), 0 2px 6px rgba(232, 93, 4, 0.4);
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <span>${count}</span>
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: [40, 40],
  });
};

// Sub-componente memoizado para aislar los markers de los re-renders del activePropertyId
const ClusteredMarkersLayer = React.memo(function ClusteredMarkersLayer({
  properties,
  pinsMap,
  onSelectProperty,
}: {
  properties: Property[];
  pinsMap: Map<string, L.DivIcon>;
  onSelectProperty?: (propertyId: string) => void;
}) {
  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createCustomClusterIcon}
      showCoverageOnHover={false}
      spiderfyOnMaxZoom={true}
      spiderfyDistanceMultiplier={2}
      maxClusterRadius={38}
      zoomToBoundsOnClick={true}
      animate={true}
    >
      {properties.map((prop) => {
        const rawCoords = prop.location.coordinates || {
          lat: -34.3375,
          lng: -56.7136,
        };

        const [lat, lng] = getJitteredCoords(prop.id, rawCoords.lat, rawCoords.lng, prop.location.isExactLocation);
        const priceMode = prop.price.priceMode || (prop.price.amount === 0 ? 'consultar' : 'visible');
        const fullPriceText =
          priceMode === 'consultar' ? 'Consultar Precio' :
          priceMode === 'reservado' ? 'Precio Reservado' :
          `${priceMode === 'desde' ? 'Desde ' : ''}${prop.price.currency === 'USD' ? 'USD' : 'UYU $'} ${prop.price.amount.toLocaleString('es-UY')}`;
        const mainImg = prop.images.find((img) => img.isMain)?.webpUrl || prop.images[0]?.webpUrl || '/logo.png';
        const icon = pinsMap.get(prop.id) || createCompactPricePin('...', false, prop.id);

        return (
          <Marker
            key={prop.id}
            position={[lat, lng]}
            icon={icon}
            eventHandlers={{
              click: (e) => {
                if (e.originalEvent) {
                  L.DomEvent.stopPropagation(e.originalEvent);
                }
                if (onSelectProperty) onSelectProperty(prop.id);
              },
              popupopen: () => {
                if (onSelectProperty) onSelectProperty(prop.id);
              },
            }}
          >
            <Popup
              className="catalog-map-popup"
              maxWidth={280}
              minWidth={250}
              autoPan={true}
              autoPanPadding={[25, 25]}
            >
              <div className="overflow-hidden rounded-2xl text-left bg-white font-sans shadow-lg">
                {/* Img Header */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  <img
                    src={mainImg}
                    alt={prop.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png';
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-[#5E1754] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow">
                      {prop.category}
                    </span>
                  </div>
                  {prop.location.isExactLocation === false && (
                    <div className="absolute top-2 right-2 bg-[#191024]/90 backdrop-blur-md text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center space-x-1 border border-purple-500/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Zona Aproximada</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end text-white drop-shadow-md">
                    <span className="text-sm font-black bg-slate-900/85 backdrop-blur-md px-2 py-0.5 rounded-lg text-amber-300 border border-white/10">
                      {fullPriceText}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                    {prop.title}
                  </h4>

                  <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-medium">
                    <MapPin className="w-3 h-3 text-[#E85D04] flex-shrink-0" />
                    <span className="truncate">{prop.location.neighborhood}, San José</span>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center space-x-3 text-[11px] text-slate-600 font-semibold pt-1 border-t border-slate-100">
                    {!!prop.features.bedrooms && prop.features.bedrooms > 0 && (
                      <div className="flex items-center space-x-1">
                        <Bed className="w-3 h-3 text-[#5E1754]" />
                        <span>{prop.features.bedrooms} Dorm</span>
                      </div>
                    )}
                    {!!prop.features.bathrooms && prop.features.bathrooms > 0 && (
                      <div className="flex items-center space-x-1">
                        <Bath className="w-3 h-3 text-[#5E1754]" />
                        <span>{prop.features.bathrooms} Baño</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
});

// Controlador de Encuadre Dinámico y Transiciones Cinemáticas Suaves (fitBounds & flyTo)
function MapBoundsController({
  properties,
  activePropertyId,
  fitTrigger,
}: {
  properties: Property[];
  activePropertyId?: string | null;
  fitTrigger: number;
}) {
  const map = useMap();

  // Ajuste automático de encuadre al cambiar la lista o presionar el botón de Recentrar
  useEffect(() => {
    if (!properties || properties.length === 0) return;

    const validCoords = properties
      .map((p) => p.location.coordinates)
      .filter((c): c is { lat: number; lng: number } => !!c && typeof c.lat === 'number' && typeof c.lng === 'number');

    if (validCoords.length === 0) return;

    if (validCoords.length === 1) {
      map.flyTo([validCoords[0].lat, validCoords[0].lng], 15, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    } else {
      const bounds = L.latLngBounds(validCoords.map((c) => [c.lat, c.lng]));
      map.flyToBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [properties, fitTrigger, map]);

  // Transición suave al seleccionar una propiedad específica
  useEffect(() => {
    if (!activePropertyId) return;
    const prop = properties.find((p) => p.id === activePropertyId);
    if (!prop || !prop.location.coordinates) return;

    const raw = prop.location.coordinates;
    const [lat, lng] = getJitteredCoords(prop.id, raw.lat, raw.lng, prop.location.isExactLocation);

    map.flyTo([lat, lng], Math.max(map.getZoom(), 15), {
      duration: 1.0,
      easeLinearity: 0.25,
    });
  }, [activePropertyId, properties, map]);

  return null;
}

// Botonera Flotante con Glassmorphism (Recentrar, Capas y Zoom personalizado)
function FloatingMapControls({
  mapLayer,
  onToggleLayer,
  onRecenter,
}: {
  mapLayer: 'voyager' | 'satellite';
  onToggleLayer: () => void;
  onRecenter: () => void;
}) {
  const map = useMap();

  return (
    <div className="absolute top-3 right-3 z-[1000] flex flex-col items-end gap-2 pointer-events-none select-none">
      
      {/* Botón de Recentrar / Ver Todas las Propiedades */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRecenter();
        }}
        title="Recentrar y ver todas las propiedades"
        aria-label="Recentrar mapa"
        className="pointer-events-auto bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-white/70 hover:shadow-2xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black active:scale-95 text-[#5E1754]"
      >
        <Compass className="w-4 h-4 text-[#E85D04]" />
        <span className="hidden sm:inline">Recentrar</span>
      </button>

      {/* Botón Alternador de Capa: Callejero vs Satélite HD */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleLayer();
        }}
        title={mapLayer === 'voyager' ? 'Cambiar a vista Satelital HD' : 'Cambiar a vista Callejero'}
        aria-label="Cambiar capa de mapa"
        className={`pointer-events-auto px-3 py-2 rounded-2xl shadow-xl border backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black active:scale-95 ${
          mapLayer === 'satellite'
            ? 'bg-[#E85D04] text-white border-orange-400 shadow-orange-500/20'
            : 'bg-white/90 hover:bg-white text-slate-800 border-white/70'
        }`}
      >
        <Layers className={`w-4 h-4 ${mapLayer === 'satellite' ? 'text-amber-300' : 'text-[#5E1754]'}`} />
        <span>{mapLayer === 'voyager' ? 'Satélite' : 'Mapa'}</span>
      </button>

      {/* Botones de Zoom Glassmorphism */}
      <div className="pointer-events-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/70 overflow-hidden flex flex-col">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            map.zoomIn();
          }}
          title="Acercar mapa"
          aria-label="Acercar zoom"
          className="p-2.5 hover:bg-slate-100 text-slate-800 transition-colors flex items-center justify-center cursor-pointer active:bg-slate-200 border-b border-slate-100"
        >
          <Plus className="w-4 h-4 font-bold" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            map.zoomOut();
          }}
          title="Alejar mapa"
          aria-label="Alejar zoom"
          className="p-2.5 hover:bg-slate-100 text-slate-800 transition-colors flex items-center justify-center cursor-pointer active:bg-slate-200"
        >
          <Minus className="w-4 h-4 font-bold" />
        </button>
      </div>

    </div>
  );
}

export const CatalogMap: React.FC<CatalogMapProps> = ({
  properties,
  heightClass = 'h-[500px] lg:h-[650px]',
  activePropertyId,
  onSelectProperty,
}) => {
  const defaultCenter: [number, number] = [-34.3375, -56.7136];
  const [mapLayer, setMapLayer] = useState<'voyager' | 'satellite'>('voyager');
  const [fitTrigger, setFitTrigger] = useState<number>(0);

  // Filtrar solo propiedades que tienen mapa habilitado y coordenadas válidas
  const displayProperties = useMemo(() => {
    return properties.filter((p) => p.location.hasLocation !== false);
  }, [properties]);

  // Calcular centro dinámico inicial
  const validCoords = useMemo(() => {
    return displayProperties
      .map((p) => p.location.coordinates)
      .filter((c): c is { lat: number; lng: number } => !!c && typeof c.lat === 'number' && typeof c.lng === 'number');
  }, [displayProperties]);

  const center: [number, number] = useMemo(() => {
    return validCoords.length > 0
      ? [
          validCoords.reduce((acc, c) => acc + c.lat, 0) / validCoords.length,
          validCoords.reduce((acc, c) => acc + c.lng, 0) / validCoords.length,
        ]
      : defaultCenter;
  }, [validCoords]);

  // Memoizar iconos estables para evitar que Leaflet unspiderfique en re-renders
  const pinsMap = useMemo(() => {
    const map = new Map<string, L.DivIcon>();
    displayProperties.forEach((prop) => {
      const isRent = prop.operation === 'alquiler';
      const priceMode = prop.price.priceMode || (prop.price.amount === 0 ? 'consultar' : 'visible');
      const compactPrice =
        priceMode === 'consultar' ? 'Consultar' :
        priceMode === 'reservado' ? 'Reservado' :
        formatCompactPrice(prop.price.amount, prop.price.currency);
      map.set(prop.id, createCompactPricePin(compactPrice, isRent, prop.id));
    });
    return map;
  }, [displayProperties]);

  // Actualizar el pin resaltado mediante clases CSS en el DOM sin recrear los objetos Leaflet
  useEffect(() => {
    document.querySelectorAll('.custom-catalog-pin.is-active').forEach((el) => {
      el.classList.remove('is-active');
    });

    if (activePropertyId) {
      document.querySelectorAll(`.pin-${activePropertyId}`).forEach((el) => {
        el.classList.add('is-active');
      });
    }
  }, [activePropertyId]);

  // Coordenadas para el círculo de privacidad activo
  const activeCircleCoords = useMemo(() => {
    if (!activePropertyId) return null;
    const prop = displayProperties.find((p) => p.id === activePropertyId);
    if (!prop || prop.location.isExactLocation !== false) return null;
    const rawCoords = prop.location.coordinates || { lat: -34.3375, lng: -56.7136 };
    return getJitteredCoords(prop.id, rawCoords.lat, rawCoords.lng, prop.location.isExactLocation);
  }, [activePropertyId, displayProperties]);

  return (
    <div className={`relative w-full ${heightClass} rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 z-0 isolate`}>
      {/* Estilos CSS para el popup, clusters y pin activo */}
      <style>{`
        .catalog-map-popup .leaflet-popup-content-wrapper {
          padding: 0 !important;
          overflow: hidden !important;
          border-radius: 1.25rem !important;
          box-shadow: 0 25px 30px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2) !important;
          border: 1px solid rgba(226, 232, 240, 0.9);
        }
        .catalog-map-popup .leaflet-popup-content {
          margin: 0 !important;
          line-height: inherit !important;
        }
        .catalog-map-popup .leaflet-popup-tip-container {
          margin-top: -1px;
        }
        .custom-catalog-pin:hover .pin-pill {
          transform: scale(1.12);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45) !important;
        }
        .custom-catalog-pin.is-active {
          z-index: 9999 !important;
        }
        .custom-catalog-pin.is-active .pin-pill {
          background: #E85D04 !important;
          border-color: #FFB800 !important;
          transform: scale(1.22) !important;
          box-shadow: 0 0 22px rgba(232, 93, 4, 0.95), 0 4px 12px rgba(0,0,0,0.5) !important;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
        .custom-cluster-icon:hover div {
          transform: scale(1.1);
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full"
      >
        {/* Capa de Azulejos: Callejero Voyager o Satélite HD con etiquetas superpuestas */}
        {mapLayer === 'voyager' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />
        ) : (
          <>
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
            {/* Superposición sutil de calles y nombres sobre el satélite */}
            <TileLayer
              attribution='&copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
              maxZoom={19}
              opacity={0.9}
            />
          </>
        )}

        {/* Controlador Dinámico de Encuadre Automático y Cinemática */}
        <MapBoundsController
          properties={displayProperties}
          activePropertyId={activePropertyId}
          fitTrigger={fitTrigger}
        />

        {/* Barra de Herramientas Flotante Glassmorphism */}
        <FloatingMapControls
          mapLayer={mapLayer}
          onToggleLayer={() => setMapLayer((prev) => (prev === 'voyager' ? 'satellite' : 'voyager'))}
          onRecenter={() => setFitTrigger((prev) => prev + 1)}
        />

        {/* Capa de Marcadores Agrupados aislada de re-renders innecesarios */}
        <ClusteredMarkersLayer
          properties={displayProperties}
          pinsMap={pinsMap}
          onSelectProperty={onSelectProperty}
        />

        {/* Círculo de Zona Aproximada independiente fuera del Cluster con pulso sutil */}
        {activeCircleCoords && (
          <Circle
            key={`circle-${activePropertyId}`}
            center={activeCircleCoords}
            radius={200}
            pathOptions={{
              color: '#E85D04',
              fillColor: '#5E1754',
              fillOpacity: 0.2,
              weight: 2.5,
              dashArray: '6, 6',
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default CatalogMap;
