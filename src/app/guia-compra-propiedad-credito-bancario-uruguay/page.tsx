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
  Landmark,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Calendar,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronRight,
  BookOpen,
  DollarSign,
  Percent,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/guia-compra-propiedad-credito-bancario-uruguay`;

export const revalidate = 86400; // 24 horas

export const metadata: Metadata = {
  title: 'Guía de Compra de Propiedades con Crédito Bancario en Uruguay | Inmobiliaria Montaño',
  description:
    'Guía completa sobre cómo comprar un inmueble con préstamo hipotecario en Uruguay (BHU, Santander, Itaú, BBVA). Qué significa que una propiedad sea apta para banco, requisitos y costos. Por Daniel Montaño.',
  keywords: [
    'comprar casa credito bancario uruguay',
    'casas aptas para banco san jose',
    'prestamo hipotecario bhu uruguay',
    'requisitos comprar casa banco santander itau',
    'gastos comprar propiedad uruguay',
    'inmobiliaria montaño credito hipotecario',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Guía de Compra con Crédito Bancario en Uruguay — Inmobiliaria Montaño',
    description:
      'Proceso, requisitos y costos para comprar una propiedad con financiamiento bancario en Uruguay.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'article',
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Guía de Compra con Crédito Bancario — Inmobiliaria Montaño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guía de Compra con Crédito Bancario en Uruguay — Inmobiliaria Montaño',
    description: 'Proceso, requisitos y costos para comprar inmuebles con banco en San José y Uruguay.',
    images: [`${BASE_URL}/og-logo.png`],
  },
};

const FAQS: FaqItem[] = [
  {
    question: '¿Qué porcentaje del valor de la propiedad financian los bancos en Uruguay?',
    answer:
      'En general, las entidades financieras (BHU, Santander, Itaú, BBVA, Scotiabank) financian entre el 70% y el 80% del valor menor entre el precio de compraventa y la tasación pericial del banco. El comprador debe disponer de un ahorro previo del 20% al 30% como entrega inicial, más aproximadamente un 8% a 10% adicional para gastos notariales, impuestos y timbres.',
  },
  {
    question: '¿Si una casa está calificada como "Apta para Banco", tengo el préstamo asegurado?',
    answer:
      'No. La condición de "Apta para Banco" significa que el inmueble reúne los requisitos jurídicos, catastrales y de agrimensura que el banco exige. Sin embargo, la aprobación definitiva del crédito depende también de la capacidad de pago del solicitante, sus ingresos demostrables, historial crediticio en el Clearing y la relación cuota/ingreso.',
  },
  {
    question: '¿Cuánto demora el trámite de un crédito hipotecario en San José?',
    answer:
      'Desde la pre-aprobación del comprador y la designación de tasador hasta el estudio notarial de títulos (30 años hacia atrás) y la firma de la escritura final, el proceso suele demorar entre 45 y 75 días hábiles.',
  },
  {
    question: '¿Qué gastos adicionales debo prever al comprar con préstamo hipotecario?',
    answer:
      'Los gastos principales incluyen: ITP (Impuesto a las Trasmisiones Patrimoniales: 2% sobre valor catastral), honorarios del escribano (3% + IVA), tasación del banco (habitualmente entre 15 y 25 UR), comisión inmobiliaria (3% + IVA), e inscripciones en el Registro de la Propiedad.',
  },
];

export default function GuiaCreditoBancarioPage() {
  const whatsappUrl = buildGeneralWhatsAppLink('general');

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${PAGE_URL}#article`,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        headline: 'Guía Completa para Comprar una Propiedad con Crédito Bancario en Uruguay',
        description:
          'Proceso, requisitos notariales, análisis de aptitud bancaria y costos asociados para adquirir inmuebles con financiamiento hipotecario en San José y Uruguay.',
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
            name: 'Guía de Crédito Bancario',
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
          <Link href="/casas-aptas-para-banco-san-jose" className="hover:text-[#5E1754] transition-colors">
            Aptas para Banco
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#5E1754] font-bold">Guía de Crédito Bancario</span>
        </div>
      </nav>

      {/* Cabecera del Artículo */}
      <header className="bg-gradient-to-br from-[#191024] via-[#2A0E35] to-[#120B1A] text-white py-14 sm:py-18">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-400 border border-white/15">
            <Landmark className="w-3.5 h-3.5 text-[#E85D04]" />
            <span>Guía Financiera e Inmobiliaria</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Guía para Comprar una Propiedad con <span className="text-[#E85D04]">Crédito Bancario</span> en Uruguay
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
              <span>San José, Uruguay</span>
            </div>
          </div>

        </div>
      </header>

      {/* Cuerpo del Artículo */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow space-y-12">
        
        {/* Introducción */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-4 text-left leading-relaxed text-sm sm:text-base text-slate-700">
          <p className="font-semibold text-slate-900 text-base sm:text-lg">
            Comprar una casa o apartamento mediante crédito hipotecario es el camino más habitual para acceder a la vivienda propia en Uruguay. Sin embargo, requiere coordinar dos evaluaciones paralelas: la del comprador (sujeto de crédito) y la del inmueble (garantía hipotecaria).
          </p>
          <p>
            En esta guía te explicamos paso a paso cómo funciona el proceso ante los bancos (BHU, Santander, Itaú, BBVA, Scotiabank), qué significa realmente que una propiedad sea "Apta para Banco" y qué gastos reales debes presupuestar.
          </p>
        </section>

        {/* Advertencia Jurídica / Financiera Clave */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 sm:p-6 text-left space-y-2 text-xs sm:text-sm text-amber-950">
          <div className="flex items-center space-x-2 font-bold text-amber-900 text-sm sm:text-base">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <span>Aclaración Importante sobre la "Aptitud Bancaria"</span>
          </div>
          <p className="leading-relaxed">
            Que una propiedad esté identificada como <strong>"Apta para Banco"</strong> certifica que cuenta con la documentación legal, planos y situación impositiva requerida por las instituciones financieras. <strong>No constituye una garantía automática de otorgamiento del préstamo</strong>, ya que la aprobación final depende exclusivamente de la calificación crediticia del solicitante, sus ingresos demostrables y la tasación pericial del banco.
          </p>
        </div>

        {/* 1. Qué significa que sea Apta para Banco */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6 text-left">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#5E1754]">
              1. ¿Qué Requisitos Técnicos Exige el Banco sobre el Inmueble?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Para aceptar una propiedad como garantía hipotecaria, los departamentos legales y técnicos del banco auditan:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#5E1754]" />
                <span>Títulos de Propiedad Perfectos</span>
              </h4>
              <p>
                Estudio notarial continuo de al menos 30 años sin embargos, hipotecas no canceladas, sucesiones inconclusas o interdicciones judiciales.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#5E1754]" />
                <span>Planos de Mensura Registrados</span>
              </h4>
              <p>
                Plano de mensura o fraccionamiento inscripto en la Dirección Nacional de Catastro y concordante con los metros reales construidos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#5E1754]" />
                <span>Regularización de BPS e Intendencia</span>
              </h4>
              <p>
                Aportes de mano de obra ante el Banco de Previsión Social (BPS) al día o prescriptos, y construcciones aprobadas en la Intendencia de San José.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#5E1754]" />
                <span>Tributos al Día</span>
              </h4>
              <p>
                Certificado de estar al día con la Contribución Inmobiliaria y el Impuesto de Primaria.
              </p>
            </div>
          </div>
        </section>

        {/* 2. El Proceso Paso a Paso */}
        <section className="space-y-6 text-left">
          <h2 className="text-2xl font-black text-[#5E1754] flex items-center space-x-2">
            <Percent className="w-6 h-6 text-[#E85D04]" />
            <span>2. El Proceso de Compra con Banco en 5 Etapas</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-4">
              <span className="w-7 h-7 rounded-full bg-[#5E1754] text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                1
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Pre-Calificación Crediticia</h4>
                <p className="text-slate-600">
                  Antes de buscar casa, presentás tus ingresos ante el banco para conocer el monto máximo prestable y la cuota estimada.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-4">
              <span className="w-7 h-7 rounded-full bg-[#5E1754] text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                2
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Selección de Propiedad Apta y Reserva</h4>
                <p className="text-slate-600">
                  Elegís una propiedad verificada con Inmobiliaria Montaño y se suscribe una reserva o boleto de reserva sujeto a aprobación bancaria.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-4">
              <span className="w-7 h-7 rounded-full bg-[#5E1754] text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                3
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Tasación Pericial del Banco</h4>
                <p className="text-slate-600">
                  Un perito tasador designado por el banco visita el inmueble para determinar su valor de garantía formal.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-4">
              <span className="w-7 h-7 rounded-full bg-[#5E1754] text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                4
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Estudio de Títulos por Escribanía</h4>
                <p className="text-slate-600">
                  El escribano actuante analiza los antecedentes de dominio y certificados registrales para certificar la titularidad limpia.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-4">
              <span className="w-7 h-7 rounded-full bg-[#5E1754] text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                5
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Firma de Escritura e Hipoteca</h4>
                <p className="text-slate-600">
                  Se suscribe la compraventa e hipoteca simultáneamente en el banco, el vendedor recibe el desembolso y tú recibes las llaves.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA hacia Catálogo de Casas Aptas para Banco */}
        <section className="bg-gradient-to-br from-[#191024] to-[#2E1235] text-white rounded-3xl p-8 sm:p-10 border border-purple-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Inmuebles Auditados
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Explorá Casas Aptas para Crédito Bancario en San José
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Filtramos propiedades con títulos y planos al día para que tu trámite de préstamo hipotecario sea ágil y sin sorpresas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
            <Link
              href="/casas-aptas-para-banco-san-jose"
              className="bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white text-xs sm:text-sm font-black px-6 py-3.5 rounded-2xl shadow-lg text-center transition-all flex items-center justify-center space-x-2"
            >
              <span>Ver Casas Aptas Banco</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-2xl border border-white/20 text-center transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Consultar Asesor</span>
            </a>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-6 text-left">
          <h3 className="text-xl sm:text-2xl font-black text-[#5E1754]">
            Preguntas Frecuentes sobre Créditos Hipotecarios
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
