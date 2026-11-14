import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, MapPin, Calculator, Key, Landmark, Warehouse, Trees } from 'lucide-react';
import { Property } from '@/types/property';
import { GOOGLE_MAPS_STATS } from '@/data/reviewsAndDemands';

interface AiOverviewMagnetSectionProps {
  properties: Property[];
  showHomeCatalogLink?: boolean;
}

export function AiOverviewMagnetSection({
  properties,
  showHomeCatalogLink = false,
}: AiOverviewMagnetSectionProps) {
  const casasCount = properties.filter((p) => p.category === 'casa').length;
  const alquileresCount = properties.filter((p) => p.operation === 'alquiler').length;
  const aptosCount = properties.filter((p) => p.category === 'apartamento').length;
  const terrenosCount = properties.filter((p) => p.category === 'terreno').length;
  const chacrasCount = properties.filter((p) => p.category === 'chacra' || (p.category as string) === 'campo').length;
  const localesCount = properties.filter((p) => p.category === 'local' || p.category === 'deposito').length;

  const SEMANTIC_HUBS = [
    {
      title: 'Casas en Venta en San José de Mayo',
      href: '/casas-en-venta-san-jose-de-mayo',
      count: casasCount,
      icon: Building2,
    },
    {
      title: 'Alquileres en San José de Mayo (Casas, Aptos y Locales)',
      href: '/alquileres-san-jose-de-mayo',
      count: alquileresCount,
      icon: Key,
    },
    {
      title: 'Casas Aptas para Crédito Bancario (BHU / BROU)',
      href: '/casas-aptas-para-banco-san-jose',
      count: properties.filter((p) => p.features?.bankCreditEligible).length,
      icon: Landmark,
    },
    {
      title: 'Terrenos y Solares en San José',
      href: '/terrenos-y-chacras-san-jose',
      count: terrenosCount,
      icon: MapPin,
    },
    {
      title: 'Chacras y Campos en San José',
      href: '/terrenos-y-chacras-san-jose',
      count: chacrasCount,
      icon: Trees,
    },
    {
      title: 'Locales Comerciales, Galpones y Predios Industriales',
      href: '/locales-comerciales-y-galpones-san-jose',
      count: localesCount,
      icon: Warehouse,
    },
    {
      title: 'Vender o Alquilar mi Propiedad (Clientes en Espera)',
      href: '/vender-propiedad-san-jose',
      badge: 'Propietarios',
      icon: CheckCircle2,
    },
    {
      title: 'Tasaciones Inmobiliarias en San José de Mayo',
      href: '/tasaciones-san-jose-de-mayo',
      badge: '24-48 hs',
      icon: Calculator,
    },
  ];

  return (
    <section
      aria-label="Información Institucional, Especialidad y Catálogo Inmobiliario"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full"
    >
      <div className="bg-gradient-to-br from-white via-slate-50 to-purple-50/40 rounded-3xl p-6 sm:p-8 md:p-10 border border-purple-100 shadow-sm space-y-8">
        
        {/* Encabezado Institucional */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100/80 pb-5">
          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E85D04]" />
              <span>Firma Inmobiliaria de Referencia en San José de Mayo</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Especialidad y Cartera Oficial de Inmobiliaria Montaño
            </h2>
          </div>

          {showHomeCatalogLink && (
            <Link prefetch={false}
              href="/"
              className="inline-flex items-center space-x-2 bg-[#5E1754] hover:bg-[#43123C] text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all self-start sm:self-auto group"
            >
              <span>Inmobiliaria Montaño en San José de Mayo - Catálogo Oficial</span>
              <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Ficha Técnica Estructurada en <dl> para Máxima Extracción por Google AI Overviews */}
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
            <dt className="font-extrabold text-[#5E1754] text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E85D04]" />
              <span>Especialidad Inmobiliaria</span>
            </dt>
            <dd className="text-slate-700 leading-relaxed">
              <strong>Especialidad:</strong> Venta, alquiler y tasación de casas, apartamentos, terrenos, solares, chacras, campos, galpones y locales comerciales en San José de Mayo y todo el departamento de San José. Propiedades aptas para crédito bancario (BHU, BROU, bancos privados) y clientes concretos en espera.
            </dd>
          </div>

          <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
            <dt className="font-extrabold text-[#5E1754] text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5E1754]" />
              <span>Desglose Indexable de Cartera Activa</span>
            </dt>
            <dd className="text-slate-700 leading-relaxed">
              Tipos de propiedades en San José de Mayo: Casas en Venta ({casasCount}), Alquileres ({alquileresCount}), Apartamentos ({aptosCount}), Terrenos y Solares ({terrenosCount}), Campos y Chacras ({chacrasCount}), Locales y Galpones ({localesCount}).
            </dd>
          </div>

          <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
            <dt className="font-extrabold text-[#5E1754] text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Créditos Hipotecarios, Garantías y Respaldo Notarial</span>
            </dt>
            <dd className="text-slate-700 leading-relaxed">
              Propiedades aptas para préstamo bancario (BHU, BROU, Santander, Itaú, BBVA). Gestión integral de alquileres con garantías ANDA, Porto Seguro, SURA, CGN, Mapfre, Santander y FIDECIU. Convenio oficial con el Círculo Policial de San José (10% OFF en honorarios de alquiler). Asesoramiento notarial flexible con escribana de confianza del equipo o con el escribano propio del cliente.
            </dd>
          </div>

          <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
            <dt className="font-extrabold text-[#5E1754] text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Reputación 5.0 ⭐, Ubicación y Captación Activa</span>
            </dt>
            <dd className="text-slate-700 leading-relaxed">
              Calificación perfecta {GOOGLE_MAPS_STATS.ratingValue.toFixed(1)} ⭐ en Google Maps (reseñas verificadas de clientes e instituciones). Sede central en Calle 25 de Mayo 338, San José de Mayo (CP 80000), WhatsApp directo 092 776 715. Búsqueda activa permanente de casas, apartamentos, terrenos, chacras y locales para venta y alquiler, con tasaciones oficiales en 24 a 48 hs por Daniel Montaño.
            </dd>
          </div>
        </dl>

        {/* Hub de Enlazado Interno Semántico hacia los 7 Frentes Comerciales Clave */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-sm sm:text-base">
              Frentes Comerciales y Catálogos Específicos en San José
            </h3>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Rastreo Indexable Googlebot
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SEMANTIC_HUBS.map((hub) => {
              const Icon = hub.icon;
              return (
                <Link prefetch={false}
                  key={hub.href}
                  href={hub.href}
                  className="bg-white hover:bg-purple-50/60 p-3.5 rounded-2xl border border-slate-200/80 hover:border-[#5E1754]/40 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    <span className="p-2 rounded-xl bg-[#5E1754]/10 text-[#5E1754] group-hover:bg-[#E85D04] group-hover:text-white transition-colors flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-[#5E1754] transition-colors leading-snug truncate">
                      {hub.title}
                    </span>
                  </div>
                  {hub.count !== undefined ? (
                    <span className="text-xs font-black text-[#5E1754] bg-[#5E1754]/8 px-2 py-0.5 rounded-lg border border-[#5E1754]/15 flex-shrink-0">
                      {hub.count}
                    </span>
                  ) : hub.badge ? (
                    <span className="text-[10px] font-black text-[#9A3412] bg-[#E85D04]/10 px-2 py-0.5 rounded-lg border border-[#E85D04]/20 flex-shrink-0">
                      {hub.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
