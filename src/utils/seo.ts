import { Property } from '@/types/property';
import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmobiliaria-montano.vercel.app';

/**
 * Genera un slug SEO amigable a partir del título y código de referencia.
 * Ej: "Casa 2 Dormitorios en Centro" -> "casa-2-dormitorios-en-centro-mon-101"
 */
export function generatePropertySlug(title: string, codeRef: string): string {
  const cleanTitle = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '')    // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-');           // Reemplazar espacios por guiones

  const cleanRef = codeRef.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanTitle}-${cleanRef}`;
}

/**
 * Genera automáticamente el Schema.org JSON-LD (RealEstateListing / SingleFamilyResidence)
 * exigido por Google Search Console para indexación rica en resultados de búsqueda.
 */
export function generatePropertyJsonLd(property: Property) {
  const mainImage = property.images.find((img) => img.isMain) || property.images[0];
  const imageUrl = mainImage?.webpUrl || mainImage?.blobUrl || `${BASE_URL}/og-default.jpg`;
  const canonicalUrl = `${BASE_URL}/propiedad/${property.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${canonicalUrl}#identity`,
    url: canonicalUrl,
    name: property.title,
    description: property.description,
    image: property.images.map((img) => img.webpUrl || img.blobUrl),
    datePosted: property.createdAt,
    dateModified: property.updatedAt,
    mainEntity: {
      '@type': property.category === 'apartamento' ? 'Apartment' : 'SingleFamilyResidence',
      name: property.title,
      description: property.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.location.city || 'San José de Mayo',
        addressRegion: property.location.department || 'San José',
        addressCountry: 'UY',
        streetAddress: property.location.address || property.location.neighborhood,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -34.3375, // Coordenadas aproximadas de San José de Mayo
        longitude: -56.7136,
      },
      numberOfBedrooms: property.features.bedrooms || undefined,
      numberOfBathroomsTotal: property.features.bathrooms || undefined,
      floorSize: property.features.builtAreaM2
        ? {
            '@type': 'QuantitativeValue',
            value: property.features.builtAreaM2,
            unitCode: 'MTK', // Metros cuadrados
          }
        : undefined,
    },
    offers: {
      '@type': 'Offer',
      price: property.price.amount,
      priceCurrency: property.price.currency,
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
 * Genera automáticamente la Metadata OpenGraph y Twitter Cards para Next.js App Router
 * al renderizar cada propiedad, sin alterar la redacción original del usuario.
 */
export function generatePropertyMetadata(property: Property): Metadata {
  const mainImage = property.images.find((img) => img.isMain) || property.images[0];
  const imageUrl = mainImage?.webpUrl || mainImage?.blobUrl || `${BASE_URL}/og-default.jpg`;
  const canonicalUrl = `${BASE_URL}/propiedad/${property.slug}`;
  const opStr = property.operation === 'alquiler' ? 'Alquiler' : 'Venta';
  const priceStr = `${property.price.currency} $${property.price.amount.toLocaleString()}`;

  const titleStr = `${property.title} — ${priceStr} | Inmobiliaria Montaño`;
  const descriptionStr = `${opStr} en ${property.location.neighborhood}, San José de Mayo. Ref. #${property.codeRef}. ${property.description.substring(0, 140)}...`;

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
