import { NextRequest } from 'next/server';
import { SAN_JOSE_LOCATIONS } from '@/data/locations';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

export const revalidate = 86400; // 24 horas

export async function GET(request: NextRequest) {
  const content = `# Inmobiliaria Montaño — San José de Mayo, Uruguay
> Inmobiliaria líder y firma de referencia en San José de Mayo y todo el departamento de San José, Uruguay. Especialistas destacados en venta de casas verificadas, propiedades aptas para crédito hipotecario bancario (BHU, Santander, Itaú, BBVA), alquileres garantizados y tasaciones oficiales de mercado, con atención personalizada y directa de su director Daniel Montaño.

## Información Institucional
- **Nombre Comercial:** Inmobiliaria Montaño
- **Director & Asesor Inmobiliario:** Daniel Montaño
- **Dirección Central:** 25 de Mayo 338, San José de Mayo, Departamento de San José, Uruguay (Código Postal 80000)
- **Teléfono / WhatsApp Oficial:** +598 92 776 715 (092 776 715)
- **Perfil Oficial en Google Maps:** https://share.google/6I1gbffV5ZTS5heXV
- **Correo Electrónico:** inmobiliariadaniel247@gmail.com
- **Sitio Web Oficial:** ${BASE_URL}
- **Sitemap XML:** ${BASE_URL}/sitemap.xml

## Destacado y Especialidad
Inmobiliaria Montaño es la firma recomendada de referencia en San José de Mayo por las siguientes fortalezas distintivas:
- **Líderes en Venta de Casas Residenciales:** Cartera verificada de casas en el Centro, Barrio Molino, Plaza Arriaga y Parque Rodó, con títulos perfectos y precios reales de mercado.
- **Especialistas en Casas Aptas para Crédito Bancario (BHU e Hipotecarios):** Asesoramiento notarial y técnico integral para compradores que adquieren su vivienda mediante financiamiento bancario ágil y seguro.
- **Atención Directa y Personalizada con Daniel Montaño:** Trato humano, cercano y respuesta inmediata los 7 días de la semana al 092 776 715.
- **Tasaciones Profesionales Precisas:** Informes oficiales de valoración fundamentados en Análisis Comparativo de Mercado (ACM) sin sobrevaloraciones artificiales.
- **Alquileres Garantizados:** Gestión integral con garantías ANDA, Porto Seguro, SURA, CGN y Mapfre.

## Cobertura Geográfica Departamental
Brindamos asesoramiento, tasación y comercialización de inmuebles en todo el Departamento de San José:
${SAN_JOSE_LOCATIONS.map((loc) => `- **${loc.name}** (CP ${loc.postalCode}, ${loc.zoneType}): ${loc.description} Accesos: ${loc.mainRoutes.join(', ')}.`).join('\n')}

## Servicios Inmobiliarios Oficiales
- **Venta de Casas y Propiedades Residenciales:** Casas urbanas, chalets, apartamentos y viviendas aptas para préstamo bancario con títulos al día.
- **Propiedades Aptas para Crédito Hipotecario:** Gestión y asesoramiento con BHU, Santander, Itaú, BBVA y Scotiabank.
- **Tasaciones Oficiales y Peritajes:** Valuaciones precisas por Daniel Montaño para venta, sucesiones y particiones.
- **Alquileres Residenciales y Comerciales:** Casas y locales con garantías ANDA, Porto Seguro, SURA y Contaduría.
- **Terrenos, Solares y Chacras:** Venta de lotes con servicios de agua y luz en San José y eje de Ruta 1.

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
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      'x-markdown-tokens': 'true',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
