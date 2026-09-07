import { Property } from '@/types/property';
import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

/**
 * Mapea una propiedad a su página pilar SEO correspondiente para enlazado interno y migas de pan.
 */
export function getPillarPageForProperty(property: Property): { title: string; href: string; shortTitle: string } {
  if (property.operation === 'alquiler') {
    return {
      title: 'Alquileres en San José de Mayo',
      shortTitle: 'Alquileres',
      href: '/alquileres-san-jose-de-mayo',
    };
  }

  switch (property.category) {
    case 'terreno':
    case 'chacra':
      return {
        title: 'Terrenos y Chacras en San José',
        shortTitle: 'Terrenos y Chacras',
        href: '/terrenos-y-chacras-san-jose',
      };
    case 'local':
    case 'deposito':
      return {
        title: 'Locales Comerciales y Galpones en San José',
        shortTitle: 'Locales y Galpones',
        href: '/locales-comerciales-y-galpones-san-jose',
      };
    case 'modulo':
    case 'proyecto':
      return {
        title: 'Proyectos y Viviendas Modulares en San José',
        shortTitle: 'Proyectos y Módulos',
        href: '/proyectos-y-viviendas-modulares-san-jose',
      };
    case 'casa':
    case 'apartamento':
    default:
      return {
        title: 'Casas en Venta en San José de Mayo',
        shortTitle: 'Casas en Venta',
        href: '/casas-en-venta-san-jose-de-mayo',
      };
  }
}

/**
 * Genera el Schema.org JSON-LD de BreadcrumbList para una ficha de propiedad.
 */
export function generatePropertyBreadcrumbJsonLd(property: Property) {
  const pillar = getPillarPageForProperty(property);
  const propertyUrl = `${BASE_URL}/propiedad/${property.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pillar.title,
        item: `${BASE_URL}${pillar.href}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: property.title,
        item: propertyUrl,
      },
    ],
  };
}

/**
 * Normaliza y limpia una cadena de texto eliminando acentos, stopwords y caracteres especiales.
 */
function cleanSlugText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, ' ')   // Mantener solo alfanuméricos y guiones
    .trim();
}

/**
 * Normaliza unidades de medida a formato estándar (ej. "112 m²", "112-m", "112 metros" -> "112m2").
 */
function normalizeMeasurementsInText(text: string): string {
  if (!text) return '';
  return text
    .replace(/(\d+)\s*(?:m2|m²|mts2|mts|metros\s*cuadrados|metros|m\b)/gi, '$1m2')
    .replace(/(\d+)\s*(?:ha|has|hectareas|hectarea\b)/gi, '$1ha');
}

/**
 * Extrae o sintetiza la característica clave para el slug (ej. "112m2", "3-dormitorios", "10ha").
 */
function extractKeyFeature(
  category: string,
  features?: {
    bedrooms?: number;
    builtAreaM2?: number;
    plotAreaM2?: number;
    isHectares?: boolean;
    hectaresAmount?: number;
  },
  title?: string
): string {
  // 1. Si es vivienda (casa, apartamento) y tiene dormitorios informados
  if ((category === 'casa' || category === 'apartamento') && features?.bedrooms && features.bedrooms > 0) {
    return `${features.bedrooms}-dormitorios`;
  }

  // 2. Si tiene superficie construida (locales, depósitos, casas)
  if (features?.builtAreaM2 && features.builtAreaM2 > 0) {
    return `${Math.round(features.builtAreaM2)}m2`;
  }

  // 3. Si tiene hectáreas o terreno (chacras, campos, terrenos)
  if (features?.isHectares && features?.hectaresAmount && features.hectaresAmount > 0) {
    return `${features.hectaresAmount}ha`;
  }
  if (features?.plotAreaM2 && features.plotAreaM2 > 0) {
    if (category === 'chacra' && features.plotAreaM2 >= 10000) {
      return `${Math.round(features.plotAreaM2 / 10000)}ha`;
    }
    return `${Math.round(features.plotAreaM2)}m2`;
  }

  // 4. Extracción heurística desde el título si no está en features
  if (title) {
    const normTitle = normalizeMeasurementsInText(title.toLowerCase());
    
    // Buscar dormitorios
    const dormMatch = normTitle.match(/(\d+)\s*(?:dormitorios|dormitorio|dorms|dorm\b)/i);
    if (dormMatch && (category === 'casa' || category === 'apartamento')) {
      return `${dormMatch[1]}-dormitorios`;
    }

    // Buscar m2
    const m2Match = normTitle.match(/(\d+)\s*m2/i);
    if (m2Match) {
      return `${m2Match[1]}m2`;
    }

    // Buscar hectáreas
    const haMatch = normTitle.match(/(\d+)\s*ha/i);
    if (haMatch) {
      return `${haMatch[1]}ha`;
    }
  }

  return '';
}

