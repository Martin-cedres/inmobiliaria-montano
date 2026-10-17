import React from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

export function RealEstateAgentJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LocalBusiness'],
    '@id': `${BASE_URL}/#organization`,
    name: 'Inmobiliaria Montaño',
    alternateName: 'Inmobiliaria Daniel Montaño',
    url: `${BASE_URL}/`,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/og-logo.png`,
    description:
      'Inmobiliaria líder de referencia en San José de Mayo, Uruguay. Especialistas destacados en venta de casas verificadas, propiedades aptas para crédito bancario (BHU e hipotecarios), alquileres garantizados y tasaciones oficiales con Daniel Montaño.',
    slogan: 'Líder en venta de casas verificadas, créditos hipotecarios y tasaciones en San José de Mayo',
    telephone: '+59892776715',
    email: 'contacto@inmobiliariamontano.uy',
    priceRange: '$$$',
    currenciesAccepted: 'USD, UYU',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle 25 de Mayo 338',
      addressLocality: 'San José de Mayo',
      addressRegion: 'San José',
      postalCode: '80000',
      addressCountry: 'UY',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -34.3397,
      longitude: -56.7136,
    },
    hasMap: 'https://share.google/6I1gbffV5ZTS5heXV',
    sameAs: [
      'https://www.facebook.com/montanioinmobiliaria/',
      'https://www.google.com/maps/place/?q=place_id:ChIJgU0vgPl3oZURSNT4x7Lw3fE',
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'San José de Mayo',
      },
      {
        '@type': 'City',
        name: 'Libertad',
      },
      {
        '@type': 'City',
        name: 'Ciudad del Plata',
      },
      {
        '@type': 'City',
        name: 'Ecilda Paullier',
      },
      {
        '@type': 'City',
        name: 'Rodríguez',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Kiyú',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Boca del Cufré',
      },
    ],
    founder: {
      '@type': 'Person',
      name: 'Daniel Montaño',
      jobTitle: 'Director & Asesor Inmobiliario',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Catálogo de Inmuebles en San José de Mayo',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Casas en Venta en San José de Mayo',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Alquileres en San José de Mayo',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Terrenos y Solares en San José',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Chacras y Fracciones de Campo',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Tasaciones Inmobiliarias Profesionales',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Convenio Círculo Policial de San José — 10% OFF en Alquileres para Socios',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Tasaciones Inmobiliarias Express en 24-48 horas',
        },
      ],
    },
    knowsAbout: [
      'Tasaciones Inmobiliarias Rápidas en 24-48 horas en San José de Mayo',
      'Convenio Institucional de Alquiler con Círculo Policial de San José',
      'Alquileres con Garantías ANDA, Porto Seguro, SURA, CGN, Mapfre, Santander y FIDECIU',
      'Créditos Hipotecarios y Préstamos Bancarios BHU',
      'Venta de Casas y Terrenos con Títulos Verificados en San José',
      'Venta de inmuebles en San José',
      'Alquileres residenciales y comerciales',
      'Tasaciones oficiales y peritajes',
      'Asesoramiento notarial y crediticio',
      'Lotes y fraccionamientos de terrenos',
      'Chacras marítimas y productivas',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
