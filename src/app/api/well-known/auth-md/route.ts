import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const content = `# Inmobiliaria Montaño — Agent Authentication & Access Policy

## Public Catalog Access (No Authentication Required)
All real estate listings, pricing data, property images, and market guides are **100% public**:
- **API Endpoint:** \`GET /api/properties\`
- **Individual Property Markdown:** \`GET /api/markdown/propiedad/:slug\`
- **LLM Manifest:** \`GET /llms.txt\`
- **MCP Server Card:** \`GET /.well-known/mcp/server-card.json\`

No API keys, OAuth tokens, or client credentials are required for AI agents to query the public property inventory.

## Administrative Access (Restricted)
Administrative endpoints (\`/api/admin/*\`) require Google OAuth2 session cookies or JWT bearer tokens and are restricted to authorized personnel of Inmobiliaria Montaño.
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
