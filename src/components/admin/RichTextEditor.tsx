'use client';

import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Sparkles, 
  Eye, 
  Edit3, 
  HelpCircle,
  Check
} from 'lucide-react';
import { PropertyDescriptionRenderer } from '@/components/PropertyDescriptionRenderer';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label = 'Descripción de la Propiedad',
  placeholder = 'Describí las características, estado de conservación, orientación, luminosidad y entorno del inmueble...',
  required = false,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [templateApplied, setTemplateApplied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper para insertar o envolver texto seleccionado en el textarea
  const applyFormat = (prefix: string, suffix: string = '', defaultPlaceholder: string = 'Texto') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end);

    let replacement = '';
    let newCursorPos = 0;

    if (selectedText.length > 0) {
      replacement = `${prefix}${selectedText}${suffix}`;
      newCursorPos = start + replacement.length;
    } else {
      replacement = `${prefix}${defaultPlaceholder}${suffix}`;
      newCursorPos = start + prefix.length + defaultPlaceholder.length;
    }

    const nextText = currentText.substring(0, start) + replacement + currentText.substring(end);
    onChange(nextText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        selectedText.length > 0 ? start + prefix.length : start + prefix.length,
        selectedText.length > 0 ? newCursorPos - suffix.length : newCursorPos
      );
    }, 10);
  };

  // Helper para listas o encabezados al inicio de línea
  const applyLinePrefix = (linePrefix: string, defaultText: string = 'Nuevo ítem') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end);

    if (selectedText) {
      const lines = selectedText.split('\n');
      const formattedLines = lines.map((l) => `${linePrefix}${l}`).join('\n');
      const nextText = currentText.substring(0, start) + formattedLines + currentText.substring(end);
      onChange(nextText);
    } else {
      const before = currentText.substring(0, start);
      const isNewLine = before.length === 0 || before.endsWith('\n');
      const prefix = isNewLine ? '' : '\n';
      const toInsert = `${prefix}${linePrefix}${defaultText}\n`;
      const nextText = currentText.substring(0, start) + toInsert + currentText.substring(end);
      onChange(nextText);
    }

    setTimeout(() => {
      textarea.focus();
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      applyFormat('**', '**', 'Texto en negrita');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      applyFormat('*', '*', 'Texto en cursiva');
    }
  };

  const insertRealEstateTemplate = () => {
    const template = 
`### 📍 Ubicación & Accesibilidad Estratégica
- Ubicación privilegiada sobre vía principal con rápida conectividad y locomoción.
- Entorno consolidado con cercanía a centros comerciales, centros educativos y servicios.

### 📐 Distribución & Comodidades
- Ambientes luminosos con excelente ventilación natural y distribución funcional.
- Espacios optimizados para confort diario o desarrollo comercial/logístico.

### 💡 Puntos Destacados & Ventajas
- **Documentación:** Títulos de propiedad al día y en regla para escrituración inmediata.
- **Servicios:** Conexión de agua (OSE), energía eléctrica (UTE) y fibra óptica disponibles.
- **Financiación / Garantías:** Opciones adaptables para facilitar la operación.`;

    if (!value || value.trim().length === 0) {
      onChange(template);
    } else {
      onChange(`${value.trim()}\n\n${template}`);
    }
    setTemplateApplied(true);
    setTimeout(() => setTemplateApplied(false), 2500);
  };

  const wordsCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charsCount = value.length;

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold uppercase text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Edit / Preview Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
              activeTab === 'edit'
                ? 'bg-white text-[#5E1754] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
              activeTab === 'preview'
                ? 'bg-[#5E1754] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Previa en Vivo</span>
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="border-2 border-purple-200/80 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:border-[#5E1754] focus-within:ring-2 focus-within:ring-[#5E1754]/20 transition-all">
        
        {/* Formatting Toolbar */}
        <div className="bg-slate-50/90 border-b border-slate-200/80 p-2 flex flex-wrap items-center justify-between gap-1.5">
          
          <div className="flex flex-wrap items-center gap-1">
            {/* Bold */}
            <button
              type="button"
              onClick={() => applyFormat('**', '**', 'Texto en negrita')}
              title="Negrita (Ctrl + B)"
              className="p-2 rounded-lg text-slate-700 hover:text-[#5E1754] hover:bg-purple-100/60 transition-colors font-bold flex items-center justify-center cursor-pointer"
            >
              <Bold className="w-4 h-4" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => applyFormat('*', '*', 'Texto en cursiva')}
              title="Cursiva (Ctrl + I)"
              className="p-2 rounded-lg text-slate-700 hover:text-[#5E1754] hover:bg-purple-100/60 transition-colors italic flex items-center justify-center cursor-pointer"
            >
              <Italic className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-slate-200 mx-1" />

            {/* Subtitle / Heading */}
            <button
              type="button"
              onClick={() => applyLinePrefix('### ', 'Título de Sección')}
              title="Subtítulo / Encabezado (H3)"
              className="px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-[#5E1754] hover:bg-purple-100/60 transition-colors font-extrabold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Heading3 className="w-4 h-4" />
              <span>Subtítulo</span>
            </button>

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => applyLinePrefix('- ', 'Característica o servicio')}
              title="Lista con viñetas"
              className="p-2 rounded-lg text-slate-700 hover:text-[#5E1754] hover:bg-purple-100/60 transition-colors flex items-center justify-center cursor-pointer"
            >
              <List className="w-4 h-4" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onClick={() => applyLinePrefix('1. ', 'Punto prioritario')}
              title="Lista numerada"
              className="p-2 rounded-lg text-slate-700 hover:text-[#5E1754] hover:bg-purple-100/60 transition-colors flex items-center justify-center cursor-pointer"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            {/* Highlight Box */}
            <button
              type="button"
              onClick={() => applyLinePrefix('> **Nota Destacada:** ', 'Información clave para inversores o clientes')}
              title="Cuadro Destacado / Nota"
              className="p-2 rounded-lg text-slate-700 hover:text-[#5E1754] hover:bg-purple-100/60 transition-colors flex items-center justify-center cursor-pointer"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Template Button */}
          <button
            type="button"
            onClick={insertRealEstateTemplate}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#5E1754]/8 hover:bg-[#5E1754]/15 text-[#5E1754] border border-[#5E1754]/20 text-xs font-black transition-all cursor-pointer"
          >
            {templateApplied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">¡Plantilla Insertada!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#E85D04]" />
                <span>Insertar Estructura Inmobiliaria</span>
              </>
            )}
          </button>
        </div>

        {/* Editor Body or Live Preview */}
        {activeTab === 'edit' ? (
          <div className="p-3">
            <textarea
              ref={textareaRef}
              required={required}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={9}
              placeholder={placeholder}
              className="w-full bg-transparent border-0 text-slate-800 text-sm sm:text-base leading-relaxed font-normal focus:outline-none focus:ring-0 resize-y min-h-[220px]"
            />
          </div>
        ) : (
          <div className="p-5 bg-purple-50/20 min-h-[220px] max-h-[450px] overflow-y-auto">
            {value.trim() ? (
              <PropertyDescriptionRenderer description={value} />
            ) : (
              <div className="text-slate-400 italic text-sm text-center py-8">
                Escribe en la pestaña de Editor para ver aquí la vista previa con negritas, listas y subtítulos en vivo.
              </div>
            )}
          </div>
        )}

        {/* Footer Counters & Tips */}
        <div className="bg-slate-50/80 border-t border-slate-200/60 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Usa <strong>**negritas**</strong>, <em>*cursivas*</em>, <strong>### Subtítulos</strong> y <strong>- Viñetas</strong>.
            </span>
          </div>

          <div className="flex items-center space-x-3 font-mono font-bold text-slate-400">
            <span>{wordsCount} palabras</span>
            <span>•</span>
            <span>{charsCount} caracteres</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RichTextEditor;
