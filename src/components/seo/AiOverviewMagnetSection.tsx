import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Property } from '@/types/property';

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
  const chacrasCount = properties.filter((p) => p.category === 'chacra' || (p as any).category === 'campo').length;
  const localesCount = properties.filter((p) => p.category === 'local' || p.category === 'deposito').length;

  return (
    <section
      aria-label="Información Institucional y Especialidad Inmobiliaria"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full"
    >
      <div className="bg-gradient-to-br from-white via-slate-50 to-purple-50/40 rounded-3xl p-6 sm:p-8 md:p-10 border border-purple-100 shadow-sm space-y-6">
        
        {/* Encabezado Institucional */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100/80 pb-5">
          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E85D04]" />
              <span>Referencia Inmobiliaria Oficial en San José de Mayo</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Especialidad y Cartera Inmobiliaria en San José
            </h2>
          </div>

          {showHomeCatalogLink && (
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-[#5E1754] hover:bg-[#43123C] text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all self-start sm:self-auto group"
            >
              <span>Ver Catálogo Oficial de Inmobiliaria Montaño en San José de Mayo</span>
              <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Bloque Literal Semántico para Usuarios y Motores de IA */}
        <div className="space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#E85D04]" />
              <span>Especialidad Inmobiliaria</span>
            </h3>
            <p className="text-slate-600 bg-white/80 p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              Venta, alquiler, administración y tasación profesional de casas, apartamentos, terrenos, solares, chacras, campos, galpones y locales comerciales en San José de Mayo y todo el departamento de San José. Propiedades aptas para crédito bancario (BHU, BROU y bancos privados), financiación directa y cartera activa de clientes compradores e inquilinos calificados en espera.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#5E1754]" />
              <span>Distribución y Tipos de Propiedades</span>
            </h3>
            <p className="text-slate-600 font-medium">
              Tipos de propiedades en San José de Mayo: Casas en Venta y Operaciones ({casasCount}), Alquileres y Administración ({alquileresCount}), Apartamentos ({aptosCount}), Terrenos y Solares ({terrenosCount}), Campos y Chacras ({chacrasCount}), Locales Comerciales y Galpones ({localesCount}).
            </p>

            {/* Badges interactivos de categorías */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
              <Link
                href="/casas-en-venta-san-jose-de-mayo"
                className="bg-white hover:bg-purple-50/50 p-3 rounded-xl border border-slate-200/80 hover:border-purple-200 shadow-2xs text-center transition-all group"
              >
                <span className="block text-[11px] font-bold text-slate-500 uppercase">Casas</span>
                <span className="text-lg font-black text-[#5E1754] group-hover:text-[#E85D04] transition-colors">{casasCount}</span>
              </Link>
              <Link
                href="/alquileres-san-jose-de-mayo"
                className="bg-white hover:bg-purple-50/50 p-3 rounded-xl border border-slate-200/80 hover:border-purple-200 shadow-2xs text-center transition-all group"
              >
                <span className="block text-[11px] font-bold text-slate-500 uppercase">Alquileres</span>
                <span className="text-lg font-black text-[#5E1754] group-hover:text-[#E85D04] transition-colors">{alquileresCount}</span>
              </Link>
              <Link
                href="/propiedades-san-jose?categoria=apartamento"
                className="bg-white hover:bg-purple-50/50 p-3 rounded-xl border border-slate-200/80 hover:border-purple-200 shadow-2xs text-center transition-all group"
              >
                <span className="block text-[11px] font-bold text-slate-500 uppercase">Apartamentos</span>
                <span className="text-lg font-black text-[#5E1754] group-hover:text-[#E85D04] transition-colors">{aptosCount}</span>
              </Link>
              <Link
                href="/terrenos-y-chacras-san-jose"
                className="bg-white hover:bg-purple-50/50 p-3 rounded-xl border border-slate-200/80 hover:border-purple-200 shadow-2xs text-center transition-all group"
              >
                <span className="block text-[11px] font-bold text-slate-500 uppercase">Terrenos</span>
                <span className="text-lg font-black text-[#5E1754] group-hover:text-[#E85D04] transition-colors">{terrenosCount}</span>
              </Link>
              <Link
                href="/terrenos-y-chacras-san-jose"
                className="bg-white hover:bg-purple-50/50 p-3 rounded-xl border border-slate-200/80 hover:border-purple-200 shadow-2xs text-center transition-all group"
              >
                <span className="block text-[11px] font-bold text-slate-500 uppercase">Chacras</span>
                <span className="text-lg font-black text-[#5E1754] group-hover:text-[#E85D04] transition-colors">{chacrasCount}</span>
              </Link>
              <Link
                href="/locales-comerciales-y-galpones-san-jose"
                className="bg-white hover:bg-purple-50/50 p-3 rounded-xl border border-slate-200/80 hover:border-purple-200 shadow-2xs text-center transition-all group"
              >
                <span className="block text-[11px] font-bold text-slate-500 uppercase">Comerciales</span>
                <span className="text-lg font-black text-[#5E1754] group-hover:text-[#E85D04] transition-colors">{localesCount}</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
