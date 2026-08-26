import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const payload = {
    resource: `${baseUrl}/api`,
    authorization_servers: [`${baseUrl}`],
    scopes_supported: ['public:read', 'admin:manage'],
    bearer_methods_supported: ['header', 'cookie'],
    public_endpoints: [
      `${baseUrl}/api/properties`,
      `${baseUrl}/llms.txt`,
      `${baseUrl}/.well-known/ai-catalog.json`,
      `${baseUrl}/.well-known/mcp/server-card.json`,
      `${baseUrl}/.well-known/api-catalog`,
    ],
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
