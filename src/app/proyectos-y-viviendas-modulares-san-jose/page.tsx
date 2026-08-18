import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PropertyCard } from '@/components/PropertyCard';
import { FaqAccordion, FaqItem } from '@/components/ui/FaqAccordion';
import { ProyectosModularesJsonLd } from '@/components/seo/ProyectosModularesJsonLd';
import { getCachedProperties } from '@/lib/propertiesStore';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import {
  Home as HomeIcon,
  ChevronRight,
  Sparkles,
  Layers,
  Building,
  MapPin,
  Flame,
  PhoneCall,
  Clock,
  Hammer,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/proyectos-y-viviendas-modulares-san-jose`;

export const revalidate = 86400; // 24 horas ISR

export const metadata: Metadata = {
  title: 'Proyectos y Viviendas Modulares en San José | Inmobiliaria Montaño',
  description:
    'Venta de módulos habitacionales, casas modulares y proyectos inmobiliarios en San José de Mayo y todo el departamento. Construcción rápida, eficiente y llave en mano con Daniel Montaño.',
  keywords: [
    'viviendas modulares san jose',
    'casas modulares uruguay',
    'modulos habitacionales san jose de mayo',
    'proyectos inmobiliarios san jose',
    'casas prefabricadas san jose',
    'construccion modular uruguay',
    'inmobiliaria montaño proyectos',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Proyectos y Viviendas Modulares en San José — Inmobiliaria Montaño',
    description:
      'Módulos habitacionales y proyectos residenciales eficientes en San José. Construcción llave en mano y entrega rápida.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Proyectos y Viviendas Modulares — Inmobiliaria Montaño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proyectos y Viviendas Modulares en San José — Inmobiliaria Montaño',
    description:
      'Módulos habitacionales y proyectos residenciales con Daniel Montaño.',
    images: [`${BASE_URL}/og-logo.png`],
  },
  other: {
    'geo.region': 'UY-SJ',
    'geo.placename': 'San José de Mayo, San José, Uruguay',
    'geo.position': '-34.3375;-56.7136',
    'ICBM': '-34.3375, -56.7136',
  },
};

const FAQS: FaqItem[] = [
  {
    question: '¿Qué incluye una vivienda modular o módulo habitacional llave en mano?',
    answer:
      'Nuestras opciones de módulos habitacionales se entregan totalmente terminadas: estructura portante reforzada, aislamiento térmico y acústico en muros y techos, aberturas de aluminio, instalación sanitaria y eléctrica completa, baño equipado y mesada de cocina.',
  },
  {
    question: '¿En qué tipo de terreno o superficie se puede instalar un módulo habitacional?',
    answer:
      'Se pueden instalar sobre solares urbanos, fondos residenciales como ampliación o segunda vivienda, y en chacras o fracciones de campo. Requieren únicamente una base nivelada (pilotes de hormigón o platea sencilla).',
  },
  {
    question: '¿Cuánto demora la fabricación y montaje de una casa modular?',
    answer:
      'El tiempo estimado de entrega suele oscilar entre 30 y 60 días según las dimensiones y terminaciones elegidas, reduciendo drásticamente los meses de espera e incertidumbre de la construcción tradicional.',
  },
  {
    question: '¿Se pueden personalizar las dimensiones o distribución del módulo?',
    answer:
      'Sí, existen distintas configuraciones: monoambientes compactos, viviendas de 1 y 2 dormitorios, u opciones adosables para ampliar la superficie en el futuro.',
  },
  {
    question: '¿Inmobiliaria Montaño comercializa también el terreno para instalar el módulo?',
    answer:
      'Sí, te brindamos una solución integral: te ayudamos a elegir el solar o chacra ideal en San José con los servicios de OSE y UTE necesarios, y coordinamos la adquisición e instalación del módulo habitacional.',
  },
];

export default async function ProyectosModularesPage() {
  const allProperties = await getCachedProperties();
  
  // Filtrar módulos y proyectos
  const modularProperties = allProperties.filter(
    (p) => p.category === 'modulo' || p.category === 'proyecto' || p.operation === 'proyecto'
  );

  const contactWhatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* 0. Schema JSON-LD */}
      <ProyectosModularesJsonLd properties={modularProperties} faqs={FAQS} />

      {/* 1. Navbar */}
      <Header />

      <main className="flex-grow">
        {/* 2. Hero Centrado y Simétrico */}
        <section className="bg-gradient-to-br from-[#2D0B28] via-[#43123C] to-[#5E1754] text-white pt-24 pb-12 sm:pt-28 sm:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#E85D04]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
            {/* Breadcrumb Visual */}
            <nav aria-label="Breadcrumb" className="flex items-center justify-center space-x-2 text-xs text-purple-200/80">
              <Link href="/" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                <HomeIcon className="w-3.5 h-3.5" />
                <span>Inicio</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-purple-300/50" />
              <span className="text-amber-300 font-bold">Proyectos & Módulos</span>
            </nav>

            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="inline-flex items-center space-x-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>San José de Mayo • Proyectos & Innovación</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Viviendas Modulares & <span className="text-amber-300">Proyectos</span>
              </h1>

              <p className="text-slate-200 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
                Módulos habitacionales, casas modulares eficientes y proyectos residenciales en San José. Soluciones llave en mano de rápida instalación, confort térmico y la atención directa de <strong>Daniel Montaño</strong>.
              </p>
            </div>

            {/* Badges de Confianza Unificados */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-3xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Llave en Mano</h4>
                  <p className="text-[11px] text-purple-200">Listos para habitar</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Construcción Eficiente</h4>
                  <p className="text-[11px] text-purple-200">Aislación y bajo consumo</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Trato Directo</h4>
                  <p className="text-[11px] text-purple-200">Con Daniel Montaño</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Catálogo de Proyectos & Módulos Disponibles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                <span>Modelos y Proyectos Disponibles</span>
                <span className="bg-[#5E1754]/10 text-[#5E1754] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {modularProperties.length} disponibles
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Módulos habitacionales, desarrollos y viviendas llave en mano en San José.
              </p>
            </div>

            <Link
              href="/#catalogo"
              className="text-xs font-bold text-[#5E1754] hover:text-[#E85D04] transition-colors inline-flex items-center gap-1"
            >
              <span>Ver catálogo completo de propiedades</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {modularProperties.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 space-y-3">
              <Building className="w-12 h-12 text-purple-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                Próximos lanzamientos en preparación
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Estamos preparando nuevos modelos habitacionales en San José. Consultanos por WhatsApp para recibir la ficha técnica y precios de lanzamiento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modularProperties.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* 4. Ventajas de la Construcción Modular */}
        <section className="bg-white border-y border-slate-200/80 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ventajas Constructivas</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ¿Por Qué Elegir una Vivienda Modular en San José?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                La alternativa moderna, económica y rápida a la obra húmeda tradicional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Rapidez de Entrega</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Montaje en semanas, eliminando los meses de incertidumbre, costos imprevistos y demoras climáticas de la albañilería convencional.
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Aislación Termoacústica</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Paredes y techos con materiales aislantes de alta densidad que garantizan ambientes frescos en verano y cálidos en invierno con mínimo consumo de energía.
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Hammer className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Versatilidad y Emplazamiento</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Ideal como vivienda principal, casa de fin de semana en chacras, consultorio, oficina o ampliación en el fondo de una propiedad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Preguntas Frecuentes */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <FaqAccordion
            items={FAQS}
            title="Preguntas Frecuentes sobre Viviendas Modulares"
            subtitle="Respuestas claras sobre fabricación, instalación y planos de módulos habitacionales."
          />
        </section>

        {/* 6. Bloque de Compromiso Personal & Asesoramiento */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14">
          <div className="bg-gradient-to-br from-[#350A2F] to-[#5E1754] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-400/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-[#E85D04] ring-4 ring-[#E85D04]/30 flex-shrink-0">
                <Image
                  src="/daniel-montano.webp"
                  alt="Daniel Montaño"
                  fill
                  className="object-cover scale-125 object-[center_18%]"
                  unoptimized
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                  ¿Buscás terreno o asesoramiento para tu módulo?
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Consultá con Daniel Montaño
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 max-w-lg font-normal">
                  Te asesoramos en la elección del lote, viabilidad de servicios y compra del modelo ideal.
                </p>
              </div>
            </div>

            <a
              href={contactWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-lg transition-all flex-shrink-0 w-full md:w-auto"
            >
              <PhoneCall className="w-4 h-4 text-amber-200" />
              <span>Consultar Proyectos por WhatsApp</span>
            </a>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <Footer />

      {/* 8. Floating WhatsApp */}
      <FloatingWhatsApp />
    </div>
  );
}
