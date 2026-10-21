import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { FaqAccordion, FaqItem } from '@/components/ui/FaqAccordion';
import { VenderPropiedadJsonLd } from '@/components/seo/VenderPropiedadJsonLd';
import { AppraisalPageForm } from '@/components/appraisal/AppraisalPageForm';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import {
  Home as HomeIcon,
  ChevronRight,
  ShieldCheck,
  Globe,
  UserCheck,
  MapPin,
  Sparkles,
  Scale,
  Target,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  FileText,
  Trees,
  Building2,
  Percent,
  Clock,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/vender-propiedad-san-jose`;

export const metadata: Metadata = {
  title: 'Vender Casa o Terreno en San José de Mayo | Inmobiliaria Montaño',
  description:
    'Vendé tu casa, terreno, solar o chacra en San José con rapidez y seguridad. Clientes concretos en lista de espera, tasación profesional sin costo y acompañamiento notarial con Daniel Montaño.',
  keywords: [
    'vender propiedad san jose de mayo',
    'vender casa san jose uruguay',
    'se precisan propiedades para la venta san jose',
    'como vender mi terreno en san jose',
    'inmobiliarias para vender en san jose',
    'comision inmobiliaria venta uruguay',
    'tasar y vender casa san jose',
    'inmobiliaria montaño ventas',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Vender Casa o Terreno en San José — Inmobiliaria Montaño',
    description:
      '¡Se precisan propiedades para la venta en San José! Clientes concretos esperando. Tasación y publicación sin costo inicial con Daniel Montaño.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/se-precisan-propiedades-4x3.jpg`,
        width: 1200,
        height: 900,
        alt: 'Se precisan propiedades para la venta — Inmobiliaria Montaño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vender Casa o Terreno en San José — Inmobiliaria Montaño',
    description:
      'Comercialización profesional de inmuebles en San José con Daniel Montaño. Clientes calificados esperando.',
    images: [`${BASE_URL}/images/se-precisan-propiedades-4x3.jpg`],
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
    question: '¿Por qué me conviene vender mi propiedad con Inmobiliaria Montaño?',
    answer:
      'Combinamos conocimiento profundo del mercado de San José, cartera activa de compradores calificados en espera, plataforma web optimizada para Google e Inteligencia Artificial y un respaldo notarial permanente que protege tu patrimonio.',
  },
  {
    question: '¿Tiene algún costo publicar o tasar mi inmueble?',
    answer:
      'No. La tasación, el relevamiento del inmueble y la publicación en nuestros canales son 100% gratuitos para el propietario. Nuestros honorarios se perciben únicamente al concretar exitosamente la venta ante escribano.',
  },
  {
    question: '¿Cuál es la comisión inmobiliaria por venta?',
    answer:
      'El arancel profesional de plaza está fijado en el 3% + IVA sobre el precio final de venta. No cobramos adelantos, gastos de cartelería ni mensualidades. Los honorarios se abonan únicamente al concretar la venta.',
  },
  {
    question: '¿Qué documentación se necesita para poner una propiedad a la venta?',
    answer:
      'Se requiere copia de la cédula del titular, número de padrón catastral, plano de mensura si se cuenta con él, y recibo de Contribución Inmobiliaria al día ante la Intendencia de San José. Si hay una sucesión o trámite pendiente, te orientamos con escribanía asociada.',
  },
  {
    question: '¿Cómo filtran a los compradores para evitar visitas innecesarias?',
    answer:
      'Calificamos previamente el interés y la capacidad de pago del solicitante (fondos propios o crédito bancario pre-aprobado). Siempre coordinamos las visitas con aviso previo y acompañamiento presencial de Daniel Montaño.',
  },
  {
    question: '¿Qué tipo de propiedades están buscando actualmente en San José?',
    answer:
      'Tenemos clientes con intención de compra inmediata para Casas y Apartamentos (especialmente en Centro, Colón, Molino y Parque Rodó), Terrenos y Solares urbanos para edificar, y Chacras o Fracciones de campo cercanas a San José de Mayo, Ruta 1 y Ruta 3.',
  },
];

