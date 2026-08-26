import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const mcpServerCard = {
    $schema: 'https://modelcontextprotocol.io/schema/server-card.json',
    serverInfo: {
      name: 'inmobiliaria-montano-mcp',
      version: '1.0.0',
      description:
        'Servidor MCP oficial de Inmobiliaria Montaño. Permite a agentes de IA consultar inmuebles públicos, valores de mercado y opciones aptas para crédito bancario en San José, Uruguay.',
    },
    transport: {
      type: 'http',
      endpoint: `${baseUrl}/api/properties`,
    },
    authentication: {
      type: 'oauth2',
      authorizationServer: `${baseUrl}/.well-known/oauth-authorization-server`,
      protectedResource: `${baseUrl}/.well-known/oauth-protected-resource`,
      scopes: ['public:read', 'properties:read'],
    },
    auth: {
      discovery_uri: `${baseUrl}/.well-known/oauth-authorization-server`,
      protected_resource: `${baseUrl}/.well-known/oauth-protected-resource`,
    },
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
    },
    tools: [
      {
        name: 'buscar_propiedades',
        description:
          'Busca propiedades activas en San José filtrando por tipo de operación (venta/alquiler), categoría (casa, apartamento, terreno) y localidad.',
        inputSchema: {
          type: 'object',
          properties: {
            operacion: { type: 'string', enum: ['venta', 'alquiler'] },
            categoria: { type: 'string', enum: ['casa', 'apartamento', 'terreno', 'local'] },
            localidad: { type: 'string', description: 'Ej: San José de Mayo, Libertad, etc.' },
            apta_banco: { type: 'boolean' },
          },
        },
      },
      {
        name: 'obtener_propiedad',
        description: 'Obtiene los detalles, precio en USD/UYU y características de una propiedad por su slug.',
        inputSchema: {
          type: 'object',
          properties: {
            slug: { type: 'string' },
          },
          required: ['slug'],
        },
      },
      {
        name: 'obtener_precios_referencia',
        description: 'Devuelve valores de mercado y medianas de precios en San José de Mayo y localidades.',
        inputSchema: {
          type: 'object',
          properties: {
            localidad: { type: 'string' },
          },
        },
      },
    ],
  };

  return new NextResponse(JSON.stringify(mcpServerCard, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