/**
 * Normaliza y extrae el barrio o calle limpia para el slug.
 */
function extractLocationSlug(neighborhood?: string, address?: string, title?: string): string {
  // Conectores y palabras a omitir en nombres de calle/barrio
  const stopwords = new Set(['de', 'en', 'y', 'el', 'la', 'del', 'los', 'las', 'al', 'o', 'un', 'una', 'con', 'pleno', 'zona', 'calle', 'avda', 'av']);

  // Si hay dirección específica como "Sarandí y 18 de Julio" o "Av. Nicolás Guerra"
  let candidate = '';
  if (address && address.trim()) {
    // Tomar la primera calle principal
    const rawClean = cleanSlugText(address);
    const words = rawClean.split(/\s+/).filter(w => !stopwords.has(w) && w.length > 1);
    if (words.length > 0) {
      candidate = words.slice(0, 2).join('-');
    }
  }

  if (!candidate && neighborhood && neighborhood.trim() && neighborhood.toLowerCase() !== 'centro') {
    const rawClean = cleanSlugText(neighborhood);
    const words = rawClean.split(/\s+/).filter(w => !stopwords.has(w) && w.length > 1);
    if (words.length > 0) {
      candidate = words.join('-');
    }
  }

  if (!candidate && title) {
    // Buscar nombres conocidos de calles o barrios de San José en el título
    const lowerTitle = cleanSlugText(title);
    const knownSpots = [
      'sarandi', 'plaza arriaga', 'arroyo mallada', 'nicolas guerra', 'barrio industrial',
      'picada de las tunas', 'parque rodo', 'bypass', 'treinta y tres', 'colon',
      'ruta 3', 'ruta 11', 'ruta 1', 'libertad', 'playa pascual', 'kuyu', 'ciudad del plata', 'centro'
    ];
    for (const spot of knownSpots) {
      if (lowerTitle.includes(spot)) {
        candidate = spot.replace(/\s+/g, '-');
        break;
      }
    }
  }

  if (!candidate && neighborhood && neighborhood.trim()) {
    candidate = cleanSlugText(neighborhood).replace(/\s+/g, '-');
  }

  return candidate || 'san-jose';
}

export interface GenerateSlugParams {
  title?: string;
  codeRef: string;
  category?: string;
  operation?: string;
  neighborhood?: string;
  address?: string;
  city?: string;
  features?: {
    bedrooms?: number;
    builtAreaM2?: number;
    plotAreaM2?: number;
    isHectares?: boolean;
    hectaresAmount?: number;
  };
}

/**
 * Genera un slug SEO amigable y estandarizado con la regla:
 * [operacion]-[tipo_inmueble]-[caracteristica_clave]-[calle_o_barrio]-[ciudad]-[id]
 *
 * Ejemplos:
 * - Alquiler: alquiler-local-comercial-112m2-sarandi-san-jose-mon955
 * - Venta: venta-casa-3-dormitorios-plaza-arriaga-san-jose-mon956
 * - Depósito: alquiler-deposito-300m2-av-nicolas-guerra-san-jose-mon957
 */
