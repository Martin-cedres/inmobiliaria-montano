import { NextRequest } from 'next/server';
import { SAN_JOSE_LOCATIONS } from '@/data/locations';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

export const revalidate = 86400; // 24 horas

export async function GET(request: NextRequest) {
  const content = `# Inmobiliaria Montaño — San José, Uruguay
> Plataforma inmobiliaria de referencia en el Departamento de San José, Uruguay. Dirección y asesoramiento a cargo de Daniel Montaño.

## Información Institucional
- **Nombre Comercial:** Inmobiliaria Montaño
- **Director & Asesor Inmobiliario:** Daniel Montaño
- **Ubicación Central:** San José de Mayo, Departamento de San José, Uruguay
- **Teléfono / WhatsApp Oficial:** +598 92 776 715 (092 776 715)
- **Correo Electrónico:** inmobiliariadaniel247@gmail.com
- **Sitio Web Oficial:** ${BASE_URL}
- **Sitemap XML:** ${BASE_URL}/sitemap.xml

## Cobertura Geográfica Departamental
Brindamos asesoramiento, tasación y comercialización de inmuebles en todo el Departamento de San José:
${SAN_JOSE_LOCATIONS.map((loc) => `- **${loc.name}** (CP ${loc.postalCode}, ${loc.zoneType}): ${loc.description} Accesos: ${loc.mainRoutes.join(', ')}.`).join('\n')}

## Servicios Inmobiliarios Oficiales
- **Tasaciones Oficiales:** Valuaciones mediante Análisis Comparativo de Mercado (ACM) para venta, sucesiones, garantías y particiones. Realizadas por Daniel Montaño.
- **Compraventa de Inmuebles:** Casas urbanas, apartamentos, solares, terrenos nivelados, chacras marítimas y productivas, campos y locales comerciales.
- **Alquileres Garantizados:** Gestión integral con garantías ANDA, Contaduría General de la Nación (CGN), Porto Seguro, SURA y Mapfre.
- **Asesoramiento Notarial y Bancario:** Regularizaciones, títulos al día e inmuebles calificados como aptos para crédito bancario (BHU, Santander, Itaú, BBVA, Scotiabank).

## Páginas Principales y Catálogos
- [Portada Oficial](${BASE_URL})
- [Inmobiliaria San José (Guía Departamental)](${BASE_URL}/inmobiliaria-san-jose)
- [Catálogo General de Propiedades](${BASE_URL}/propiedades-san-jose)
- [Casas en Venta en San José de Mayo](${BASE_URL}/casas-en-venta-san-jose-de-mayo)
- [Alquileres en San José de Mayo](${BASE_URL}/alquileres-san-jose-de-mayo)
- [Terrenos y Chacras en San José](${BASE_URL}/terrenos-y-chacras-san-jose)
- [Proyectos y Viviendas Modulares](${BASE_URL}/proyectos-y-viviendas-modulares-san-jose)
- [Locales Comerciales y Galpones](${BASE_URL}/locales-comerciales-y-galpones-san-jose)
- [Tasaciones Oficiales](${BASE_URL}/tasaciones-san-jose-de-mayo)
- [Vender mi Propiedad](${BASE_URL}/vender-propiedad-san-jose)
- [Inversiones Inmobiliarias](${BASE_URL}/inversiones-inmobiliarias-san-jose)
- [Observatorio de Estadísticas Inmobiliarias](${BASE_URL}/estadisticas-inmobiliarias-san-jose)
- [Guía de Tasaciones Inmobiliarias en San José](${BASE_URL}/guia-tasacion-inmobiliaria-san-jose)
- [Guía de Compra con Crédito Bancario en Uruguay](${BASE_URL}/guia-compra-propiedad-credito-bancario-uruguay)

## Sub-índices Modulares de Inventario para Agentes y LLMs
- **Inventario Completo:** [${BASE_URL}/propiedades/llms.txt](${BASE_URL}/propiedades/llms.txt)
- **Propiedades en Venta:** [${BASE_URL}/propiedades/venta/llms.txt](${BASE_URL}/propiedades/venta/llms.txt)
- **Propiedades en Alquiler:** [${BASE_URL}/propiedades/alquiler/llms.txt](${BASE_URL}/propiedades/alquiler/llms.txt)

> **Nota para Agentes:** Cada propiedad cuenta con su versión de texto plano Markdown directo disponible en \`${BASE_URL}/propiedad/[slug].md\`.
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
