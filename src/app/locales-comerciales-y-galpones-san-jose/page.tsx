import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PropertyCard } from '@/components/PropertyCard';
import { FaqAccordion, FaqItem } from '@/components/ui/FaqAccordion';
import { LocalesGalponesJsonLd } from '@/components/seo/LocalesGalponesJsonLd';
import { getCachedProperties } from '@/lib/propertiesStore';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import {
  Home as HomeIcon,
  ChevronRight,
  MapPin,
  Truck,
  FileText,
  Building,
  Sparkles,
  Warehouse,
  ShieldCheck,
  PhoneCall,
  Store,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/locales-comerciales-y-galpones-san-jose`;

export const revalidate = 86400; // 24 horas ISR

export const metadata: Metadata = {
  title: 'Locales Comerciales y Galpones en San José | Alquiler y Venta | Inmobiliaria Montaño',
  description:
    'Alquiler y venta de locales comerciales, depósitos y galpones industriales en San José de Mayo, Ruta 3 y Ruta 11. Ubicaciones estratégicas y asesoramiento con Daniel Montaño.',
  keywords: [
    'locales comerciales en san jose de mayo',
    'alquiler de locales comerciales san jose uruguay',
    'galpones en san jose',
    'depositos industriales san jose',
    'galpones ruta 3 san jose',
    'inmuebles comerciales san jose',
    'inmobiliaria montaño comerciales',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Locales Comerciales y Galpones en San José — Inmobiliaria Montaño',
    description:
      'Locales en el centro de San José y galpones sobre corredores logísticos. Alquiler y venta con Daniel Montaño.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Locales Comerciales y Galpones — Inmobiliaria Montaño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Locales Comerciales y Galpones en San José — Inmobiliaria Montaño',
    description:
      'Inmuebles comerciales, locales y naves industriales en San José con Daniel Montaño.',
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
    question: '¿Qué garantías se solicitan para el alquiler de un local comercial o galpón en San José?',
    answer:
      'Aceptamos pólizas de seguro de alquiler comercial (Porto Seguro, Sura, Mapfre), garantías de ANDA para personas físicas/empresas unipersonales, garantías de fianza o depósito bancario según el acuerdo con el propietario.',
  },
  {
    question: '¿Cuál es el plazo habitual de los contratos de arrendamiento comercial?',
    answer:
      'Los contratos comerciales en Uruguay se pactan habitualmente entre 2 y 5 años con opción a prórroga, permitiendo a la empresa o comercio amortizar sus mejoras y consolidar su punto de venta.',
  },
  {
    question: '¿Los galpones e inmuebles industriales cuentan con trifásica y accesos para camiones pesados?',
    answer:
      'En nuestras fichas técnicas detallamos la potencia eléctrica disponible (monofásica / trifásica industrial de UTE), altura libre al techo, portones basculantes o corredizos, y piso de hormigón apto para autoelevadores.',
  },
  {
    question: '¿Se pueden realizar adaptaciones edilicias o colocar cartelería en la fachada?',
    answer:
      'Sí, se deja estipulado en el contrato el permiso para adecuaciones de marca, vidrieras y división de ambientes con la debida autorización de la Intendencia de San José.',
  },
  {
    question: '¿Cómo publico mi local o nave logística con Inmobiliaria Montaño?',
    answer:
      'Contactanos por WhatsApp al 092 776 715 para coordinar una visita técnica y conectar tu inmueble con nuestra cartera activa de empresas y comerciantes en búsqueda.',
  },
];

export default async function LocalesGalponesPage() {
  const allProperties = await getCachedProperties();
  
  // Filtrar locales y galpones
  const commercialProperties = allProperties.filter(
    (p) => p.category === 'local' || p.category === 'deposito'
  );

  const contactWhatsappUrl = buildGeneralWhatsAppLink('general');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* 0. Schema JSON-LD */}
      <LocalesGalponesJsonLd properties={commercialProperties} faqs={FAQS} />

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
              <span className="text-amber-300 font-bold">Locales & Galpones</span>
            </nav>

            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="inline-flex items-center space-x-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>San José de Mayo • Comercio & Logística</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Locales Comerciales & <span className="text-amber-300">Galpones</span>
              </h1>

              <p className="text-slate-200 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
                Ubicaciones clave para tu negocio en el Centro de San José de Mayo y depósitos logísticos sobre Ruta 3 y Ruta 11. Alquiler y venta con <strong>Daniel Montaño</strong>.
              </p>
            </div>

            {/* Badges de Confianza Unificados */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-3xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Alto Tránsito</h4>
                  <p className="text-[11px] text-purple-200">Puntos céntricos y vidrieras</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Accesos Logísticos</h4>
                  <p className="text-[11px] text-purple-200">Ruta 3 y corredores de carga</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Contratos Claros</h4>
                  <p className="text-[11px] text-purple-200">Garantías comerciales</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Catálogo de Inmuebles Comerciales */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                <span>Locales y Galpones Disponibles</span>
                <span className="bg-[#5E1754]/10 text-[#5E1754] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {commercialProperties.length} disponibles
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Inmuebles comerciales, oficinas y depósitos en San José.
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

          {commercialProperties.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 space-y-3">
              <Warehouse className="w-12 h-12 text-purple-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No hay locales o depósitos publicados en este momento
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tenemos ingresos periódicos de locales céntricos y naves industriales. Escribinos a WhatsApp con el metraje y zona que necesita tu empresa.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {commercialProperties.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* 4. Claves para Elegir un Inmueble Comercial */}
        <section className="bg-white border-y border-slate-200/80 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Asesoramiento Comercial</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Criterios Clave para tu Espacio Comercial o Logístico
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Optimización de ubicación, capacidad operativa y costos fijos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Exposición y Peatonalidad</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Para comercios minoristas, farmacias y gastronomía, el flujo peatonal del <strong>Centro de San José</strong> asegura visibilidad inmediata.
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Maniobra y Carga Pesada</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Para distribuidoras y logística, naves con playas de maniobra y salida rápida a <strong>Ruta 3 y Ruta 11</strong> optimizan tus tiempos de entrega.
                </p>
              </div>

              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#5E1754]/30 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Seguridad Jurídica y Plazos</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Contratos comerciales redactados por escribanía con cláusulas claras de ajuste, mantenimiento e inventario para proyectar tu actividad con estabilidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Preguntas Frecuentes */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <FaqAccordion
            items={FAQS}
            title="Preguntas Frecuentes sobre Inmuebles Comerciales"
            subtitle="Respuestas claras a las consultas habituales de empresas y comerciantes."
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
                  ¿Tenés un local o galpón para ofrecer?
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Consultá con Daniel Montaño
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 max-w-lg font-normal">
                  Conectamos tu inmueble comercial con inquilinos o compradores calificados de San José y todo el país.
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
              <span>Contactar por WhatsApp</span>
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