export function generatePropertySlug(
  titleOrParams: string | GenerateSlugParams,
  codeRefParam?: string,
  categoryParam?: string,
  operationParam?: string,
  neighborhoodParam?: string,
  featuresParam?: any
): string {
  let p: GenerateSlugParams;

  if (typeof titleOrParams === 'object' && titleOrParams !== null) {
    p = titleOrParams;
  } else {
    p = {
      title: titleOrParams,
      codeRef: codeRefParam || 'mon',
      category: categoryParam,
      operation: operationParam,
      neighborhood: neighborhoodParam,
      features: featuresParam,
    };
  }

  // 1. Operación
  let op = (p.operation || '').toLowerCase().trim();
  if (!op || op === 'todos') {
    // Detección heurística desde el título
    const lowerTitle = (p.title || '').toLowerCase();
    if (lowerTitle.includes('alquiler') || lowerTitle.includes('alquila')) {
      op = 'alquiler';
    } else if (lowerTitle.includes('pozo') || lowerTitle.includes('proyecto')) {
      op = 'proyecto';
    } else {
      op = 'venta';
    }
  }

  // 2. Tipo de Inmueble
  const cat = (p.category || '').toLowerCase().trim();
  let tipo = 'inmueble';
  switch (cat) {
    case 'local':
      tipo = 'local-comercial';
      break;
    case 'deposito':
      tipo = 'deposito';
      break;
    case 'modulo':
      tipo = 'modulo-habitacional';
      break;
    case 'casa':
      tipo = 'casa';
      break;
    case 'apartamento':
      tipo = 'apartamento';
      break;
    case 'terreno':
      tipo = 'terreno';
      break;
    case 'chacra':
      tipo = 'chacra';
      break;
    case 'proyecto':
      tipo = 'proyecto';
      break;
    default:
      if (p.title) {
        const t = p.title.toLowerCase();
        if (t.includes('local')) tipo = 'local-comercial';
        else if (t.includes('deposito') || t.includes('galpon')) tipo = 'deposito';
        else if (t.includes('apartamento') || t.includes('apto')) tipo = 'apartamento';
        else if (t.includes('terreno') || t.includes('solar')) tipo = 'terreno';
        else if (t.includes('chacra') || t.includes('campo')) tipo = 'chacra';
        else if (t.includes('casa')) tipo = 'casa';
      }
      break;
  }

  // 3. Característica Clave
  const keyFeature = extractKeyFeature(cat, p.features, p.title);

  // 4. Calle o Barrio
  const locationPart = extractLocationSlug(p.neighborhood, p.address, p.title);

  // 5. Ciudad
  let ciudad = 'san-jose';
  const rawCity = (p.city || '').toLowerCase();
  if (rawCity.includes('libertad')) ciudad = 'libertad';
  else if (rawCity.includes('ciudad del plata') || rawCity.includes('playa pascual')) ciudad = 'ciudad-del-plata';
  else if (rawCity.includes('rodriguez')) ciudad = 'rodriguez';
  else if (rawCity.includes('ecilda')) ciudad = 'ecilda-paullier';

  // 6. ID Limpio
  const cleanId = (p.codeRef || 'mon')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  // 7. Ensamble de piezas evitando repeticiones
  const rawParts = [op, tipo, keyFeature, locationPart, ciudad, cleanId].filter(Boolean);
  
  // Limpieza y deduplicación de tokens repetidos
  const tokens: string[] = [];
  for (const part of rawParts) {
    const subTokens = cleanSlugText(part).split(/[\s-]+/).filter(Boolean);
    for (const token of subTokens) {
      // Evitar stopwords en la cadena final (salvo que formen parte de medidas como '112m2' o '3-dormitorios')
      if (['de', 'en', 'y', 'el', 'la', 'del', 'los', 'las', 'al', 'o', 'un', 'una', 'con'].includes(token)) {
        continue;
      }
      // Evitar repetir token adyacente (ej. 'san-jose-san-jose' o 'alquiler-alquiler')
      if (tokens.length > 0 && tokens[tokens.length - 1] === token) {
        continue;
      }
      tokens.push(token);
    }
  }

  // Asegurar que el ID no se haya perdido y quede exactamente al final
  if (tokens.length === 0 || tokens[tokens.length - 1] !== cleanId) {
    // Si cleanId ya está en alguna parte anterior, eliminarlo para ponerlo al final
    const filtered = tokens.filter(t => t !== cleanId);
    filtered.push(cleanId);
    return filtered.join('-');
  }

  return tokens.join('-');
}

