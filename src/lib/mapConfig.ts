export interface MapLocationPreset {
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const DEFAULT_MAP_CENTER: [number, number] = [-34.3375, -56.7136]; // San José de Mayo
export const DEFAULT_MAP_ZOOM = 14;

// Presets de localidades clave del Departamento de San José para posicionamiento en 1-clic
export const SAN_JOSE_LOCALITY_PRESETS: MapLocationPreset[] = [
  { name: 'San José de Mayo (Centro)', shortName: 'Centro SJ', lat: -34.3375, lng: -56.7136, zoom: 15 },
  { name: 'Barrio Hospital (San José)', shortName: 'Hospital', lat: -34.3320, lng: -56.7180, zoom: 16 },
  { name: 'Barrio Molino (San José)', shortName: 'B° Molino', lat: -34.3450, lng: -56.7100, zoom: 16 },
  { name: 'Plaza Arriaga / Colón', shortName: 'Plaza Arriaga', lat: -34.3412, lng: -56.7210, zoom: 16 },
  { name: 'Libertad', shortName: 'Libertad', lat: -34.6333, lng: -56.6167, zoom: 15 },
  { name: 'Ciudad del Plata', shortName: 'Cd. del Plata', lat: -34.7731, lng: -56.3814, zoom: 14 },
  { name: 'Playa Pascual', shortName: 'Playa Pascual', lat: -34.7878, lng: -56.4444, zoom: 15 },
  { name: 'Balneario Kiyú', shortName: 'Kiyú', lat: -34.7000, lng: -56.7167, zoom: 15 },
  { name: 'Villa Rodríguez', shortName: 'Rodríguez', lat: -34.3800, lng: -56.5400, zoom: 15 },
  { name: 'Ecilda Paullier', shortName: 'Ecilda P.', lat: -34.3542, lng: -57.0489, zoom: 15 },
];

/**
 * Capas de azulejos (Tiles) 100% libres, de alto rendimiento y sin marca de agua "API KEY REQUIRED".
 * Esri World Street Map ofrece un aspecto profesional, nítido y legible similar a Google Maps.
 */
export const MAP_TILE_LAYERS = {
  // Callejero nítido corporativo (Esri ArcGIS World Street Map)
  street: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom',
    maxZoom: 19,
  },
  // OpenStreetMap Estándar
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  // Fotografía Satelital HD (Esri World Imagery)
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, GeoEye',
    maxZoom: 19,
  },
  // Etiquetas de calles y lugares sobre el satélite (Esri Boundaries & Places - sin dependencias de Carto)
  satelliteLabels: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
  },
};
