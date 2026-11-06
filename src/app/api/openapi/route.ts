import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Inmobiliaria Montaño API',
      version: '1.0.0',
      description: 'API pública y oficial de Inmobiliaria Montaño para consulta y búsqueda de inventario inmobiliario en San José de Mayo y todo el departamento de San José, Uruguay.',
      contact: {
        name: 'Daniel Montaño — Director',
        url: baseUrl,
        email: 'contacto@inmobiliariamontano.uy',
      },
    },
    servers: [
      {
        url: baseUrl,
        description: 'Servidor de producción oficial',
      },
    ],
    paths: {
      '/api/properties': {
        get: {
          operationId: 'listProperties',
          summary: 'Listar propiedades públicas disponibles',
          description: 'Devuelve la lista completa de inmuebles (casas, apartamentos, terrenos, chacras y locales comerciales) en San José.',
          parameters: [
            {
              name: 'category',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['casa', 'apartamento', 'terreno', 'chacra', 'local', 'deposito', 'modulo'],
              },
              description: 'Filtrar por categoría de inmueble',
            },
            {
              name: 'operation',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['venta', 'alquiler', 'busqueda', 'proyecto'],
              },
              description: 'Filtrar por tipo de operación comercial',
            },
          ],
          responses: {
            '200': {
              description: 'Listado de propiedades obtenido exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Property',
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Error interno del servidor',
              content: {
                'application/problem+json': {
                  schema: {
                    $ref: '#/components/schemas/ProblemDetails',
                  },
                },
              },
            },
          },
        },
      },
      '/api/properties/{slug}': {
        get: {
          operationId: 'getPropertyBySlug',
          summary: 'Obtener detalle técnico completo de una propiedad por su slug',
          parameters: [
            {
              name: 'slug',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'Slug canónico de la propiedad',
            },
          ],
          responses: {
            '200': {
              description: 'Ficha técnica de la propiedad encontrada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Property',
                  },
                },
              },
            },
            '404': {
              description: 'Propiedad no encontrada',
              content: {
                'application/problem+json': {
                  schema: {
                    $ref: '#/components/schemas/ProblemDetails',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        ProblemDetails: {
          type: 'object',
          properties: {
            type: { type: 'string', format: 'uri' },
            title: { type: 'string' },
            status: { type: 'integer' },
            detail: { type: 'string' },
            instance: { type: 'string' },
          },
          required: ['type', 'title', 'status'],
        },
        Property: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            codeRef: { type: 'string' },
            title: { type: 'string' },
            slug: { type: 'string' },
            operation: { type: 'string' },
            category: { type: 'string' },
            status: { type: 'string' },
            price: {
              type: 'object',
              properties: {
                amount: { type: 'number' },
                currency: { type: 'string' },
                period: { type: 'string' },
                priceMode: { type: 'string' },
              },
            },
            location: {
              type: 'object',
              properties: {
                department: { type: 'string' },
                city: { type: 'string' },
                neighborhood: { type: 'string' },
                address: { type: 'string' },
              },
            },
          },
        },
      },
    },
  };

  return new NextResponse(JSON.stringify(spec, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
