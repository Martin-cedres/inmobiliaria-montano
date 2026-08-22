import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Property } from '@/types/property';
import { getPillarPageForProperty, generatePropertyBreadcrumbJsonLd } from '@/utils/seo';

interface PropertyBreadcrumbsProps {
  property: Property;
}

export default function PropertyBreadcrumbs({ property }: PropertyBreadcrumbsProps) {
  const pillar = getPillarPageForProperty(property);
  const breadcrumbJsonLd = generatePropertyBreadcrumbJsonLd(property);

  return (
    <>
      {/* 1. Inyección de Schema.org BreadcrumbList para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 2. Visual Breadcrumb Navigation */}
      <nav
        aria-label="Migas de pan"
        className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap py-1 mb-6 scrollbar-none"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-slate-600 hover:text-[#E85D04] transition-colors flex-shrink-0"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Inicio</span>
        </Link>

        <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />

        <Link
          href={pillar.href}
          className="text-slate-600 hover:text-[#E85D04] font-semibold transition-colors flex-shrink-0"
        >
          {pillar.shortTitle}
        </Link>

        <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />

        <span className="text-[#5E1754] font-bold truncate max-w-[200px] sm:max-w-xs md:max-w-md">
          {property.title}
        </span>
      </nav>
    </>
  );
}
