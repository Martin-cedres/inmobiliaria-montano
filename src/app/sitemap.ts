import { MetadataRoute } from 'next';
import { getAllProperties } from '@/lib/propertiesStore';
import { Property } from '@/types/property';

export const revalidate = 86400; // 24 horas

// Fecha base editorial estable para páginas institucionales (no inventa new Date())
const STABLE_EDITORIAL_DATE = new Date('2026-08-20T00:00:00.000Z');

/**
 * Obtiene la fecha de modificación más reciente real a partir de un listado de inmuebles.
 * Si el conjunto está vacío, retorna la fecha editorial base sin generar timestamps falsos.
 */
function getLatestModifiedDate(items: Property[], fallbackDate: Date = STABLE_EDITORIAL_DATE): Date {
  if (!items || items.length === 0) return fallbackDate;

  const timestamps = items
    .map((p) => {
      const raw = p.updatedAt || p.createdAt;
      return raw ? new Date(raw).getTime() : 0;
    })
    .filter((ts) => ts > 0 && !isNaN(ts));

  if (timestamps.length === 0) return fallbackDate;
  return new Date(Math.max(...timestamps));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
  const allProperties = await getAllProperties();

  // Filtro defensivo: Solo incluir propiedades activas, reservadas, vendidas o alquiladas.
  // Excluye estrictamente cualquier inmueble con estado 'retirada' o 'inactiva'.
  const validProperties = allProperties.filter(
    (p) => p.status !== 'retirada' && p.status !== 'inactiva'
  );

  // Fechas reales calculadas según el inventario que alimenta cada sección
  const homeLatestDate = getLatestModifiedDate(validProperties);
  const casasLatestDate = getLatestModifiedDate(
    validProperties.filter((p) => (p.category === 'casa' || p.category === 'apartamento') && p.operation === 'venta')
  );
  const alquileresLatestDate = getLatestModifiedDate(
    validProperties.filter((p) => p.operation === 'alquiler')
  );
  const terrenosLatestDate = getLatestModifiedDate(
    validProperties.filter((p) => p.category === 'terreno' || p.category === 'chacra')
  );
  const proyectosLatestDate = getLatestModifiedDate(
    validProperties.filter((p) => p.category === 'modulo' || p.category === 'proyecto')
  );
  const localesLatestDate = getLatestModifiedDate(
    validProperties.filter((p) => p.category === 'local' || p.category === 'deposito')
  );

  // 1. Portada y Páginas Pilares / Departamentales Institucionales
  const staticAndPillarPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: homeLatestDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/casas-en-venta-san-jose-de-mayo`,
      lastModified: casasLatestDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/alquileres-san-jose-de-mayo`,
      lastModified: alquileresLatestDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/terrenos-y-chacras-san-jose`,
      lastModified: terrenosLatestDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/proyectos-y-viviendas-modulares-san-jose`,
      lastModified: proyectosLatestDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/locales-comerciales-y-galpones-san-jose`,
      lastModified: localesLatestDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/inmobiliaria-san-jose`,
      lastModified: STABLE_EDITORIAL_DATE,
      changeFrequency: 'weekly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/propiedades-san-jose`,
      lastModified: homeLatestDate,
      changeFrequency: 'daily',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/tasaciones-san-jose-de-mayo`,
      lastModified: STABLE_EDITORIAL_DATE,
      changeFrequency: 'weekly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/vender-propiedad-san-jose`,
      lastModified: STABLE_EDITORIAL_DATE,
      changeFrequency: 'weekly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/inversiones-inmobiliarias-san-jose`,
      lastModified: STABLE_EDITORIAL_DATE,
      changeFrequency: 'weekly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/estadisticas-inmobiliarias-san-jose`,
      lastModified: homeLatestDate,
      changeFrequency: 'daily',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/guia-tasacion-inmobiliaria-san-jose`,
      lastModified: STABLE_EDITORIAL_DATE,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/guia-compra-propiedad-credito-bancario-uruguay`,
      lastModified: STABLE_EDITORIAL_DATE,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
  ];

  // 2. Landings Nivel B Condicionadas (Solo se incluyen si cumplen N >= 2 inmuebles reales)
  const { getAllLevelBLandings, evaluateLevelBLanding } = await import('@/data/levelBLandings');
  const levelBLandings = getAllLevelBLandings();
  const validLevelBPages: MetadataRoute.Sitemap = [];

  for (const landing of levelBLandings) {
    const evaluation = evaluateLevelBLanding(landing, allProperties);
    if (evaluation.isIndexable) {
      const landingDate = getLatestModifiedDate(evaluation.matchedProperties);
      validLevelBPages.push({
        url: `${baseUrl}${landing.path}`,
        lastModified: landingDate,
        changeFrequency: 'daily',
        priority: 0.85,
      });
    }
  }

  // 3. Fichas de Propiedades (derivadas de la base de datos real)
  const propertyPages: MetadataRoute.Sitemap = validProperties.map((p) => {
    const rawDate = p.updatedAt || p.createdAt;
    const itemDate = rawDate ? new Date(rawDate) : STABLE_EDITORIAL_DATE;

    const isHistorical = p.status === 'vendido' || p.status === 'alquilado';
    const isReserved = p.status === 'reservado';

    return {
      url: `${baseUrl}/propiedad/${p.slug}`,
      lastModified: !isNaN(itemDate.getTime()) ? itemDate : STABLE_EDITORIAL_DATE,
      changeFrequency: isHistorical ? 'monthly' : isReserved ? 'weekly' : 'daily',
      priority: p.featured ? 0.9 : 0.8,
    };
  });

  // 4. Garantizar 0 URLs duplicadas mediante un Map por URL canónica
  const sitemapMap = new Map<string, MetadataRoute.Sitemap[0]>();

  for (const entry of [...staticAndPillarPages, ...validLevelBPages, ...propertyPages]) {
    if (!sitemapMap.has(entry.url)) {
      sitemapMap.set(entry.url, entry);
    }
  }

  return Array.from(sitemapMap.values());
}

