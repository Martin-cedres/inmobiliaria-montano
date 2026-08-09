import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MOCK_PROPERTIES } from '@/data/mockProperties';
import { generatePropertyMetadata, generatePropertyJsonLd } from '@/utils/seo';
import { buildPropertyWhatsAppLink } from '@/utils/whatsapp';
import { MapPin, Bed, Bath, Maximize2, Car, Building, CheckCircle2, MessageCircle, ArrowLeft, ShieldCheck, Share2 } from 'lucide-react';
import { PropertyMapWrapper } from '@/components/PropertyMapWrapper';
import { SharePropertyModal } from '@/components/SharePropertyModal';

interface PropertyDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generación automática de Metadata SEO para Google y Redes Sociales
export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const resolvedParams = await params;
  const property = MOCK_PROPERTIES.find((p) => p.slug === resolvedParams.slug);
  if (!property) return {};
  return generatePropertyMetadata(property);
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const resolvedParams = await params;
  const property = MOCK_PROPERTIES.find((p) => p.slug === resolvedParams.slug);

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
            
            {/* Main Image Frame */}
            <div className="relative h-80 sm:h-96 lg:h-[480px] bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-purple-100">
              <img
                src={mainImage?.webpUrl || mainImage?.blobUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-[#E85D04] text-white text-xs font-black uppercase px-3.5 py-1.5 rounded-full shadow">
                  {property.operation === 'alquiler' ? 'Alquiler' : property.operation === 'proyecto' ? 'Proyecto' : 'En Venta'}
                </span>
                <span className="bg-[#350A2F]/90 text-amber-300 text-xs font-bold uppercase px-3 py-1.5 rounded-full border border-amber-400/30">
                  Ref. #{property.codeRef}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <SharePropertyModal property={property} variant="icon" />
              </div>
            </div>

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
                  {property.price.currency} ${property.price.amount.toLocaleString()}
                </span>
                {property.price.period && (
                  <span className="text-sm font-semibold text-slate-500">/{property.price.period}</span>
                )}
              </div>
            </div>

            {/* Exact Human Description Written by User */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-4 text-left">
              <h3 className="text-lg font-black text-[#5E1754]">Descripción de la Propiedad</h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Interactive Map Section */}
            {property.location.coordinates && (
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
                  lat={property.location.coordinates.lat}
                  lng={property.location.coordinates.lng}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                {property.features.bedrooms !== undefined && (
                  <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded-2xl text-xs font-bold text-slate-800">
                    <Bed className="w-5 h-5 text-[#5E1754]" />
                    <span>{property.features.bedrooms} Dormitorios</span>
                  </div>
                )}
                {property.features.bathrooms !== undefined && (
                  <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded-2xl text-xs font-bold text-slate-800">
                    <Bath className="w-5 h-5 text-[#5E1754]" />
                    <span>{property.features.bathrooms} Baño/s</span>
                  </div>
                )}
                {property.features.builtAreaM2 !== undefined && (
                  <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded-2xl text-xs font-bold text-slate-800">
                    <Maximize2 className="w-5 h-5 text-[#E85D04]" />
                    <span>{property.features.builtAreaM2} m² Construidos</span>
                  </div>
                )}
                {property.features.garage && (
                  <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded-2xl text-xs font-bold text-slate-800">
                    <Car className="w-5 h-5 text-[#5E1754]" />
                    <span>Garage / Cochera</span>
                  </div>
                )}
                {property.features.bankCreditEligible && (
                  <div className="flex items-center space-x-2 bg-amber-50 p-3 rounded-2xl text-xs font-bold text-amber-900 border border-amber-200">
                    <span>🏛️ Apta Crédito Bancario</span>
                  </div>
                )}
                {property.features.oseWater && (
                  <div className="flex items-center space-x-2 bg-sky-50 p-3 rounded-2xl text-xs font-bold text-sky-900 border border-sky-200">
                    <span>💧 Agua Potable de OSE</span>
                  </div>
                )}
              </div>

              {property.guarantees && property.guarantees.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Garantías de Alquiler Aceptadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.guarantees.map((g) => (
                      <span key={g} className="bg-emerald-100 text-emerald-900 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-emerald-200">
                        🛡️ {g}
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