/**
 * Genera una recomendación de Título SEO basada en fórmulas comerciales por categoría (máx 60 caracteres).
 */
export function generateSmartSeoTitle(p: Partial<Property>): string {
  const categoryRaw = p.category || 'casa';
  const categoryFormatted = categoryRaw.charAt(0).toUpperCase() + categoryRaw.slice(1);
  const operation = p.operation === 'alquiler' ? 'Alquiler' : 'Venta';
  const hood = p.location?.neighborhood || 'San José de Mayo';

  if (p.category === 'terreno') {
    const area = p.features?.plotAreaM2 ? `${p.features.plotAreaM2}m²` : '';
    const title = `Terreno ${area ? `de ${area} ` : ''}en ${hood}, San José | Inmobiliaria Montaño`;
    return title.length <= 60 ? title : title.substring(0, 57) + '...';
  }

  if (p.category === 'chacra') {
    const ha = p.features?.plotAreaM2 ? `${p.features.plotAreaM2} Ha` : '';
    const title = `Chacra ${ha ? `de ${ha} ` : ''}en ${hood}, San José | Inmobiliaria Montaño`;
    return title.length <= 60 ? title : title.substring(0, 57) + '...';
  }

  const dorms = p.features?.bedrooms ? `${p.features.bedrooms} Dorms ` : '';
  const candidate = `${categoryFormatted} ${dorms}en ${operation} en ${hood} | Inmobiliaria Montaño`;
  if (candidate.length <= 60) return candidate;

  const fallback = `${categoryFormatted} en ${operation} en ${hood} | Inmobiliaria Montaño`;
  return fallback.length <= 60 ? fallback : fallback.substring(0, 57) + '...';
}

/**
 * Genera una recomendación de Meta Descripción (130-155 caracteres) con Copywriting Local + CTA.
 */
export function generateSmartSeoDescription(p: Partial<Property>): string {
  const category = (p.category || 'propiedad').toLowerCase();
  const hood = p.location?.neighborhood || 'San José de Mayo';
  const city = p.location?.city || 'San José de Mayo';
  const dorms = p.features?.bedrooms ? `${p.features.bedrooms} dorms` : '';
  const priceMode = p.price?.priceMode || (p.price?.amount === 0 ? 'consultar' : 'visible');
  const hasValidPrice = Boolean(p.price?.amount && p.price.amount > 0 && priceMode !== 'consultar' && priceMode !== 'reservado');
  const priceFormatted =
    priceMode === 'consultar' ? 'Precio a Consultar' :
    priceMode === 'reservado' ? 'Precio Reservado' :
    priceMode === 'desde' && hasValidPrice ? `Desde ${p.price?.currency === 'USD' ? 'USD' : 'UYU $'} ${p.price?.amount?.toLocaleString('es-UY')}` :
    hasValidPrice ? `${p.price?.currency === 'USD' ? 'USD' : 'UYU $'} ${p.price?.amount?.toLocaleString('es-UY')}` : '';

  let keyAttr = '';
  if (p.features?.garage) keyAttr = 'con garage';
  else if (p.features?.garden) keyAttr = 'con amplio jardín';
  else if (p.features?.barbecue) keyAttr = 'con parrillero';
  else if (p.features?.bankCreditEligible) keyAttr = 'apta crédito bancario';

  const attrStr = keyAttr ? ` ${keyAttr}` : '';
  const priceStr = priceFormatted ? ` (${priceFormatted})` : '';

  return `Oportunidad en ${hood}, ${city}: ${category} ${dorms}${attrStr}${priceStr}. Coordiná tu visita con Daniel Montaño al 092 776 715.`.substring(0, 155);
}

