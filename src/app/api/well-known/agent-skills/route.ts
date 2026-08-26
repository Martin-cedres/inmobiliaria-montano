import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const skillsPayload = {
    $schema: 'https://agentskills.io/schema/v0.2.0/skills.json',
    skills: [
      {
        name: 'real-estate-catalog-search',
        type: 'http',
        description: 'Consulta de inventario inmobiliario público en San José de Mayo y localidades.',
        url: `${baseUrl}/api/properties`,
      },
      {
        name: 'market-price-guide',
        type: 'http',
        description: 'Valores de mercado y referencias de precios en San José.',
        url: `${baseUrl}/estadisticas-inmobiliarias-san-jose`,
      },
      {
        name: 'bank-loan-guide',
        type: 'http',
        description: 'Guía y requisitos para compra con crédito hipotecario.',
        url: `${baseUrl}/guia-compra-propiedad-credito-bancario-uruguay`,
      },
      {
        name: 'property-appraisals',
        type: 'http',
        description: 'Servicio y guía de tasaciones oficiales con Daniel Montaño.',
        url: `${baseUrl}/tasaciones-san-jose-de-mayo`,
      },
    ],
  };

  return new NextResponse(JSON.stringify(skillsPayload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
