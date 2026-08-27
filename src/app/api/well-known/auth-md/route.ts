import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const content = `# auth.md — Inmobiliaria Montaño Agent Registration & Access Policy

## Overview
Inmobiliaria Montaño publishes this document according to the [auth.md specification](https://workos.com/auth-md) to describe agent registration, public access, and authentication mechanisms for autonomous AI systems, search engines, and real estate aggregators.

## Public Access (Zero Credentials)
Public real estate listings, pricing data, property images, and market guides are **100% publicly queryable without authentication**:
- **API Endpoint:** \`GET ${baseUrl}/api/properties\`
- **Individual Property Markdown:** \`GET ${baseUrl}/propiedad/:slug.md\`
- **LLM Manifest:** \`GET ${baseUrl}/llms.txt\`
- **MCP Server Card:** \`GET ${baseUrl}/.well-known/mcp/server-card.json\`
- **ARD Capability Catalog:** \`GET ${baseUrl}/.well-known/ai-catalog.json\`
- **API Catalog (RFC 9727):** \`GET ${baseUrl}/.well-known/api-catalog\`

No API keys, OAuth tokens, or client credentials are required for AI agents to query the public property inventory.

## Registration & Authentication Instructions
For automated agents integrating with Inmobiliaria Montaño:

### 1. Discovery Endpoints
- **Protected Resource Metadata (RFC 9728):** \`GET ${baseUrl}/.well-known/oauth-protected-resource\`
- **OAuth 2.0 Authorization Server:** \`GET ${baseUrl}/.well-known/oauth-authorization-server\`
- **OpenID Connect Configuration:** \`GET ${baseUrl}/.well-known/openid-configuration\`

### 2. Registration Flow
- **Registration Endpoint:** \`POST ${baseUrl}/auth.md\`
- **Supported Identity Types:**
  - \`anonymous\`: Zero-credential public catalog consumption.
  - \`identity_assertion\`: Verified agent assertions using \`verified_email\` or \`urn:ietf:params:oauth:token-type:id-jag\`.
- **Token Endpoint:** \`POST ${baseUrl}/api/auth/google\`
- **Token Method:** \`Authorization: Bearer <access_token>\`

### 3. Administrative Access
Administrative endpoints (\`/api/admin/*\`) require authorized Google OAuth2 session cookies or JWT bearer tokens restricted to Inmobiliaria Montaño staff.
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
