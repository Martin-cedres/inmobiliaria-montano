'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ShieldCheck, Eye, Compass, Search, Loader2, Navigation, MapPinned, CopyCheck } from 'lucide-react';
import { MAP_TILE_LAYERS, SAN_JOSE_LOCALITY_PRESETS, MapLocationPreset } from '@/lib/mapConfig';

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
    <div style="position: relative; display: inline-flex; align-items: center; justify-content: center; transform: translate(-50%, -100%); cursor: grab;">
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

// Click & Drag Handler Sub-component for Leaflet Map
function LocationMarker({
  lat,
  lng,
  isExactLocation,
  radiusMeters,
  onMapClick,
  onMarkerDragEnd,
}: {
  lat: number;
  lng: number;
  isExactLocation: boolean;
  radiusMeters: number;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerDragEnd: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <>
      <Marker
        position={[lat, lng]}
        icon={customIcon}
        draggable={true}
        eventHandlers={{
          dragend(e) {
            const marker = e.target;
            const position = marker.getLatLng();
            onMarkerDragEnd(position.lat, position.lng);
          },
        }}
      />
      {!isExactLocation && (
        <Circle
          center={[lat, lng]}
          radius={radiusMeters}
          pathOptions={{
            color: '#5E1754',
            fillColor: '#E85D04',
            fillOpacity: 0.25,
            weight: 2,
            dashArray: '6, 6',
          }}
        />
      )}
    </>
  );
}

