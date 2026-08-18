import { MetadataRoute } from 'next';
import { getCachedProperties } from '@/lib/propertiesStore';

export const revalidate = 86400; // 24 horas

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
  const properties = await getCachedProperties();

  const propertyUrls: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${baseUrl}/propiedad/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
    changeFrequency: 'weekly',
    priority: p.featured ? 0.9 : 0.8,
  }));

  const pillarUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/casas-en-venta-san-jose-de-mayo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/alquileres-san-jose-de-mayo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/terrenos-y-chacras-san-jose`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/tasaciones-san-jose-de-mayo`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/proyectos-y-viviendas-modulares-san-jose`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/vender-propiedad-san-jose`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/inversiones-inmobiliarias-san-jose`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/locales-comerciales-y-galpones-san-jose`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...pillarUrls,
    ...propertyUrls,
  ];
}
