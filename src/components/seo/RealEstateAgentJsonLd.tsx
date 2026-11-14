import React from 'react';
import { buildOrganizationReviewsAndDemandsSchema } from '@/data/reviewsAndDemands';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

export function RealEstateAgentJsonLd() {
  const { aggregateRating, review, seeks } = buildOrganizationReviewsAndDemandsSchema();

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
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+59892776715',
      contactType: 'customer service',
      email: 'contacto@inmobiliariamontano.uy',
      areaServed: 'UY',
      availableLanguage: ['es', 'Spanish'],
    },
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
      'https://www.instagram.com/propiedadesmontana1',
      'https://www.google.com/maps/place/?q=place_id:ChIJgU0vgPl3oZURSNT4x7Lw3fE',
    ],
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: 'Departamento de San José',
      },
      {
        '@type': 'City',
        name: 'San José de Mayo',
        postalCode: '80000',
      },
      {
        '@type': 'City',
        name: 'Libertad',
        postalCode: '80100',
      },
      {
        '@type': 'City',
        name: 'Ciudad del Plata',
        postalCode: '80500',
      },
      {
        '@type': 'City',
        name: 'Ecilda Paullier',
        postalCode: '80200',
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
        name: 'Chamizo',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Raigón',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Boca del Cufré',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Catálogo Oficial de Propiedades e Inmuebles en San José',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Casas en Venta en San José de Mayo',
          url: `${BASE_URL}/casas-en-venta-san-jose-de-mayo`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Alquileres en San José de Mayo',
          url: `${BASE_URL}/alquileres-san-jose-de-mayo`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Casas Aptas para Crédito Bancario (BHU/BROU)',
          url: `${BASE_URL}/casas-aptas-para-banco-san-jose`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Terrenos y Chacras en San José',
          url: `${BASE_URL}/terrenos-y-chacras-san-jose`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Locales Comerciales y Galpones',
          url: `${BASE_URL}/locales-comerciales-y-galpones-san-jose`,
        },
      ],
    },
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
    knowsAbout: [
      'Tasaciones Inmobiliarias Rápidas en 24-48 horas en San José de Mayo',
      'Convenio Institucional de Alquiler con Círculo Policial de San José',
      'Alquileres con Garantías ANDA, Porto Seguro, SURA, CGN, Mapfre, Santander y FIDECIU',
      'Créditos Hipotecarios y Préstamos Bancarios BHU',
      'Venta de Casas y Terrenos con Títulos Verificados en San José',
      'Asesoramiento Notarial Flexible con Escribana de Confianza o Escribano del Cliente',
      'Captación Activa de Propiedades para Venta y Alquiler en San José',
      'Venta de inmuebles en San José',
      'Alquileres residenciales y comerciales',
      'Tasaciones oficiales y peritajes',
      'Lotes y fraccionamientos de terrenos',
      'Chacras marítimas y productivas',
    ],
    aggregateRating,
    review,
    seeks,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
