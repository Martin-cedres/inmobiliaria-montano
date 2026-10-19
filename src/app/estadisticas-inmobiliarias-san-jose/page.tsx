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
  Building2,
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
  TreePine,
  Landmark,
  Activity,
  ArrowRight,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';
const PAGE_URL = `${BASE_URL}/estadisticas-inmobiliarias-san-jose`;

export const revalidate = 86400; // 24 horas

export const metadata: Metadata = {
  title: 'Precios y Valores Inmobiliarios en San José',
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
                  <span className="text-xs font-bold text-[#5E1754] bg-purple-50 px-3 py-1 rounded-full border border-purple-200 inline-flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-[#5E1754]" />
                    <span>Venta de Casas</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">San José de Mayo</span>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Valor típico de referencia:</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#5E1754] tabular-nums">
                    USD 88.000
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Rango frecuente: <strong className="tabular-nums">USD 88.000 a USD 98.000</strong> (Casas residenciales de 2 a 3 dormitorios).
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
                <span>Ver casas disponibles en venta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Tarjeta 2: Alquileres */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-900" />
                    <span>Alquileres Residenciales</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Zona Centro</span>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Alquiler mensual de referencia:</div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-950 tabular-nums">
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
                <span>Ver opciones en alquiler</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Tarjeta 3: Terrenos y Chacras */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                    <TreePine className="w-3.5 h-3.5 text-emerald-900" />
                    <span>Terrenos y Chacras</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Libertad & Eje Rutas 1 y 3</span>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Solares y terrenos desde:</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-900 tabular-nums">
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
                <span>Ver terrenos y chacras</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Tarjeta 4: Casas Aptas para Crédito */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-800 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-orange-800" />
                    <span>Aptas Crédito Bancario</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">BHU y Bancos Privados</span>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Rango de casas financiables:</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#E85D04] tabular-nums">
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
                <span>Ver casas aptas para banco</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </section>

        {/* Sección: Pulso de Mercado y Tendencia por Microzonas */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#5E1754] uppercase tracking-wider mb-1">
                <Activity className="w-3.5 h-3.5 text-[#E85D04]" />
                <span>Dinámica Territorial</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Tendencias del Mercado por Microzonas
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Valores periciales y demanda residencial
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Zona 1: Centro / Plazas */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-950 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#5E1754]" />
                    Centro / Plazas
                  </span>
                  <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                    Consolidado
                  </span>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Valor ref. m² edificado:</div>
                  <div className="text-xl font-black text-[#5E1754] tabular-nums">USD 890 / m²</div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Alta demanda continua para vivienda familiar, apartamentos próximos a servicios y locales comerciales.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                San José de Mayo
              </div>
            </div>

            {/* Zona 2: Barrio Molino / Arriaga */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    Molino / Arriaga
                  </span>
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Alta Rotación
                  </span>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Valor ref. m² edificado:</div>
                  <div className="text-xl font-black text-emerald-900 tabular-nums">USD 760 / m²</div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Preferencia máxima para crédito hipotecario (BHU/Bancos). Casas familiares con fondo verde y garaje.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                San José de Mayo
              </div>
            </div>

            {/* Zona 3: Parquización Arroyo Mallada */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-950 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Arroyo Mallada
                  </span>
                  <span className="text-[10px] font-black uppercase text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    Expansión
                  </span>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Valor ref. m² edificado:</div>
                  <div className="text-xl font-black text-blue-950 tabular-nums">USD 820 / m²</div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Desarrollo de proyectos a estrenar y solares residenciales con entorno parquizado y servicios al día.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                San José de Mayo
              </div>
            </div>

            {/* Zona 4: Eje Rutas / Libertad */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    Eje Rutas / Libertad
                  </span>
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    Inversión
                  </span>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Valor ref. solar suburbano:</div>
                  <div className="text-xl font-black text-amber-950 tabular-nums">USD 45 / m²</div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Solares suburbanos, chacras productivas y predios industriales/logísticos con conexión a Rutas 1, 3 y 11.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Interior Departamental
              </div>
            </div>
          </div>
        </section>

        {/* Sección: Tabla Comparativa Semántica por Barrios y Zonas */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Valores de Referencia y Demanda por Zona en San José
            </h2>
            <p className="text-xs text-slate-500">
              Desglose detallado del mercado inmobiliario por barrios de San José de Mayo y localidades clave del departamento.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th scope="col" className="p-3.5 sm:p-4">Zona / Barrio</th>
                  <th scope="col" className="p-3.5 sm:p-4">Tipología Predominante</th>
                  <th scope="col" className="p-3.5 sm:p-4">Perfil de Demanda</th>
                  <th scope="col" className="p-3.5 sm:p-4">Valores de Referencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <th scope="row" className="p-3.5 sm:p-4 font-bold text-slate-900 whitespace-nowrap">
                    Centro / Plaza 33 / Plaza Artigas
                    <span className="block text-[11px] font-normal text-slate-500">San José de Mayo</span>
                  </th>
                  <td className="p-3.5 sm:p-4">
                    Casas de 3 dormitorios, locales comerciales y apartamentos céntricos
                  </td>
                  <td className="p-3.5 sm:p-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-[#5E1754] border border-purple-200">
                      Alta demanda residencial y comercial
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 font-medium text-slate-900 tabular-nums">
                    <div>Casas: <strong className="tabular-nums">USD 95.000 – USD 250.000</strong></div>
                    <div className="text-[11px] text-slate-500 tabular-nums">Alquileres: <strong className="tabular-nums">$ 16.500 – $ 25.000 / mes</strong></div>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60 transition-colors">
                  <th scope="row" className="p-3.5 sm:p-4 font-bold text-slate-900 whitespace-nowrap">
                    Barrio Molino / Barrio Arriaga / Zona Hospital
                    <span className="block text-[11px] font-normal text-slate-500">San José de Mayo</span>
                  </th>
                  <td className="p-3.5 sm:p-4">
                    Casas familiares de 2 a 3 dormitorios con fondo y garaje, propiedades horizontales (PH)
                  </td>
                  <td className="p-3.5 sm:p-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Alta rotación y aptitud bancaria
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 font-medium text-slate-900 tabular-nums">
                    <div>Casas: <strong className="tabular-nums">USD 45.000 – USD 98.000</strong></div>
                    <div className="text-[11px] text-slate-500">Alta preferencia crédito BHU y bancos</div>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60 transition-colors">
                  <th scope="row" className="p-3.5 sm:p-4 font-bold text-slate-900 whitespace-nowrap">
                    Parquización de Arroyo Mallada
                    <span className="block text-[11px] font-normal text-slate-500">San José de Mayo</span>
                  </th>
                  <td className="p-3.5 sm:p-4">
                    Proyectos residenciales de 2 dormitorios a estrenar y terrenos amplios
                  </td>
                  <td className="p-3.5 sm:p-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                      Zona en expansión residencial
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 font-medium text-slate-900 tabular-nums">
                    <div>Casas a estrenar: <strong className="tabular-nums">USD 99.500</strong> ref.</div>
                    <div className="text-[11px] text-slate-500">Entorno verde y parquizado</div>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60 transition-colors">
                  <th scope="row" className="p-3.5 sm:p-4 font-bold text-slate-900 whitespace-nowrap">
                    Eje Rutas 1, 3 y 11 / Libertad / Cañada Grande / Juan Soler / Chamizo
                    <span className="block text-[11px] font-normal text-slate-500">Interior de San José</span>
                  </th>
                  <td className="p-3.5 sm:p-4">
                    Solares, chacras productivas y predios industriales/logísticos
                  </td>
                  <td className="p-3.5 sm:p-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      Inversión, logística y vivienda suburbana
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 font-medium text-slate-900 tabular-nums">
                    <div>Terrenos: desde <strong className="tabular-nums">USD 24.500</strong></div>
                    <div className="text-[11px] text-slate-500 tabular-nums">Predios industriales: desde <strong className="tabular-nums">USD 180.000</strong></div>
                  </td>
                </tr>
              </tbody>
            </table>
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
