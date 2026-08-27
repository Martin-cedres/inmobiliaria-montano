import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const payload = {
    resource: baseUrl,
    authorization_servers: [baseUrl],
    scopes_supported: ['public:read', 'properties:read', 'admin:manage'],
    bearer_methods_supported: ['header'],
    resource_documentation: `${baseUrl}/auth.md`,
    resource_signing_alg_values_supported: ['RS256', 'HS256'],
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
