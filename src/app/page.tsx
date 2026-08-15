import React from 'react';
import { Header } from '@/components/Header';
import { HeroSearch } from '@/components/HeroSearch';
import { CatalogSection } from '@/components/CatalogSection';
import { OwnerLeadSection } from '@/components/OwnerLeadSection';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { getAllProperties } from '@/lib/propertiesStore';

// ISR (Incremental Static Regeneration): Revalida automáticamente en el servidor cada 60 segundos
export const revalidate = 60;

export default async function Home() {
  // Carga directa en el Servidor (SSR/ISR) - 0ms de espera en cliente
  const initialProperties = await getAllProperties();

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
