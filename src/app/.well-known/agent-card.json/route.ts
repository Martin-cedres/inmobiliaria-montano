import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const a2aCard = {
    name: 'Inmobiliaria Montaño AI Agent',
    version: '1.0.0',
    description:
      'Agente inmobiliario inteligente de Inmobiliaria Montaño. Búsqueda de propiedades, precios de referencia y tasaciones en San José de Mayo, Uruguay.',
    supportedInterfaces: [
      {
        url: `${baseUrl}/api/properties`,
        transport: 'http',
        protocol: 'json',
      },
    ],
    capabilities: {
      streaming: false,
      tools: true,
    },
    skills: [
      {
        id: 'search-properties',
        name: 'Buscador de Inmuebles en San José',
        description: 'Consulta el inventario de casas, terrenos, apartamentos y locales en venta o alquiler.',
      },
      {
        id: 'market-statistics',
        name: 'Observatorio de Precios de Mercado',
        description: 'Consulta valores medianos y estadísticas inmobiliarias en San José de Mayo y localidades.',
      },
      {
        id: 'appraisal-guide',
        name: 'Asesoramiento y Tasaciones',
        description: 'Tasaciones profesionales oficiales con Daniel Montaño.',
      },
    ],
  };

  return new NextResponse(JSON.stringify(a2aCard, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    },
  });
}
