import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const robotsTxt = `User-Agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*

User-Agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*

User-Agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*

User-Agent: GPTBot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*

User-Agent: ClaudeBot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*

User-Agent: PerplexityBot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*

User-Agent: Applebot-Extended
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*

# Content Signals for AI Agents (contentsignals.org / IETF RFC draft)
Content-Signal: ai-train=no, search=yes, ai-input=yes

# Discovery
Sitemap: ${baseUrl}/sitemap.xml
Catalog: ${baseUrl}/google-catalog.xml
Agentmap: ${baseUrl}/.well-known/ai-catalog.json
Host: ${baseUrl}
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      Link: `</llms.txt>; rel="alternate"; type="text/markdown", </.well-known/ai-catalog.json>; rel="service-desc"`,
    },
  });
}
