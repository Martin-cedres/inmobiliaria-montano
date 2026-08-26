import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { FaqAccordion, FaqItem } from '@/components/ui/FaqAccordion';
import { DepartmentInterlinking } from '@/components/seo/DepartmentInterlinking';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import {
  Calculator,
  ShieldCheck,
  FileCheck,
  Scale,
  Calendar,
  User,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronRight,
  BookOpen,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/guia-tasacion-inmobiliaria-san-jose`;

export const revalidate = 86400; // 24 horas

export const metadata: Metadata = {
  title: 'Guía de Tasaciones Inmobiliarias en San José | Inmobiliaria Montaño',
  description:
    'Guía completa sobre cómo se tasa una propiedad en San José, Uruguay. Factores que determinan el valor de mercado, documentación necesaria y diferencias con el precio de publicación. Por Daniel Montaño.',
  keywords: [
    'tasacion inmobiliaria san jose',
    'como tasar una casa en uruguay',
    'tasador inmobiliario san jose de mayo',
    'valor de mercado propiedades san jose',
    'precio metro cuadrado san jose uruguay',
    'daniel montaño tasaciones',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Guía de Tasaciones Inmobiliarias en San José — Inmobiliaria Montaño',
    description:
      'Aprende cómo se determina el verdadero valor de mercado de una propiedad en San José, Uruguay.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'article',
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Guía de Tasaciones Inmobiliarias — Inmobiliaria Montaño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guía de Tasaciones Inmobiliarias en San José — Inmobiliaria Montaño',
    description: 'Factores, metodología y documentación para tasar propiedades en San José.',
    images: [`${BASE_URL}/og-logo.png`],
  },
};

const FAQS: FaqItem[] = [
  {
    question: '¿Qué diferencia existe entre el valor de tasación y el precio de publicación en portales?',
    answer:
      'El precio de publicación es la cifra inicial que el propietario aspira a recibir, a menudo influenciada por expectativas personales o márgenes de negociación. La tasación profesional, en cambio, es un dictamen técnico basado en operaciones reales concretadas en la misma zona, estado constructivo y documentación del inmueble.',
  },
  {
    question: '¿Qué documentos debo tener listos para solicitar una tasación?',
    answer:
      'Es fundamental contar con el número de Padrón, copia del plano de mensura o fraccionamiento, último recibo de Contribución Inmobiliaria de la Intendencia de San José, e información sobre regularizaciones ante BPS si hubo reformas recientes.',
  },
  {
    question: '¿Cuánto tiempo demora la realización de una tasación?',
    answer:
      'Tras la inspección presencial del inmueble en San José de Mayo o localidades del departamento, el informe fundamentado de Análisis Comparativo de Mercado (ACM) se entrega habitualmente en un plazo de 24 a 48 horas hábiles.',
  },
  {
    question: '¿El valor de tasación garantiza la venta inmediata de la propiedad?',
    answer:
      'Una tasación correcta ubica el inmueble en su rango real de liquidez en el mercado, maximizando las consultas de compradores calificados y reduciendo el tiempo promedio de comercialización sin resignar patrimonio.',
  },
];

export default function GuiaTasacionPage() {
  const whatsappUrl = buildGeneralWhatsAppLink('tasacion');

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${PAGE_URL}#article`,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        headline: 'Guía Profesional de Tasaciones Inmobiliarias en San José, Uruguay',
        description:
          'Metodología, documentación requerida y factores determinantes para fijar el valor de mercado de casas, terrenos y campos en San José.',
        url: PAGE_URL,
        datePublished: '2026-08-20T00:00:00.000Z',
        dateModified: '2026-08-25T00:00:00.000Z',
        author: {
          '@type': 'Person',
          '@id': `${BASE_URL}/#daniel-montano`,
          name: 'Daniel Montaño',
          jobTitle: 'Director & Asesor Inmobiliario',
        },
        publisher: {
          '@type': 'RealEstateAgent',
          '@id': `${BASE_URL}/#agent`,
          name: 'Inmobiliaria Montaño',
        },
        mainEntityOfPage: PAGE_URL,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Guías de Autoridad',
            item: `${BASE_URL}/inmobiliaria-san-jose`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Guía de Tasaciones en San José',
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <Header />

      {/* Migas de pan visuales */}
      <nav className="bg-white border-b border-slate-200/80 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#5E1754] transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/tasaciones-san-jose-de-mayo" className="hover:text-[#5E1754] transition-colors">
            Tasaciones
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#5E1754] font-bold">Guía de Tasaciones</span>
        </div>
      </nav>

      {/* Cabecera del Artículo */}
      <header className="bg-gradient-to-br from-[#191024] via-[#2A0E35] to-[#120B1A] text-white py-14 sm:py-18">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-400 border border-white/15">
            <BookOpen className="w-3.5 h-3.5 text-[#E85D04]" />
            <span>Guía de Autoridad Inmobiliaria</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Cómo se Determina el Valor Real de una Propiedad en <span className="text-[#E85D04]">San José</span>
          </h1>

          {/* Metadatos del Autor y Fecha */}
          <div className="pt-2 border-t border-white/15 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#E85D04]">
                <Image
                  src="/daniel-montano.webp"
                  alt="Daniel Montaño"
                  width={28}
                  height={28}
                  className="w-full h-full object-cover scale-125 object-[center_18%]"
                />
              </div>
              <span className="font-bold text-white">Por Daniel Montaño</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span>Actualizado al 25 de agosto de 2026</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>San José de Mayo, Uruguay</span>
            </div>
          </div>

        </div>
      </header>

      {/* Cuerpo del Artículo */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow space-y-12">
        
        {/* Introducción */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-4 text-left leading-relaxed text-sm sm:text-base text-slate-700">
          <p className="font-semibold text-slate-900 text-base sm:text-lg">
            Fijar el precio adecuado de un inmueble es la decisión más crítica en cualquier proceso de compraventa. En el mercado inmobiliario de San José, un precio desfasado puede significar meses con la propiedad paralizada o, por el contrario, una pérdida innecesaria de patrimonio.
          </p>
          <p>
            En esta guía detallamos los criterios técnicos, legales y territoriales que utilizamos en <strong>Inmobiliaria Montaño</strong> para realizar tasaciones fundamentadas mediante Análisis Comparativo de Mercado (ACM).
          </p>
        </section>

        {/* 1. Diferencia Conceptual */}
        <section className="space-y-4 text-left">
          <h2 className="text-2xl font-black text-[#5E1754] flex items-center space-x-2">
            <Scale className="w-6 h-6 text-[#E85D04]" />
            <span>1. Precio de Publicación vs. Valor de Mercado vs. Tasación</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Es común confundir estos tres conceptos en portales y clasificados:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-black uppercase text-slate-400">Concepto 1</span>
              <h3 className="text-base font-bold text-slate-900">Precio de Publicación</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                El monto inicial visible en anuncios. Suele incluir expectativas afectivas o márgenes de rebaja pretendidos por el vendedor.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-black uppercase text-slate-400">Concepto 2</span>
              <h3 className="text-base font-bold text-slate-900">Valor Catastral</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                El valor fiscal fijado por la Dirección Nacional de Catastro y la Intendencia de San José para liquidar tributos e ITP. Casi nunca coincide con el valor comercial.
              </p>
            </div>

            <div className="bg-purple-50 p-5 rounded-2xl border border-purple-200 shadow-xs space-y-2">
              <span className="text-xs font-black uppercase text-[#E85D04]">Concepto Clave</span>
              <h3 className="text-base font-bold text-[#5E1754]">Valor de Tasación Real</h3>
              <p className="text-xs text-purple-950 leading-relaxed">
                El precio más probable por el cual compradores calificados y vendedores informados cerrarían una operación en condiciones normales de mercado.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Factores Determinantes */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6 text-left">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#5E1754]">
              2. Factores Locales que Determinan el Valor en San José
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Cada localidad y barrio posee dinámicas propias de valor por metro cuadrado:
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <h4 className="font-bold text-slate-900">A. Micro-Ubicación y Entorno</h4>
              <p>
                En San José de Mayo, propiedades en zonas céntricas o residenciales consolidadas (Barrio Molino, Barrio Arriaga, Parque Rodó) cotizan con primas respecto a zonas con menor acceso a saneamiento o asfalto. En Libertad o balnearios como Kiyú, la cercanía a Ruta 1 o a la costa marca diferencias determinantes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <h4 className="font-bold text-slate-900">B. Calidad Constructiva y Estado de Conservación</h4>
              <p>
                Tipo de cubierta (planchada de hormigón vs. techo liviano), humedad de cimientos, estado de carpinterías, cañerías de termofusión y tablero eléctrico con térmicas reglamentarias.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <h4 className="font-bold text-slate-900">C. Relación Superficie Edificada vs. Superficie de Terreno</h4>
              <p>
                El metro cuadrado cubierto tiene un valor de reposición constructiva muy superior al metro cuadrado de terreno libre. En solares amplios, se tasa el valor del solar base más la mejora edilicia.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <h4 className="font-bold text-slate-900">D. Situación Notarial y Régimen Jurídico</h4>
              <p>
                Las propiedades con títulos perfectos y en régimen común o PH debidamente escriturado tienen mayor liquidez y son aceptadas por bancos para crédito hipotecario, mientras que títulos incompletos requieren regularizaciones que descuentan valor.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Documentación Requerida */}
        <section className="space-y-4 text-left">
          <h2 className="text-2xl font-black text-[#5E1754] flex items-center space-x-2">
            <FileCheck className="w-6 h-6 text-[#E85D04]" />
            <span>3. Documentación Necesaria para Solicitar una Tasación</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Para realizar un informe riguroso, solicitamos al propietario los siguientes datos:
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start space-x-2 bg-white p-3.5 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-[#5E1754] flex-shrink-0 mt-0.5" />
              <span>Número de Padrón y Localidad Catastral</span>
            </li>
            <li className="flex items-start space-x-2 bg-white p-3.5 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-[#5E1754] flex-shrink-0 mt-0.5" />
              <span>Copia del Plano de Mensura o Fraccionamiento</span>
            </li>
            <li className="flex items-start space-x-2 bg-white p-3.5 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-[#5E1754] flex-shrink-0 mt-0.5" />
              <span>Último recibo de Contribución Inmobiliaria</span>
            </li>
            <li className="flex items-start space-x-2 bg-white p-3.5 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-[#5E1754] flex-shrink-0 mt-0.5" />
              <span>Detalle de reformas o ampliaciones registradas</span>
            </li>
          </ul>
        </section>

        {/* CTA Directo a Tasaciones */}
        <section className="bg-gradient-to-br from-[#191024] to-[#2E1235] text-white rounded-3xl p-8 sm:p-10 border border-purple-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Servicio de Tasación Oficial
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Solicitá una Tasación Profesional con Daniel Montaño
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Inspección presencial, análisis comparativo de mercado y defensa honesta del verdadero valor de tu propiedad en San José.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
            <Link
              href="/tasaciones-san-jose-de-mayo"
              className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-2xl border border-white/20 text-center transition-all"
            >
              Ver Metodología
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white text-xs sm:text-sm font-black px-6 py-3.5 rounded-2xl shadow-lg text-center transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Tasación por WhatsApp</span>
            </a>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-6 text-left">
          <h3 className="text-xl sm:text-2xl font-black text-[#5E1754]">
            Preguntas Frecuentes sobre Tasaciones
          </h3>
          <FaqAccordion items={FAQS} />
        </section>

        {/* Interlinking */}
        <DepartmentInterlinking currentPath={PAGE_URL} />

      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
