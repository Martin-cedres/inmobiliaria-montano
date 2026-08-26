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
 * Genera un slug SEO amigable optimizado con Palabras Clave Locales.
 * Ej: "casa-venta-2-dormitorios-arroyo-mallada-san-jose-mon-101"
 */
export function generatePropertySlug(title: string, codeRef: string, category?: string, operation?: string, neighborhood?: string): string {
  const op = (operation || 'venta').toLowerCase();
  const cat = (category || 'propiedad').toLowerCase();
  const hood = (neighborhood || '').toLowerCase();
  
  const baseText = `${op}-${cat}-${title} ${hood} san jose`;

  const cleanSlug = baseText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '')    // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-');           // Reemplazar espacios por guiones

  const cleanRef = codeRef.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanSlug}-${cleanRef}`;
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
      address: {
        '@type': 'PostalAddress',
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
        description: 'Inmobiliaria de referencia en San José de Mayo, Uruguay. Especialistas en venta de casas, alquileres garantizados, terrenos, chacras y tasaciones oficiales con Daniel Montaño.',
        address: {
          '@type': 'PostalAddress',
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

  return {
    title: titleStr,
    description: descriptionStr,
    keywords: [
      property.title,
      `${property.category} en ${property.location?.neighborhood || 'San José de Mayo'}`,
      `${property.operation === 'alquiler' ? 'alquiler' : 'venta de casas'} en San José de Mayo`,
      'Inmobiliaria Montaño San José',
      'Daniel Montaño Inmobiliaria',
      'Inmuebles en San José Uruguay',
    ],
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
          alt: property.title,
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
