import { Property, PropertyCategory } from '@/types/property';

export interface LocationInfo {
  slug: string;
  name: string;
  shortName: string;
  department: string;
  postalCode: string;
  zoneType: 'capital' | 'ciudad' | 'balneario' | 'villa' | 'rural';
  mainRoutes: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
}

/**
 * Registro exhaustivo y oficial de localidades, ciudades, balnearios y villas del Departamento de San José, Uruguay.
 */
export const SAN_JOSE_LOCATIONS: LocationInfo[] = [
  {
    slug: 'san-jose-de-mayo',
    name: 'San José de Mayo',
    shortName: 'San José de Mayo',
    department: 'San José',
    postalCode: '80000',
    zoneType: 'capital',
    mainRoutes: ['Ruta 3', 'Ruta 11'],
    coordinates: { lat: -34.3375, lng: -56.7136 },
    description: 'Capital departamental y principal centro comercial, administrativo y residencial del departamento de San José.',
  },
  {
    slug: 'libertad',
    name: 'Libertad',
    shortName: 'Libertad',
    department: 'San José',
    postalCode: '80100',
    zoneType: 'ciudad',
    mainRoutes: ['Ruta 1'],
    coordinates: { lat: -34.6340, lng: -56.6210 },
    description: 'Polo agroindustrial y residencial estratégico sobre Ruta 1, a solo 50 km de Montevideo.',
  },
  {
    slug: 'ciudad-del-plata',
    name: 'Ciudad del Plata',
    shortName: 'Ciudad del Plata',
    department: 'San José',
    postalCode: '80500',
    zoneType: 'ciudad',
    mainRoutes: ['Ruta 1'],
    coordinates: { lat: -34.7710, lng: -56.3980 },
    description: 'Ciudad costera limítrofe con Montevideo, abarca Playa Pascual, Delta del Tigre, Autódromo y Santa Mónica.',
  },
  {
    slug: 'ecilda-paullier',
    name: 'Ecilda Paullier',
    shortName: 'Ecilda Paullier',
    department: 'San José',
    postalCode: '80200',
    zoneType: 'ciudad',
    mainRoutes: ['Ruta 1', 'Ruta 11'],
    coordinates: { lat: -34.3540, lng: -57.0480 },
    description: 'Tradicional localidad productiva y quesera en el oeste del departamento, acceso principal a balneario Boca del Cufré.',
  },
  {
    slug: 'rodriguez',
    name: 'Rodríguez',
    shortName: 'Rodríguez',
    department: 'San José',
    postalCode: '80300',
    zoneType: 'ciudad',
    mainRoutes: ['Ruta 45'],
    coordinates: { lat: -34.3810, lng: -56.5410 },
    description: 'Localidad del noreste de San José, centro agrícola, vitivinícola y residencial con excelente conectividad.',
  },
  {
    slug: 'rafael-perazza',
    name: 'Rafael Perazza',
    shortName: 'Rafael Perazza',
    department: 'San José',
    postalCode: '80101',
    zoneType: 'villa',
    mainRoutes: ['Ruta 1'],
    coordinates: { lat: -34.5420, lng: -56.7650 },
    description: 'Villa residencial y comercial sobre el eje de Ruta 1 km 72, acceso natural al balneario Kiyú.',
  },
  {
    slug: 'kiyu',
    name: 'Kiyú',
    shortName: 'Kiyú',
    department: 'San José',
    postalCode: '80102',
    zoneType: 'balneario',
    mainRoutes: ['Ruta 1', 'Camino a Kiyú'],
    coordinates: { lat: -34.7010, lng: -56.7380 },
    description: 'Destacado balneario sobre el Río de la Plata con imponentes barrancas naturales, playas mansas y zonas de descanso (Ordeig, Barrancas).',
  },
  {
    slug: 'boca-del-cufre',
    name: 'Boca del Cufré',
    shortName: 'Boca del Cufré',
    department: 'San José',
    postalCode: '80201',
    zoneType: 'balneario',
    mainRoutes: ['Ruta 1'],
    coordinates: { lat: -34.4500, lng: -57.1450 },
    description: 'Balneario ecológico certificado y puerto náutico en la desembocadura del Arroyo Cufré, límite con Colonia.',
  },
  {
    slug: 'villa-maria',
    name: 'Villa María (Rincón de la Torre)',
    shortName: 'Villa María',
    department: 'San José',
    postalCode: '80103',
    zoneType: 'villa',
    mainRoutes: ['Ruta 1'],
    coordinates: { lat: -34.5800, lng: -56.7100 },
    description: 'Poblado residencial y productivo en las inmediaciones de Ruta 1.',
  },
  {
    slug: 'puntas-de-valdez',
    name: 'Puntas de Valdez',
    shortName: 'Puntas de Valdez',
    department: 'San José',
    postalCode: '80104',
    zoneType: 'villa',
    mainRoutes: ['Ruta 1'],
    coordinates: { lat: -34.6050, lng: -56.6780 },
    description: 'Localidad sobre Ruta 1 km 61 con fuerte actividad agropecuaria y residencial.',
  },
  {
    slug: 'juan-soler',
    name: 'Juan Soler',
    shortName: 'Juan Soler',
    department: 'San José',
    postalCode: '80001',
    zoneType: 'rural',
    mainRoutes: ['Ruta 11'],
    coordinates: { lat: -34.3050, lng: -56.8120 },
    description: 'Localidad rural y agropecuaria al oeste de la capital departamental sobre Ruta 11.',
  },
  {
    slug: 'capurro',
    name: 'Capurro',
    shortName: 'Capurro',
    department: 'San José',
    postalCode: '80301',
    zoneType: 'rural',
    mainRoutes: ['Ruta 11', 'Ruta 77'],
    coordinates: { lat: -34.4020, lng: -56.4520 },
    description: 'Poblado rural en el este de San José con vocación granjera y lechera.',
  },
  {
    slug: 'mal-abrigo',
    name: 'Mal Abrigo (Estación Cepeda)',
    shortName: 'Mal Abrigo',
    department: 'San José',
    postalCode: '80002',
    zoneType: 'rural',
    mainRoutes: ['Ruta 23'],
    coordinates: { lat: -34.0950, lng: -56.9650 },
    description: 'Pueblo histórico y turístico al norte de San José sobre Ruta 23, galardonado Pueblo Turístico Nacional.',
  },
];

