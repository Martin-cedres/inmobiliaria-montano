import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { FaqAccordion, FaqItem } from '@/components/ui/FaqAccordion';
import { AlquilarPropiedadJsonLd } from '@/components/seo/AlquilarPropiedadJsonLd';
import { AppraisalPageForm } from '@/components/appraisal/AppraisalPageForm';
import { DepartmentInterlinking } from '@/components/seo/DepartmentInterlinking';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import {
  Home as HomeIcon,
  ChevronRight,
  ShieldCheck,
  Globe,
  UserCheck,
  MapPin,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  FileText,
  Building2,
  Clock,
  Award,
  AlertTriangle,
  XCircle,
  Receipt,
  Scale,
  KeyRound,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/alquilar-mi-propiedad-san-jose`;

export const metadata: Metadata = {
  title: 'Alquilar y Administrar mi Propiedad en San José | Inmobiliaria Montaño',
  description:
    'Búsqueda activa de casas, apartamentos y locales para alquilar en San José de Mayo. Inquilinos calificados, garantías seguras (ANDA, CGN, Aseguradoras) y administración mensual sin complicaciones con Daniel Montaño al 092 776 715.',
  keywords: [
    'alquilar mi casa san jose',
    'administracion de propiedades san jose de mayo',
    'poner en alquiler apartamento san jose',
    'inmobiliarias para alquilar san jose uruguay',
    'administracion de alquileres san jose',
    'inmobiliaria montaño alquileres',
    'garantias de alquiler san jose',
    'alquilar local comercial san jose',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Alquilar y Administrar mi Propiedad en San José | Inmobiliaria Montaño',
    description:
      '¡Estamos en la búsqueda de casas, apartamentos y locales para alquilar en San José! Inquilinos calificados y garantías seguras en espera. Trato directo con Daniel Montaño.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/buscamos-propiedades-alquiler-4x3.jpg`,
        width: 1200,
        height: 896,
        alt: 'Estamos en la búsqueda de propiedades para alquilar — Inmobiliaria Montaño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alquilar y Administrar mi Propiedad en San José | Inmobiliaria Montaño',
    description:
      'Gestión integral de alquileres en San José: selección de inquilinos, inventario fotográfico, contratos notariales y cobranza puntual.',
    images: [`${BASE_URL}/images/buscamos-propiedades-alquiler-4x3.jpg`],
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
    question: '¿Por qué confiar el alquiler o administración de tu propiedad a Inmobiliaria Montaño?',
    answer:
      'Porque nos ocupamos de punta a punta para que disfrutes de tu renta sin dolores de cabeza: tasamos el valor óptimo de mercado, realizamos un inventario fotográfico exhaustivo, seleccionamos inquilinos con solvencia comprobada, formalizamos contratos ante escribano público y gestionamos la cobranza mensual con control de tributos al día.',
  },
  {
    question: '¿Qué garantías de alquiler ofrecen mayor seguridad para el propietario en San José?',
    answer:
      'Trabajamos con las garantías más confiables de plaza: ANDA y Contaduría General de la Nación (CGN) con retención de haberes, y aseguradoras privadas de primer nivel (Porto Seguro, SURA, Mapfre, Santander y FIDECIU) que cubren el alquiler mensual, gastos comunes, consumos de UTE/OSE y eventuales deterioros. También asesoramos en depósitos en custodia del BHU (5 meses) y acuerdos bajo la normativa LUC.',
  },
  {
    question: '¿Qué incluye exactamente el servicio de Administración Mensual de Alquileres?',
    answer:
      'La administración incluye: cobranza mensual del canon de arrendamiento y depósito puntual en la cuenta bancaria del propietario, verificación estricta de pagos de UTE, OSE y tributos domiciliarios de la Intendencia de San José, intermediación en reparaciones o mantenimiento necesarios y liquidaciones mensuales claras y transparentes.',
  },
  {
    question: '¿Cómo se controla que el inquilino no acumule deudas de UTE, OSE o Intendencia?',
    answer:
      'Exigimos y verificamos mensualmente los comprobantes de pago de servicios públicos y tributos antes de emitir los recibos correspondientes. Al finalizar el contrato de arrendamiento, retenemos las liquidaciones finales hasta constatar saldo cero en todas las empresas públicas.',
  },
  {
    question: '¿Cuánto demora en alquilarse una casa o apartamento en San José de Mayo hoy?',
    answer:
      'Existe una altísima demanda de viviendas en San José de Mayo. Una propiedad con precio correctamente fijado y buenas condiciones habitacionales suele concretar su reserva en un plazo promedio de 7 a 20 días gracias a nuestra lista de espera activa de inquilinos calificados.',
  },
  {
    question: '¿Qué documentación necesito para poner mi inmueble en alquiler?',
    answer:
      'Copia de cédula de identidad del titular, número de padrón catastral, comprobantes de pago de Contribución Inmobiliaria e Impuesto de Primaria al día, y detalle de los servicios existentes (UTE/OSE). Nosotros nos encargamos de todo el relevamiento fotográfico y la redacción del contrato notarial.',
  },
];