/**
 * Limpia el formato Markdown y HTML de un texto para su uso en metaetiquetas y Schema JSON-LD.
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/^#+\s+/gm, '')       // Eliminar encabezados #, ##, ###
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Eliminar negritas **texto**
    .replace(/\*([^*]+)\*/g, '$1')     // Eliminar cursivas *texto*
    .replace(/__([^_]+)__/g, '$1')     // Eliminar negritas __texto__
    .replace(/^[-*•]\s+/gm, '')        // Eliminar viñetas
    .replace(/^\d+\.\s+/gm, '')        // Eliminar listas numeradas
    .replace(/^>\s*/gm, '')            // Eliminar citas/bloques >
    .replace(/<[^>]*>/g, '')           // Eliminar etiquetas HTML
    .replace(/\s+/g, ' ')              // Normalizar espacios
    .trim();
}

/**
 * Genera el Schema.org @graph unificado y canónico para una propiedad inmobiliaria.
 * Tipos oficiales Schema.org / W3C: RealEstateAgent, Person, RealEstateListing, SingleFamilyResidence / Apartment / Land / CommercialBuilding, Offer, BreadcrumbList.
 * No emite Offer para propiedades vendidas, alquiladas o retiradas.
 * No emite atributos ficticios que no existan en los datos reales.
 */
