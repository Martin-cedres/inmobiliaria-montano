import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const linksetPayload = {
    linkset: [
      {
        anchor: `${baseUrl}/api/properties`,
        'service-desc': [
          {
            href: `${baseUrl}/.well-known/ai-catalog.json`,
            type: 'application/json',
          },
        ],
        'service-doc': [
          {
            href: `${baseUrl}/llms.txt`,
            type: 'text/markdown',
          },
        ],
        status: [
          {
            href: `${baseUrl}/api/properties`,
            type: 'application/json',
          },
        ],
      },
    ],
  };

  return new NextResponse(JSON.stringify(linksetPayload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/linkset+json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
