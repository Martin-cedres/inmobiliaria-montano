import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const disallowedPrivatePaths = [
    '/admin',
    '/admin/*',
    '/login',
    '/api/admin/*',
    '/api/auth/*',
  ];

  const allowedUserAgents = [
    '*',
    'Googlebot',
    'Googlebot-Image',
    'Bingbot',
    'GPTBot',
    'OAI-SearchBot',
    'ClaudeBot',
    'PerplexityBot',
    'Google-Extended',
    'Applebot-Extended',
    'cohere-ai',
  ];

  return {
    rules: allowedUserAgents.map((userAgent) => ({
      userAgent,
      allow: '/',
      disallow: disallowedPrivatePaths,
    })),
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
