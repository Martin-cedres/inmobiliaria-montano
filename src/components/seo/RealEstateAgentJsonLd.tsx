import React from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

export function RealEstateAgentJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${BASE_URL}/#organization`,
    name: 'Inmobiliaria Montaño',
    alternateName: ['Inmobiliaria Daniel Montaño', 'Montaño Propiedades San José'],
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/og-logo.png`,
    description:
      'Inmobiliaria líder en San José de Mayo, Uruguay. Especialistas en venta de casas, alquileres garantizados, terrenos, chacras y tasaciones oficiales con Daniel Montaño.',
    telephone: '+59892776715',
    email: 'inmobiliariadaniel247@gmail.com',
    priceRange: '$$$',
    currenciesAccepted: 'USD, UYU',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San José de Mayo',
      addressRegion: 'San José',
      postalCode: '80000',
      addressCountry: 'UY',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -34.3375,
      longitude: -56.7136,
    },
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: 'San José de Mayo',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Departamento de San José',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Libertad',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Ciudad del Plata',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Rodríguez',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Ecilda Paullier',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Kiyú',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Rafael Perazza',
      },
    ],
    founder: {
      '@type': 'Person',
      name: 'Daniel Montaño',
      jobTitle: 'Director & Asesor Inmobiliario',
      image: `${BASE_URL}/daniel-montano.webp`,
      telephone: '+59892776715',
      sameAs: 'https://wa.me/59892776715',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
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
      ],
    },
    knowsAbout: [
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
