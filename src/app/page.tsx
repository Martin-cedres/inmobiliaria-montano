import React from 'react';
import { Header } from '@/components/Header';
import { HeroSearch } from '@/components/HeroSearch';
import { CatalogSection } from '@/components/CatalogSection';
import { OwnerLeadSection } from '@/components/OwnerLeadSection';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { getCachedProperties } from '@/lib/propertiesStore';

// ISR (Incremental Static Regeneration): Revalida en segundo plano cada 24 horas (86.400s)
// y de forma inmediata ante cambios vía On-Demand Tag Revalidation (revalidateTag('properties'))
export const revalidate = 86400;

export default async function Home() {
  // Carga perimetral ultra-rápida (Edge ISR Cache) - 0ms de espera y costo cero
  const initialProperties = await getCachedProperties();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* 1. Sticky Header Navbar */}
      <Header />

      {/* 2. Hero Section */}
      <HeroSearch />

      {/* 3. Sección de Catálogo Renderizada desde el Servidor */}
      <CatalogSection initialProperties={initialProperties} />

      {/* 4. Owner Lead & Appraisals Section */}
      <OwnerLeadSection />

      {/* 5. Footer */}
      <Footer />

      {/* 6. Floating WhatsApp CTA */}
      <FloatingWhatsApp />
    </div>
  );
}
