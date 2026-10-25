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
import { DepartmentInterlinking } from '@/components/seo/DepartmentInterlinking';
import { getCachedProperties } from '@/lib/propertiesStore';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import { WhatsAppTrackButton } from '@/components/analytics/WhatsAppTrackButton';
import {
  Home as HomeIcon,
  ChevronRight,
  ShieldCheck,
  Key,
  FileCheck,
  MapPin,
  Building,
  PhoneCall,
  UserCheck,
  FileText,
  Award,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/alquileres-san-jose-de-mayo`;

export const revalidate = 86400; // 24 horas ISR

export const metadata: Metadata = {
  title: 'Alquileres en San José de Mayo: Casas, Apartamentos y Locales | Inmobiliaria Montaño',
  description:
    'Casas y apartamentos para alquilar en San José de Mayo. Opciones con garantía (ANDA, CGN, Aseguradoras, Depósito BHU y modalidad sin garantía tradicional / LUC) y trato directo con Daniel Montaño al 092 776 715.',
  keywords: [
    'alquileres san jose',
    'alquileres en san jose de mayo',
    'alquileres san jose uruguay',
    'casas para alquilar en san jose de mayo sin garantia',
    'apartamentos en alquiler san jose',
    'alquileres baratos san jose de mayo',
    'alquileres anda san jose',
    'alquileres porto seguro san jose',
    'alquiler garantia deposito bhu san jose',
    'alquiler sin garantia luc uruguay',
    'inmobiliaria montaño alquileres',
    'administracion de propiedades san jose',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Alquileres en San José de Mayo: Casas, Apartamentos y Locales | Inmobiliaria Montaño',
    description:
      'Casas, apartamentos y locales en alquiler en San José de Mayo. Garantías ANDA, Porto Seguro, CGN, Depósito BHU y régimen sin garantía LUC.',
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
    title: 'Alquileres en San José de Mayo: Casas, Apartamentos y Locales | Inmobiliaria Montaño',
    description:
      'Casas, apartamentos y locales en alquiler en San José con garantías seguras y asesoramiento directo.',
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
    question: '¿Qué garantías de alquiler se aceptan en Inmobiliaria Montaño?',
    answer:
      'Aceptamos todas las garantías líderes del mercado uruguayo: ANDA, Contaduría General de la Nación (CGN), Porto Seguro, SURA, Mapfre, Santander y FIDECIU. También asesoramos en depósitos de garantía en el BHU y en el régimen de libre contratación sin garantía tradicional al amparo de la LUC (Ley N° 19.889). Además, disponemos de convenio oficial con el Círculo Policial de San José con 10% de bonificación en honorarios para socios.',
  },
  {
    question: '¿Es posible alquilar una propiedad en San José sin garantía tradicional?',
    answer:
      'Sí. Bajo la normativa de la Ley de Urgente Consideración (LUC), propietarios e inquilinos pueden acordar contratos de arrendamiento sin necesidad de presentar pólizas o garantías de fianza, siempre que ambas partes lo pacten de común acuerdo. En Inmobiliaria Montaño asesoramos a ambas partes para redactar contratos notariales claros con inventario detallado.',
  },
  {
    question: '¿Cómo funciona la garantía por depósito en el Banco Hipotecario (BHU)?',
    answer:
      'Consiste en un depósito en custodia a nombre del arrendamiento en el BHU equivalente a 5 meses de alquiler (para vivienda) que genera intereses y se reintegra al finalizar el contrato tras comprobar el estado del inmueble.',
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
    question: '¿Qué servicios ofrece Inmobiliaria Montaño para propietarios que desean alquilar?',
    answer:
      'Nos encargamos de la tasación justa de renta, selección rigurosa y chequeo de garantías del inquilino, redacción del contrato notarial, inventario fotográfico inicial y administración mensual de cobranzas sin complicaciones.',
  },
];

export default async function AlquileresPage() {
  const allProperties = await getCachedProperties();
  
  // Filtrar alquileres y propiedades en alquiler
  const allRentals = allProperties.filter(
    (p) => p.operation === 'alquiler'
  );

  const activeRentals = allRentals.filter((p) => p.status !== 'alquilado' && p.status !== 'vendido');

  const contactWhatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* 0. Schema JSON-LD */}
      <AlquileresJsonLd properties={allRentals} faqs={FAQS} />

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
                <span>San José • San José de Mayo • Uruguay</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Alquileres en <span className="text-amber-300">San José</span> y San José de Mayo
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
                  <h4 className="text-xs font-black text-white">Todas las Garantías</h4>
                  <p className="text-[11px] text-purple-200">ANDA, Porto, SURA, CGN y más</p>
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
                  {activeRentals.length} disponibles
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

          {activeRentals.length === 0 ? (
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
              {activeRentals.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}

              {/* Tarjeta Nativa de Captación de Alquileres (Cierra la fila en la 3ª columna) */}
              <div className="bg-gradient-to-br from-[#2D0B28] via-[#43123C] to-[#5E1754] text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-purple-400/25 flex flex-col justify-between relative overflow-hidden group">
                <div className="space-y-3 relative z-10">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 shadow-md">
                    <Image
                      src="/images/buscamos-propiedades-alquiler-4x3.jpg"
                      alt="Estamos en la búsqueda de propiedades para alquilar en San José"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                  </div>
                  <div className="space-y-1.5 pt-1 text-left">
                    <span className="inline-flex items-center space-x-1 text-[11px] font-black uppercase text-amber-300 tracking-wider">
                      <Key className="w-3 h-3" />
                      <span>Para Propietarios</span>
                    </span>
                    <h3 className="font-black text-lg text-white leading-tight">
                      ¿Tenés una propiedad para alquilar?
                    </h3>
                    <p className="text-xs text-purple-200 leading-relaxed font-normal">
                      Contamos con inquilinos calificados y garantías seguras esperando en San José de Mayo.
                    </p>
                  </div>
                </div>

                <div className="pt-4 relative z-10">
                  <Link
                    href="/alquilar-mi-propiedad-san-jose"
                    className="w-full inline-flex items-center justify-center space-x-2 bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-black text-xs py-3 px-4 rounded-xl shadow-lg transition-all"
                  >
                    <span>Conocer Servicio de Alquiler y Administración</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>



        {/* 3.5. Confianza Institucional: Convenio Círculo Policial & Garantías Homologadas */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
          <div className="bg-gradient-to-br from-[#1c081e] via-[#350A2F] to-[#5E1754] rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl border border-purple-400/25 relative overflow-hidden">
            {/* Resplandor decorativo de fondo */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#E85D04]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Tarjeta Convenio Oficial Círculo Policial */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Convenio Institucional Oficial</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Convenio con el <span className="text-amber-300">Círculo Policial de San José</span>
                </h2>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  Beneficio exclusivo para socios: <strong>10% de bonificación</strong> en la comisión inmobiliaria en todos los nuevos contratos de arrendamiento gestionados por <strong>Inmobiliaria Montaño</strong>.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="https://circulopolicialsj.org.uy/convenios/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 group"
                  >
                    <span>Verificar Convenio en circulopolicialsj.org.uy</span>
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </a>

                  <span className="text-xs text-purple-200/90 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Acuerdo institucional verificado</span>
                  </span>
                </div>
              </div>

              {/* Sello de Garantías de Alquiler Homologadas */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0 border border-amber-400/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">
                      Aceptamos Todas las Garantías de Alquiler
                    </h3>
                    <p className="text-[11px] text-purple-200">
                      Cobertura total para inquilinos y propietarios en San José
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { name: 'ANDA', type: 'Institucional' },
                    { name: 'Porto Seguro', type: 'Aseguradora' },
                    { name: 'SURA', type: 'Aseguradora' },
                    { name: 'CGN', type: 'Contaduría' },
                    { name: 'Mapfre', type: 'Aseguradora' },
                    { name: 'Santander', type: 'Bancaria' },
                    { name: 'FIDECIU', type: 'Fianza' },
                  ].map((g) => (
                    <div
                      key={g.name}
                      className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-2.5 py-2 text-center transition-colors"
                    >
                      <div className="text-xs font-black text-white">{g.name}</div>
                      <div className="text-[10px] text-amber-300/90">{g.type}</div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-300 leading-normal">
                  ¿Aún no tenés garantía tramitada? Te asesoramos sin costo para gestionarla en minutos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Claves para Alquilar en San José */}
        <section className="bg-white border-y border-slate-200/80 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
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

        {/* 4.5. Bloque SEO Informativo: Modalidades de Garantía en San José de Mayo */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-xs space-y-6 text-left">
            <div className="space-y-2">
              <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Marco Legal & Garantías en Uruguay</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Garantías y Modalidades de Alquiler en San José de Mayo
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                En Inmobiliaria Montaño facilitamos el acceso a la vivienda y protegemos el patrimonio de los propietarios asesorando en todas las modalidades legales vigentes en plaza.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2.5">
                <h3 className="font-black text-sm text-[#5E1754]">Garantías Estatales e Institucionales</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Operamos con <strong>ANDA</strong> y la <strong>Contaduría General de la Nación (CGN)</strong>, brindando máxima seguridad de cobro para jubilados, pensionistas y funcionarios públicos o dependientes privados.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2.5">
                <h3 className="font-black text-sm text-[#5E1754]">Pólizas de Aseguradoras Privadas</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Aprobación ágil en 24 horas mediante <strong>Porto Seguro, SURA, Mapfre, Santander y FIDECIU</strong>. Cobertura total de renta mensual, gastos comunes, consumos de UTE/OSE y eventuales daños edilicios.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2.5">
                <h3 className="font-black text-sm text-[#5E1754]">Depósito en Garantía (BHU)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Para quienes no cuentan con recibos de sueldo tradicionales o ingresos formales fijos, gestionamos el depósito en custodia en el <strong>Banco Hipotecario del Uruguay (5 meses de alquiler)</strong> con devolución de intereses.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2.5">
                <h3 className="font-black text-sm text-[#5E1754]">Régimen Sin Garantía Tradicional (LUC)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bajo la Ley N° 19.889 (LUC), facilitamos acuerdos directos de arrendamiento sin costo de póliza ni fianza, respaldados por contratos notariales rigurosos con inventario detallado para seguridad de ambas partes.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2.5">
                <h3 className="font-black text-sm text-[#5E1754]">Convenio Círculo Policial San José</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Los socios activos y retirados del <strong>Círculo Policial de San José</strong> acceden a un <strong>10% de bonificación exclusiva</strong> en la comisión inmobiliaria en todos los contratos de arrendamiento.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2.5">
                <h3 className="font-black text-sm text-[#5E1754]">Administración Mensual Transparente</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Liquidación puntual mes a mes, control permanente de tributos e impuestos al día e inspección presencial del estado del inmueble con Daniel Montaño.
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

        {/* 5.5. Interlinking Departamental Semántico */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <DepartmentInterlinking currentPath={PAGE_URL} />
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

            <WhatsAppTrackButton
              whatsappUrl={contactWhatsappUrl}
              buttonPosition="landing_hero"
              pagePath="/alquileres-san-jose-de-mayo"
              className="inline-flex items-center justify-center space-x-2 bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-lg transition-all flex-shrink-0 w-full md:w-auto"
            >
              <PhoneCall className="w-4 h-4 text-amber-200" />
              <span>Consultar Alquileres por WhatsApp</span>
            </WhatsAppTrackButton>
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
