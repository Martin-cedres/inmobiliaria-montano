import { Property, PropertyCategory, OperationType } from '@/types/property';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

export interface LevelBLandingDefinition {
  slug: string;
  path: string;
  title: string;
  shortTitle: string;
  seoTitle: string;
  seoDescription: string;
  searchIntentKeywords: string[];
  targetCity?: string;
  targetCategory?: PropertyCategory;
  targetOperation?: OperationType;
  customFilter?: (p: Property) => boolean;
  parentFallbackUrl: string; // URL canónica superior de respaldo en caso de N < 2
  editorialContent: {
    badgeText: string;
    headline: string;
    subheadline: string;
    locationContext: string;
    marketAnalysis: string;
    adviceForBuyers: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

/**
 * Registro de Landings Nivel B planificadas para el Departamento de San José.
 * Cada landing cuenta con intención de búsqueda real investigada, contenido local diferenciado
 * y regla estricta de indexabilidad condicionada a N >= 2 inmuebles activos.
 */
export const LEVEL_B_LANDINGS: LevelBLandingDefinition[] = [
  {
    slug: 'casas-en-venta-libertad',
    path: '/casas-en-venta-libertad',
    title: 'Casas en Venta en Libertad, San José',
    shortTitle: 'Casas en Libertad',
    seoTitle: 'Casas en Venta en Libertad, San José | Inmobiliaria Montaño',
    seoDescription: 'Venta de casas en Libertad, San José, Uruguay. Opciones residenciales sobre eje Ruta 1, con patio, garage y títulos al día. Asesoramiento con Daniel Montaño.',
    searchIntentKeywords: [
      'casas en venta libertad',
      'casas en libertad san jose',
      'inmobiliaria en libertad san jose',
      'comprar casa en libertad uruguay',
    ],
    targetCity: 'Libertad',
    targetCategory: 'casa',
    targetOperation: 'venta',
    parentFallbackUrl: `${BASE_URL}/casas-en-venta-san-jose-de-mayo`,
    editorialContent: {
      badgeText: 'Mercado Inmobiliario en Libertad',
      headline: 'Casas en Venta en Libertad, San José',
      subheadline: 'Oportunidades residenciales en el polo estratégico sobre Ruta 1, a solo 50 km de Montevideo.',
      locationContext: 'Libertad es una de las ciudades más dinámicas del departamento de San José, con excelente conectividad logística, servicios completos, centros educativos y una sólida demanda residencial e industrial.',
      marketAnalysis: 'El mercado de casas en Libertad combina propiedades tradicionales céntricas con nuevas opciones residenciales ideales para familias que buscan tranquilidad a minutos de la capital.',
      adviceForBuyers: 'Verificamos minuciosamente los títulos de propiedad, situación ante BPS e Intendencia de San José para garantizar transacciones 100% seguras y aptas para crédito hipotecario.',
    },
    faqs: [
      {
        question: '¿Qué ventajas ofrece comprar una casa en Libertad, San José?',
        answer: 'Libertad ofrece una ubicación estratégica sobre Ruta 1 con rápida conexión a Montevideo y San José de Mayo, entorno seguro, todos los servicios urbanos y precios por metro cuadrado muy competitivos.',
      },
      {
        question: '¿Las casas en venta en Libertad son aptas para banco?',
        answer: 'En Inmobiliaria Montaño verificamos el estado jurídico y catastral de cada propiedad para confirmar su viabilidad ante bancos de plaza (BHU, Santander, Itaú, BBVA, Scotiabank).',
      },
    ],
  },
  {
    slug: 'terrenos-en-venta-libertad',
    path: '/terrenos-en-venta-libertad',
    title: 'Terrenos y Solares en Venta en Libertad, San José',
    shortTitle: 'Terrenos en Libertad',
    seoTitle: 'Terrenos en Venta en Libertad, San José | Inmobiliaria Montaño',
    seoDescription: 'Solares y terrenos nivelados en venta en Libertad, San José. Terrenos listos para edificar con servicios de agua y luz. Asesoramiento con Daniel Montaño.',
    searchIntentKeywords: [
      'terrenos en venta libertad',
      'solares en libertad san jose',
      'comprar terreno en libertad uruguay',
    ],
    targetCity: 'Libertad',
    targetCategory: 'terreno',
    targetOperation: 'venta',
    parentFallbackUrl: `${BASE_URL}/terrenos-y-chacras-san-jose`,
    editorialContent: {
      badgeText: 'Solares y Terrenos en Libertad',
      headline: 'Terrenos en Venta en Libertad, San José',
      subheadline: 'Solares urbanos y suburbanos nivelados, con servicios y documentación lista para escriturar.',
      locationContext: 'La ciudad de Libertad presenta una creciente demanda de terrenos residenciales y comerciales gracias a su expansión urbana y proximidad a los accesos de Ruta 1.',
      marketAnalysis: 'Disponemos de solares con frentes amplios, aptos para vivienda unifamiliar o desarrollos de galpones y depósitos.',
      adviceForBuyers: 'Comprobamos el amojonamiento, nivelación del suelo, padrones catastrales y disponibilidad de redes de OSE y UTE antes de comercializar cada solar.',
    },
    faqs: [
      {
        question: '¿Qué servicios tienen los terrenos en venta en Libertad?',
        answer: 'La mayoría de los solares en zonas urbanas de Libertad disponen de conexión a agua potable (OSE), red de energía eléctrica (UTE), alumbrado público y recolección de residuos.',
      },
    ],
  },
  {
    slug: 'casas-aptas-para-banco-san-jose',
    path: '/casas-aptas-para-banco-san-jose',
    title: 'Casas Aptas para Préstamo Bancario e Hipotecario en San José',
    shortTitle: 'Casas Aptas Banco',
    seoTitle: 'Casas Aptas para Préstamo Bancario e Hipotecario en San José | Montaño',
    seoDescription: 'Casas en venta aptas para crédito hipotecario y préstamos bancarios (BHU, Santander, Itaú, BBVA) en San José de Mayo. Títulos y planos al día. Daniel Montaño.',
    searchIntentKeywords: [
      'casas aptas para banco san jose',
      'casas aptas para prestamos hipotecarios san jose',
      'prestamos bancarios casas san jose',
      'comprar casa con prestamo bancario san jose',
      'casas en venta con credito hipotecario san jose',
      'comprar casa con bhu san jose',
      'prestamos hipotecarios casas san jose de mayo',
      'credito hipotecario casas san jose uruguay',
    ],
    targetCategory: 'casa',
    targetOperation: 'venta',
    customFilter: (p: Property) => Boolean(p.legalCertainties?.bankCreditEligible || p.features?.bankCreditEligible),
    parentFallbackUrl: `${BASE_URL}/casas-en-venta-san-jose-de-mayo`,
    editorialContent: {
      badgeText: 'Certeza Jurídica y Financiamiento',
      headline: 'Casas Aptas para Préstamo Bancario e Hipotecario en San José',
      subheadline: 'Propiedades con documentación perfecta, planos registrados y títulos al día para compra con préstamo hipotecario (BHU, Santander, Itaú, BBVA, Scotiabank).',
      locationContext: 'Comprar una casa con financiamiento bancario exige que la propiedad cumpla estrictos requisitos notariales y de agrimensura ante BHU o bancos privados.',
      marketAnalysis: 'En Inmobiliaria Montaño auditamos previamente los títulos, aportes a BPS e impuestos municipales para que tu trámite de crédito hipotecario sea ágil y sin objeciones.',
      adviceForBuyers: 'Te asesoramos junto a escribanos de confianza durante todo el proceso de tasación pericial del banco y escrituración.',
    },
    faqs: [
      {
        question: '¿Qué requisitos debe cumplir una casa para ser aceptada por un préstamo bancario o hipotecario?',
        answer: 'Debe contar con títulos de propiedad continuos de 30 años sin gravámenes, planos de mensura registrados en Catastro, final de obra o regularización de BPS al día, y estar al día con la Contribución Inmobiliaria y Primaria.',
      },
      {
        question: '¿Qué bancos financian la compra de casas en San José de Mayo?',
        answer: 'Trabajamos con todas las entidades bancarias de plaza: Banco Hipotecario del Uruguay (BHU), Banco Santander, Banco Itaú, BBVA y Scotiabank, asesorándote en los requisitos de cada institución.',
      },
    ],
  },
];

export function getLevelBLandingBySlug(slug: string): LevelBLandingDefinition | undefined {
  return LEVEL_B_LANDINGS.find((l) => l.slug === slug || l.path === `/${slug}`);
}

export function getAllLevelBLandings(): LevelBLandingDefinition[] {
  return LEVEL_B_LANDINGS;
}

export interface LevelBLandingEvaluation {
  landing: LevelBLandingDefinition;
  isIndexable: boolean;
  count: number;
  matchedProperties: Property[];
  robots: string;
  canonicalUrl: string;
}

/**
 * Evalúa en tiempo real si una landing Nivel B cumple las condiciones para ser indexable (N >= 2)
 * o si debe entrar en modo de transición noindex con canonical a su categoría superior.
 */
export function evaluateLevelBLanding(
  landing: LevelBLandingDefinition,
  allProperties: Property[]
): LevelBLandingEvaluation {
  const publicProps = allProperties.filter(
    (p) => p.status !== 'retirada' && p.status !== 'inactiva'
  );

  const matched = publicProps.filter((p) => {
    if (landing.targetCity) {
      const city = (p.location.city || '').toLowerCase();
      const hood = (p.location.neighborhood || '').toLowerCase();
      const target = landing.targetCity.toLowerCase();
      if (!city.includes(target) && !hood.includes(target)) return false;
    }

    if (landing.targetCategory && p.category !== landing.targetCategory) {
      return false;
    }

    if (landing.targetOperation && p.operation !== landing.targetOperation) {
      return false;
    }

    if (landing.customFilter && !landing.customFilter(p)) {
      return false;
    }

    return true;
  });

  const isIndexable = matched.length >= 2;
  const canonicalUrl = isIndexable
    ? `${BASE_URL}${landing.path}`
    : landing.parentFallbackUrl;

  const robots = isIndexable ? 'index, follow' : 'noindex, follow';

  return {
    landing,
    isIndexable,
    count: matched.length,
    matchedProperties: matched,
    robots,
    canonicalUrl,
  };
}
