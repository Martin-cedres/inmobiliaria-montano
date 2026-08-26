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
  TrendingUp,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  PhoneCall,
  Info,
  CheckCircle2,
  Home,
  DollarSign,
  LandPlot,
  FileCheck,
  Sparkles,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/estadisticas-inmobiliarias-san-jose`;

export const revalidate = 86400; // 24 horas

export const metadata: Metadata = {
  title: 'Precios y Valores Inmobiliarios en San José | Inmobiliaria Montaño',
  description:
    'Conocé los valores reales de casas, terrenos y alquileres en San José de Mayo y localidades del departamento. Guía de precios y tasaciones con Daniel Montaño.',
  keywords: [
    'cuanto sale una casa en san jose uruguay',
    'precios de casas san jose de mayo',
    'precio alquileres san jose de mayo',
    'cuanto cuesta el metro cuadrado en san jose',
    'tasacion de propiedades san jose inmobiliaria',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Guía de Precios y Valores Inmobiliarios en San José — Inmobiliaria Montaño',
    description:
      'Valores de referencia y precios reales de casas, apartamentos y terrenos en el departamento de San José.',
    url: PAGE_URL,
    siteName: 'Inmobiliaria Montaño',
    locale: 'es_UY',
    type: 'website',
  },
};

export default async function EstadisticasInmobiliariasPage() {
  const allProperties = await getAllProperties();
  const report = generateObservatoryReport(allProperties);

  const formattedDate = report.lastUpdatedDate.toLocaleDateString('es-UY', {
    month: 'long',
    year: 'numeric',
  });

  const whatsappUrl = buildGeneralWhatsAppLink('tasacion');

  // Schema.org Dataset (mantiene valor SEO técnico sin molestar al usuario)
  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        '@id': `${PAGE_URL}#dataset`,
        name: 'Valores y Estadísticas Inmobiliarias de San José — Inmobiliaria Montaño',
        description:
          'Precios y valores de referencia del inventario verificado en San José, Uruguay.',
        url: PAGE_URL,
        dateModified: report.lastUpdatedDate.toISOString(),
        creator: { '@id': `${BASE_URL}/#agent` },
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

      {/* Hero Cálido y Comprensible */}
      <section className="bg-gradient-to-br from-[#191024] via-[#2A0E35] to-[#120B1A] text-white py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
          
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-400 border border-white/15">
            <Sparkles className="w-4 h-4 text-[#E85D04]" />
            <span>Guía de Valores de Mercado</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            ¿Cuánto vale una propiedad en <span className="text-[#E85D04]">San José</span>?
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Te mostramos precios de referencia reales para comprar, vender o alquilar en San José de Mayo y localidades vecinas, basados en propiedades verificadas con títulos al día.
          </p>

          <div className="pt-2 text-xs text-purple-200 flex items-center justify-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-[#E85D04]" />
            <span>Valores de referencia actualizados a <strong>{formattedDate}</strong></span>
          </div>

        </div>
      </section>

      {/* Contenido Principal Orientado a la Persona */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-10">
        
        {/* 3 Pilares de Confianza */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5E1754] flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-[#5E1754]" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Títulos Verificados</h3>
            <p className="text-xs text-slate-500">
              Analizamos la documentación notarial de cada inmueble antes de publicarlo.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#E85D04] flex items-center justify-center font-bold">
              <Home className="w-4 h-4 text-[#E85D04]" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Aptas para Banco</h3>
            <p className="text-xs text-slate-500">
              Opciones aptas para gestionar crédito hipotecario con bancos o el BHU.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4 text-blue-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Precios Reales</h3>
            <p className="text-xs text-slate-500">
              Valores acordes al mercado local, sin sobreprecios irreales.
            </p>
          </div>
        </div>

        {/* Sección: Valores de Referencia por Tipo de Inmueble */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Valores de Referencia en San José
            </h2>
            <p className="text-xs text-slate-500">
              Precios representativos según la categoría de propiedad y la localidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Tarjeta 1: Casas en Venta */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5E1754] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    🏡 Venta de Casas
                  </span>
                  <span className="text-xs text-slate-400 font-medium">San José de Mayo</span>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Valor típico de referencia:</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#5E1754]">
                    USD 88.000
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Rango frecuente: <strong>USD 88.000 a USD 98.000</strong> (Casas residenciales de 2 a 3 dormitorios).
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Opciones con patio, garage y títulos al día</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    El valor final varía según la zona (Centro, Molino, Arriaga) y el estado de conservación.
                  </p>
                </div>
              </div>

              <Link
                href="/casas-en-venta-san-jose-de-mayo"
                className="text-xs font-bold text-[#5E1754] hover:text-[#7A1E6E] flex items-center justify-between pt-3 border-t border-slate-100"
              >
                <span>Ver casas disponibles en venta →</span>
              </Link>
            </div>

            {/* Tarjeta 2: Alquileres */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                    🏢 Alquileres Residenciales
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Zona Centro</span>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Alquiler mensual de referencia:</div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-950">
                    $ 16.500 <span className="text-xs font-normal text-slate-500">/ mes</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Apartamentos céntricos de 1 a 2 dormitorios próximos a plazas y servicios.
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Garantías de aseguradoras (Porto, ANDA, Contaduría)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Contratos claros y administración transparente con Daniel Montaño.
                  </p>
                </div>
              </div>

              <Link
                href="/alquileres-san-jose-de-mayo"
                className="text-xs font-bold text-indigo-900 hover:text-indigo-700 flex items-center justify-between pt-3 border-t border-slate-100"
              >
                <span>Ver opciones en alquiler →</span>
              </Link>
            </div>

            {/* Tarjeta 3: Terrenos y Chacras */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    🌳 Terrenos y Chacras
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Libertad & Eje Rutas 1 y 3</span>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Solares y terrenos desde:</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-900">
                    USD 24.500
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Fracciones residenciales y suburbanas con excelente conectividad.
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Servicios en puerta y padrones individuales</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Ideal para construcción de vivienda propia o inversión a mediano plazo.
                  </p>
                </div>
              </div>

              <Link
                href="/terrenos-y-chacras-san-jose"
                className="text-xs font-bold text-emerald-900 hover:text-emerald-700 flex items-center justify-between pt-3 border-t border-slate-100"
              >
                <span>Ver terrenos y chacras →</span>
              </Link>
            </div>

            {/* Tarjeta 4: Casas Aptas para Crédito */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-800 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    🏦 Aptas Crédito Bancario
                  </span>
                  <span className="text-xs text-slate-400 font-medium">BHU y Bancos Privados</span>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Rango de casas financiables:</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#E85D04]">
                    USD 88.000 – 98.000
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Propiedades con planos registrados, BPS al día y sin embargos.
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Acompañamiento notarial en todo el proceso</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Te ayudamos a evaluar la documentación antes de iniciar tu solicitud bancaria.
                  </p>
                </div>
              </div>

              <Link
                href="/casas-aptas-para-banco-san-jose"
                className="text-xs font-bold text-[#E85D04] hover:text-orange-700 flex items-center justify-between pt-3 border-t border-slate-100"
              >
                <span>Ver casas aptas para banco →</span>
              </Link>
            </div>

          </div>
        </section>

        {/* Banner Comercial de Asesoramiento y Tasación Directa */}
        <section className="bg-gradient-to-br from-[#191024] to-[#2E1235] text-white rounded-3xl p-8 sm:p-10 border border-purple-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Asesoría & Tasaciones
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              ¿Querés tasar tu propiedad o saber a cuánto podés venderla?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Daniel Montaño analiza tu inmueble en persona y te brinda una estimación honesta y fundamentada según el mercado actual de San José.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-[#E85D04] hover:bg-[#FF8500] active:scale-95 text-white text-xs sm:text-sm font-black px-7 py-4 rounded-2xl shadow-lg transition-all flex-shrink-0 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-white" />
            <span>Consultar con Daniel al 092 776 715</span>
          </a>
        </section>

        {/* Enlaces Departamentales */}
        <DepartmentInterlinking currentPath={PAGE_URL} />

      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
