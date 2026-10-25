import React from 'react';
import { FaqItem } from '@/components/ui/FaqAccordion';

interface AlquilarPropiedadJsonLdProps {
  faqs: FaqItem[];
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/alquilar-mi-propiedad-san-jose`;

export function AlquilarPropiedadJsonLd({ faqs }: AlquilarPropiedadJsonLdProps) {
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
            name: 'Alquilar y Administrar Propiedad en San José',
            item: PAGE_URL,
          },
        ],
      },
      {
        '@type': 'Service',
        '@id': `${PAGE_URL}#service`,
        name: 'Servicio de Alquiler y Administración de Inmuebles en San José de Mayo',
        serviceType: 'Alquiler y Administración de Propiedades, Casas, Apartamentos y Locales',
        description:
          'Gestión integral de alquileres en San José de Mayo con Inmobiliaria Montaño y Daniel Montaño. Selección de inquilinos con garantías seguras (ANDA, CGN, Aseguradoras, Depósito BHU), inventario detallado, contratos notariales y cobranza mensual puntual.',
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
        name: 'Cómo Alquilar y Administrar tu Propiedad en San José con Inmobiliaria Montaño',
        description:
          'Proceso profesional de 4 pasos para alquilar tu casa, apartamento o local con máxima seguridad de cobro y sin complicaciones.',
        totalTime: 'P15D',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Relevamiento e Inspección del Inmueble',
            text: 'Relevamiento in situ, fijación del precio justo de renta según la zona y elaboración de un inventario fotográfico inicial minucioso.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Difusión y Selección Rigurosa de Inquilinos',
            text: 'Promoción destacada en canales oficiales y filtrado exhaustivo de garantías (ANDA, CGN, Porto Seguro, SURA, Mapfre o Depósito BHU).',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Contrato Notarial con Respaldo Jurídico',
            text: 'Redacción de contrato de arrendamiento formal ante escribano público con cláusulas claras de conservación y garantías.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Administración Mensual y Control de Servicios',
            text: 'Cobranza mensual garantizada, liquidación en tu cuenta bancaria y control permanente de tributos domiciliarios, OSE y UTE al día.',
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
