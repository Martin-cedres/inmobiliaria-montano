import { MetadataRoute } from 'next';
import { getCachedProperties } from '@/lib/propertiesStore';

export const revalidate = 86400; // 24 horas

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmobiliariamontano.uy';
  const properties = await getCachedProperties();

  const propertyUrls: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${baseUrl}/propiedad/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
    changeFrequency: 'weekly',
    priority: p.featured ? 0.9 : 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...propertyUrls,
  ];
}
