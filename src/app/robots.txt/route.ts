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
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: Google-Extended
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: GPTBot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: ClaudeBot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: PerplexityBot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: Applebot-Extended
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: Applebot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: OAI-SearchBot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: ChatGPT-User
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: meta-externalagent
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: anthropic-ai
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: cohere-ai
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

User-Agent: Amazonbot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/admin/*
Disallow: /api/auth/*
Disallow: /*?*view=*
Disallow: /*?*category=*
Disallow: /*?*focus=*

# Content Signals for AI Agents (contentsignals.org / IETF RFC draft)
Content-Signal: ai-train=no, search=yes, ai-input=yes

# Discovery
Sitemap: ${baseUrl}/sitemap.xml
Catalog: ${baseUrl}/google-catalog.xml
Agentmap: ${baseUrl}/.well-known/ai-catalog.json
LLMs: ${baseUrl}/llms.txt
LLMs-Full: ${baseUrl}/llms-full.txt
Host: ${baseUrl}
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      Link: `</llms.txt>; rel="alternate"; type="text/markdown", </llms-full.txt>; rel="alternate"; type="text/markdown", </.well-known/ai-catalog.json>; rel="service-desc"`,
    },
  });
}
