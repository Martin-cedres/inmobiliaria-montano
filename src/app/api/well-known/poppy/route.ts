import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
  const domain = 'inmobiliariamontano.uy';

  const poppyPayload = {
    protocol_version: '0.1',
    organization: {
      name: 'Inmobiliaria Montaño',
      domain: domain,
    },
    auth: {
      issuer: baseUrl,
      direct: {
        scopes: ['poppy:read', 'real_estate:read', 'properties:search'],
      },
      device: {
        scopes: ['poppy:read', 'real_estate:read'],
      },
      custom_scopes: {
        'real_estate:read': 'Consultar inventario público de propiedades, casas en venta, alquileres y tasaciones en San José de Mayo',
        'properties:search': 'Búsqueda semántica y filtrado de inmuebles por categoría, precio y ubicación',
      },
    },
    agent: {
      protocols: [
        {
          type: 'poppy',
          endpoint: `${baseUrl}/api/well-known/agent-skills`,
        },
      ],
    },
    web: {
      browser_session_endpoint: `${baseUrl}/api/auth/session`,
    },
    apis: [
      {
        type: 'openapi',
        url: `${baseUrl}/openapi.json`,
        description: 'Catálogo público y motor de búsqueda de inmuebles en San José de Mayo y departamento de San José',
      },
      {
        type: 'mcp',
        url: `${baseUrl}/.well-known/mcp/server-card.json`,
        description: 'Herramientas de consulta y filtrado de propiedades para agentes de IA (Model Context Protocol)',
      },
    ],
    extensions: {
      a2a: {
        agent_card: `${baseUrl}/.well-known/agent-card.json`,
      },
    },
  };

  return new NextResponse(JSON.stringify(poppyPayload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