export function generatePropertyGraphSchema(property: Property) {
  const canonicalUrl = `${BASE_URL}/propiedad/${property.slug}`;
  const pillar = getPillarPageForProperty(property);
  const mainImage = property.images?.find((img) => img.isMain) || property.images?.[0];
  const imageUrl = mainImage?.webpUrl || mainImage?.blobUrl || `${BASE_URL}/logo.png`;
  const absoluteImages = property.images?.map((img) => {
    const src = img.webpUrl || img.blobUrl;
    return src.startsWith('http') ? src : `${BASE_URL}${src}`;
  }) || [imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`];

  // Determinar tipo de entidad inmobiliaria Schema.org oficial
  let schemaType = 'SingleFamilyResidence';
  if (property.category === 'apartamento') schemaType = 'Apartment';
  else if (property.category === 'terreno' || property.category === 'chacra') schemaType = 'Land';
  else if (property.category === 'local' || property.category === 'deposito') schemaType = 'CommercialBuilding';

  const title = property.seoTitle || property.title;
  const description = stripMarkdown(property.seoDescription || property.description);

  // Determinar si la propiedad está activa para emitir Offer
  const isOfferActive = property.status === 'disponible' || property.status === 'nuevo' || property.status === 'oportunidad';

  // Entidad del Inmueble (Item)
  const itemEntity: any = {
    '@type': schemaType,
    '@id': `${canonicalUrl}#item`,
    name: property.title,
    description: stripMarkdown(property.description),
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location?.city || 'San José de Mayo',
      addressRegion: property.location?.department || 'San José',
      addressCountry: 'UY',
      streetAddress: property.location?.address || property.location?.neighborhood,
    },
  };

  // Coordenadas solo si están disponibles y válidas
  if (property.location?.coordinates?.lat && property.location?.coordinates?.lng) {
    itemEntity.geo = {
      '@type': 'GeoCoordinates',
      latitude: property.location.coordinates.lat,
      longitude: property.location.coordinates.lng,
    };
  }

  // Atributos cuantitativos reales (solo si existen y son mayores a cero)
  if (property.features?.bedrooms && property.features.bedrooms > 0) {
    itemEntity.numberOfBedrooms = property.features.bedrooms;
  }
  if (property.features?.bathrooms && property.features.bathrooms > 0) {
    itemEntity.numberOfBathroomsTotal = property.features.bathrooms;
  }
  if (property.features?.builtAreaM2 && property.features.builtAreaM2 > 0) {
    itemEntity.floorSize = {
      '@type': 'QuantitativeValue',
      value: property.features.builtAreaM2,
      unitCode: 'MTK',
    };
  }
  if (property.features?.plotAreaM2 && property.features.plotAreaM2 > 0) {
    itemEntity.landArea = {
      '@type': 'QuantitativeValue',
      value: property.features.plotAreaM2,
      unitCode: 'MTK',
    };
  }

  // Entidad de Publicación (RealEstateListing)
  const listingEntity: any = {
    '@type': 'RealEstateListing',
    '@id': `${canonicalUrl}#listing`,
    url: canonicalUrl,
    name: title,
    description: description,
    image: absoluteImages,
    datePosted: property.createdAt,
    dateModified: property.updatedAt || property.createdAt,
    mainEntity: { '@id': `${canonicalUrl}#item` },
  };

  // Oferta comercial (Offer) - SOLO se emite si la propiedad está activa
  const offerEntity: any = isOfferActive && property.price?.amount
    ? {
        '@type': 'Offer',
        '@id': `${canonicalUrl}#offer`,
        price: property.price.amount,
        priceCurrency: property.price.currency || 'USD',
        availability: 'https://schema.org/InStock',
        seller: { '@id': `${BASE_URL}/#agent` },
      }
    : null;

  if (offerEntity) {
    listingEntity.offers = { '@id': `${canonicalUrl}#offer` };
  }

  // Grafo unificado
  const graph: any[] = [
    // 1. Agencia Inmobiliaria
    {
      '@type': 'RealEstateAgent',
      '@id': `${BASE_URL}/#agent`,
      name: 'Inmobiliaria Montaño',
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      image: `${BASE_URL}/og-logo.png`,
      telephone: '+59892776715',
      email: 'inmobiliariadaniel247@gmail.com',
      hasMap: 'https://share.google/6I1gbffV5ZTS5heXV',
      sameAs: [
        'https://share.google/6I1gbffV5ZTS5heXV',
        'https://wa.me/59892776715',
      ],
      slogan: 'Líder en venta de casas verificadas, créditos hipotecarios y tasaciones en San José de Mayo',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '25 de Mayo 338',
        addressLocality: 'San José de Mayo',
        addressRegion: 'San José',
        postalCode: '80000',
        addressCountry: 'UY',
      },
      founder: { '@id': `${BASE_URL}/#daniel-montano` },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'San José' },
        { '@type': 'City', name: 'San José de Mayo' },
        { '@type': 'City', name: 'Libertad' },
        { '@type': 'City', name: 'Ciudad del Plata' },
      ],
    },
    // 2. Persona / Asesor
    {
      '@type': 'Person',
      '@id': `${BASE_URL}/#daniel-montano`,
      name: 'Daniel Montaño',
      jobTitle: 'Director & Asesor Inmobiliario',
      telephone: '+59892776715',
      image: `${BASE_URL}/daniel-montano.webp`,
      worksFor: { '@id': `${BASE_URL}/#agent` },
    },
    // 3. Ficha Listing
    listingEntity,
    // 4. Inmueble
    itemEntity,
    // 5. Breadcrumbs
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: BASE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: pillar.title,
          item: `${BASE_URL}${pillar.href}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: property.title,
          item: canonicalUrl,
        },
      ],
    },
  ];

  if (offerEntity) {
    graph.push(offerEntity);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export const generatePropertyJsonLd = generatePropertyGraphSchema;

/**
 * Genera el Schema.org @graph institucional para páginas principales y de servicios.
 */
export function generateSiteGraphSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateAgent',
        '@id': `${BASE_URL}/#agent`,
        name: 'Inmobiliaria Montaño',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        image: `${BASE_URL}/og-logo.png`,
        telephone: '+59892776715',
        email: 'inmobiliariadaniel247@gmail.com',
        hasMap: 'https://share.google/6I1gbffV5ZTS5heXV',
        sameAs: [
          'https://share.google/6I1gbffV5ZTS5heXV',
          'https://wa.me/59892776715',
        ],
        slogan: 'Líder en venta de casas verificadas, créditos hipotecarios y tasaciones en San José de Mayo',
        description: 'Inmobiliaria líder de referencia en San José de Mayo, Uruguay. Especialistas destacados en venta de casas verificadas, propiedades aptas para crédito bancario (BHU e hipotecarios), alquileres garantizados y tasaciones oficiales con Daniel Montaño.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '25 de Mayo 338',
          addressLocality: 'San José de Mayo',
          addressRegion: 'San José',
          postalCode: '80000',
          addressCountry: 'UY',
        },
        founder: { '@id': `${BASE_URL}/#daniel-montano` },
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Departamento de San José' },
          { '@type': 'City', name: 'San José de Mayo' },
          { '@type': 'City', name: 'Libertad' },
          { '@type': 'City', name: 'Ciudad del Plata' },
        ],
      },
      {
        '@type': 'Person',
        '@id': `${BASE_URL}/#daniel-montano`,
        name: 'Daniel Montaño',
        jobTitle: 'Director & Asesor Inmobiliario',
        telephone: '+59892776715',
        image: `${BASE_URL}/daniel-montano.webp`,
        worksFor: { '@id': `${BASE_URL}/#agent` },
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'Inmobiliaria Montaño',
        publisher: { '@id': `${BASE_URL}/#agent` },
      },
    ],
  };
}

