import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const content = `# auth.md — Inmobiliaria Montaño Agent Registration & Access Policy

## Overview
Inmobiliaria Montaño publishes this document according to the [auth.md specification](https://workos.com/auth-md) to describe agent registration, public access, and authentication mechanisms for autonomous AI systems, search engines, and real estate aggregators.

## Agent Audience & Public Access (No Credentials Required)
All public real estate listings, search parameters, pricing data, market statistics, and photos are **100% publicly queryable without authentication**:
- **JSON API:** \`GET ${baseUrl}/api/properties\`
- **Markdown Listing:** \`GET ${baseUrl}/propiedad/:slug.md\`
- **LLM Manifest:** \`GET ${baseUrl}/llms.txt\`
- **MCP Server Card:** \`GET ${baseUrl}/.well-known/mcp/server-card.json\`
- **ARD Capability Catalog:** \`GET ${baseUrl}/.well-known/ai-catalog.json\`
- **API Catalog (RFC 9727):** \`GET ${baseUrl}/.well-known/api-catalog\`

Autonomous agents can query, index, and cite these resources freely without registering or presenting API keys.

## Agent Registration & Authentication Flows
For agents and integrators requiring authenticated actions (e.g., submitting property leads, valuation requests, or partner integrations):

1. **OAuth 2.0 Discovery:**
   - **Protected Resource Metadata (RFC 9728):** \`GET ${baseUrl}/.well-known/oauth-protected-resource\`
   - **Authorization Server Metadata:** \`GET ${baseUrl}/.well-known/oauth-authorization-server\`
   - **OpenID Connect Configuration:** \`GET ${baseUrl}/.well-known/openid-configuration\`

2. **Supported Registration Methods:**
   - **Anonymous Agents:** \`identity_types_supported: ["anonymous"]\` — zero-credential public discovery.
   - **Identity Assertion (ID-JAG & Verified Email):** \`identity_types_supported: ["identity_assertion"]\` with JWT bearer tokens for verified partner agents.

3. **Administrative Access (Restricted):**
   Management endpoints (\`/api/admin/*\`) require authorized Google OAuth2 / JWT bearer credentials restricted to Inmobiliaria Montaño staff.
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
