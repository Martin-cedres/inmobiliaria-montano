import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PropertyCard } from '@/components/PropertyCard';
import { FaqAccordion, FaqItem } from '@/components/ui/FaqAccordion';
import { DepartmentInterlinking } from '@/components/seo/DepartmentInterlinking';
import { getAllProperties } from '@/lib/propertiesStore';
import { SAN_JOSE_LOCATIONS } from '@/data/locations';
import { generateSiteGraphSchema } from '@/utils/seo';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import {
  Building2,
  MapPin,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calculator,
  Compass,
  ArrowRight,
  PhoneCall,
  UserCheck,
  Landmark,
  FileCheck,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/inmobiliaria-san-jose`;

export const revalidate = 86400; // 24 horas ISR

export const metadata: Metadata = {
  title: 'Inmobiliaria en San José, Uruguay | Inmobiliaria Montaño — Daniel Montaño',
  description:
    'Inmobiliaria de referencia en el Departamento de San José, Uruguay. Venta de casas, campos, chacras, terrenos, alquileres garantizados y tasaciones oficiales con Daniel Montaño en San José de Mayo, Libertad, Ciudad del Plata y todo el departamento.',
  keywords: [
    'inmobiliaria san jose',
    'inmobiliarias san jose',
    'inmobiliaria san jose uruguay',
    'inmobiliaria san jose de mayo',
    'daniel montaño inmobiliaria',
    'tasaciones san jose uruguay',
    'comprar propiedades san jose',
    'alquileres departamento de san jose',
    'inmobiliaria libertad san jose',
    'inmobiliaria ciudad del plata',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Inmobiliaria en San José, Uruguay — Inmobiliaria Montaño',
    description:
      'Líderes inmobiliarios en el Departamento de San José. Casas, terrenos, chacras, alquileres y tasaciones profesionales con Daniel Montaño.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Inmobiliaria Montaño — San José, Uruguay',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inmobiliaria en San José, Uruguay — Inmobiliaria Montaño',
    description:
      'Venta, alquiler y tasaciones profesionales en todo el departamento de San José con Daniel Montaño.',
    images: [`${BASE_URL}/og-logo.png`],
  },
  other: {
    'geo.region': 'UY-SJ',
    'geo.placename': 'San José, Uruguay',
    'geo.position': '-34.3375;-56.7136',
    'ICBM': '-34.3375, -56.7136',
  },
};

const FAQS: FaqItem[] = [
  {
    question: '¿Qué alcance territorial cubre Inmobiliaria Montaño en el departamento de San José?',
    answer:
      'Brindamos cobertura integral y atención presencial en todo el Departamento de San José: San José de Mayo (capital), Libertad, Ciudad del Plata (Playa Pascual, Delta del Tigre), Ecilda Paullier, Rodríguez, Rafael Perazza, balnearios Kiyú y Boca del Cufré, así como en todas las zonas rurales, chacras y campos sobre Ruta 1, Ruta 3, Ruta 11 y Ruta 45.',
  },
  {
    question: '¿Cómo se determina el valor de tasación de un inmueble en San José?',
    answer:
      'Daniel Montaño realiza tasaciones profesionales mediante Análisis Comparativo de Mercado (ACM), analizando operaciones reales cerradas en la misma zona, estado de conservación, títulos de propiedad, metros edificados y valor del terreno. Se entrega un informe honesto y fundamentado para defender el valor real del inmueble.',
  },
  {
    question: '¿Qué garantías de alquiler se aceptan para propiedades en San José?',
    answer:
      'Trabajamos con las principales aseguradoras y aseguradoras públicas de Uruguay: ANDA, Contaduría General de la Nación (CGN), Porto Seguro, SURA y Mapfre, brindando máxima seguridad de cobro para propietarios y agilidad de gestión para inquilinos.',
  },
  {
    question: '¿Las propiedades cuentan con títulos e información verificada para banco?',
    answer:
      'Sí. Cada propiedad comercializada por Inmobiliaria Montaño pasa por una rigurosa revisión de títulos de propiedad, padrones, situación contributiva ante la Intendencia de San José y BPS, verificando su aptitud para créditos hipotecarios bancarios (BHU, Santander, Itaú, BBVA, Scotiabank).',
  },
];

export default async function InmobiliariaSanJosePage() {
  const allProperties = await getAllProperties();
  const publicProperties = allProperties.filter(
    (p) => p.status !== 'retirada' && p.status !== 'inactiva'
  );

  const featuredProperties = publicProperties.slice(0, 6);
  const whatsappContactUrl = buildGeneralWhatsAppLink('general');

  const schemaJsonLd = generateSiteGraphSchema();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Schema.org @graph unificado */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <Header />

      {/* Hero Departamental */}
      <section className="relative bg-gradient-to-br from-[#191024] via-[#2A0E35] to-[#120B1A] text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E85D04_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center sm:text-left">
          
          {/* Badge de Autoridad */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-xs font-extrabold text-orange-400">
            <ShieldCheck className="w-4 h-4 text-[#E85D04]" />
            <span>Autoridad Inmobiliaria en Todo el Departamento de San José</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Inmobiliaria en <span className="text-[#E85D04]">San José, Uruguay</span>
              </h1>
              <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
                Lideramos la comercialización, tasación y asesoramiento inmobiliario en todo el departamento. Desde la capital <strong>San José de Mayo</strong> hasta el eje industrial de <strong>Libertad</strong>, la costa de <strong>Ciudad del Plata</strong>, <strong>Kiyú</strong> y zonas rurales productivas.
              </p>

              <div className="flex flex-wrap gap-4 pt-2 justify-center sm:justify-start">
                <a
                  href={whatsappContactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white text-sm sm:text-base font-black px-8 py-4 rounded-2xl shadow-xl transition-all flex items-center space-x-2.5 cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Consultar con Daniel Montaño</span>
                </a>

                <Link
                  href="/propiedades-san-jose"
                  className="bg-white/10 hover:bg-white/20 active:scale-95 text-white text-sm sm:text-base font-bold px-7 py-4 rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center space-x-2"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Tarjeta de Asesor Directo */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 text-center space-y-4 shadow-2xl">
              <div className="relative w-24 h-24 mx-auto rounded-full ring-4 ring-[#E85D04]/30 overflow-hidden border-2 border-[#E85D04]">
                <Image
                  src="/daniel-montano.webp"
                  alt="Daniel Montaño - Director Inmobiliaria Montaño"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover scale-125 object-[center_18%]"
                  priority
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">Daniel Montaño</h3>
                <p className="text-xs font-bold text-orange-400">Director & Asesor Inmobiliario</p>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Defendemos el verdadero valor de tu propiedad con tasaciones honestas, contratos transparentes y atención personalizada en cada rincón del departamento."
              </p>
              <div className="pt-2 border-t border-white/15 flex items-center justify-center space-x-2 text-xs text-slate-300 font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#E85D04]" />
                <span>San José de Mayo • Tel. 092 776 715</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Cobertura Territorial por Localidades */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#E85D04]">
            Presencia Departamental
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#5E1754]">
            Localidades y Zonas Atendidas en San José
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Conocimiento exhaustivo del mercado local, valores por metro cuadrado y dinámicas de cada localidad de San José.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAN_JOSE_LOCATIONS.map((loc) => (
            <div
              key={loc.slug}
              className="bg-white p-5 rounded-2xl border border-purple-100/80 hover:border-purple-300 hover:shadow-md transition-all space-y-2 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#5E1754] uppercase bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-100">
                  {loc.zoneType}
                </span>
                <span className="text-[11px] font-mono text-slate-400">CP {loc.postalCode}</span>
              </div>
              <h3 className="text-base font-black text-slate-900">{loc.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{loc.description}</p>
              <div className="pt-2 text-[11px] font-bold text-slate-400 flex items-center space-x-1">
                <Compass className="w-3 h-3 text-[#E85D04]" />
                <span>Ejes: {loc.mainRoutes.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Propiedades Destacadas en el Departamento */}
      {featuredProperties.length > 0 && (
        <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#E85D04]">
                  Oportunidades Destacadas
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#5E1754]">
                  Inmuebles en San José
                </h2>
              </div>
              <Link
                href="/propiedades-san-jose"
                className="inline-flex items-center space-x-2 text-xs font-black text-[#5E1754] hover:text-[#E85D04] transition-colors"
              >
                <span>Ver todas las propiedades</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Preguntas Frecuentes */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#E85D04]">
            Respuestas Claras
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#5E1754]">
            Preguntas Frecuentes sobre el Mercado en San José
          </h2>
        </div>

        <FaqAccordion items={FAQS} />
      </section>

      {/* Interlinking Semántico Departamental */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <DepartmentInterlinking currentPath={PAGE_URL} />
      </div>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