/**
 * Genera la Metadata OpenGraph y Twitter Cards optimizada para Next.js App Router.
 */
export function generatePropertyMetadata(property: Property): Metadata {
  const mainImage = property.images?.find((img) => img.isMain) || property.images?.[0];
  const rawImg = mainImage?.webpUrl || mainImage?.blobUrl || '/logo.png';
  const imageUrl = rawImg.startsWith('http') ? rawImg : `${BASE_URL}${rawImg}`;
  const canonicalUrl = `${BASE_URL}/propiedad/${property.slug}`;

  const titleStr = property.seoTitle || generateSmartSeoTitle(property);
  const descriptionStr = property.seoDescription || generateSmartSeoDescription(property);

  const focusKeys = property.focusKeywords
    ? property.focusKeywords.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  const keywordsList = [
    ...focusKeys,
    property.title,
    `${property.category} en ${property.location?.neighborhood || 'San José de Mayo'}`,
    `${property.operation === 'alquiler' ? 'alquiler' : 'venta de casas'} en San José de Mayo`,
    'Inmobiliaria Montaño San José',
    'Daniel Montaño Inmobiliaria',
    'Inmuebles en San José Uruguay',
  ];

  const robotsConfig = property.noIndex
    ? {
        index: false,
        follow: false,
      }
    : {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      };

  return {
    title: titleStr,
    description: descriptionStr,
    keywords: keywordsList,
    robots: robotsConfig,
    alternates: {
      canonical: canonicalUrl,
      types: {
        'text/markdown': `${canonicalUrl}.md`,
      },
    },
    openGraph: {
      title: titleStr,
      description: descriptionStr,
      url: canonicalUrl,
      siteName: 'Inmobiliaria Montaño',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: mainImage?.altText || property.title,
          type: imageUrl.endsWith('.webp') ? 'image/webp' : imageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg',
        },
      ],
      locale: 'es_UY',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titleStr,
      description: descriptionStr,
      images: [imageUrl],
    },
    other: {
      'geo.region': 'UY-SJ',
      'geo.placename': `${property.location?.neighborhood || 'San José de Mayo'}, San José, Uruguay`,
      'geo.position': `${property.location?.coordinates?.lat || -34.3375};${property.location?.coordinates?.lng || -56.7136}`,
      'ICBM': `${property.location?.coordinates?.lat || -34.3375}, ${property.location?.coordinates?.lng || -56.7136}`,
    },
  };
}
