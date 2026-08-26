import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PropertyCard } from '@/components/PropertyCard';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { DepartmentInterlinking } from '@/components/seo/DepartmentInterlinking';
import { LevelBLandingEvaluation } from '@/data/levelBLandings';
import { Property } from '@/types/property';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import {
  Building,
  MapPin,
  ShieldCheck,
  Compass,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Home as HomeIcon,
  ChevronRight,
} from 'lucide-react';

interface LevelBLandingTemplateProps {
  evaluation: LevelBLandingEvaluation;
  fallbackProperties: Property[];
}

export function LevelBLandingTemplate({
  evaluation,
  fallbackProperties,
}: LevelBLandingTemplateProps) {
  const { landing, isIndexable, count, matchedProperties } = evaluation;
  const whatsappUrl = buildGeneralWhatsAppLink('general');

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
  const pageUrl = `${BASE_URL}${landing.path}`;

  // Schema.org BreadcrumbList + WebPage
  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: landing.title,
        description: landing.seoDescription,
        isPartOf: { '@id': `${BASE_URL}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumbs`,
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
            name: 'Propiedades en San José',
            item: `${BASE_URL}/propiedades-san-jose`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: landing.shortTitle,
            item: pageUrl,
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#5E1754] transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/propiedades-san-jose" className="hover:text-[#5E1754] transition-colors">
            San José
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#5E1754] font-bold">{landing.shortTitle}</span>
        </div>
      </nav>

      {/* Hero Editorial */}
      <section className="relative bg-gradient-to-br from-[#191024] via-[#2A0E35] to-[#120B1A] text-white py-12 sm:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 text-center sm:text-left">
          
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-extrabold text-orange-400">
            <Compass className="w-3.5 h-3.5 text-[#E85D04]" />
            <span>{landing.editorialContent.badgeText}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {landing.editorialContent.headline}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
                {landing.editorialContent.subheadline}
              </p>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-left space-y-2">
              <div className="flex items-center space-x-2 text-orange-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#E85D04]" />
                <span>Asesoramiento Personalizado</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Consultá disponibilidad y opciones con Daniel Montaño al <strong>092 776 715</strong>.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Aviso de Transición si N < 2 */}
      {!isIndexable && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start space-x-3 text-amber-900 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">
                Inventario en Actualización en esta Localidad ({count} inmueble disponible)
              </p>
              <p className="text-amber-800 text-xs font-normal">
                Para garantizar la máxima calidad de información, mostramos las opciones disponibles y sugerencias en zonas afines del Departamento de San José.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Catálogo de Inmuebles */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-12">
        
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#5E1754]">
              {isIndexable
                ? `Inmuebles Disponibles (${count})`
                : count > 0
                ? `Inmuebles en ${landing.targetCity || 'San José'}`
                : 'Opciones Sugeridas en San José'}
            </h2>
            <Link
              href="/propiedades-san-jose"
              className="text-xs font-bold text-[#5E1754] hover:text-[#E85D04] transition-colors inline-flex items-center space-x-1"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grilla */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(matchedProperties.length > 0 ? matchedProperties : fallbackProperties.slice(0, 3)).map(
              (prop) => (
                <PropertyCard key={prop.id} property={prop} />
              )
            )}
          </div>
        </div>

        {/* Contenido Editorial Diferenciado */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-xs space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#E85D04]">
              Análisis del Mercado Local
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#5E1754]">
              Contexto y Oportunidades en {landing.targetCity || 'San José'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
              <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#E85D04]" />
                <span>Ubicación y Entorno</span>
              </h4>
              <p>{landing.editorialContent.locationContext}</p>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
              <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                <Building className="w-4 h-4 text-[#5E1754]" />
                <span>Demanda y Dinámica</span>
              </h4>
              <p>{landing.editorialContent.marketAnalysis}</p>
            </div>
          </div>

          <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-100 text-xs sm:text-sm text-purple-950 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-[#5E1754] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold">Garantía Inmobiliaria Montaño</h4>
              <p>{landing.editorialContent.adviceForBuyers}</p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        {landing.faqs.length > 0 && (
          <section className="max-w-4xl mx-auto w-full space-y-6 text-left">
            <h3 className="text-lg sm:text-xl font-black text-[#5E1754] text-center">
              Preguntas Frecuentes
            </h3>
            <FaqAccordion items={landing.faqs} />
          </section>
        )}

        {/* Interlinking Semántico Contextual */}
        <DepartmentInterlinking currentPath={landing.path} />

      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