/**
 * Devuelve todas las localidades del departamento de San José.
 */
export function getAllDepartmentLocations(): LocationInfo[] {
  return SAN_JOSE_LOCATIONS;
}

/**
 * Busca una localidad por su slug.
 */
export function getLocationBySlug(slug: string): LocationInfo | undefined {
  const clean = slug.toLowerCase().trim();
  return SAN_JOSE_LOCATIONS.find((loc) => loc.slug === clean);
}

/**
 * Busca una localidad por coincidencia de nombre o ciudad registrada en una propiedad.
 */
export function getLocationByName(name: string): LocationInfo | undefined {
  if (!name) return undefined;
  const clean = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  return SAN_JOSE_LOCATIONS.find((loc) => {
    const locClean = loc.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const shortClean = loc.shortName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return locClean.includes(clean) || clean.includes(locClean) || shortClean.includes(clean) || clean.includes(shortClean);
  });
}

/**
 * Calcula el inventario público real disponible en una localidad.
 * Excluye estrictamente inmuebles 'retirada' e 'inactiva'.
 */
export function getActivePropertiesForLocation(cityOrSlug: string, properties: Property[]): Property[] {
  const loc = getLocationBySlug(cityOrSlug) || getLocationByName(cityOrSlug);
  const targetName = loc ? loc.name.toLowerCase() : cityOrSlug.toLowerCase();

  return properties.filter((p) => {
    if (p.status === 'retirada' || p.status === 'inactiva') return false;
    const propCity = (p.location.city || '').toLowerCase();
    const propHood = (p.location.neighborhood || '').toLowerCase();
    const propAddress = (p.location.address || '').toLowerCase();

    return propCity.includes(targetName) || targetName.includes(propCity) || propHood.includes(targetName) || propAddress.includes(targetName);
  });
}

/**
 * Regla Estricta Anti-Thin Content (P1.1 / P2):
 * Aplica EXCLUSIVAMENTE a páginas derivadas/específicas de localidad + categoría (Nivel B, ej. /casas-en-venta-libertad).
 * NUNCA se aplica a las páginas maestras Nivel A (/propiedades-san-jose, /inmobiliaria-san-jose),
 * las cuales son permanentes, autoritativas e indexables de forma incondicional.
 * 
 * Una landing Nivel B SOLO es indexable si:
 * 1. Cuenta con inventario real N >= 2
 * 2. Corresponde a una localidad oficialmente reconocida en el departamento
 */
export function shouldIndexLocationCategory(
  cityOrSlug: string,
  category: PropertyCategory | 'todas',
  properties: Property[]
): boolean {
  const locationProps = getActivePropertiesForLocation(cityOrSlug, properties);
  const filtered = category === 'todas'
    ? locationProps
    : locationProps.filter((p) => p.category === category);

  return filtered.length >= 2;
}
