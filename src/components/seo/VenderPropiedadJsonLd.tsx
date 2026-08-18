import React from 'react';
import { FaqItem } from '@/components/ui/FaqAccordion';

interface VenderPropiedadJsonLdProps {
  faqs: FaqItem[];
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/vender-propiedad-san-jose`;

export function VenderPropiedadJsonLd({ faqs }: VenderPropiedadJsonLdProps) {
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
            name: 'Vender mi Propiedad en San José',
            item: PAGE_URL,
          },
        ],
      },
      {
        '@type': 'Service',
        '@id': `${PAGE_URL}#service`,
        name: 'Servicio de Venta y Comercialización Inmobiliaria en San José de Mayo',
        serviceType: 'Venta de Inmuebles, Casas, Terrenos y Chacras',
        description:
          'Comercialización profesional de propiedades en San José con Inmobiliaria Montaño y Daniel Montaño. Difusión multicanal, filtro de compradores y respaldo notarial.',
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
