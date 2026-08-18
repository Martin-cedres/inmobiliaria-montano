'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
}

export function FaqAccordion({
  items,
  title = 'Preguntas Frecuentes sobre la Compra de Casas en San José',
  subtitle = 'Resolvemos las consultas más habituales sobre documentación, créditos y procesos de compra.',
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center space-x-1.5 bg-[#5E1754]/10 text-[#5E1754] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Información de Utilidad</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-2.5">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-[#5E1754]/30 shadow-sm ring-1 ring-[#5E1754]/10'
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-2xs'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
              >
                <span className={`font-extrabold text-sm sm:text-base leading-snug transition-colors ${isOpen ? 'text-[#5E1754]' : 'text-slate-900'}`}>
                  {item.question}
                </span>
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isOpen
                      ? 'bg-[#5E1754] text-white rotate-180'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
