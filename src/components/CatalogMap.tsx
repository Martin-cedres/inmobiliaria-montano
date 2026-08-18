'use client';

import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { Property } from '@/types/property';
import { Bed, Bath, ArrowRight, MapPin, Building2, ShieldCheck } from 'lucide-react';

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
  const badgeBg = isRent ? '#10B981' : '#5E1754';
  const borderColor = isRent ? '#059669' : '#E85D04';

  return L.divIcon({
    className: `custom-catalog-pin pin-${propId}`,
    html: `
      <div class="pin-pill-wrapper" style="position: relative; display: inline-flex; align-items: center; justify-content: center; transform: translate(-50%, -100%); transition: all 0.2s ease;">
        <div class="pin-pill" style="
          background: ${badgeBg};
          border: 2px solid ${borderColor};
          color: white;
          border-radius: 9999px;
          padding: 4px 9px;
          font-weight: 900;
          font-size: 11px;
          letter-spacing: -0.01em;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        ">
          <span style="width: 6px; height: 6px; background-color: ${borderColor}; border-radius: 9999px; display: inline-block;"></span>
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
        width: 38px;
        height: 38px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 12px;
        box-shadow: 0 8px 20px rgba(94, 23, 84, 0.6);
        cursor: pointer;
      ">
        <span>${count}</span>
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: [38, 38],
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
              autoPanPadding={[20, 20]}
            >
              <div className="overflow-hidden rounded-2xl text-left bg-white font-sans">
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
                    <span className="text-sm font-black bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-amber-300">
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
                    {!!prop.features.builtAreaM2 && prop.features.builtAreaM2 > 0 && (
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-3 h-3 text-[#5E1754]" />
                        <span>{prop.features.builtAreaM2} m²</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/propiedad/${prop.slug}`}
                    className="w-full bg-[#E85D04] hover:bg-[#FF8500] text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 text-xs transition-colors mt-2 shadow-md"
                  >
                    <span>Ver Ficha Completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
});

export const CatalogMap: React.FC<CatalogMapProps> = ({
  properties,
  heightClass = 'h-[500px] lg:h-[650px]',
  activePropertyId,
  onSelectProperty,
}) => {
  const defaultCenter: [number, number] = [-34.3375, -56.7136];

  // Filtrar solo propiedades que tienen mapa habilitado y coordenadas válidas
  const displayProperties = useMemo(() => {
    return properties.filter((p) => p.location.hasLocation !== false);
  }, [properties]);

  // Calcular centro dinámico basado en propiedades
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
    <div className={`relative w-full ${heightClass} rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 z-0 isolate`}>
      {/* Estilos CSS para el popup y pin activo */}
      <style>{`
        .catalog-map-popup .leaflet-popup-content-wrapper {
          padding: 0 !important;
          overflow: hidden !important;
          border-radius: 1rem !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2) !important;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .catalog-map-popup .leaflet-popup-content {
          margin: 0 !important;
          line-height: inherit !important;
        }
        .catalog-map-popup .leaflet-popup-tip-container {
          margin-top: -1px;
        }
        .custom-catalog-pin.is-active {
          z-index: 9999 !important;
        }
        .custom-catalog-pin.is-active .pin-pill {
          background: #E85D04 !important;
          border-color: #FF8500 !important;
          transform: scale(1.15) !important;
          box-shadow: 0 0 18px rgba(232, 93, 4, 0.9) !important;
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        <ZoomControl position="bottomright" />

        {/* Capa de Marcadores Agrupados aislada de re-renders innecesarios */}
        <ClusteredMarkersLayer
          properties={displayProperties}
          pinsMap={pinsMap}
          onSelectProperty={onSelectProperty}
        />

        {/* Círculo de Zona Aproximada independiente fuera del Cluster */}
        {activeCircleCoords && (
          <Circle
            key={`circle-${activePropertyId}`}
            center={activeCircleCoords}
            radius={180}
            pathOptions={{
              color: '#E85D04',
              fillColor: '#5E1754',
              fillOpacity: 0.15,
              weight: 2,
              dashArray: '5, 5',
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default CatalogMap;

