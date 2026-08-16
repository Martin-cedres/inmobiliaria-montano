import { Property } from '@/types/property';
import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

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
 * Genera una recomendación de Título SEO basada en fórmulas comerciales por categoría.
 */
export function generateSmartSeoTitle(p: Partial<Property>): string {
  const category = (p.category || 'casa').toUpperCase();
  const operation = p.operation === 'alquiler' ? 'Alquiler' : 'Venta';
  const dorms = p.features?.bedrooms ? `${p.features.bedrooms} Dorms` : '';
  const hood = p.location?.neighborhood || 'San José de Mayo';
  const isBank = p.features?.bankCreditEligible ? 'Apta Banco' : p.features?.titlesUpToDate ? 'Títulos al Día' : '';

  if (p.category === 'terreno') {
    const area = p.features?.plotAreaM2 ? `${p.features.plotAreaM2}m²` : '';
    return `Terreno de ${area} en ${hood} | Con Servicios | San José`.substring(0, 60);
  }

  if (p.category === 'chacra') {
    const ha = p.features?.plotAreaM2 ? `${p.features.plotAreaM2} Ha` : '';
    const coneat = p.features?.coneatIndex ? `CONEAT ${p.features.coneatIndex}` : '';
    return `Chacra de ${ha} en ${hood} | ${coneat || 'San José'}`.substring(0, 60);
  }

  if (p.operation === 'alquiler') {
    const guar = p.guarantees && p.guarantees.length > 0 ? `Garantía ${p.guarantees[0]}` : 'Excelente Ubicación';
    return `Alquiler de ${category} en ${hood} | ${guar} - San José`.substring(0, 60);
  }

  const badge = isBank || 'Inmobiliaria Montaño';
  return `${category} de ${dorms} en ${hood} | ${badge}`.substring(0, 60);
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
  const priceFormatted =
    priceMode === 'consultar' ? 'Precio a Consultar' :
    priceMode === 'reservado' ? 'Precio Reservado' :
    priceMode === 'desde' && p.price?.amount ? `Desde ${p.price.currency === 'USD' ? 'USD' : 'UYU $'} ${p.price.amount.toLocaleString('es-UY')}` :
    p.price?.amount ? `${p.price.currency === 'USD' ? 'USD' : 'UYU $'} ${p.price.amount.toLocaleString('es-UY')}` : '';

  let keyAttr = '';
  if (p.features?.garage) keyAttr = 'con garage';
  else if (p.features?.garden) keyAttr = 'con amplio jardín';
  else if (p.features?.barbecue) keyAttr = 'con parrillero';
  else if (p.features?.bankCreditEligible) keyAttr = 'apta crédito bancario';

  const attrStr = keyAttr ? ` ${keyAttr}` : '';
  const priceStr = priceFormatted ? ` (${priceFormatted})` : '';

  return `Oportunidad en ${hood}, ${city}: ${category} ${dorms}${attrStr}${priceStr}. Coordiná tu visita con Daniel Montaño.`.substring(0, 155);
}

/**
 * Genera automáticamente el Schema.org JSON-LD (RealEstateListing / SingleFamilyResidence / Apartment / Landform)
 */
export function generatePropertyJsonLd(property: Property) {
  const mainImage = property.images?.find((img) => img.isMain) || property.images?.[0];
  const imageUrl = mainImage?.webpUrl || mainImage?.blobUrl || `${BASE_URL}/logo.png`;
  const canonicalUrl = `${BASE_URL}/propiedad/${property.slug}`;

  let schemaType = 'SingleFamilyResidence';
  if (property.category === 'apartamento') schemaType = 'Apartment';
  else if (property.category === 'terreno' || property.category === 'chacra') schemaType = 'Landform';

  const title = property.seoTitle || property.title;
  const description = property.seoDescription || property.description;

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${canonicalUrl}#identity`,
    url: canonicalUrl,
    name: title,
    description: description,
    image: property.images?.map((img) => img.webpUrl || img.blobUrl) || [imageUrl],
    datePosted: property.createdAt,
    dateModified: property.updatedAt,
    mainEntity: {
      '@type': schemaType,
      name: property.title,
      description: property.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.location?.city || 'San José de Mayo',
        addressRegion: property.location?.department || 'San José',
        addressCountry: 'UY',
        streetAddress: property.location?.address || property.location?.neighborhood,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: property.location?.coordinates?.lat || -34.3375,
        longitude: property.location?.coordinates?.lng || -56.7136,
      },
      numberOfBedrooms: property.features?.bedrooms || undefined,
      numberOfBathroomsTotal: property.features?.bathrooms || undefined,
      floorSize: property.features?.builtAreaM2
        ? {
            '@type': 'QuantitativeValue',
            value: property.features.builtAreaM2,
            unitCode: 'MTK',
          }
        : undefined,
    },
    offers: {
      '@type': 'Offer',
      price: property.price?.amount,
      priceCurrency: property.price?.currency || 'USD',
      availability:
        property.status === 'disponible' || property.status === 'nuevo'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'RealEstateAgent',
        name: 'Inmobiliaria Montaño',
        telephone: '+59892776715',
        email: 'inmobiliariadaniel247@gmail.com',
        url: BASE_URL,
      },
    },
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

  const priceMode = property.price?.priceMode || (property.price?.amount === 0 ? 'consultar' : 'visible');
  const defaultPriceStr =
    priceMode === 'consultar' ? 'Consultar Precio' :
    priceMode === 'reservado' ? 'Precio Reservado' :
    priceMode === 'desde' ? `Desde ${property.price?.currency} $${property.price?.amount?.toLocaleString('es-UY')}` :
    `${property.price?.currency} $${property.price?.amount?.toLocaleString('es-UY')}`;

  const titleStr = property.seoTitle || `${property.title} — ${defaultPriceStr} | Inmobiliaria Montaño`;
  const descriptionStr = property.seoDescription || `Oportunidad en ${property.location?.neighborhood}, San José de Mayo. Ref. #${property.codeRef}. ${property.description.substring(0, 140)}...`;

  return {
    title: titleStr,
    description: descriptionStr,
    alternates: {
      canonical: canonicalUrl,
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
      'geo.placename': 'San José de Mayo',
    },
  };
}
