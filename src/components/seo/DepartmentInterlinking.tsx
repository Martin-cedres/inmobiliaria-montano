import React from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { MapPin, Compass, Building, Landmark, Calculator, ArrowRight, ShieldCheck, Home as HomeIcon } from 'lucide-react';
import { getPillarPageForProperty } from '@/utils/seo';
import { SAN_JOSE_LOCATIONS } from '@/data/locations';

interface DepartmentInterlinkingProps {
  property?: Property;
  currentPath?: string;
}

export function DepartmentInterlinking({ property, currentPath = '' }: DepartmentInterlinkingProps) {
  // Enlaces calculados contextualmente según el inmueble o la página actual
  const mainPillar = property ? getPillarPageForProperty(property) : null;
  const propertyCity = property?.location.city || 'San José de Mayo';

  // Colección de hubs departamentales verificados y con contenido existente
  const verifiedPillars = [
    {
      title: 'Casas en Venta en San José de Mayo',
      shortTitle: 'Casas en Venta',
      href: '/casas-en-venta-san-jose-de-mayo',
      icon: HomeIcon,
      category: 'casa',
    },
    {
      title: 'Alquileres Garantizados en San José de Mayo',
      shortTitle: 'Alquileres',
      href: '/alquileres-san-jose-de-mayo',
      icon: Building,
      category: 'alquiler',
    },
    {
      title: 'Terrenos y Chacras en San José',
      shortTitle: 'Terrenos y Chacras',
      href: '/terrenos-y-chacras-san-jose',
      icon: Compass,
      category: 'terreno',
    },
    {
      title: 'Proyectos y Viviendas Modulares',
      shortTitle: 'Viviendas Modulares',
      href: '/proyectos-y-viviendas-modulares-san-jose',
      icon: Building,
      category: 'modulo',
    },
    {
      title: 'Locales Comerciales y Galpones',
      shortTitle: 'Locales y Galpones',
      href: '/locales-comerciales-y-galpones-san-jose',
      icon: Landmark,
      category: 'local',
    },
    {
      title: 'Tasaciones Oficiales con Daniel Montaño',
      shortTitle: 'Tasaciones Oficiales',
      href: '/tasaciones-san-jose-de-mayo',
      icon: Calculator,
      category: 'servicio',
    },
    {
      title: 'Vender mi Propiedad en San José',
      shortTitle: 'Vender Inmueble',
      href: '/vender-propiedad-san-jose',
      icon: ShieldCheck,
      category: 'servicio',
    },
    {
      title: 'Inversiones Inmobiliarias en San José',
      shortTitle: 'Inversiones y Renta',
      href: '/inversiones-inmobiliarias-san-jose',
      icon: Landmark,
      category: 'servicio',
    },
    {
      title: 'Observatorio Estadístico de San José',
      shortTitle: 'Estadísticas y Valores m²',
      href: '/estadisticas-inmobiliarias-san-jose',
      icon: Calculator,
      category: 'departamental',
    },
    {
      title: 'Guía de Tasaciones Inmobiliarias en San José',
      shortTitle: 'Guía de Tasaciones',
      href: '/guia-tasacion-inmobiliaria-san-jose',
      icon: Calculator,
      category: 'guia',
    },
    {
      title: 'Guía de Compra con Crédito Bancario en Uruguay',
      shortTitle: 'Guía de Crédito Bancario',
      href: '/guia-compra-propiedad-credito-bancario-uruguay',
      icon: Landmark,
      category: 'guia',
    },
    {
      title: 'Inmobiliaria en San José (Guía Departamental)',
      shortTitle: 'Inmobiliaria San José',
      href: '/inmobiliaria-san-jose',
      icon: MapPin,
      category: 'departamental',
    },
    {
      title: 'Catálogo General de Propiedades en San José',
      shortTitle: 'Propiedades San José',
      href: '/propiedades-san-jose',
      icon: Building,
      category: 'departamental',
    },
  ];

  // Filtrar para evitar auto-enlazado a la misma página actual
  const filteredPillars = verifiedPillars.filter((p) => p.href !== currentPath);

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6 text-left my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#E85D04]">
            Explorá el Mercado Inmobiliario
          </span>
          <h3 className="text-lg sm:text-xl font-black text-[#5E1754]">
            {property
              ? `Explorá más opciones en ${propertyCity} y el Departamento de San José`
              : 'Navegación Departamental e Inmuebles en San José'}
          </h3>
        </div>

        <Link
          href="/propiedades-san-jose"
          className="inline-flex items-center space-x-1.5 text-xs font-black text-[#5E1754] hover:text-[#E85D04] transition-colors flex-shrink-0"
        >
          <span>Ver catálogo completo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid de Enlaces Contextuales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPillars.slice(0, 6).map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/60 border border-slate-200/80 hover:border-purple-200 transition-all flex items-start space-x-3.5"
            >
              <div className="p-2.5 rounded-xl bg-white group-hover:bg-[#5E1754] text-[#5E1754] group-hover:text-white border border-slate-200/60 group-hover:border-[#5E1754] transition-all shadow-2xs flex-shrink-0">
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#5E1754] transition-colors truncate">
                  {item.shortTitle}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {item.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Cobertura territorial verificada */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-500 flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5 text-[#E85D04]" />
          <span>Localidades cubiertas:</span>
        </span>
        {SAN_JOSE_LOCATIONS.slice(0, 8).map((loc) => (
          <Link
            key={loc.slug}
            href={`/propiedades-san-jose?ciudad=${encodeURIComponent(loc.name)}`}
            className="text-[11px] font-semibold text-slate-600 hover:text-[#5E1754] bg-slate-100 hover:bg-purple-100/60 px-2.5 py-1 rounded-lg transition-colors"
          >
            {loc.shortName}
          </Link>
        ))}
      </div>
    </section>
  );
}
