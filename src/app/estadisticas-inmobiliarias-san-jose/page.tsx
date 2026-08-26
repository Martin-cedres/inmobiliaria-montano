import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { DepartmentInterlinking } from '@/components/seo/DepartmentInterlinking';
import { getAllProperties } from '@/lib/propertiesStore';
import { generateObservatoryReport } from '@/utils/marketObservatory';
import { buildGeneralWhatsAppLink } from '@/utils/whatsapp';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  PhoneCall,
  Info,
  Scale,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/estadisticas-inmobiliarias-san-jose`;

export const revalidate = 86400; // 24 horas

export const metadata: Metadata = {
  title: 'Observatorio Inmobiliario de San José | Inmobiliaria Montaño',
  description:
    'Estadísticas y métricas de precios, medianas y valores por m² derivadas exclusivamente del inventario verificado de Inmobiliaria Montaño en San José, Uruguay. Transparencia y rigor metodológico con Daniel Montaño.',
  keywords: [
    'estadisticas inmobiliarias san jose',
    'precios de casas san jose uruguay',
    'precio metro cuadrado san jose de mayo',
    'tasaciones y valores san jose inmobiliaria',
    'informe inmobiliario san jose uruguay',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Observatorio Inmobiliario de San José — Inmobiliaria Montaño',
    description:
      'Métricas reales de precios y valores por m² del inventario verificado en San José, Uruguay.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Observatorio Inmobiliario de San José — Inmobiliaria Montaño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Observatorio Inmobiliario de San José — Inmobiliaria Montaño',
    description:
      'Métricas de precios y valores por m² del inventario verificado en San José.',
    images: [`${BASE_URL}/og-logo.png`],
  },
};

export default async function EstadisticasInmobiliariasPage() {
  const allProperties = await getAllProperties();
  const report = generateObservatoryReport(allProperties);

  const formattedDate = report.lastUpdatedDate.toLocaleDateString('es-UY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const whatsappUrl = buildGeneralWhatsAppLink('tasacion');

  // Schema.org Dataset
  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        '@id': `${PAGE_URL}#dataset`,
        name: 'Observatorio del Inventario Inmobiliario — Inmobiliaria Montaño',
        description:
          'Estadísticas y métricas de precios y superficies del inventario público verificado de Inmobiliaria Montaño en el Departamento de San José, Uruguay.',
        url: PAGE_URL,
        dateModified: report.lastUpdatedDate.toISOString(),
        creator: { '@id': `${BASE_URL}/#agent` },
        spatialCoverage: {
          '@type': 'Place',
          name: 'Departamento de San José, Uruguay',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: -34.3375,
            longitude: -56.7136,
          },
        },
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

      {/* Hero del Observatorio */}
      <section className="bg-gradient-to-br from-[#191024] via-[#2A0E35] to-[#120B1A] text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center sm:text-left">
          
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-400 border border-white/15">
            <BarChart3 className="w-4 h-4 text-[#E85D04]" />
            <span>Observatorio del Inventario Inmobiliario</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Métricas y Valores del <span className="text-[#E85D04]">Inventario en San José</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Reporte estadístico basado exclusivamente en la cartera pública y verificada de Inmobiliaria Montaño. Datos reales, muestras transparentes y sin extrapolaciones artificiales.
            </p>
          </div>

          {/* Fecha de corte visible */}
          <div className="inline-flex items-center space-x-2 bg-purple-950/60 px-4 py-2 rounded-xl text-xs text-purple-200 border border-purple-800/60">
            <Calendar className="w-3.5 h-3.5 text-[#E85D04]" />
            <span>Datos actualizados al <strong>{formattedDate}</strong></span>
          </div>

        </div>
      </section>

      {/* Descargo Metodológico Obligatorio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 w-full">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-purple-200 shadow-md flex items-start space-x-4">
          <Info className="w-5 h-5 text-[#5E1754] flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p className="font-bold text-slate-900">
              Nota Metodológica y Rigor Estadístico
            </p>
            <p>
              La información refleja exclusivamente el inventario público verificado de Inmobiliaria Montaño disponible en la fecha indicada. No constituye una tasación ni representa necesariamente el valor de mercado de todas las propiedades del departamento. Toda métrica requiere una muestra mínima de <strong>N ≥ 3</strong> para calcular medianas y promedios.
            </p>
          </div>
        </div>
      </div>

      {/* Resumen de Muestra y Certezas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-12">
        
        {/* KPIs Generales de la Cartera */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Muestra Total Auditada
            </span>
            <div className="text-3xl font-black text-[#5E1754]">
              {report.totalPublicPropertiesAudited} <span className="text-base font-normal text-slate-500">inmuebles</span>
            </div>
            <p className="text-xs text-slate-500">
              Propiedades públicas activas, reservadas y concluidas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Certeza Notarial (Títulos al Día)
            </span>
            <div className="text-3xl font-black text-[#5E1754]">
              {report.overallDocumentationSummary.titlesUpToDateCount} de {report.overallDocumentationSummary.explicitlyCheckedForTitles}
            </div>
            <p className="text-xs text-slate-500">
              Inmuebles con verificación documental explícita completada.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Aptitud para Crédito Bancario
            </span>
            <div className="text-3xl font-black text-[#5E1754]">
              {report.overallDocumentationSummary.bankEligibleCount} de {report.overallDocumentationSummary.explicitlyCheckedForBank}
            </div>
            <p className="text-xs text-slate-500">
              Propiedades aptas para préstamo hipotecario bancario.
            </p>
          </div>
        </div>

        {/* Desglose por Segmentos de Mercado */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#5E1754]">
              Métricas por Localidad, Categoría y Operación
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Agrupación rigurosa sin mezclar monedas (USD / UYU).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.groups.map((g, idx) => {
              const groupTitle = `${g.category.toUpperCase()} en ${g.operation.toUpperCase()} — ${g.location}`;

              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black uppercase text-[#E85D04] bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-100">
                        {g.currency}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Muestra: <strong>N = {g.sampleSize}</strong>
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900">
                      {groupTitle}
                    </h3>

                    {/* Caso A: Muestra suficiente (N >= 3) */}
                    {g.isStatisticallySufficient && g.priceStats ? (
                      <div className="space-y-4 pt-2">
                        {/* Mediana (Principal) y Promedio (Complementario) */}
                        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                          <div>
                            <span className="block text-[11px] font-bold text-slate-500 uppercase">
                              Precio Mediana ★
                            </span>
                            <span className="text-lg font-black text-[#5E1754]">
                              {g.currency} {g.priceStats.median.toLocaleString('es-UY')}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[11px] font-bold text-slate-500 uppercase">
                              Precio Promedio
                            </span>
                            <span className="text-base font-bold text-slate-700">
                              {g.currency} {g.priceStats.average.toLocaleString('es-UY')}
                            </span>
                          </div>
                        </div>

                        {/* Rango de Precios */}
                        <div className="text-xs text-slate-600 flex items-center justify-between px-2">
                          <span>Mín: <strong>{g.currency} {g.priceStats.min.toLocaleString('es-UY')}</strong></span>
                          <span>Máx: <strong>{g.currency} {g.priceStats.max.toLocaleString('es-UY')}</strong></span>
                        </div>

                        {/* Precio por m² edificado si aplica */}
                        {g.pricePerM2BuiltStats && (
                          <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 text-xs space-y-1">
                            <div className="flex justify-between font-bold text-purple-950">
                              <span>Valor m² Edificado (Mediana):</span>
                              <span>{g.currency} {g.pricePerM2BuiltStats.median}/m²</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-purple-700">
                              <span>Promedio: {g.currency} {g.pricePerM2BuiltStats.average}/m²</span>
                              <span>Muestra válida: N = {g.pricePerM2BuiltStats.sampleCount}</span>
                            </div>
                          </div>
                        )}

                        {/* Precio por m² de terreno si aplica */}
                        {g.pricePerM2PlotStats && (
                          <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 text-xs space-y-1">
                            <div className="flex justify-between font-bold text-purple-950">
                              <span>Valor m² Solar (Mediana):</span>
                              <span>{g.currency} {g.pricePerM2PlotStats.median}/m²</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-purple-700">
                              <span>Promedio: {g.currency} {g.pricePerM2PlotStats.average}/m²</span>
                              <span>Muestra válida: N = {g.pricePerM2PlotStats.sampleCount}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Caso B: Muestra en consolidación (N < 3) */
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
                        <div className="flex items-center space-x-2 text-amber-700 font-bold">
                          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <span>Muestra en consolidación (N = {g.sampleSize})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Por protocolo de rigor estadístico, se requiere un mínimo de <strong>N ≥ 3</strong> propiedades en este segmento para calcular medianas y promedios oficiales.
                        </p>
                        {g.pricePerM2PlotStats && (
                          <p className="text-[11px] font-semibold text-slate-700 pt-1">
                            Dato individual registrado: {g.currency} {g.pricePerM2PlotStats.median}/m² (Solar, N = {g.pricePerM2PlotStats.sampleCount})
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Auditoría Documental del Grupo */}
                  {g.documentationAudit && (
                    <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5">
                      <div>Títulos al día verificados: <strong>{g.documentationAudit.titlesVerifiedCount}</strong></div>
                      <div>Aptas para crédito bancario: <strong>{g.documentationAudit.bankCreditEligibleCount}</strong></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA a Tasaciones Oficiales con Daniel Montaño */}
        <section className="bg-gradient-to-br from-[#191024] to-[#2E1235] text-white rounded-3xl p-8 sm:p-10 border border-purple-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Tasaciones Profesionales
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              ¿Querés conocer el valor real de mercado de tu propiedad?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Daniel Montaño realiza tasaciones presenciales fundamentadas mediante Análisis Comparativo de Mercado (ACM) en todo el departamento de San José.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white text-xs sm:text-sm font-black px-7 py-4 rounded-2xl shadow-lg transition-all flex-shrink-0 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-white" />
            <span>Solicitar Tasación Oficial</span>
          </a>
        </section>

        {/* Interlinking Departamental */}
        <DepartmentInterlinking currentPath={PAGE_URL} />

      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
