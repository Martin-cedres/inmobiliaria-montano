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
          email: 'contacto@inmobiliariamontano.uy',
          url: BASE_URL,
          hasMap: 'https://share.google/6I1gbffV5ZTS5heXV',
          sameAs: [
            'https://share.google/6I1gbffV5ZTS5heXV',
            'https://wa.me/59892776715',
          ],
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Departamento de San José, Uruguay',
        },
      },
      {
        '@type': 'HowTo',
        name: 'Cómo Vender tu Propiedad en San José de Mayo con Inmobiliaria Montaño',
        description:
          'Proceso profesional de 4 pasos para vender una casa, terreno o chacra en San José al valor real de mercado y con garantía notarial.',
        totalTime: 'P30D',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Tasación Profesional y Análisis Comparativo de Mercado',
            text: 'Relevamiento in situ del inmueble y cálculo de valor real por m² en base a operaciones cerradas en tu barrio de San José.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Relevamiento y Ficha Técnica',
            text: 'Relevamiento detallado del inmueble y redacción técnica de virtudes urbanísticas y constructivas para su difusión multicanal.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Difusión Multicanal y Filtro de Compradores',
            text: 'Publicación en web oficial, portales líderes y cruce con compradores calificados en lista de espera.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Respaldo Notarial y Cierre ante Escribano',
            text: 'Supervisión de boleto de reserva, seña, títulos de propiedad y liquidación impositiva ante escribanía.',
          },
        ],
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
