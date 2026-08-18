import React from 'react';
import { Property } from '@/types/property';
import { FaqItem } from '@/components/ui/FaqAccordion';

interface CasasEnVentaJsonLdProps {
  properties: Property[];
  faqs: FaqItem[];
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/casas-en-venta-san-jose-de-mayo`;

export function CasasEnVentaJsonLd({ properties, faqs }: CasasEnVentaJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. Breadcrumbs
      {
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
            name: 'Casas en Venta en San José de Mayo',
            item: PAGE_URL,
          },
        ],
      },
      // 2. Collection Page & ItemList
      {
        '@type': 'CollectionPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'Casas en Venta en San José de Mayo — Inmobiliaria Montaño',
        description:
          'Catálogo exclusivo de casas en venta en San José de Mayo, Uruguay. Propiedades con títulos al día, opciones aptas para banco, con fondo y garage.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          name: 'Inmobiliaria Montaño',
          url: BASE_URL,
        },
        about: {
          '@type': 'Place',
          name: 'San José de Mayo, Uruguay',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: -34.3375,
            longitude: -56.7136,
          },
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: properties.length,
          itemListElement: properties.slice(0, 10).map((p, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            url: `${BASE_URL}/propiedad/${p.slug}`,
            name: p.title,
          })),
        },
      },
      // 3. FAQPage Schema para Rich Snippets en Google
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
