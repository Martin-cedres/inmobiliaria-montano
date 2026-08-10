import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getAllProperties } from '@/lib/propertiesStore';
import { generatePropertyMetadata, generatePropertyJsonLd } from '@/utils/seo';
import { buildPropertyWhatsAppLink } from '@/utils/whatsapp';
import { MapPin, Bed, Bath, Maximize2, Car, Building, CheckCircle2, MessageCircle, ArrowLeft, ShieldCheck, Share2, Compass, Trees, Droplets, FileCheck, Landmark, ArrowLeftRight, Wifi } from 'lucide-react';
import { PropertyMapWrapper } from '@/components/PropertyMapWrapper';
import { SharePropertyModal } from '@/components/SharePropertyModal';
import { PropertyGallery } from '@/components/PropertyGallery';

interface PropertyDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generación automática de Metadata SEO para Google y Redes Sociales
export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const resolvedParams = await params;
  const allProperties = await getAllProperties();
  const property = allProperties.find((p) => p.slug === resolvedParams.slug);
  if (!property) return {};
  return generatePropertyMetadata(property);
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const resolvedParams = await params;
  const allProperties = await getAllProperties();
  const property = allProperties.find((p) => p.slug === resolvedParams.slug);

  if (!property) {
    notFound();
  }

  const jsonLd = generatePropertyJsonLd(property);
  const whatsappUrl = buildPropertyWhatsAppLink(property);
  const mainImage = property.images.find((img) => img.isMain) || property.images[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Inyección Automática de Schema.org JSON-LD para Google Search Console */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#5E1754] hover:text-[#E85D04] transition-colors bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo</span>
          </Link>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Gallery & Description */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Interactive Image Gallery */}
            <PropertyGallery property={property} />

            {/* Title & Location Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-4 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#E85D04]">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location.neighborhood}, {property.location.city}, {property.location.department}</span>
                </div>
                <SharePropertyModal property={property} variant="button" />
              </div>

              {/* Exact Human Title Written by User */}
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                {property.title}
              </h1>

              {/* Price & Operation Status */}
              <div className="flex items-baseline space-x-2 pt-2 border-t border-slate-100">
                <span className="text-3xl sm:text-4xl font-black text-[#5E1754]">
                  {property.price.currency === 'USD' ? 'USD' : 'UYU $'} {property.price.amount.toLocaleString('es-UY')}
                  {property.operation === 'alquiler' && property.price.period && property.price.period !== 'total' && (
                    <span className="text-sm font-semibold text-slate-500"> / {property.price.period}</span>
                  )}
                </span>
              </div>
            </div>

            {/* Exact Human Description Written by User */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-4 text-left">
              <h3 className="text-lg font-black text-[#5E1754]">Descripción de la Propiedad</h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Interactive Map Section (Opcional - Oculto si hasLocation es false) */}
            {property.location.hasLocation !== false && property.location.coordinates && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#5E1754] flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-[#E85D04]" />
                    <span>Ubicación & Entorno</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold bg-purple-50 text-[#5E1754] px-3 py-1 rounded-full border border-purple-200">
                    San José de Mayo
                  </span>
                </div>

                <PropertyMapWrapper
                  lat={property.location.coordinates?.lat ?? (property.location as any).lat ?? -34.3375}
                  lng={property.location.coordinates?.lng ?? (property.location as any).lng ?? -56.7136}
                  title={property.title}
                  neighborhood={property.location.neighborhood}
                  isExactLocation={property.location.isExactLocation}
                  radiusMeters={property.location.radiusMeters}
                />
              </div>
            )}

            {/* Quantitative Features & Badges */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-4 text-left">
              <h3 className="text-lg font-black text-[#5E1754]">Características & Comodidades</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {!!property.features.bedrooms && property.features.bedrooms > 0 && (
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Bed className="w-5 h-5" />
                    </span>
                    <span>{property.features.bedrooms} Dormitorios</span>
                  </div>
                )}
                {!!property.features.bathrooms && property.features.bathrooms > 0 && (
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Bath className="w-5 h-5" />
                    </span>
                    <span>{property.features.bathrooms} Baño/s</span>
                  </div>
                )}
                {!!property.features.builtAreaM2 && property.features.builtAreaM2 > 0 && (
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Building className="w-5 h-5" />
                    </span>
                    <span>{property.features.builtAreaM2} m² Construidos</span>
                  </div>
                )}
                {!!property.features.plotAreaM2 && property.features.plotAreaM2 > 0 && (
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Maximize2 className="w-5 h-5" />
                    </span>
                    <span>{property.features.plotAreaM2} m² Terreno</span>
                  </div>
                )}
                {!!property.features.frontMeters && property.features.frontMeters > 0 && (
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Compass className="w-5 h-5" />
                    </span>
                    <span>{property.features.frontMeters}m de Frente</span>
                  </div>
                )}
                {!!property.features.coneatIndex && property.features.coneatIndex > 0 && (
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Trees className="w-5 h-5" />
                    </span>
                    <span>CONEAT {property.features.coneatIndex}</span>
                  </div>
                )}
                {property.features.waterWellOrPond && (
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Droplets className="w-5 h-5" />
                    </span>
                    <span>Pozo de Agua / Tajamar</span>
                  </div>
                )}
                {property.features.titlesUpToDate && (
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </span>
                    <span>Títulos al Día</span>
                  </div>
                )}
                {property.features.bankCreditEligible && (
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Landmark className="w-5 h-5" />
                    </span>
                    <span>Apta Crédito Bancario</span>
                  </div>
                )}
                {property.features.acceptsTradeIn && (
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <ArrowLeftRight className="w-5 h-5" />
                    </span>
                    <span>Acepta Permuta</span>
                  </div>
                )}
                {property.features.fiberOptic && (
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Wifi className="w-5 h-5" />
                    </span>
                    <span>Fibra Óptica</span>
                  </div>
                )}
                {property.features.oseWater && (
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Droplets className="w-5 h-5" />
                    </span>
                    <span>Agua Potable de OSE</span>
                  </div>
                )}
              </div>

              {property.guarantees && property.guarantees.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3.5">
                    Garantías de Alquiler Aceptadas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {property.guarantees.map((g) => (
                      <span key={g} className="bg-slate-50 text-slate-800 font-extrabold text-xs px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-[#5E1754]" />
                        <span>Garantía {g}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Contact Card */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6 text-left">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E85D04]">Consulta Directa</span>
                <h3 className="text-xl font-black text-slate-900">¿Te interesa esta propiedad?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Comunicate directamente con **Inmobiliaria Montaño** para coordinar una visita o sacarte dudas.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center space-x-3 text-sm sm:text-base"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#E85D04]" />
                <span>Consultar por WhatsApp</span>
              </a>

              {/* Secondary Share Action */}
              <SharePropertyModal property={property} variant="sticky-bar" />

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-600">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Respuesta rápida y directa.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5E1754]" />
                  <span>Sin intermediarios ni demoras.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