// Controlador de vuelo cinematográfico del mapa cuando se busca o selecciona un preset
function MapFlyToController({
  target,
}: {
  target: { lat: number; lng: number; zoom: number; trigger: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], target.zoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [target, map]);

  return null;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
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
  const [tempLat, setTempLat] = useState(lat.toFixed(6));
  const [tempLng, setTempLng] = useState(lng.toFixed(6));

  // Estado del buscador de direcciones
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Estado de pegado de coordenadas de Google Maps
  const [coordsPasteInput, setCoordsPasteInput] = useState('');
  const [coordsFeedback, setCoordsFeedback] = useState<string | null>(null);

  // Controlador de vuelo del mapa
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number; zoom: number; trigger: number } | null>(null);

  // Sincronizar inputs si cambian externamente
  useEffect(() => {
    setTempLat(lat.toFixed(6));
    setTempLng(lng.toFixed(6));
  }, [lat, lng]);

  const handleManualLatChange = (val: string) => {
    setTempLat(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= -90 && parsed <= 90) {
      onChangeLocation(parsed, lng);
    }
  };

  const handleManualLngChange = (val: string) => {
    setTempLng(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= -180 && parsed <= 180) {
      onChangeLocation(lat, parsed);
    }
  };

  // 1. Buscador de Direcciones mediante Nominatim (OpenStreetMap) acotado a San José / Uruguay
  const handleSearchAddress = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchFeedback(null);
    setSearchResults([]);

    try {
      // Incluir "San José, Uruguay" si no fue especificado para priorizar resultados locales
      const query = searchQuery.toLowerCase().includes('san josé') || searchQuery.toLowerCase().includes('libertad')
        ? searchQuery
        : `${searchQuery}, San José, Uruguay`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=uy&limit=5&addressdetails=1`
      );
      const data: SearchResult[] = await res.json();

      if (data && data.length > 0) {
        setSearchResults(data);
        setSearchFeedback(`${data.length} resultado(s) encontrados. Elegí el más cercano:`);
      } else {
        setSearchFeedback('No se encontraron resultados exactos. Probá con nombre de calle y ciudad.');
      }
    } catch {
      setSearchFeedback('Error al consultar el servicio de direcciones. Probá pegar coordenadas.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: SearchResult) => {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    if (!isNaN(newLat) && !isNaN(newLng)) {
      onChangeLocation(newLat, newLng);
      setTempLat(newLat.toFixed(6));
      setTempLng(newLng.toFixed(6));
      setFlyTarget({ lat: newLat, lng: newLng, zoom: 16, trigger: Date.now() });
      setSearchResults([]);
      setSearchFeedback(`Ubicación fijada: ${result.display_name.split(',')[0]}`);
    }
  };

  // 2. Pegar coordenadas de Google Maps (ej: "-34.33758, -56.71362" o links)
  const handleApplyCoordinates = () => {
    setCoordsFeedback(null);
    const text = coordsPasteInput.trim();
    if (!text) return;

    // Buscar dos números decimales separados por coma, espacio o tab
    const match = text.match(/(-?\d{1,2}\.\d+)[,\s]+(-?\d{1,3}\.\d+)/);
    if (match) {
      const parsedLat = parseFloat(match[1]);
      const parsedLng = parseFloat(match[2]);

      // Validar rango aproximado de Uruguay
      if (parsedLat >= -36 && parsedLat <= -30 && parsedLng >= -59 && parsedLng <= -53) {
        onChangeLocation(parsedLat, parsedLng);
        setTempLat(parsedLat.toFixed(6));
        setTempLng(parsedLng.toFixed(6));
        setFlyTarget({ lat: parsedLat, lng: parsedLng, zoom: 16, trigger: Date.now() });
        setCoordsFeedback('✓ Coordenadas aplicadas exitosamente');
        setCoordsPasteInput('');
      } else {
        setCoordsFeedback('Coordenadas fuera del territorio de Uruguay (-34.x, -56.x).');
      }
    } else {
      setCoordsFeedback('Formato inválido. Ejemplo esperado: -34.33758, -56.71362');
    }
  };

  // 3. Selección de presets departamentales de San José
  const handleSelectPreset = (preset: MapLocationPreset) => {
    onChangeLocation(preset.lat, preset.lng);
    setTempLat(preset.lat.toFixed(6));
    setTempLng(preset.lng.toFixed(6));
    setFlyTarget({ lat: preset.lat, lng: preset.lng, zoom: preset.zoom, trigger: Date.now() });
  };

  // 4. Captura de GPS actual
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización GPS.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentLat = pos.coords.latitude;
        const currentLng = pos.coords.longitude;
        onChangeLocation(currentLat, currentLng);
        setTempLat(currentLat.toFixed(6));
        setTempLng(currentLng.toFixed(6));
        setFlyTarget({ lat: currentLat, lng: currentLng, zoom: 17, trigger: Date.now() });
      },
      () => {
        alert('No pudimos obtener tu ubicación. Verificá los permisos de GPS.');
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-left">
      
      {/* Header con Título y Botón GPS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2 text-[#5E1754] font-black text-sm uppercase tracking-wider">
          <Compass className="w-4 h-4 text-[#E85D04]" />
          <span>Super-Asistente de Ubicación en el Mapa</span>
        </div>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 shadow-2xs transition-all cursor-pointer hover:text-[#5E1754]"
          title="Fijar en mi posición actual mediante GPS"
        >
          <Navigation className="w-3.5 h-3.5 text-[#E85D04]" />
          <span>Usar mi GPS actual</span>
        </button>
      </div>

      {/* Asistente 1: Buscador de Direcciones y Pegar Coordenadas (Tabs Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        {/* Buscador de Direcciones Nominatim */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <label className="block text-xs font-extrabold uppercase text-slate-700">
            🔍 Buscar Calle o Esquina
          </label>
          <form onSubmit={handleSearchAddress} className="flex gap-1.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ej: 25 de Mayo 338, Libertad..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5E1754]/30"
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="bg-[#5E1754] hover:bg-[#43123C] disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Buscar</span>
            </button>
          </form>

          {/* Feedback & Resultados de búsqueda */}
          {searchFeedback && (
            <p className="text-[11px] font-semibold text-slate-600 mt-1">{searchFeedback}</p>
          )}
          {searchResults.length > 0 && (
            <div className="max-h-36 overflow-y-auto space-y-1 pt-1 border-t border-slate-100">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectSearchResult(r)}
                  className="w-full text-left p-1.5 rounded-lg text-[11px] font-medium text-slate-800 hover:bg-purple-50 hover:text-[#5E1754] border border-transparent hover:border-purple-200 transition-colors truncate block"
                >
                  📍 {r.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pegar Coordenadas de Google Maps */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <label className="block text-xs font-extrabold uppercase text-slate-700">
            📋 Pegar Coordenadas (Google Maps)
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={coordsPasteInput}
              onChange={(e) => setCoordsPasteInput(e.target.value)}
              placeholder="-34.33758, -56.71362"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30"
            />
            <button
              type="button"
              onClick={handleApplyCoordinates}
              disabled={!coordsPasteInput.trim()}
              className="bg-[#E85D04] hover:bg-[#D05303] disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <CopyCheck className="w-3.5 h-3.5" />
              <span>Aplicar</span>
            </button>
          </div>
          {coordsFeedback && (
            <p className={`text-[11px] font-semibold ${coordsFeedback.startsWith('✓') ? 'text-emerald-600' : 'text-rose-600'}`}>
              {coordsFeedback}
            </p>
          )}
        </div>

      </div>

      {/* Asistente 2: Presets Rápidos de Localidades del Departamento de San José */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
          🏙️ Salto Rápido a Zonas y Localidades de San José
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SAN_JOSE_LOCALITY_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-[#5E1754] text-slate-700 hover:text-white transition-all cursor-pointer border border-slate-200/80 hover:border-[#5E1754]"
            >
              {preset.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Privacidad (Zona vs Exacto) y Coordenadas Manuales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Toggle Exact Pin vs Approximate Area Circle */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <label className="block text-xs font-extrabold uppercase text-slate-700">
            Modo de Privacidad del Mapa
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onChangeExactLocation(false)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                !isExactLocation
                  ? 'bg-[#191024] text-amber-300 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zona (~{radiusMeters}m)</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeExactLocation(true)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                isExactLocation
                  ? 'bg-[#5E1754] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>Pin Exacto</span>
            </button>
          </div>
        </div>

        {/* Radio de Cobertura o Edición Manual de Coordenadas */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          {!isExactLocation ? (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Radio de Cobertura (metros)
              </label>
              <select
                value={radiusMeters}
                onChange={(e) => onChangeRadiusMeters(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-800 focus:outline-none"
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
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Latitud</label>
                <input
                  type="text"
                  value={tempLat}
                  onChange={(e) => handleManualLatChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Longitud</label>
                <input
                  type="text"
                  value={tempLng}
                  onChange={(e) => handleManualLngChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-mono font-bold"
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Picker Leaflet Map (Con capa limpia Esri libre de marcas de agua) */}
      <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-300 shadow-inner relative z-0 isolate">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          zoomControl={false}
          className="w-full h-full"
        >
          {/* Callejero corporativo Esri World Street Map libre de marcas de agua */}
          <TileLayer
            attribution={MAP_TILE_LAYERS.street.attribution}
            url={MAP_TILE_LAYERS.street.url}
            maxZoom={MAP_TILE_LAYERS.street.maxZoom}
          />
          <ZoomControl position="bottomright" />

          {/* Controlador de Vuelo Suave */}
          <MapFlyToController target={flyTarget} />

          {/* Marcador Arrastrable con soporte de clic */}
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
            onMarkerDragEnd={(newLat, newLng) => {
              onChangeLocation(newLat, newLng);
              setTempLat(newLat.toFixed(6));
              setTempLng(newLng.toFixed(6));
            }}
          />
        </MapContainer>

        {/* Tip flotante para Daniel Montaño */}
        <div className="absolute top-2 left-2 z-[1000] bg-white/90 backdrop-blur-md text-slate-800 text-[10px] px-2.5 py-1 rounded-full font-bold shadow-md border border-slate-200 flex items-center gap-1.5">
          <MapPinned className="w-3.5 h-3.5 text-[#E85D04]" />
          <span>Arrastrá el pin o hacé clic para ubicar</span>
        </div>

        {/* Coordenadas en vivo */}
        <div className="absolute bottom-2 left-2 z-[1000] bg-black/75 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-mono font-semibold">
          Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}
        </div>
      </div>

    </div>
  );
};

export default AdminLocationPicker;
