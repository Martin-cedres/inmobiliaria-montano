import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PropertyCard } from '@/components/PropertyCard';
import { FaqAccordion, FaqItem } from '@/components/ui/FaqAccordion';
import { AlquileresJsonLd } from '@/components/seo/AlquileresJsonLd';
import { getCachedProperties } from '@/lib/propertiesStore';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import {
  Home as HomeIcon,
  ChevronRight,
  ShieldCheck,
  Key,
  FileCheck,
  MapPin,
  Building,
  Sparkles,
  PhoneCall,
  UserCheck,
  FileText,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/alquileres-san-jose-de-mayo`;

export const revalidate = 86400; // 24 horas ISR

export const metadata: Metadata = {
  title: 'Alquileres en San José de Mayo | Casas y Apartamentos | Inmobiliaria Montaño',
  description:
    'Alquiler de casas, apartamentos y locales comerciales en San José de Mayo, Uruguay. Garantías ANDA, Porto Seguro, Sura, CGN y Mapfre. Contratos seguros y atención directa con Daniel Montaño.',
  keywords: [
    'alquileres san jose de mayo',
    'alquiler de casas san jose uruguay',
    'apartamentos en alquiler san jose',
    'alquileres anda san jose',
    'alquileres porto seguro san jose',
    'inmobiliaria montaño alquileres',
    'administracion de propiedades san jose',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Alquileres en San José de Mayo — Inmobiliaria Montaño',
    description:
      'Casas, apartamentos y locales en alquiler en San José de Mayo. Opciones con garantías ANDA, Porto Seguro y CGN.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Alquileres en San José de Mayo — Inmobiliaria Montaño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alquileres en San José de Mayo — Inmobiliaria Montaño',
    description:
      'Casas, apartamentos y locales en alquiler en San José de Mayo con garantías seguras.',
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
    question: '¿Qué garantías de alquiler se aceptan en Inmobiliaria Montaño?',
    answer:
      'Trabajamos con las principales aseguradoras y aseguradoras públicas de plaza: ANDA, Contaduría General de la Nación (CGN), Porto Seguro, Sura y Mapfre. También gestionamos garantías de depósito o fianza según el acuerdo con el propietario.',
  },
  {
    question: '¿Cuál es el plazo habitual de los contratos de arrendamiento?',
    answer:
      'Para vivienda urbana en Uruguay, el plazo habitual bajo la normativa vigente es de 2 años (con opción a prórroga) o de 1 año con acuerdo entre las partes. Para locales comerciales, los plazos suelen acordarse de 2 a 5 años según la actividad.',
  },
  {
    question: '¿Qué gastos e impuestos corresponden al inquilino y cuáles al propietario?',
    answer:
      'Corresponde al inquilino el pago mensual del alquiler, los consumos de servicios (UTE, OSE, Internet), tributos domiciliarios de la Intendencia y gastos comunes si aplican. Corresponde al propietario el pago de la Contribución Inmobiliaria, Impuesto de Primaria y reparaciones estructurales del inmueble.',
  },
  {
    question: '¿Cómo coordino una visita para ver una propiedad en alquiler?',
    answer:
      'Puedes escribirnos directamente por WhatsApp al 092 776 715 o presionar el botón de consulta en la ficha del inmueble. Coordinamos horarios flexibles para que puedas conocer la propiedad en persona.',
  },
  {
    question: '¿Qué servicios ofrece Inmobiliaria Montaño para propietarios que desean alquilar?',
    answer:
      'Nos encargamos de la tasación justa de renta, selección rigurosa y chequeo de garantías del inquilino, redacción del contrato notarial, inventario fotográfico inicial y administración mensual de cobranzas sin complicaciones.',
  },
];

export default async function AlquileresPage() {
  const allProperties = await getCachedProperties();
  
  // Filtrar alquileres y apartamentos
  const rentals = allProperties.filter(
    (p) => p.operation === 'alquiler' || p.category === 'apartamento'
  );

  const contactWhatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* 0. Schema JSON-LD */}
      <AlquileresJsonLd properties={rentals} faqs={FAQS} />

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
              <span className="text-amber-300 font-bold">Alquileres</span>
            </nav>

            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="inline-flex items-center space-x-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>San José de Mayo • Uruguay</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Alquileres en <span className="text-amber-300">San José de Mayo</span>
              </h1>

              <p className="text-slate-200 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
                Casas, apartamentos y locales comerciales con las mejores garantías de plaza (ANDA, Porto Seguro, Sura, CGN). Contratos claros, inventarios precisos y atención directa de <strong>Daniel Montaño</strong>.
              </p>
            </div>

            {/* Badges de Confianza Unificados */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-3xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Garantías Ágiles</h4>
                  <p className="text-[11px] text-purple-200">ANDA, Porto, Sura y CGN</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Contratos Seguros</h4>
                  <p className="text-[11px] text-purple-200">Inventario y respaldo legal</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Trato Directo</h4>
                  <p className="text-[11px] text-purple-200">Con Daniel Montaño</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Catálogo de Alquileres Disponibles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                <span>Propiedades en Alquiler Disponibles</span>
                <span className="bg-[#5E1754]/10 text-[#5E1754] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {rentals.length} disponibles
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Casas, apartamentos y locales con disponibilidad inmediata en San José.
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

          {rentals.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 space-y-3">
              <Building className="w-12 h-12 text-purple-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No hay alquileres activos en este momento
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Los alquileres en San José se reservan rápidamente. Escribinos a WhatsApp y te avisamos ni bien ingrese una nueva opción.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentals.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* 4. Claves para Alquilar en San José */}
        <section className="bg-white border-y border-slate-200/80 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gestión de Arrendamientos</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Puntos Clave para Alquilar en San José de Mayo
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Todo lo que necesitás saber tanto si buscás alquilar como si querés poner en renta tu inmueble.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Elección de Garantía</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Te orientamos en los trámites de <strong>ANDA, Porto Seguro, Sura o CGN</strong> para que la aprobación sea rápida y segura para ambas partes.
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Inventario y Contratos Claros</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Realizamos un relevamiento fotográfico y descriptivo detallado del estado del inmueble al inicio del contrato, evitando dudas al finalizar el arrendamiento.
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Administración para Propietarios</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Cuidamos tu patrimonio con cobranza puntual, control de servicios e impuestos al día y atención continua ante cualquier eventualidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Preguntas Frecuentes */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <FaqAccordion
            items={FAQS}
            title="Preguntas Frecuentes sobre Alquileres en San José"
            subtitle="Respuestas a las dudas más comunes de inquilinos y propietarios."
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
                  ¿Tenés una propiedad para alquilar en San José?
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Administrá tu alquiler con Daniel Montaño
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 max-w-lg font-normal">
                  Garantizamos una renta segura con inquilinos calificados y administración transparente mes a mes.
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
              <span>Consultar Alquileres por WhatsApp</span>
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
