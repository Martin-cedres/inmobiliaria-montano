import React from 'react';
import { FaqItem } from '@/components/ui/FaqAccordion';

interface TasacionesJsonLdProps {
  faqs: FaqItem[];
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/tasaciones-san-jose-de-mayo`;

export function TasacionesJsonLd({ faqs }: TasacionesJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
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
            name: 'Tasaciones en San José de Mayo',
            item: PAGE_URL,
          },
        ],
      },
      {
        '@type': 'Service',
        '@id': `${PAGE_URL}#service`,
        name: 'Tasaciones Inmobiliarias Profesionales en San José de Mayo',
        serviceType: 'Tasación Inmobiliaria y Valuación de Bienes Raíces',
        description:
          'Servicio oficial de tasación de casas, apartamentos, terrenos y campos en San José de Mayo con Daniel Montaño. Criterio de mercado real y sin falsas expectativas.',
        provider: {
          '@type': 'RealEstateAgent',
          name: 'Inmobiliaria Montaño',
          telephone: '+59892776715',
          email: 'inmobiliariadaniel247@gmail.com',
          url: BASE_URL,
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Departamento de San José, Uruguay',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Tipos de Tasaciones',
          itemListElement: [
            {
              '@type': 'Offer',
              name: 'Tasación de Casas y Viviendas Urbanas',
            },
            {
              '@type': 'Offer',
              name: 'Tasación de Terrenos y Solares',
            },
            {
              '@type': 'Offer',
              name: 'Tasación de Chacras y Campos',
            },
            {
              '@type': 'Offer',
              name: 'Tasación de Locales Comerciales y Galpones',
            },
          ],
        },
      },
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