export default function VenderPropiedadPage() {
  const contactWhatsappUrl = buildGeneralWhatsAppLink('vender');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* 0. Schema JSON-LD */}
      <VenderPropiedadJsonLd faqs={FAQS} />

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
              <span className="text-amber-300 font-bold">Vender mi Propiedad</span>
            </nav>

            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="inline-flex items-center space-x-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>San José de Mayo • Comercialización de Confianza</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Vendé tu Propiedad en <span className="text-amber-300">San José</span>
              </h1>

              <p className="text-slate-200 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
                Casas, apartamentos, solares y fracciones de campo. Difusión profesional de alto impacto, compradores calificados y la tranquilidad de operar con <strong>Daniel Montaño</strong>.
              </p>
            </div>

            {/* Badges de Confianza Unificados */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-3xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Difusión Multicanal</h4>
                  <p className="text-[11px] text-purple-200">Máxima visibilidad web</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Filtro de Compradores</h4>
                  <p className="text-[11px] text-purple-200">Solo visitas calificadas</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Garantía Notarial</h4>
                  <p className="text-[11px] text-purple-200">Seguridad en cada paso</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Oficial de Captación de Propietarios (Flyer 4:3 Oficial) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <div className="bg-gradient-to-br from-[#2D0B28] via-[#43123C] to-[#5E1754] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-purple-400/25 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4 text-left">
                <span className="inline-flex items-center space-x-1.5 bg-amber-400/15 border border-amber-400/30 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demanda Activa en San José</span>
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  ¡Se precisan propiedades para la venta!
                </h2>
                <p className="text-sm sm:text-base text-purple-100 leading-relaxed font-normal">
                  Tenemos compradores calificados con intención de compra inmediata en San José de Mayo y localidades del departamento.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center space-x-2.5">
                    <HomeIcon className="w-4 h-4 text-amber-300 flex-shrink-0" />
                    <span className="font-bold text-white">Casas y Aptos</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center space-x-2.5">
                    <Trees className="w-4 h-4 text-amber-300 flex-shrink-0" />
                    <span className="font-bold text-white">Terrenos y Solares</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center space-x-2.5">
                    <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0" />
                    <span className="font-bold text-white">Chacras y Campos</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center space-x-2.5">
                    <Building2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
                    <span className="font-bold text-white">Locales y Galpones</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#formulario-tasacion"
                    className="inline-flex items-center space-x-2 bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition-all"
                  >
                    <span>Completar Datos de mi Propiedad</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={contactWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/25 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-300" />
                    <span>WhatsApp Directo</span>
                  </a>
                </div>
              </div>

              {/* Flyer Oficial 4:3 */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/25">
                  <Image
                    src="/images/se-precisan-propiedades-4x3.jpg"
                    alt="Se precisan propiedades para la venta — Clientes concretos esperando — Inmobiliaria Montaño"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Formulario de Captación */}
        <section id="formulario-tasacion" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <AppraisalPageForm />
        </section>

        {/* 4. Por qué vender con Inmobiliaria Montaño */}
        <section className="bg-white border-y border-slate-200/80 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nuestra Propuesta de Valor</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ¿Por Qué Confiar la Venta de tu Propiedad a Daniel Montaño?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Cuidamos tu tiempo, tu tranquilidad y el verdadero valor de tu patrimonio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Presentación Destacada</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Relevamiento completo y descripción técnica precisa que resalta las virtudes reales de tu propiedad.
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Visibilidad en Google e IA</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Plataforma web propia con tecnología de última generación, optimizada para que tanto Google como asistentes de Inteligencia Artificial encuentren y recomienden tu inmueble a compradores activos.
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Negociación Firme y Realista</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Defendemos tu precio con argumentos sólidos y filtramos curiosos, atendiendo exclusivamente a compradores con capacidad financiera real.
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Acompañamiento Notarial</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Supervisamos la seña, el boleto de reserva, la entrega de documentación y la firma de la escritura para una operación 100% blindada.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. El Proceso de Venta en 4 Pasos (E-E-A-T & HowTo) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Transparencia de Principio a Fin</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cómo Vendemos tu Propiedad en 4 Pasos
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Metodología probada en San José, sin letra chica y con acompañamiento notarial permanente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#5E1754]/40 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5E1754] font-black flex items-center justify-center text-sm border border-purple-200">
                01
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Tasación y ACM Real</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Visitamos tu inmueble e investigamos valores de transacciones reales cerradas en tu barrio de San José para determinar el precio óptimo.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#5E1754]/40 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5E1754] font-black flex items-center justify-center text-sm border border-purple-200">
                02
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Ficha Técnica y Difusión</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Relevamiento visual y ficha técnica detallada publicada en nuestra web, redes y canales comerciales sin ningún costo previo.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#5E1754]/40 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5E1754] font-black flex items-center justify-center text-sm border border-purple-200">
                03
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Filtro de Interesados</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Calificamos a los compradores (fondos propios o crédito bancario pre-aprobado) y coordinamos visitas presenciales con previo aviso.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#5E1754]/40 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5E1754] font-black flex items-center justify-center text-sm border border-purple-200">
                04
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Firma ante Escribano</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Acompañamiento en el boleto de reserva, seña, control de títulos catastrales y liquidación de tributos para un cierre seguro.
              </p>
            </div>
          </div>

          {/* Recuadro de Honorarios Transparentes */}
          <div className="mt-8 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-black text-amber-950 flex items-center space-x-2">
                <Percent className="w-4 h-4 text-[#E85D04]" />
                <span>Honorarios Claros y Transparentes</span>
              </h4>
              <p className="text-xs sm:text-sm text-amber-900/80 font-medium">
                Arancel del 3% + IVA abonado <strong>únicamente al escriturar la venta</strong>. Cero costos iniciales, sin cargos fijos por publicación ni sorpresas.
              </p>
            </div>
            <a
              href={contactWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-[#E85D04] hover:bg-[#FF8500] text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex-shrink-0"
            >
              <span>Tasar mi Inmueble</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* 6. Preguntas Frecuentes */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <FaqAccordion
            items={FAQS}
            title="Preguntas Frecuentes sobre la Venta de Inmuebles"
            subtitle="Respuestas claras a las consultas más habituales de propietarios."
          />
        </section>

        {/* 6. Bloque de Compromiso Personal */}
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
                  Trato Directo y Confidencial
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Daniel Montaño • Asesor Inmobiliario
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 max-w-lg font-normal">
                  Escribime por WhatsApp para conversar sobre tu propiedad y planificar una venta rápida y segura.
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