export default function AlquilarPropiedadPage() {
  const contactWhatsappUrl = buildGeneralWhatsAppLink('alquilar_propiedad');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 0. Schema JSON-LD */}
      <AlquilarPropiedadJsonLd faqs={FAQS} />

      {/* 1. Navbar */}
      <Header />

      <main className="flex-grow">
        {/* 2. Hero Centrado y Persuasivo */}
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
              <Link href="/alquileres-san-jose-de-mayo" className="hover:text-amber-300 transition-colors">
                Alquileres
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-purple-300/50" />
              <span className="text-amber-300 font-bold">Alquilar mi Propiedad</span>
            </nav>

            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="inline-flex items-center space-x-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>San José de Mayo • Alquiler y Administración Profesional</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Estamos en Búsqueda de Propiedades para Alquilar en <span className="text-amber-300">San José</span>: Casas, Apartamentos y Locales
              </h1>

              <p className="text-slate-200 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
                Contamos con inquilinos calificados y garantías seguras esperando. Contactanos para conversar sobre las posibilidades de alquiler o administración de tu inmueble con <strong>Daniel Montaño</strong>.
              </p>
            </div>

            {/* Badges de Confianza Unificados */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-3xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Garantías Seguras</h4>
                  <p className="text-[11px] text-purple-200">ANDA, CGN, Porto, SURA</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Inventario Fotográfico</h4>
                  <p className="text-[11px] text-purple-200">Protección del estado edilicio</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Cobranza Puntual</h4>
                  <p className="text-[11px] text-purple-200">Liquidación mensual en cuenta</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Banner Oficial 4:3 de Captación de Alquileres */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <div className="bg-gradient-to-br from-[#2D0B28] via-[#43123C] to-[#5E1754] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-purple-400/25 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4 text-left">
                <span className="inline-flex items-center space-x-1.5 bg-amber-400/15 border border-amber-400/30 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demanda Activa de Alquileres en San José</span>
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  ¡Buscamos propiedades para alquilar en tiempo récord!
                </h2>
                <p className="text-sm sm:text-base text-purple-100 leading-relaxed font-normal">
                  Tenemos familias y comerciantes calificados con garantías aprobadas esperando alquilar en San José de Mayo y alrededores.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center space-x-2.5">
                    <HomeIcon className="w-4 h-4 text-amber-300 flex-shrink-0" />
                    <span className="font-bold text-white">Casas Residenciales</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center space-x-2.5">
                    <Building2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
                    <span className="font-bold text-white">Apartamentos Céntricos</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center space-x-2.5">
                    <KeyRound className="w-4 h-4 text-amber-300 flex-shrink-0" />
                    <span className="font-bold text-white">Locales Comerciales</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center space-x-2.5">
                    <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0" />
                    <span className="font-bold text-white">Galpones y Depósitos</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#formulario-alquiler"
                    className="inline-flex items-center space-x-2 bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition-all"
                  >
                    <span>Ofrecer mi Inmueble en Alquiler</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={contactWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/25 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-300" />
                    <span>WhatsApp con Daniel Montaño</span>
                  </a>
                </div>
              </div>

              {/* Flyer Oficial 4:3 Alquileres */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/25">
                  <Image
                    src="/images/buscamos-propiedades-alquiler-4x3.jpg"
                    alt="Estamos en la búsqueda de propiedades para alquilar — Casas, Apartamentos y Locales — Inmobiliaria Montaño"
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

        {/* 4. Los 4 Pilares de Administración de Inmobiliaria Montaño */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tranquilidad Patrimonial</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tu Renta Segura, Sin Dolores de Cabeza
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Así cuidamos tu inmueble y aseguramos el cobro mes a mes en San José de Mayo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-slate-900">1. Filtro Riguroso de Inquilinos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chequeamos solvencia económica, estabilidad laboral e historial crediticio. Priorizamos pólizas de ANDA, CGN, Porto Seguro, SURA, Mapfre o depósito en custodia del BHU.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-[#5E1754] flex items-center justify-center font-black">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-slate-900">2. Inventario Notarial Completo</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Antes de entregar las llaves, elaboramos un inventario fotográfico minucioso con el estado de aberturas, sanitarios, pisos y pintura para garantizar la restitución fiel del bien.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-slate-900">3. Control de Servicios y Tributos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verificamos mes a mes que los recibos de UTE, OSE y tributos domiciliarios de la Intendencia de San José se mantengan al día, evitando deudas sorpresa acumuladas.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-slate-900">4. Cobranza y Liquidación Puntual</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Depositamos tu renta mensual sin demoras en tu cuenta bancaria. Si el inquilino tiene cualquier duda o mantenimiento edilicio, nosotros somos el único punto de contacto.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Tabla Comparativa: Alquilar Solo vs Con Inmobiliaria Montaño */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-black text-[#5E1754] uppercase tracking-wider">
                Comparativa de Seguridad
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                ¿Por qué no conviene alquilar de forma particular?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Opción Particular */}
              <div className="bg-red-50/50 rounded-2xl p-6 border border-red-200/80 space-y-4">
                <div className="flex items-center space-x-2 text-red-700 font-black text-sm">
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Alquilar por tu cuenta (Riesgos)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Riesgo de impagos sin garantía sólida que responda por el alquiler.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Deudas inesperadas de UTE, OSE o tributos que quedan a nombre del dueño.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Llamadas continuas a deshora por reclamos o reparaciones menores.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Contratos genéricos de internet sin respaldo notarial riguroso.</span>
                  </li>
                </ul>
              </div>

              {/* Opción Montaño */}
              <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200/80 space-y-4">
                <div className="flex items-center space-x-2 text-emerald-800 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>Con Inmobiliaria Montaño (Tranquilidad)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Garantías homologadas (ANDA, CGN, Porto, SURA) con cobro asegurado.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Control mensual estricto de consumos y tributos al día.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Atención y gestión de intermediación con trato directo de Daniel Montaño.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Contratos notariales redactados por escribano con inventario fotográfico.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5.5. Convenio Círculo Policial de San José */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-[#2D0B28] to-[#5E1754] text-white rounded-3xl p-6 sm:p-8 border border-purple-400/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                  Convenio Institucional Oficial
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Convenio con el Círculo Policial de San José
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
                  Acceso directo a una cartera calificada de funcionarios y socios con retención segura de haberes y <strong>10% de bonificación</strong> en honorarios de arrendamiento.
                </p>
              </div>
            </div>

            <a
              href="https://circulopolicialsj.org.uy/convenios/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <span>Ver Convenio Oficial</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* 6. Formulario de Captación Preconfigurado en Alquiler */}
        <section id="formulario-alquiler" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <AppraisalPageForm
            defaultOperation="alquiler"
            badgeText="Alquiler y Administración"
            titleText="Ofrecé tu propiedad en alquiler"
            subtitleText="Sin compromiso ni costo inicial. Te respondemos en menos de 24 horas para coordinar el relevamiento."
            sourcePage="/alquilar-mi-propiedad-san-jose"
          />
        </section>

        {/* 7. Preguntas Frecuentes */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <FaqAccordion
            items={FAQS}
            title="Preguntas Frecuentes de Propietarios que Alquilan"
            subtitle="Todo lo que necesitás saber antes de poner tu casa, apartamento o local en alquiler en San José."
          />
        </section>

        {/* 7.5. Interlinking Departamental Semántico */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <DepartmentInterlinking currentPath={PAGE_URL} />
        </section>

        {/* 8. Bloque Final con Daniel Montaño */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14">
          <div className="bg-gradient-to-br from-[#350A2F] to-[#5E1754] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-400/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-[#E85D04] ring-4 ring-[#E85D04]/30 flex-shrink-0">
                <Image
                  src="/daniel-montano.webp"
                  alt="Daniel Montaño — Inmobiliaria Montaño"
                  fill
                  className="object-cover scale-125 object-[center_18%]"
                  unoptimized
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                  Atención Personalizada en San José de Mayo
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Conversá con Daniel Montaño sobre tu Inmueble
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 max-w-lg font-normal">
                  Te asesoramos con honestidad sobre el precio de renta real y las mejores garantías para tu caso particular.
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
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <Footer />

      {/* 10. Floating WhatsApp */}
      <FloatingWhatsApp />
    </div>
  );
}
