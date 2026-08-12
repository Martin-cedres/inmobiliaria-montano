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
import { PropertyCard } from '@/components/PropertyCard';

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

  // Obtener hasta 3 propiedades similares (misma categoría o misma operación)
  let similarProperties = allProperties.filter(
    (p) => p.id !== property.id && (p.category === property.category || p.operation === property.operation)
  );

  if (similarProperties.length < 3) {
    const remaining = allProperties.filter((p) => p.id !== property.id && !similarProperties.some((sp) => sp.id === p.id));
    similarProperties = [...similarProperties, ...remaining];
  }
  similarProperties = similarProperties.slice(0, 3);

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

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        
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
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#E85D04]">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location.neighborhood}, {property.location.city}, {property.location.department}</span>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80">
                    Ref. #{property.codeRef}
                  </span>
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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5 pt-2">
                {!!property.features.bedrooms && property.features.bedrooms > 0 && (
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Bed className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="truncate">{property.features.bedrooms} Dormitorios</span>
                  </div>
                )}
                {!!property.features.bathrooms && property.features.bathrooms > 0 && (
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Bath className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="truncate">{property.features.bathrooms} Baño/s</span>
                  </div>
                )}
                {!!property.features.builtAreaM2 && property.features.builtAreaM2 > 0 && (
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Building className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="truncate">{property.features.builtAreaM2} m² Edificados</span>
                  </div>
                )}
                {!!property.features.plotAreaM2 && property.features.plotAreaM2 > 0 && (
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="truncate">{property.features.plotAreaM2} m² Terreno</span>
                  </div>
                )}
                {!!property.features.frontMeters && property.features.frontMeters > 0 && (
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="truncate">{property.features.frontMeters}m de Frente</span>
                  </div>
                )}
                {!!property.features.coneatIndex && property.features.coneatIndex > 0 && (
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Trees className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="truncate">CONEAT {property.features.coneatIndex}</span>
                  </div>
                )}
                {property.features.waterWellOrPond && (
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="truncate">Pozo / Tajamar</span>
                  </div>
                )}
                {property.features.titlesUpToDate && (
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <FileCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="truncate">Títulos al Día</span>
                  </div>
                )}
                {property.features.bankCreditEligible && (
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="truncate">Apta Crédito</span>
                  </div>
                )}
                {property.features.acceptsTradeIn && (
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="truncate">Acepta Permuta</span>
                  </div>
                )}
                {property.features.fiberOptic && (
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Wifi className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="truncate">Fibra Óptica</span>
                  </div>
                )}
                {property.features.oseWater && (
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                    <span className="p-1.5 sm:p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] flex-shrink-0">
                      <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="truncate">Agua de OSE</span>
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

          {/* Right Column: Sticky Advisor Contact Card (Daniel Montaño) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-xl space-y-5 text-center">
              
              {/* Advisor Profile Header */}
              <div className="flex flex-col items-center space-y-3">
                {/* Circular Profile Photo with Orange Ring */}
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-[#E85D04]/20 border-2 border-[#E85D04] shadow-lg transition-transform duration-300 group-hover:scale-105 bg-slate-100">
                    <img
                      src="/daniel-montano.webp"
                      alt="Daniel Montaño — Director & Asesor Inmobiliario"
                      className="w-full h-full object-cover object-[center_28%] scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Pulsing Green Online Status Badge */}
                  <span className="absolute bottom-1 right-1.5 flex h-4.5 w-4.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-emerald-500 border-2 border-white shadow-sm"></span>
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">Daniel Montaño</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Director & Asesor Inmobiliario</p>
                </div>

                {/* Trust Badge - Violeta Soft Neutro */}
                <div className="inline-flex items-center bg-[#5E1754]/8 border border-[#5E1754]/15 text-[#5E1754] text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-2xs">
                  <span>Atención personalizada</span>
                </div>
              </div>

              {/* Primary CTA Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-black py-3.5 px-5 rounded-2xl shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center space-x-2.5 text-xs sm:text-sm group"
              >
                <svg className="w-5 h-5 fill-current text-white flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                </svg>
                <span className="truncate">Consultar a Daniel por WhatsApp</span>
              </a>

              {/* Secondary Backup Action: Share Property Button */}
              <div className="pt-5 mt-2 border-t border-slate-100 flex justify-center">
                <SharePropertyModal property={property} variant="button" />
              </div>

            </div>

          </div>

        </div>

        {/* Propiedades Similares / Recomendadas */}
        {similarProperties.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200/80 space-y-6 text-left">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E85D04]">Recomendados</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Otras propiedades que te pueden interesar</h3>
              </div>
              <Link
                href="/"
                className="text-xs font-bold text-[#5E1754] hover:text-[#E85D04] transition-colors"
              >
                Ver todo el catálogo →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((simProp) => (
                <PropertyCard key={simProp.id} property={simProp} />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Sticky Bottom CTA Bar for Mobile Screens (< 1024px / lg:hidden) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-2.5 sm:p-3 shadow-2xl flex items-center justify-between gap-2.5 animate-slideUp">
        <div className="flex items-center space-x-2.5 overflow-hidden text-left pl-1">
          <div className="w-10 h-10 rounded-full border-2 border-[#E85D04] overflow-hidden flex-shrink-0">
            <img
              src="/daniel-montano.webp"
              alt="Daniel Montaño"
              className="w-full h-full object-cover object-[center_28%] scale-105"
            />
          </div>
          <div className="overflow-hidden">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#E85D04]">
              Ref. #{property.codeRef}
            </span>
            <span className="block text-sm sm:text-base font-black text-[#5E1754] leading-tight truncate">
              {property.price.currency === 'USD' ? 'USD' : 'UYU $'} {property.price.amount.toLocaleString('es-UY')}
              {property.operation === 'alquiler' && property.price.period && property.price.period !== 'total' && (
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500"> / {property.price.period}</span>
              )}
            </span>
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white font-black text-xs py-2.5 px-3.5 sm:px-4 rounded-xl shadow-md flex items-center space-x-2 transition-all"
        >
          <svg className="w-4 h-4 fill-current text-white flex-shrink-0" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
          </svg>
          <span>Consultar por WhatsApp</span>
        </a>
      </div>

      <Footer />
    </div>
  );
}
