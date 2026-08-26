import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PropertyCard } from '@/components/PropertyCard';
import { DepartmentInterlinking } from '@/components/seo/DepartmentInterlinking';
import { getAllProperties } from '@/lib/propertiesStore';
import { SAN_JOSE_LOCATIONS } from '@/data/locations';
import { generateSiteGraphSchema } from '@/utils/seo';
import { Building, MapPin, SlidersHorizontal, Search, Home as HomeIcon, CheckCircle2 } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/propiedades-san-jose`;

export const revalidate = 86400; // 24 horas ISR

export const metadata: Metadata = {
  title: 'Propiedades en San José, Uruguay | Casas, Terrenos y Alquileres — Inmobiliaria Montaño',
  description:
    'Catálogo completo de propiedades en venta y alquiler en el Departamento de San José, Uruguay. Casas, apartamentos, terrenos, chacras y locales en San José de Mayo, Libertad, Ciudad del Plata y más. Títulos verificados y asesoramiento de Daniel Montaño.',
  keywords: [
    'propiedades san jose',
    'propiedades en san jose uruguay',
    'inmuebles san jose',
    'casas y terrenos san jose',
    'alquileres departamento san jose',
    'comprar propiedad san jose',
    'inmobiliaria montaño catalogo',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Propiedades en San José, Uruguay — Inmobiliaria Montaño',
    description:
      'Catálogo completo de inmuebles en venta y alquiler en todo el departamento de San José.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Catálogo de Propiedades en San José — Inmobiliaria Montaño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Propiedades en San José, Uruguay — Inmobiliaria Montaño',
    description: 'Catálogo completo de inmuebles en venta y alquiler en todo el departamento de San José.',
    images: [`${BASE_URL}/og-logo.png`],
  },
};

export default async function PropiedadesSanJosePage() {
  const allProperties = await getAllProperties();
  const validProperties = allProperties.filter(
    (p) => p.status !== 'retirada' && p.status !== 'inactiva'
  );

  const schemaJsonLd = generateSiteGraphSchema();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Schema.org @graph unificado */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <Header />

      {/* Hero Catálogo Departamental */}
      <section className="bg-gradient-to-b from-[#191024] to-[#2E1235] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-400 border border-white/10">
            <Building className="w-3.5 h-3.5 text-[#E85D04]" />
            <span>Inventario Departamental en Vivo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            Propiedades en <span className="text-[#E85D04]">San José, Uruguay</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
            Casas, apartamentos, terrenos, chacras y locales comerciales disponibles en San José de Mayo, Libertad, Ciudad del Plata y zonas aledañas.
          </p>
        </div>
      </section>

      {/* Contenido Principal & Grid de Propiedades */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-8">
        
        {/* Barra Informativa de Resultados */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-xs">
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-black text-slate-900">
            <span className="p-1.5 rounded-lg bg-[#5E1754]/10 text-[#5E1754]">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <span>Mostrando {validProperties.length} publicaciones verificadas en el departamento</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="text-slate-500 py-1">Filtrar por tipo:</span>
            <Link
              href="/casas-en-venta-san-jose-de-mayo"
              className="px-3 py-1 bg-slate-100 hover:bg-purple-100/70 text-slate-700 rounded-lg transition-colors"
            >
              Casas
            </Link>
            <Link
              href="/alquileres-san-jose-de-mayo"
              className="px-3 py-1 bg-slate-100 hover:bg-purple-100/70 text-slate-700 rounded-lg transition-colors"
            >
              Alquileres
            </Link>
            <Link
              href="/terrenos-y-chacras-san-jose"
              className="px-3 py-1 bg-slate-100 hover:bg-purple-100/70 text-slate-700 rounded-lg transition-colors"
            >
              Terrenos y Chacras
            </Link>
          </div>
        </div>

        {/* Grilla de Publicaciones */}
        {validProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {validProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-8">
            <HomeIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-black text-slate-800">No hay publicaciones disponibles en este momento</h3>
            <p className="text-xs text-slate-500">Contactanos por WhatsApp para consultar ingresos recientes fuera de catálogo.</p>
          </div>
        )}

        {/* Interlinking Semántico Contextual */}
        <DepartmentInterlinking currentPath={PAGE_URL} />

      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
