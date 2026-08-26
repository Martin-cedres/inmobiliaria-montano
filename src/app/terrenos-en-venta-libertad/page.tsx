import type { Metadata } from 'next';
import { getAllProperties } from '@/lib/propertiesStore';
import { getLevelBLandingBySlug, evaluateLevelBLanding } from '@/data/levelBLandings';
import { LevelBLandingTemplate } from '@/components/seo/LevelBLandingTemplate';
import { notFound } from 'next/navigation';

export const revalidate = 86400; // 24 horas

const LANDING_SLUG = 'terrenos-en-venta-libertad';

export async function generateMetadata(): Promise<Metadata> {
  const landing = getLevelBLandingBySlug(LANDING_SLUG);
  if (!landing) return {};

  const allProperties = await getAllProperties();
  const evaluation = evaluateLevelBLanding(landing, allProperties);

  return {
    title: landing.seoTitle,
    description: landing.seoDescription,
    keywords: landing.searchIntentKeywords,
    robots: {
      index: evaluation.isIndexable,
      follow: true,
    },
    alternates: {
      canonical: evaluation.canonicalUrl,
    },
    openGraph: {
      title: landing.seoTitle,
      description: landing.seoDescription,
      url: evaluation.canonicalUrl,
      siteName: 'Inmobiliaria Montaño',
      locale: 'es_UY',
      type: 'website',
    },
  };
}

export default async function TerrenosEnVentaLibertadPage() {
  const landing = getLevelBLandingBySlug(LANDING_SLUG);
  if (!landing) notFound();

  const allProperties = await getAllProperties();
  const evaluation = evaluateLevelBLanding(landing, allProperties);
  const fallbackProperties = allProperties.filter(
    (p) => p.status !== 'retirada' && p.status !== 'inactiva' && (p.category === 'terreno' || p.category === 'chacra')
  );

  return (
    <LevelBLandingTemplate
      evaluation={evaluation}
      fallbackProperties={fallbackProperties}
    />
  );
}
