import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PropertyCard } from '@/components/PropertyCard';
import { FaqAccordion, FaqItem } from '@/components/ui/FaqAccordion';
import { CasasEnVentaJsonLd } from '@/components/seo/CasasEnVentaJsonLd';
import { DepartmentInterlinking } from '@/components/seo/DepartmentInterlinking';
import { getCachedProperties } from '@/lib/propertiesStore';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import {
  Home as HomeIcon,
  ChevronRight,
  ShieldCheck,
  Landmark,
  FileCheck,
  MapPin,
  Building,
  Compass,
  Sparkles,
  PhoneCall,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/casas-en-venta-san-jose-de-mayo`;

export const revalidate = 86400; // 24 horas ISR

export const metadata: Metadata = {
  title: 'Casas en Venta en San José y San José de Mayo | Inmobiliaria Montaño',
  description:
    'Catálogo exclusivo de casas en venta en San José y San José de Mayo, Uruguay. Opciones residenciales y céntricas con títulos al día y aptitud para crédito bancario. Asesoramiento con Daniel Montaño al 092 776 715.',
  keywords: [
    'casas en venta san jose',
    'casas en venta en san jose',
    'comprar casa en san jose uruguay',
    'casas en venta san jose uruguay',
    'casas en venta san jose de mayo',
    'casas aptas para banco san jose de mayo',
    'casas centro san jose',
    'casas arroyo mallada',
    'inmobiliaria montaño casas',
    'daniel montaño propiedades',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Casas en Venta en San José y San José de Mayo — Inmobiliaria Montaño',
    description:
      'Encontrá tu casa en San José y San José de Mayo con títulos verificados, opciones aptas para banco y atención directa de Daniel Montaño.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Casas en Venta en San José y San José de Mayo — Inmobiliaria Montaño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casas en Venta en San José y San José de Mayo — Inmobiliaria Montaño',
    description:
      'Encontrá tu casa en San José con títulos verificados y atención directa de Daniel Montaño.',
    images: [`${BASE_URL}/og-logo.png`],
  },
  other: {
    'geo.region': 'UY-SJ',
    'geo.placename': 'San José, San José de Mayo, Uruguay',
    'geo.position': '-34.3375;-56.7136',
    'ICBM': '-34.3375, -56.7136',
  },
};

const FAQS: FaqItem[] = [
  {
    question: '¿Qué requisitos se necesitan para comprar una casa con crédito hipotecario en San José de Mayo?',
    answer:
      'Para adquirir una casa mediante crédito bancario (BHU, Santander, Itaú, BBVA o Scotiabank), la propiedad debe contar con títulos de propiedad perfectos, planos de mensura y construcciones registrados en BPS e Intendencia de San José. En Inmobiliaria Montaño identificamos claramente cuáles inmuebles son "Aptos para Banco" para que tu trámite de préstamo sea ágil y sin contratiempos.',
  },
  {
    question: '¿Cuáles son las zonas y barrios más buscados para comprar casa en San José de Mayo?',
    answer:
      'Las zonas con mayor demanda son el Centro de San José (por cercanía a servicios, colegios y comercios), Barrio Prado y Parque Rodó (entornos residenciales tranquilos con verde), y Arroyo Mallada (zona residencial en pleno crecimiento y valorización).',
  },
  {
    question: '¿Qué gastos adicionales implica la compra de una propiedad en Uruguay?',
    answer:
      'Los gastos habituales para el comprador incluyen el Impuesto a las Trasmisiones Patrimoniales (ITP del 2% sobre el valor real catastral), los honorarios profesionales del escribano actuante (generalmente 3% + IVA), timbres profesionales e inscripciones en el Registro de la Propiedad Inmueble de San José.',
  },
  {
    question: '¿Cómo coordino una visita a las casas en venta?',
    answer:
      'Puedes coordinar una visita presencial de forma inmediata enviando un mensaje por WhatsApp a Daniel Montaño al 092 776 715 o haciendo clic en el botón de WhatsApp en la ficha de cada casa. Nos adaptamos a tus horarios, incluso fines de semana.',
  },
  {
    question: '¿Inmobiliaria Montaño ofrece asesoramiento notarial y de tasación?',
    answer:
      'Sí, brindamos un acompañamiento integral de principio a fin: desde la tasación justa y honesta del valor de mercado hasta el estudio de títulos con escribanía de confianza y la firma definitiva de la compraventa.',
  },
];

export default async function CasasEnVentaPage() {
  const allProperties = await getCachedProperties();
  
  // Filtrar casas y módulos residenciales en venta
  const houses = allProperties.filter(
    (p) => (p.category === 'casa' || p.category === 'modulo') && p.operation !== 'alquiler'
  );

  const contactWhatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* 0. Inyección de Schema JSON-LD para Google (CollectionPage + BreadcrumbList + FAQPage) */}
      <CasasEnVentaJsonLd properties={houses} faqs={FAQS} />

      {/* 1. Navbar */}
      <Header />

      <main className="flex-grow">
        {/* 2. Hero Específico de Casas en Venta */}
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
              <span className="text-amber-300 font-bold">Casas en Venta</span>
            </nav>

            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="inline-flex items-center space-x-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>San José • San José de Mayo • Uruguay</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Casas en Venta en <span className="text-amber-300">San José</span> y San José de Mayo
              </h1>

              <p className="text-slate-200 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
                Encontrá la casa ideal para tu familia. Propiedades residenciales y céntricas con títulos al día, opciones aptas para crédito hipotecario, con fondo, parrillero y la atención directa de <strong>Daniel Montaño</strong>.
              </p>
            </div>

            {/* Badges de Confianza / Pilares de Valor Unificados */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-3xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Títulos al Día</h4>
                  <p className="text-[11px] text-purple-200">Garantía jurídica total</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Aptas para Banco</h4>
                  <p className="text-[11px] text-purple-200">BHU, Santander e Itaú</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Trato Directo</h4>
                  <p className="text-[11px] text-purple-200">Con Daniel Montaño</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Catálogo de Casas Disponibles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                <span>Oportunidades Destacadas de Casas</span>
                <span className="bg-[#5E1754]/10 text-[#5E1754] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {houses.length} disponibles
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Viviendas unifamiliares, chalets y casas residenciales en San José de Mayo.
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

          {houses.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 space-y-3">
              <Building className="w-12 h-12 text-purple-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No hay casas publicadas en este momento
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Estamos ingresando nuevas propiedades en San José. Consultanos por WhatsApp para avisarte antes de que se publiquen.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {houses.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* 4. Claves para Comprar tu Casa (Rediseño armónico sin números de colores) */}
        <section className="bg-white border-y border-slate-200/80 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Asesoramiento Inmobiliario</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Claves para Comprar tu Casa en San José de Mayo
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Puntos esenciales para realizar una inversión segura y con respaldo profesional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Tarjeta 1 */}
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Ubicación y Entorno</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Desde la comodidad del <strong>Centro</strong> con todos los servicios, hasta la tranquilidad residencial de <strong>Arroyo Mallada</strong>, <strong>Barrio Prado</strong> o <strong>Treinta y Tres</strong>.
                </p>
              </div>

              {/* Tarjeta 2 */}
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Certeza Jurídica y Títulos</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Verificamos títulos de propiedad, regularización municipal y libre de gravámenes para garantizar una operación transparente y sin sorpresas.
                </p>
              </div>

              {/* Tarjeta 3 */}
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Financiación y Créditos</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Te orientamos en los requisitos de crédito hipotecario bancario (<strong>BHU, Santander, Itaú, BBVA</strong>) para acceder al mayor financiamiento disponible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Acordeón Interactivo de Preguntas Frecuentes (FAQ Schema) */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <FaqAccordion
            items={FAQS}
            title="Preguntas Frecuentes sobre la Compra de Casas en San José"
            subtitle="Respuestas claras a las consultas más habituales de nuestros clientes."
          />
        </section>

        {/* 6. Bloque de Compromiso Personal & Captación de Propietarios */}
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
                  ¿Tenés una casa para vender en San José?
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Tasá tu propiedad con Daniel Montaño
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 max-w-lg font-normal">
                  Defendemos el valor real de tu inmueble con tasaciones honestas y difusión comercial efectiva.
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
              <span>Solicitar Tasación por WhatsApp</span>
            </a>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <Footer />

      {/* 8. Botón Flotante de WhatsApp */}
      <FloatingWhatsApp />
    </div>
  );
}
