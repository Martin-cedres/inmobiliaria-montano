'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Quote, 
  Minus, 
  Link2, 
  Undo, 
  Redo, 
  Eraser, 
  Palette, 
  Highlighter, 
  Maximize2, 
  Minimize2
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

// Paletas de color corporativas y de formato
const TEXT_COLORS = [
  { name: 'Negro Clásico', color: '#0f172a' },
  { name: 'Púrpura Montaño', color: '#5E1754' },
  { name: 'Naranja Acento', color: '#E85D04' },
  { name: 'Azul Ejecutivo', color: '#1d4ed8' },
  { name: 'Verde Éxito', color: '#15803d' },
  { name: 'Gris Neutro', color: '#475569' },
];

const HIGHLIGHT_COLORS = [
  { name: 'Sin Resaltado', color: 'transparent' },
  { name: 'Amarillo Suave', color: '#fef08a' },
  { name: 'Violeta Suave', color: '#f3e8ff' },
  { name: 'Verde Suave', color: '#dcfce7' },
  { name: 'Celeste Suave', color: '#e0f2fe' },
];

/**
 * Convierte markdown heredado simple o texto plano a HTML si no tiene etiquetas
 */
function convertLegacyTextToHtml(text: string): string {
  if (!text) return '';
  // Si ya tiene etiquetas HTML estructuradas, devolver tal cual
  if (/<(p|div|h1|h2|h3|h4|ul|ol|li|strong|b|em|i|blockquote|hr|span)[^>]*>/i.test(text)) {
    return text;
  }

  // Convertir líneas de markdown heredado a HTML limpio
  const lines = text.split(/\r?\n/);
  const htmlParts: string[] = [];
  let inUl = false;
  let inOl = false;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inUl) { htmlParts.push('</ul>'); inUl = false; }
      if (inOl) { htmlParts.push('</ol>'); inOl = false; }
      continue;
    }

    // Encabezados ### o ##
    if (trimmed.startsWith('### ')) {
      if (inUl) { htmlParts.push('</ul>'); inUl = false; }
      if (inOl) { htmlParts.push('</ol>'); inOl = false; }
      htmlParts.push(`<h3>${trimmed.replace(/^###\s+/, '')}</h3>`);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      if (inUl) { htmlParts.push('</ul>'); inUl = false; }
      if (inOl) { htmlParts.push('</ol>'); inOl = false; }
      htmlParts.push(`<h2>${trimmed.replace(/^##\s+/, '')}</h2>`);
      continue;
    }

    // Viñetas
    if (/^[-*•]\s+/.test(trimmed)) {
      if (inOl) { htmlParts.push('</ol>'); inOl = false; }
      if (!inUl) { htmlParts.push('<ul>'); inUl = true; }
      const content = trimmed.replace(/^[-*•]\s+/, '')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      htmlParts.push(`<li>${content}</li>`);
      continue;
    }

    // Listas numeradas
    if (/^\d+\.\s+/.test(trimmed)) {
      if (inUl) { htmlParts.push('</ul>'); inUl = false; }
      if (!inOl) { htmlParts.push('<ol>'); inOl = true; }
      const content = trimmed.replace(/^\d+\.\s+/, '')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      htmlParts.push(`<li>${content}</li>`);
      continue;
    }

    // Citas >
    if (trimmed.startsWith('>')) {
      if (inUl) { htmlParts.push('</ul>'); inUl = false; }
      if (inOl) { htmlParts.push('</ol>'); inOl = false; }
      const content = trimmed.replace(/^>\s*/, '')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      htmlParts.push(`<blockquote>${content}</blockquote>`);
      continue;
    }

    if (inUl) { htmlParts.push('</ul>'); inUl = false; }
    if (inOl) { htmlParts.push('</ol>'); inOl = false; }

    // Párrafo normal
    const content = trimmed
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    htmlParts.push(`<p>${content}</p>`);
  }

  if (inUl) htmlParts.push('</ul>');
  if (inOl) htmlParts.push('</ol>');

  return htmlParts.join('');
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label = 'Descripción de la Propiedad',
  placeholder = 'Escribí aquí la descripción enriquecida como en Word...',
  required = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    orderedList: false,
    unorderedList: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    blockType: 'p',
  });

  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Inicializar contenido en el editor visual
  useEffect(() => {
    if (!editorRef.current) return;
    const initialHtml = convertLegacyTextToHtml(value || '');
    if (editorRef.current.innerHTML !== initialHtml) {
      editorRef.current.innerHTML = initialHtml;
      updateStats();
    }
  }, []); // Solo al montar

  // Actualizar estadísticas de palabras y caracteres
  const updateStats = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const cleanText = text.trim();
    setCharCount(cleanText.length);
    setWordCount(cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0);
  }, []);

  // Notificar al componente padre cuando cambie el contenido
  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    // Si solo tiene tags vacíos o <br>, devolver string vacío
    const plain = editorRef.current.innerText.trim();
    if (!plain && (html === '<p><br></p>' || html === '<br>' || html === '<div><br></div>')) {
      onChange('');
    } else {
      onChange(html);
    }
    updateStats();
    checkActiveFormats();
  };

  // Detectar formatos activos en la selección actual
  const checkActiveFormats = useCallback(() => {
    if (typeof document === 'undefined') return;
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        orderedList: document.queryCommandState('insertOrderedList'),
        unorderedList: document.queryCommandState('insertUnorderedList'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
        blockType: document.queryCommandValue('formatBlock') || 'p',
      });
    } catch {
      // Ignorar errores en navegadores con execCommand restringido
    }
  }, []);

  // Ejecutar comando de formateo en el editor
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  // Formato de encabezados y párrafos
  const handleBlockFormat = (tag: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('formatBlock', false, tag);
    handleInput();
  };

  // Color de texto
  const handleTextColor = (color: string) => {
    executeCommand('foreColor', color);
    setShowColorPicker(false);
  };

  // Resaltador de fondo
  const handleHighlight = (color: string) => {
    if (color === 'transparent') {
      executeCommand('removeFormat');
    } else {
      executeCommand('hiliteColor', color);
    }
    setShowHighlightPicker(false);
  };

  // Insertar Enlace
  const handleInsertLink = () => {
    const url = window.prompt('Ingresá la URL del enlace (ej: https://ejemplo.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  // Limpiar Formato
  const handleClearFormat = () => {
    executeCommand('removeFormat');
  };

  // Atajos de teclado estilo Word
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        executeCommand('bold');
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        executeCommand('italic');
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        executeCommand('underline');
      } else if (e.key === 'z' || e.key === 'Z') {
        // Dejar que el navegador maneje undo/redo nativo
        setTimeout(handleInput, 10);
      }
    }
  };

  return (
    <div className={`space-y-1.5 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8 flex flex-col justify-center items-center' : ''}`}>
      {/* Header superior con etiqueta y controles */}
      <div className={`flex items-center justify-between ${isFullscreen ? 'w-full max-w-5xl bg-white p-3 rounded-t-2xl border-b border-slate-200' : ''}`}>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#5E1754]">
            Editor Visual Word
          </span>
        </label>

        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="text-xs font-semibold text-slate-500 hover:text-[#5E1754] flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          title={isFullscreen ? 'Salir de pantalla completa' : 'Modo pantalla completa'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Cerrar Pantalla Completa</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Pantalla Completa</span>
            </>
          )}
        </button>
      </div>

      {/* Contenedor Principal del Editor */}
      <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col transition-all focus-within:ring-2 focus-within:ring-[#5E1754]/30 focus-within:border-[#5E1754] ${isFullscreen ? 'w-full max-w-5xl h-[85vh] rounded-t-none' : ''}`}>
        
        {/* BARRA DE HERRAMIENTAS TIPO WORD (Ribbon) */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 sm:p-2.5 flex flex-wrap items-center gap-1 sm:gap-1.5 select-none text-slate-700">
          
          {/* Grupo 1: Deshacer / Rehacer */}
          <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200">
            <button
              type="button"
              onClick={() => executeCommand('undo')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
              title="Deshacer (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('redo')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
              title="Rehacer (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Grupo 2: Selector de Estilos de Encabezado */}
          <div className="pr-1.5 border-r border-slate-200">
            <select
              onChange={(e) => handleBlockFormat(e.target.value)}
              value={activeFormats.blockType || 'p'}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
            >
              <option value="p">Texto Normal (Párrafo)</option>
              <option value="h2">Título Principal (H2)</option>
              <option value="h3">Subtítulo (H3)</option>
              <option value="h4">Encabezado Menor (H4)</option>
            </select>
          </div>

          {/* Grupo 3: Formato de Texto Básico */}
          <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              className={`p-1.5 rounded-lg transition-all ${
                activeFormats.bold ? 'bg-[#5E1754] text-white shadow-xs' : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Negrita (Ctrl+B)"
            >
              <Bold className="w-4 h-4 font-black" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('italic')}
              className={`p-1.5 rounded-lg transition-all ${
                activeFormats.italic ? 'bg-[#5E1754] text-white shadow-xs' : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Cursiva (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('underline')}
              className={`p-1.5 rounded-lg transition-all ${
                activeFormats.underline ? 'bg-[#5E1754] text-white shadow-xs' : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Subrayado (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('strikeThrough')}
              className={`p-1.5 rounded-lg transition-all ${
                activeFormats.strikeThrough ? 'bg-[#5E1754] text-white shadow-xs' : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Tachado"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          {/* Grupo 4: Color de Texto & Resaltador */}
          <div className="flex items-center space-x-1 pr-1.5 border-r border-slate-200 relative">
            {/* Color de Texto */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowHighlightPicker(false);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 flex items-center gap-1"
                title="Color de Fuente"
              >
                <Palette className="w-4 h-4 text-[#5E1754]" />
                <span className="w-2 h-2 rounded-full bg-[#5E1754]" />
              </button>

              {showColorPicker && (
                <div className="absolute left-0 top-full mt-1.5 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-50 grid grid-cols-3 gap-1.5 w-36">
                  {TEXT_COLORS.map((item) => (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => handleTextColor(item.color)}
                      className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: item.color }}
                      title={item.name}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Resaltador de Fondo */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowHighlightPicker(!showHighlightPicker);
                  setShowColorPicker(false);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 flex items-center gap-1"
                title="Resaltar Texto"
              >
                <Highlighter className="w-4 h-4 text-amber-600" />
                <span className="w-2 h-2 rounded-full bg-yellow-300 border border-slate-300" />
              </button>

              {showHighlightPicker && (
                <div className="absolute left-0 top-full mt-1.5 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-50 space-y-1 w-40">
                  {HIGHLIGHT_COLORS.map((item) => (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => handleHighlight(item.color)}
                      className="w-full text-left px-2 py-1 text-xs font-semibold rounded-md hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                    >
                      <span
                        className="w-4 h-4 rounded border border-slate-300 shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grupo 5: Listas */}
          <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200">
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              className={`p-1.5 rounded-lg transition-all ${
                activeFormats.unorderedList ? 'bg-[#5E1754] text-white shadow-xs' : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Lista con Viñetas"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              className={`p-1.5 rounded-lg transition-all ${
                activeFormats.orderedList ? 'bg-[#5E1754] text-white shadow-xs' : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Lista Numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Grupo 6: Alineación */}
          <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200">
            <button
              type="button"
              onClick={() => executeCommand('justifyLeft')}
              className={`p-1.5 rounded-lg transition-all ${
                activeFormats.justifyLeft ? 'bg-[#5E1754] text-white' : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Alinear a la Izquierda"
            >
              <AlignLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('justifyCenter')}
              className={`p-1.5 rounded-lg transition-all ${
                activeFormats.justifyCenter ? 'bg-[#5E1754] text-white' : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Centrar"
            >
              <AlignCenter className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('justifyRight')}
              className={`p-1.5 rounded-lg transition-all ${
                activeFormats.justifyRight ? 'bg-[#5E1754] text-white' : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Alinear a la Derecha"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Grupo 7: Insertar Elementos */}
          <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200">
            <button
              type="button"
              onClick={() => handleBlockFormat('blockquote')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
              title="Cita / Bloque Destacado"
            >
              <Quote className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('insertHorizontalRule')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
              title="Línea Divisoria"
            >
              <Minus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleInsertLink}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
              title="Insertar Enlace Web"
            >
              <Link2 className="w-4 h-4" />
            </button>
          </div>

          {/* Grupo 8: Limpieza de Formato */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleClearFormat}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
              title="Borrar Todo el Formato de la Selección"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* LIENZO DE EDICIÓN VISUAL WYSIWYG (Paper Canvas) */}
        <div className="relative flex-1 overflow-y-auto bg-white min-h-[260px] sm:min-h-[320px] p-4 sm:p-6 cursor-text">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyUp={checkActiveFormats}
            onMouseUp={checkActiveFormats}
            onKeyDown={handleKeyDown}
            className="outline-none min-h-full font-sans text-slate-800 text-base leading-relaxed space-y-3 prose max-w-none focus:outline-none 
              [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-black [&_h2]:text-[#5E1754] [&_h2]:mt-4 [&_h2]:mb-2
              [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:font-black [&_h3]:text-slate-900 [&_h3]:mt-3 [&_h3]:mb-1
              [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-slate-800 [&_h4]:mt-2
              [&_p]:my-2 [&_p]:leading-relaxed
              [&_strong]:font-black [&_strong]:text-slate-900
              [&_em]:italic [&_em]:text-slate-800
              [&_u]:underline [&_u]:decoration-[#5E1754]/60
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ul]:space-y-1.5
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_ol]:space-y-1.5
              [&_li]:text-slate-800
              [&_blockquote]:border-l-4 [&_blockquote]:border-[#5E1754] [&_blockquote]:bg-purple-50/50 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:my-3
              [&_hr]:my-4 [&_hr]:border-slate-200
              [&_a]:text-[#5E1754] [&_a]:underline [&_a]:font-bold"
            data-placeholder={placeholder}
          />
        </div>

        {/* Pie de Estadísticas & Atajos */}
        <div className="bg-slate-50/90 border-t border-slate-200/80 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-medium select-none gap-2">
          <div className="flex items-center gap-3">
            <span><strong>{wordCount}</strong> palabras</span>
            <span>•</span>
            <span><strong>{charCount}</strong> caracteres</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span>Atajos: <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-mono">Ctrl+B</kbd> Negrita</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-mono">Ctrl+I</kbd> Cursiva</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-mono">Ctrl+U</kbd> Subrayado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
