import { MetadataRoute } from 'next';
import { MOCK_PROPERTIES } from '@/data/mockProperties';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/#tasaciones`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamic property routes
  const propertyRoutes: MetadataRoute.Sitemap = MOCK_PROPERTIES.map((prop) => ({
    url: `${BASE_URL}/propiedad/${prop.slug}`,
    lastModified: new Date(prop.updatedAt || prop.createdAt),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
