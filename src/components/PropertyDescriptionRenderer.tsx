import React from 'react';
import { Sparkles, CheckCircle2, ChevronRight, Info } from 'lucide-react';

interface PropertyDescriptionRendererProps {
  description: string;
  className?: string;
}

/**
 * Renderiza de forma segura y semántica el texto enriquecido de la descripción
 * soportando negritas (**texto**), cursivas (*texto*), subtítulos (### Título),
 * viñetas (- o • o *), listas numeradas (1. 2.) y bloques destacados (>).
 * Muestra el contenido completo de forma transparente con tipografía optimizada.
 */
export const PropertyDescriptionRenderer: React.FC<PropertyDescriptionRendererProps> = ({
  description,
  className = '',
}) => {
  if (!description || typeof description !== 'string') {
    return null;
  }

  // Detectar si la descripción fue creada con el editor visual (HTML)
  const isHtml = /<(p|div|h1|h2|h3|h4|ul|ol|li|strong|b|em|i|blockquote|hr|span|a)[^>]*>/i.test(description);

  if (isHtml) {
    return (
      <div 
        className={`text-slate-800 text-sm sm:text-base leading-relaxed prose max-w-none 
          [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-black [&_h2]:text-[#5E1754] [&_h2]:mt-5 [&_h2]:mb-2.5
          [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-black [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-2
          [&_h4]:text-sm [&_h4]:sm:text-base [&_h4]:font-bold [&_h4]:text-slate-800 [&_h4]:mt-3 [&_h4]:mb-1
          [&_p]:my-2.5 [&_p]:leading-relaxed
          [&_strong]:font-black [&_strong]:text-slate-900
          [&_em]:italic [&_em]:text-slate-800
          [&_u]:underline [&_u]:decoration-[#5E1754]/60
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ul]:space-y-1.5
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_ol]:space-y-1.5
          [&_li]:text-slate-800 [&_li]:leading-relaxed
          [&_blockquote]:border-l-4 [&_blockquote]:border-[#5E1754] [&_blockquote]:bg-purple-50/70 [&_blockquote]:p-3.5 [&_blockquote]:rounded-r-2xl [&_blockquote]:italic [&_blockquote]:my-3
          [&_hr]:my-5 [&_hr]:border-slate-200
          [&_a]:text-[#5E1754] [&_a]:underline [&_a]:font-bold ${className}`}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }

  // Helper para renderizar negritas e itálicas dentro de una línea (Fallback texto heredado)
  const renderInlineFormatted = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      const matchText = match[0];
      if (matchText.startsWith('**') && matchText.endsWith('**')) {
        parts.push(
          <strong key={`b-${matchIndex}`} className="font-black text-slate-900">
            {matchText.slice(2, -2)}
          </strong>
        );
      } else if (matchText.startsWith('__') && matchText.endsWith('__')) {
        parts.push(
          <strong key={`b2-${matchIndex}`} className="font-black text-slate-900">
            {matchText.slice(2, -2)}
          </strong>
        );
      } else if (matchText.startsWith('*') && matchText.endsWith('*')) {
        parts.push(
          <em key={`i-${matchIndex}`} className="italic text-slate-700">
            {matchText.slice(1, -1)}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  // Dividir el texto en bloques de líneas
  const rawLines = description.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (keyPrefix: number) => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={`ul-${keyPrefix}`} className="my-2.5 space-y-1.5 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-slate-800 text-sm sm:text-base leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E85D04] shrink-0" />
              <span>{renderInlineFormatted(item)}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`ol-${keyPrefix}`} className="my-2.5 space-y-1.5 pl-4 list-decimal marker:font-black marker:text-[#5E1754]">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="text-slate-800 text-sm sm:text-base leading-relaxed pl-1">
              {renderInlineFormatted(item)}
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  rawLines.forEach((line, index) => {
    const trimmed = line.trim();

    // Línea vacía
    if (!trimmed) {
      flushList(index);
      return;
    }

    // Encabezados H3 / Subtítulos (ej. "### Título" o "## Título")
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      flushList(index);
      const titleText = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <h4
          key={`h-${index}`}
          className="text-base sm:text-lg font-black text-[#5E1754] pt-3 pb-1 border-b border-purple-100 flex items-center gap-1.5"
        >
          <ChevronRight className="w-4 h-4 text-[#E85D04]" />
          <span>{renderInlineFormatted(titleText)}</span>
        </h4>
      );
      return;
    }

    // Bloque destacado / Callout (ej. "> Nota importante")
    if (trimmed.startsWith('>')) {
      flushList(index);
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <div
          key={`quote-${index}`}
          className="bg-purple-50/70 border-l-4 border-[#5E1754] p-3 rounded-r-2xl my-2.5 text-slate-800 font-medium text-sm sm:text-base flex items-start gap-2.5 shadow-2xs"
        >
          <Info className="w-4 h-4 text-[#5E1754] shrink-0 mt-0.5" />
          <div className="leading-relaxed">{renderInlineFormatted(quoteText)}</div>
        </div>
      );
      return;
    }

    // Viñetas no numeradas (- item, * item, • item)
    if (/^[-*•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*•]\s+/, '');
      if (currentList && currentList.type === 'ul') {
        currentList.items.push(itemText);
      } else {
        flushList(index);
        currentList = { type: 'ul', items: [itemText] };
      }
      return;
    }

    // Listas numeradas (1. item, 2. item)
    if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, '');
      if (currentList && currentList.type === 'ol') {
        currentList.items.push(itemText);
      } else {
        flushList(index);
        currentList = { type: 'ol', items: [itemText] };
      }
      return;
    }

    // Párrafo normal
    flushList(index);
    elements.push(
      <p key={`p-${index}`} className="text-slate-800 text-sm sm:text-base leading-relaxed font-normal tracking-normal">
        {renderInlineFormatted(trimmed)}
      </p>
    );
  });

  flushList(rawLines.length);

  return (
    <div className={`space-y-2.5 text-left ${className}`}>
      {elements}
    </div>
  );
};

export default PropertyDescriptionRenderer;
