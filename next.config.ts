import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/propiedad/:slug.md',
        destination: '/api/markdown/propiedad/:slug',
      },
      {
        source: '/.well-known/api-catalog',
        destination: '/api/well-known/api-catalog',
      },
      {
        source: '/.well-known/ai-catalog.json',
        destination: '/api/well-known/ai-catalog',
      },
      {
        source: '/.well-known/mcp/server-card.json',
        destination: '/api/well-known/mcp-server-card',
      },
      {
        source: '/.well-known/agent-skills/index.json',
        destination: '/api/well-known/agent-skills',
      },
      {
        source: '/.well-known/openid-configuration',
        destination: '/api/well-known/openid-configuration',
      },
      {
        source: '/.well-known/oauth-authorization-server',
        destination: '/api/well-known/openid-configuration',
      },
      {
        source: '/.well-known/oauth-protected-resource',
        destination: '/api/well-known/oauth-protected-resource',
      },
      {
        source: '/auth.md',
        destination: '/api/well-known/auth-md',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Link',
            value:
              '</llms.txt>; rel="alternate"; type="text/markdown", </.well-known/ai-catalog.json>; rel="service-desc", </.well-known/api-catalog>; rel="api-catalog", </.well-known/mcp/server-card.json>; rel="service-desc"',
          },
          {
            key: 'Vary',
            value: 'Accept',
          },
        ],
      },
      {
        source: '/.well-known/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
