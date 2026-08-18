import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PropertyCard } from '@/components/PropertyCard';
import { FaqAccordion, FaqItem } from '@/components/ui/FaqAccordion';
import { TerrenosChacrasJsonLd } from '@/components/seo/TerrenosChacrasJsonLd';
import { getCachedProperties } from '@/lib/propertiesStore';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import {
  Home as HomeIcon,
  ChevronRight,
  ShieldCheck,
  Zap,
  MapPin,
  Trees,
  Compass,
  Sparkles,
  PhoneCall,
  Activity,
  Layers,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/terrenos-y-chacras-san-jose`;

export const revalidate = 86400; // 24 horas ISR

export const metadata: Metadata = {
  title: 'Terrenos y Chacras en Venta en San José | Solares y Campos | Inmobiliaria Montaño',
  description:
    'Venta de terrenos, solares urbanos, fraccionamientos y chacras productivas en San José de Mayo y alrededores. Servicios de OSE y UTE, índice CONEAT y asesoramiento con Daniel Montaño.',
  keywords: [
    'terrenos en venta san jose de mayo',
    'chacras en venta san jose uruguay',
    'solares en san jose',
    'terrenos con luz y agua san jose',
    'campos en san jose uruguay',
    'inmobiliaria montaño terrenos',
    'fraccionamientos san jose',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Terrenos y Chacras en Venta en San José — Inmobiliaria Montaño',
    description:
      'Solares urbanos para construir y chacras de campo en el departamento de San José. Títulos verificados y servicios al día.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Terrenos y Chacras en San José — Inmobiliaria Montaño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terrenos y Chacras en Venta en San José — Inmobiliaria Montaño',
    description:
      'Solares urbanos y chacras de campo en el departamento de San José con Daniel Montaño.',
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
    question: '¿Qué aspectos legales y topográficos debo verificar antes de comprar un terreno en San José?',
    answer:
      'Es imprescindible corroborar que el padrón sea individual e independiente, que no tenga deudas de Contribución Inmobiliaria, que cuente con plano de mensura inscripto y que cumpla con los retiros de construcción y ordenanzas de la Intendencia de San José.',
  },
  {
    question: '¿Qué significa el Índice CONEAT en una chacra o fracción rural?',
    answer:
      'El Índice CONEAT mide la capacidad productiva del suelo en Uruguay en una escala promedio de 100. Índices superiores a 100 indican tierras fértiles agrícolas o forrajeras de alta productividad, mientras que índices menores son ideales para descanso, recreación, cabañas o vivienda campestre.',
  },
  {
    question: '¿Los terrenos cuentan con conexión de agua corriente de OSE y energía eléctrica de UTE?',
    answer:
      'En nuestras fichas detallamos expresamente los servicios existentes: agua potable de OSE o pozo de agua/tajamar, tendido eléctrico de UTE en la puerta, alumbrado público, calle asfaltada o con balasto, y cobertura de fibra óptica.',
  },
  {
    question: '¿Se aceptan permutas o financiación para la compra de solares y campos?',
    answer:
      'Muchos propietarios aceptan entrega inicial y financiación en cuotas a convenir, o permutas por vehículos u otros inmuebles. Consultanos por la propiedad de tu interés para gestionar la mejor propuesta comercial.',
  },
  {
    question: '¿Cómo coordino para visitar un terreno o chacra en persona?',
    answer:
      'Escribinos por WhatsApp a Daniel Montaño al 092 776 715 para coordinar una recorrida presencial, delimitar los linderos del solar y evaluar el acceso y servicios en el lugar.',
  },
];

export default async function TerrenosChacrasPage() {
  const allProperties = await getCachedProperties();
  
  // Filtrar terrenos y chacras
  const lands = allProperties.filter(
    (p) => p.category === 'terreno' || p.category === 'chacra'
  );

  const contactWhatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* 0. Schema JSON-LD */}
      <TerrenosChacrasJsonLd properties={lands} faqs={FAQS} />

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
              <span className="text-amber-300 font-bold">Terrenos & Chacras</span>
            </nav>

            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="inline-flex items-center space-x-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Departamento de San José • Uruguay</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Terrenos y Chacras en <span className="text-amber-300">San José</span>
              </h1>

              <p className="text-slate-200 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
                Solares urbanos para construir tu casa, fraccionamientos en crecimiento y chacras de campo en San José de Mayo y alrededores. Títulos verificados, servicios al día y asesoramiento con <strong>Daniel Montaño</strong>.
              </p>
            </div>

            {/* Badges de Confianza Unificados */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-3xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Servicios en Puerta</h4>
                  <p className="text-[11px] text-purple-200">Luz UTE y Agua OSE</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Padrones Únicos</h4>
                  <p className="text-[11px] text-purple-200">Aptos para escriturar</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Trato Directo</h4>
                  <p className="text-[11px] text-purple-200">Con Daniel Montaño</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Catálogo de Terrenos & Chacras Disponibles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                <span>Solares, Fraccionamientos & Chacras</span>
                <span className="bg-[#5E1754]/10 text-[#5E1754] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {lands.length} disponibles
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Lotes urbanos, suburbanos y fracciones rurales en San José.
              </p>
            </div>

            <Link
              href="/#catalogo"
              className="text-xs font-bold text-[#5E1754] hover:text-[#E85D04] transition-colors inline-flex items-center gap-1"
            >
              <span>Ver catálogo completo con mapa</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {lands.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 space-y-3">
              <Trees className="w-12 h-12 text-purple-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No hay terrenos o chacras publicadas en este momento
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tenemos ingresos constantes de solares y fracciones. Consultanos por WhatsApp con tus preferencias de metraje y zona.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lands.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* 4. Claves para Comprar Terrenos o Chacras */}
        <section className="bg-white border-y border-slate-200/80 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Asesoramiento de Tierras</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Puntos Esenciales al Elegir un Terreno o Chacra
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Criterios técnicos y legales para asegurar una inversión de alto valor en San José.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Ubicación y Accesos</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Cercanía a <strong>Ruta 3, Ruta 11 o caminos principales</strong> con buen drenaje, calles transitables todo el año y fácil conectividad a San José de Mayo o Montevideo.
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Factibilidad de Servicios</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Confirmamos la existencia de <strong>red de agua corriente (OSE)</strong>, tendido de <strong>energía eléctrica (UTE)</strong> o alternativas sustentables (tajamar, pozo semisurgente).
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Productividad e Índice CONEAT</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Para chacras y fracciones de campo, analizamos el <strong>Índice CONEAT</strong> de suelo para evaluar aptitud ganadera, agrícola o para proyectos recreativos familiares.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Preguntas Frecuentes */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <FaqAccordion
            items={FAQS}
            title="Preguntas Frecuentes sobre Terrenos y Chacras en San José"
            subtitle="Respuestas claras a las consultas más habituales sobre compra de solares y campos."
          />
        </section>

        {/* 6. Bloque de Compromiso Personal & Captación */}
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
                  ¿Tenés un terreno o chacra para vender en San José?
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Tasá tu solar o fracción con Daniel Montaño
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 max-w-lg font-normal">
                  Realizamos un peritaje honesto del valor por metro cuadrado o hectárea según la zona y sus mejoras.
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
              <span>Solicitar Tasación de Terreno</span>
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
