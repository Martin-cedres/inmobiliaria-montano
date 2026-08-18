import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { FaqAccordion, FaqItem } from '@/components/ui/FaqAccordion';
import { TasacionesJsonLd } from '@/components/seo/TasacionesJsonLd';
import { AppraisalPageForm } from '@/components/appraisal/AppraisalPageForm';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import {
  Home as HomeIcon,
  ChevronRight,
  ShieldCheck,
  Calculator,
  FileCheck,
  MapPin,
  Sparkles,
  Search,
  TrendingUp,
  Award,
  PhoneCall,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/tasaciones-san-jose-de-mayo`;

export const metadata: Metadata = {
  title: 'Tasaciones Inmobiliarias en San José de Mayo | Daniel Montaño',
  description:
    'Tasación profesional, objetiva y real de casas, apartamentos, solares y chacras en San José de Mayo. Conocé el verdadero valor de mercado de tu propiedad con Daniel Montaño.',
  keywords: [
    'tasaciones inmobiliarias san jose de mayo',
    'tasar casa en san jose uruguay',
    'cuanto vale mi propiedad en san jose',
    'tasador inmobiliario san jose',
    'tasacion de terrenos y campos san jose',
    'inmobiliaria montaño tasaciones',
    'daniel montaño tasador',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Tasaciones Inmobiliarias en San José de Mayo — Inmobiliaria Montaño',
    description:
      'Conocé el verdadero valor de mercado de tu inmueble en San José. Tasaciones objetivas y honestas con Daniel Montaño.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Tasaciones Inmobiliarias en San José de Mayo — Inmobiliaria Montaño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tasaciones Inmobiliarias en San José de Mayo — Inmobiliaria Montaño',
    description:
      'Conocé el verdadero valor de mercado de tu inmueble en San José de Mayo.',
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
    question: '¿Por qué es fundamental realizar una tasación profesional antes de publicar una propiedad?',
    answer:
      'Fijar un precio fuera de mercado genera dos riesgos graves: si es demasiado alto, la propiedad se "quema" comercialmente y pasa meses sin consultas; si es demasiado bajo, pierdes dinero. Una tasación objetiva asegura vender al máximo valor real posible en un plazo óptimo.',
  },
  {
    question: '¿Qué costo tiene solicitar una tasación con Inmobiliaria Montaño?',
    answer:
      'Para propietarios que desean poner a la venta o en alquiler su inmueble con nosotros, la tasación y el asesoramiento inicial comercial son 100% sin costo.',
  },
  {
    question: '¿Qué documentación es conveniente tener a mano para la tasación?',
    answer:
      'Es de gran utilidad contar con el número de padrón, plano de mensura o construcción si existiera, y el último recibo de Contribución Inmobiliaria para corroborar metrajes de terreno y área edificada.',
  },
  {
    question: '¿Cuánto tiempo demora el proceso de tasación?',
    answer:
      'Una vez realizada la visita presencial al inmueble, elaboramos el informe de valoración en un plazo de 24 a 48 horas hábiles.',
  },
  {
    question: '¿Qué factores determinan el precio final de una propiedad en San José?',
    answer:
      'Analizamos la ubicación y barrio, calidad constructiva, estado de mantenimiento, orientación solar, metraje del terreno, mejoras (garage, parrillero, piscina), regularización en BPS/Intendencia y los valores reales de cierre de propiedades similares en la zona.',
  },
];

export default function TasacionesPage() {
  const contactWhatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* 0. Schema JSON-LD */}
      <TasacionesJsonLd faqs={FAQS} />

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
              <span className="text-amber-300 font-bold">Tasaciones</span>
            </nav>

            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="inline-flex items-center space-x-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>San José de Mayo • Asesoramiento Oficial</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Tasaciones Inmobiliarias en <span className="text-amber-300">San José</span>
              </h1>

              <p className="text-slate-200 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
                Conocé el verdadero valor de mercado de tu casa, apartamento, terreno o fracción de campo. Peritaje profesional, transparente y sin falsas expectativas con <strong>Daniel Montaño</strong>.
              </p>
            </div>

            {/* Badges de Confianza Unificados */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-3xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Valor de Mercado Real</h4>
                  <p className="text-[11px] text-purple-200">Análisis comparativo certero</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Sin Falsas Expectativas</h4>
                  <p className="text-[11px] text-purple-200">Honestidad y transparencia</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Asesoría Notarial</h4>
                  <p className="text-[11px] text-purple-200">Revisión jurídica previa</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Formulario de Solicitud de Tasación */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <AppraisalPageForm />
        </section>

        {/* 4. Etapas del Proceso de Tasación Profesional */}
        <section className="bg-white border-y border-slate-200/80 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Metodología de Trabajo</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ¿Cómo Realizamos la Tasación de tu Inmueble?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Un proceso riguroso y transparente para que tomes la mejor decisión patrimonial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">1. Inspección Presencial</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Visitamos tu propiedad para evaluar el metraje real, estado edilicio, calidad de terminaciones, funcionalidad de ambientes y entorno barrial.
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">2. Análisis Comparativo (ACM)</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Cotejamos con las operaciones concretadas recientemente en la misma zona de San José y la oferta activa de la competencia.
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">3. Estrategia de Venta</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Te entregamos el rango de valor óptimo de venta o alquiler junto con un plan de marketing para comercializar tu propiedad rápidamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Preguntas Frecuentes */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <FaqAccordion
            items={FAQS}
            title="Preguntas Frecuentes sobre Tasaciones en San José"
            subtitle="Respuestas claras a las dudas habituales de propietarios."
          />
        </section>

        {/* 6. Bloque de Compromiso Personal con Daniel Montaño */}
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
                  Atención Directa y Personalizada
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Daniel Montaño • Asesor Inmobiliario
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 max-w-lg font-normal">
                  Tu consulta es confidencial. Escribime directamente para coordinar una reunión o visita a tu propiedad.
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
              <span>Contactar a Daniel por WhatsApp</span>
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
