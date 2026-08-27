import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
  const hostname = new URL(baseUrl).hostname;

  const ardCatalog = {
    specVersion: '1.0',
    host: {
      displayName: 'Inmobiliaria Montaño',
      identifier: `did:web:${hostname}`,
    },
    entries: [
      {
        identifier: `urn:air:${hostname}:properties:search`,
        displayName: 'Catálogo y Buscador de Propiedades en San José',
        type: 'application/json',
        url: `${baseUrl}/api/properties`,
        representativeQueries: [
          'buscar casas en venta en san jose de mayo',
          'alquileres en san jose de mayo uruguay',
          'terrenos y chacras en san jose',
          'casas aptas para banco san jose',
          'tasacion de propiedades san jose inmobiliaria montaño',
        ],
      },
      {
        identifier: `urn:air:${hostname}:mcp:server`,
        displayName: 'Servidor MCP (Model Context Protocol)',
        type: 'application/mcp-server-card+json',
        url: `${baseUrl}/.well-known/mcp/server-card.json`,
        representativeQueries: [
          'mcp server inmobiliaria montaño',
          'herramientas mcp consulta de inmuebles uruguay',
          'real estate mcp tools san jose',
        ],
      },
      {
        identifier: `urn:air:${hostname}:llms:manifest`,
        displayName: 'Manifiesto LLMs y Formato Markdown para Agentes de IA',
        type: 'text/markdown',
        url: `${baseUrl}/llms.txt`,
        representativeQueries: [
          'catalogo completo de propiedades formato markdown',
          'llms.txt inmobiliaria montaño uruguay',
          'markdown property listings san jose',
        ],
      },
      {
        identifier: `urn:air:${hostname}:api:catalog`,
        displayName: 'Catálogo de APIs RFC 9727',
        type: 'application/linkset+json',
        url: `${baseUrl}/.well-known/api-catalog`,
        representativeQueries: [
          'api catalog inmobiliaria montaño',
          'rfc 9727 api linkset san jose real estate',
        ],
      },
    ],
  };

  return new NextResponse(JSON.stringify(ardCatalog, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
