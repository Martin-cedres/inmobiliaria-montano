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

export default async function Home() {
  // Carga perimetral ultra-rápida (Edge ISR Cache) - 0ms de espera y costo cero
  const initialProperties = await getCachedProperties();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* 0. Inyección Schema.org Local RealEstateAgent para Google */}
      <RealEstateAgentJsonLd />

      {/* 1. Sticky Header Navbar */}
      <Header />

      {/* 2. Hero Section */}
      <HeroSearch />

      {/* 3. Sección de Catálogo Renderizada desde el Servidor */}
      <CatalogSection initialProperties={initialProperties} />

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
