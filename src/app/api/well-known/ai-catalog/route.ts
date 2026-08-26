import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const ardCatalog = {
    specVersion: '1.0',
    host: {
      name: 'Inmobiliaria Montaño',
      url: baseUrl,
      description:
        'Inmobiliaria en San José de Mayo, Uruguay. Venta y alquiler de casas, apartamentos, chacras y tasaciones con Daniel Montaño.',
    },
    entries: [
      {
        id: 'urn:air:inmobiliariamontano.uy:properties:search',
        displayName: 'Catálogo y Buscador de Propiedades en San José',
        type: 'application/json',
        url: `${baseUrl}/api/properties`,
        representationQueries: [
          'buscar casas en venta en san jose de mayo',
          'alquileres en san jose de mayo uruguay',
          'terrenos y chacras en san jose',
          'casas aptas para banco san jose',
          'tasacion de propiedades san jose inmobiliaria montaño',
        ],
      },
      {
        id: 'urn:air:inmobiliariamontano.uy:llms:manifest',
        displayName: 'Manifiesto LLMs y Formato Markdown para Agentes de IA',
        type: 'text/markdown',
        url: `${baseUrl}/llms.txt`,
        representationQueries: [
          'catalogo completo de propiedades formato markdown',
          'llms.txt inmobiliaria montaño uruguay',
        ],
      },
      {
        id: 'urn:air:inmobiliariamontano.uy:mcp:server',
        displayName: 'Servidor MCP (Model Context Protocol)',
        type: 'application/json',
        url: `${baseUrl}/.well-known/mcp/server-card.json`,
        representationQueries: [
          'mcp server inmobiliaria montaño',
          'herramientas mcp consulta de inmuebles uruguay',
        ],
      },
    ],
  };

  return new NextResponse(JSON.stringify(ardCatalog, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
