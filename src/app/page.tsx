import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { HeroSearch } from '@/components/HeroSearch';
import { CatalogSection } from '@/components/CatalogSection';
import { OwnerCaptureBanner } from '@/components/OwnerCaptureBanner';
import { OwnerLeadSection } from '@/components/OwnerLeadSection';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { RealEstateAgentJsonLd } from '@/components/seo/RealEstateAgentJsonLd';
import { AiOverviewMagnetSection } from '@/components/seo/AiOverviewMagnetSection';
import { getCachedProperties } from '@/lib/propertiesStore';

export const metadata: Metadata = {
  title: 'Inmobiliaria Montaño | Casas en Venta, Alquileres y Tasaciones en San José de Mayo',
  description:
    'Inmobiliaria Montaño en San José de Mayo (25 de Mayo 338). Especialidad: Venta y alquiler de casas, apartamentos, terrenos, chacras y locales. Tasaciones y aptas banco.',
  alternates: {
    canonical: '/',
  },
};

// ISR (Incremental Static Regeneration): Revalida en segundo plano cada 24 horas (86.400s)
// y de forma inmediata ante cambios vía On-Demand Tag Revalidation (revalidateTag('properties'))
export const revalidate = 86400;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

export default async function Home() {
  // Carga perimetral ultra-rápida (Edge ISR Cache) - 0ms de espera y costo cero
  const initialProperties = await getCachedProperties();

  // Poda selectiva de props para el catálogo de la Home: elimina descripciones largas
  // y limita imágenes a las necesarias para la tarjeta, reduciendo el HTML payload en >300 KB
  const catalogProperties = initialProperties.map((p) => ({
    ...p,
    description: '',
    images: p.images?.slice(0, 2) || [],
  }));

  // Schema ItemList oficial que consagra a la Home como Catálogo Maestro ante Googlebot
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo Oficial de Inmuebles en San José de Mayo — Inmobiliaria Montaño',
    description: 'Catálogo de casas en venta, alquileres garantizados, terrenos y locales comerciales en San José.',
    url: `${BASE_URL}/`,
    numberOfItems: initialProperties.length,
    itemListElement: initialProperties.slice(0, 30).map((prop, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: prop.title,
      url: `${BASE_URL}/propiedad/${prop.slug}`,
      image: (prop.images?.[0] as any)?.webpUrl || (prop.images?.[0] as any)?.blobUrl || `${BASE_URL}/logo-header.webp`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* 0. Inyección Schema.org Local RealEstateAgent & Catálogo Maestro ItemList */}
      <RealEstateAgentJsonLd />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* 1. Sticky Header Navbar */}
      <Header />

      {/* 2. Hero Section */}
      <HeroSearch />

      {/* 3. Sección de Catálogo Renderizada desde el Servidor */}
      <CatalogSection initialProperties={catalogProperties} />

      {/* 4. Bloque Institucional y Especialidad para Usuarios y Google AI Overviews */}
      <AiOverviewMagnetSection properties={initialProperties} />

      {/* 5. Banner de Alto Impacto para Propietarios (Flyer Oficial Montaño) */}
      <OwnerCaptureBanner variant="home" />

      {/* 6. Owner Lead & Appraisals Section */}
      <OwnerLeadSection />

      {/* 7. Footer */}
      <Footer />

      {/* 8. Floating WhatsApp CTA */}
      <FloatingWhatsApp />
    </div>
  );
}
