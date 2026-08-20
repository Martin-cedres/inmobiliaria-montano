import React from 'react';
import { Property } from '@/types/property';
import { 
  Maximize2, 
  LayoutGrid, 
  Milestone, 
  DollarSign, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  Building,
  Compass,
  FileCheck
} from 'lucide-react';
import { MONTAÑO_WHATSAPP_PHONE } from '@/utils/whatsapp';

interface MetricItem {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  subtext: string;
  badge?: string;
  whatsappInquiry?: string;
}

interface ExecutiveMetricsGridProps {
  property: Property;
  className?: string;
}

export const ExecutiveMetricsGrid: React.FC<ExecutiveMetricsGridProps> = ({ property, className = '' }) => {
  const cleanRef = (property.codeRef || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanSlug = (property.slug || '').toLowerCase();
  const cleanTitle = (property.title || '').toLowerCase();

  const isBypassIndustrial = 
    cleanRef === 'indbypass01' || 
    cleanRef.includes('indbypass') || 
    cleanSlug.includes('indbypass') || 
    cleanSlug.includes('bypass-ruta-3-y-11') ||
    cleanTitle.includes('bypass ruta 3') ||
    cleanTitle.includes('12 hectareas') ||
    cleanTitle.includes('12 hectáreas');

  const f = property.features || {};
  const hasCustomIndustrial = 
    f.fractionable || 
    f.routeFrontage || 
    f.pricePerM2 || 
    f.soilTopography || 
    f.gatedPerimeter || 
    f.isHectares ||
    (f.plotAreaM2 && f.plotAreaM2 >= 10000);

  let metrics: MetricItem[] = [];

  if (isBypassIndustrial || hasCustomIndustrial) {
    // 1. Superficie Total
    const plotArea = f.plotAreaM2 || (isBypassIndustrial ? 120000 : 0);
    const isHa = f.isHectares || plotArea >= 10000;
    const haCount = f.isHectares && plotArea < 1000 ? plotArea : plotArea / 10000;
    
    metrics.push({
      id: 'superficie',
      icon: <Maximize2 className="w-5 h-5" />,
      iconBg: 'bg-[#5E1754]/10 text-[#5E1754]',
      title: 'Superficie Total',
      value: isHa ? `${haCount.toLocaleString('es-UY')} Hectáreas` : `${plotArea.toLocaleString('es-UY')} m²`,
      subtext: `${plotArea.toLocaleString('es-UY')} m² de predio total`,
      badge: isHa ? 'Escala Industrial' : 'Gran Superficie',
      whatsappInquiry: `Hola Daniel, quisiera consultar sobre la superficie total de ${isHa ? `${haCount} Ha` : `${plotArea} m²`}.`,
    });

    // 2. Fraccionamiento
    if (f.fractionable || f.minFractionM2 || f.fractionNotes || isBypassIndustrial) {
      const minM2 = f.minFractionM2 || 12000;
      metrics.push({
        id: 'fracciones',
        icon: <LayoutGrid className="w-5 h-5" />,
        iconBg: 'bg-[#5E1754]/10 text-[#5E1754]',
        title: 'Fraccionamiento',
        value: `Desde ${minM2.toLocaleString('es-UY')} m²`,
        subtext: f.fractionNotes || 'Fracciones adaptables a tu proyecto',
        badge: 'Adaptable',
        whatsappInquiry: `Hola Daniel, me interesan las opciones de fraccionamiento desde ${minM2.toLocaleString('es-UY')} m².`,
      });
    }

    // 3. Frente sobre Ruta / Conectividad
    if (f.routeFrontage || f.frontMeters || isBypassIndustrial) {
      const frenteVal = f.routeFrontage || `${f.frontMeters || 50} Metros`;
      metrics.push({
        id: 'frente',
        icon: <Milestone className="w-5 h-5" />,
        iconBg: 'bg-[#E85D04]/10 text-[#E85D04]',
        title: 'Frente sobre Ruta',
        value: frenteVal,
        subtext: f.pavedStreet ? 'Salida directa a Ruta / Bypass pavimentado' : 'Salida directa a Bypass / Ruta 3',
        badge: 'Acceso Pesado',
        whatsappInquiry: `Hola Daniel, quisiera más detalles del acceso y frente: ${frenteVal}.`,
      });
    }

    // 4. Precio por m²
    if (f.pricePerM2 || isBypassIndustrial) {
      const ppm2 = f.pricePerM2 || 15;
      const minM2 = f.minFractionM2 || 12000;
      metrics.push({
        id: 'precio-m2',
        icon: <DollarSign className="w-5 h-5" />,
        iconBg: 'bg-emerald-500/10 text-emerald-700',
        title: 'Precio por m²',
        value: `USD ${ppm2} / m²`,
        subtext: `Fracción base desde USD ${(minM2 * ppm2).toLocaleString('es-UY')}`,
        badge: 'Oportunidad',
        whatsappInquiry: `Hola Daniel, quisiera consultar la lista de precios (USD ${ppm2}/m²) y formas de pago.`,
      });
    }

    // 5. Topografía & Suelo
    if (f.soilTopography || isBypassIndustrial) {
      const topoVal = f.soilTopography || '100% Nivelado';
      metrics.push({
        id: 'topografia',
        icon: <Layers className="w-5 h-5" />,
        iconBg: 'bg-[#5E1754]/10 text-[#5E1754]',
        title: 'Topografía & Suelo',
        value: topoVal,
        subtext: 'Listo para edificar sin costo de relleno',
        badge: 'Apto Inmediato',
        whatsappInquiry: `Hola Daniel, quisiera consultar sobre la nivelación y características del suelo (${topoVal}).`,
      });
    }

    // 6. Seguridad & Cerramiento
    if (f.gatedPerimeter || f.perimeterFence || f.securitySystem || isBypassIndustrial) {
      metrics.push({
        id: 'seguridad',
        icon: <ShieldCheck className="w-5 h-5" />,
        iconBg: 'bg-blue-500/10 text-blue-700',
        title: 'Seguridad & Cerramiento',
        value: 'Predio Cerrado',
        subtext: 'Perímetro cerrado y control de acceso',
        badge: 'Resguardo Total',
        whatsappInquiry: 'Hola Daniel, quisiera consultar sobre el cerramiento perimetral y seguridad del predio.',
      });
    }
  } else if (
    property.category === 'chacra' || 
    property.category === 'terreno' || 
    property.category === 'deposito' || 
    property.category === 'local' ||
    (f.plotAreaM2 && f.plotAreaM2 >= 1000)
  ) {
    const plotArea = f.plotAreaM2 || 0;
    const isHa = f.isHectares || plotArea >= 10000;
    const areaFormatted = isHa 
      ? `${(f.isHectares && plotArea < 1000 ? plotArea : plotArea / 10000).toLocaleString('es-UY')} Ha`
      : `${plotArea.toLocaleString('es-UY')} m²`;

    metrics.push({
      id: 'superficie-gen',
      icon: <Maximize2 className="w-5 h-5" />,
      iconBg: 'bg-[#5E1754]/10 text-[#5E1754]',
      title: 'Superficie de Terreno',
      value: areaFormatted,
      subtext: `${plotArea.toLocaleString('es-UY')} m² totales de predio`,
    });

    if (f.frontMeters && f.frontMeters > 0) {
      metrics.push({
        id: 'frente-gen',
        icon: <Compass className="w-5 h-5" />,
        iconBg: 'bg-[#E85D04]/10 text-[#E85D04]',
        title: 'Metros de Frente',
        value: `${f.frontMeters} Metros`,
        subtext: f.pavedStreet ? 'Frente a calle pavimentada / ruta' : 'Excelente frente y accesibilidad',
      });
    }

    if (f.builtAreaM2 && f.builtAreaM2 > 0) {
      metrics.push({
        id: 'edif-gen',
        icon: <Building className="w-5 h-5" />,
        iconBg: 'bg-[#5E1754]/10 text-[#5E1754]',
        title: 'Área Edificada',
        value: `${f.builtAreaM2} m²`,
        subtext: 'Superficie construida disponible',
      });
    }

    if (f.coneatIndex && f.coneatIndex > 0) {
      metrics.push({
        id: 'coneat-gen',
        icon: <Layers className="w-5 h-5" />,
        iconBg: 'bg-[#5E1754]/10 text-[#5E1754]',
        title: 'Índice CONEAT',
        value: `CONEAT ${f.coneatIndex}`,
        subtext: 'Productividad y calidad de suelo',
      });
    }

    if (f.perimeterFence) {
      metrics.push({
        id: 'cierre-gen',
        icon: <ShieldCheck className="w-5 h-5" />,
        iconBg: 'bg-blue-500/10 text-blue-700',
        title: 'Cerramiento',
        value: 'Cerco Perimetral',
        subtext: 'Límites definidos y delimitación perimetral',
      });
    }

    if (f.titlesUpToDate) {
      metrics.push({
        id: 'titulos-gen',
        icon: <FileCheck className="w-5 h-5" />,
        iconBg: 'bg-emerald-500/10 text-emerald-700',
        title: 'Garantía Jurídica',
        value: 'Títulos al Día',
        subtext: 'Documentación lista para escriturar',
      });
    }
  }

  if (metrics.length === 0) {
    return null;
  }

  return (
    <section className={`bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-5 text-left ${className}`}>
      
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-[#5E1754]/8 border border-[#5E1754]/15 px-3 py-1 rounded-full mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E85D04]" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5E1754]">
              Dossier Ejecutivo & Viabilidad Logística
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            Datos Destacados para Inversión
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Métricas estratégicas para análisis de escala, logística y desarrollo inmediato.
          </p>
        </div>

        <span className="self-start sm:self-center font-mono text-[11px] font-extrabold text-slate-400 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200/80">
          {metrics.length} Puntos Clave
        </span>
      </div>

      {/* Grid of Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
        {metrics.map((m) => {
          const cardContent = (
            <div
              key={m.id}
              className="bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-[#5E1754]/40 rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-2xs hover:shadow-lg flex flex-col justify-between group relative overflow-hidden h-full"
            >
              {/* Subtle top accent gradient bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5E1754] to-[#E85D04] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Top Row: Icon + Mini-Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-2xs transition-transform duration-300 group-hover:scale-110 ${m.iconBg}`}>
                  {m.icon}
                </div>

                {m.badge && (
                  <span className="text-[10px] font-extrabold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-white border border-slate-200/80 text-slate-700 shadow-2xs">
                    {m.badge}
                  </span>
                )}
              </div>

              {/* Title & Value */}
              <div className="space-y-1">
                <span className="block text-[11px] font-black uppercase tracking-wider text-slate-400 group-hover:text-[#5E1754] transition-colors">
                  {m.title}
                </span>
                <span className="block text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {m.value}
                </span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed pt-1 border-t border-slate-200/50 mt-2">
                  {m.subtext}
                </p>
              </div>
            </div>
          );

          if (m.whatsappInquiry) {
            const waUrl = `https://wa.me/${MONTAÑO_WHATSAPP_PHONE}?text=${encodeURIComponent(
              `${m.whatsappInquiry}\n\nRef. #${property.codeRef}: ${property.title}`
            )}`;
            return (
              <a
                key={m.id}
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Consultar por ${m.title} en WhatsApp`}
                className="block cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5E1754] rounded-2xl h-full"
              >
                {cardContent}
              </a>
            );
          }

          return <div key={m.id} className="h-full">{cardContent}</div>;
        })}
      </div>

    </section>
  );
};

export default ExecutiveMetricsGrid;
