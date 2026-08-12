'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { Property } from '@/types/property';
import { Bed, Bath, ArrowRight, MapPin, Building2, ShieldCheck } from 'lucide-react';

interface CatalogMapProps {
  properties: Property[];
  heightClass?: string;
}

// Function to generate custom Leaflet Pin with Property Price in Montaño Brand Colors
const createPricePin = (priceText: string, operation: string) => {
  const isRent = operation === 'alquiler';
  const badgeBg = isRent ? '#25D366' : '#E85D04'; // Green for rent, Orange for sale

  return L.divIcon({
    className: 'custom-catalog-pin',
    html: `
      <div style="position: relative; display: inline-flex; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
        <div style="
          background: linear-gradient(135deg, #5E1754 0%, #2D0B28 100%);
          border: 2px solid ${badgeBg};
          color: white;
          border-radius: 9999px;
          padding: 5px 11px;
          font-weight: 900;
          font-size: 11px;
          letter-spacing: 0.025em;
          box-shadow: 0 10px 20px -3px rgba(94, 23, 84, 0.6), 0 4px 10px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          cursor: pointer;
        ">
          <span style="width: 7px; height: 7px; background-color: ${badgeBg}; border-radius: 9999px; display: inline-block; box-shadow: 0 0 6px ${badgeBg};"></span>
          <span>${priceText}</span>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

// Custom Cluster Icon in Montaño Purple & Orange
const createCustomClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, #5E1754 0%, #350A2F 100%);
        border: 3px solid #E85D04;
        color: white;
        width: 44px;
        height: 44px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 13px;
        box-shadow: 0 10px 25px rgba(94, 23, 84, 0.7), 0 4px 10px rgba(232, 93, 4, 0.5);
      ">
        <span>${count}</span>
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: [44, 44],
  });
};

export const CatalogMap: React.FC<CatalogMapProps> = ({
  properties,
  heightClass = 'h-[500px] sm:h-[620px]',
}) => {
  // Centro por defecto: San José de Mayo, Uruguay
  const defaultCenter: [number, number] = [-34.3375, -56.7136];

  // Calcular centro dinamico basado en las propiedades filtradas
  const validCoords = properties
    .map((p) => p.location.coordinates)
    .filter((c): c is { lat: number; lng: number } => !!c && typeof c.lat === 'number' && typeof c.lng === 'number');

  const center: [number, number] =
    validCoords.length > 0
      ? [
          validCoords.reduce((acc, c) => acc + c.lat, 0) / validCoords.length,
          validCoords.reduce((acc, c) => acc + c.lng, 0) / validCoords.length,
        ]
      : defaultCenter;

  return (
    <div className={`relative w-full ${heightClass} rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900`}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createCustomClusterIcon}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom
        >
          {properties.map((prop) => {
            const coords = prop.location.coordinates || {
              lat: -34.3375,
              lng: -56.7136,
            };

            const priceText = `${prop.price.currency === 'USD' ? 'USD' : 'UYU $'} ${prop.price.amount.toLocaleString('es-UY')}`;
            const mainImg = prop.images.find((img) => img.isMain)?.webpUrl || prop.images[0]?.webpUrl || '/logo.png';

            return (
              <React.Fragment key={prop.id}>
                {prop.location.isExactLocation !== false ? (
                  /* Marker Exacto con desplegable */
                  <Marker
                    position={[coords.lat, coords.lng]}
                    icon={createPricePin(priceText, prop.operation)}
                  >
                    <Popup className="catalog-map-popup" maxWidth={280} minWidth={250}>
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
                          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end text-white drop-shadow-md">
                            <span className="text-sm font-black bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-amber-300">
                              {priceText}
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
                ) : (
                  /* Círculo de Zona Aproximada por Privacidad */
                  <>
                    <Marker
                      position={[coords.lat, coords.lng]}
                      icon={createPricePin(priceText, prop.operation)}
                    >
                      <Popup className="catalog-map-popup" maxWidth={280} minWidth={250}>
                        <div className="overflow-hidden rounded-2xl text-left bg-white font-sans">
                          <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                            <img
                              src={mainImg}
                              alt={prop.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/logo.png';
                              }}
                            />
                            <div className="absolute top-2 left-2 bg-[#191024]/90 backdrop-blur-md text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center space-x-1 border border-purple-500/30">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              <span>Zona Aproximada</span>
                            </div>
                          </div>

                          <div className="p-3 space-y-2">
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                              {prop.title}
                            </h4>
                            <p className="text-xs font-black text-[#5E1754]">{priceText}</p>

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
                    <Circle
                      center={[coords.lat, coords.lng]}
                      radius={prop.location.radiusMeters || 350}
                      pathOptions={{
                        color: '#5E1754',
                        fillColor: '#E85D04',
                        fillOpacity: 0.25,
                        weight: 2,
                        dashArray: '6, 6',
                      }}
                    />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default CatalogMap;
