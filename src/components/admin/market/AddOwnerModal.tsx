'use client';

import React, { useState, useMemo } from 'react';
import { MarketListing } from '@/types/market';
import { detectCompetitorSignatures } from '@/lib/whatsapp';
import {
  X,
  Building2,
  Phone,
  User,
  MapPin,
  DollarSign,
  Globe,
  FileText,
  CheckCircle2,
  ClipboardPaste,
  AlertTriangle,
} from 'lucide-react';

interface AddOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newListing: MarketListing) => void;
}

export function AddOwnerModal({ isOpen, onClose, onSuccess }: AddOwnerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawPasteText, setRawPasteText] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    operation: 'venta' as 'venta' | 'alquiler',
    category: 'casa' as 'casa' | 'apartamento' | 'terreno' | 'chacra' | 'local' | 'deposito',
    neighborhood: 'Centro',
    priceAmount: '',
    priceCurrency: 'USD' as 'USD' | 'UYU',
    contactName: '',
    contactPhone: '',
    sourceName: 'Mercado Libre (Dueño)',
    sourceUrl: '',
    internalNotes: '',
  });

  const competitorWarning = useMemo(() => {
    const check = detectCompetitorSignatures({
      phone: formData.contactPhone,
      title: formData.title,
      description: `${rawPasteText} ${formData.internalNotes}`,
      contactName: formData.contactName,
    });
    return check;
  }, [formData, rawPasteText]);

  if (!isOpen) return null;

  const handleSmartPaste = (text: string) => {
    setRawPasteText(text);
    if (!text.trim()) return;

    const lower = text.toLowerCase();

    // 1. Detectar Operación
    const operation: 'venta' | 'alquiler' =
      lower.includes('alquiler') || lower.includes('alquilo') || lower.includes('arriendo')
        ? 'alquiler'
        : 'venta';

    // 2. Detectar Categoría
    let category: 'casa' | 'apartamento' | 'terreno' | 'chacra' | 'local' | 'deposito' = 'casa';
    if (lower.includes('apartamento') || lower.includes('apto') || lower.includes('monoambiente')) {
      category = 'apartamento';
    } else if (lower.includes('chacra') || lower.includes('campo') || lower.includes('hectarea') || lower.includes('hectárea') || lower.includes('estancia')) {
      category = 'chacra';
    } else if (lower.includes('terreno') || lower.includes('solar') || lower.includes('lote') || lower.includes('fraccion') || lower.includes('fracción')) {
      category = 'terreno';
    } else if (lower.includes('galpon') || lower.includes('galpón') || lower.includes('deposito') || lower.includes('depósito')) {
      category = 'deposito';
    } else if (lower.includes('local') || lower.includes('comercio') || lower.includes('comercial') || lower.includes('oficina')) {
      category = 'local';
    }

    // 3. Detectar Zona / Localidad de San José
    let neighborhood = 'San José de Mayo';
    if (lower.includes('molino')) neighborhood = 'Barrio Molino';
    else if (lower.includes('arriaga')) neighborhood = 'Barrio Arriaga';
    else if (lower.includes('hospital')) neighborhood = 'Zona Hospital';
    else if (lower.includes('mallada')) neighborhood = 'Parquización Arroyo Mallada';
    else if (lower.includes('playa pascual') || lower.includes('pascual')) neighborhood = 'Playa Pascual';
    else if (lower.includes('ciudad del plata') || lower.includes('delta del tigre') || lower.includes('santa monica') || lower.includes('santa mónica') || lower.includes('autodromo')) neighborhood = 'Ciudad del Plata';
    else if (lower.includes('libertad') || lower.includes('colonia wilson')) neighborhood = 'Libertad';
    else if (lower.includes('ecilda') || lower.includes('paullier') || lower.includes('perazza')) neighborhood = 'Ecilda Paullier';
    else if (lower.includes('kiyu') || lower.includes('kiyú') || lower.includes('arazati') || lower.includes('cufre')) neighborhood = 'Kiyú';
    else if (lower.includes('ruta 1') || lower.includes('ruta 3') || lower.includes('ruta 11') || lower.includes('juan soler') || lower.includes('rodriguez') || lower.includes('ituzaingo') || lower.includes('valdez')) neighborhood = 'Eje Rutas / Libertad';
    else if (lower.includes('centro') || lower.includes('plaza')) neighborhood = 'Centro';

    // 4. Extraer Precio y Moneda
    let priceCurrency: 'USD' | 'UYU' = operation === 'alquiler' ? 'UYU' : 'USD';
    let priceAmount = '';
    const usdMatch = text.match(/(?:U\$S|USD|d[oó]lares)\s*([\d.,]+)/i);
    const uyuMatch = text.match(/(?:\$U|\$)\s*([\d.,]+)/i);
    if (usdMatch) {
      priceCurrency = 'USD';
      priceAmount = usdMatch[1].replace(/\./g, '').replace(/,/g, '');
    } else if (uyuMatch) {
      priceCurrency = 'UYU';
      priceAmount = uyuMatch[1].replace(/\./g, '').replace(/,/g, '');
    }

    // 5. Extraer Teléfono Uruguayo
    const phoneMatch = text.match(/(?:\+?598\s*0?9\d|09\d)[\s.\-_]?\d{3}[\s.\-_]?\d{3}/);
    const contactPhone = phoneMatch ? phoneMatch[0].trim() : formData.contactPhone;

    // 6. Extraer URL si fue pegada
    const urlMatch = text.match(/https?:\/\/[^\s]+/i);
    const sourceUrl = urlMatch ? urlMatch[0] : formData.sourceUrl;

    // 7. Detectar Fuente por URL
    let sourceName = formData.sourceName;
    if (sourceUrl.includes('mercadolibre')) sourceName = 'Mercado Libre (Dueño)';
    else if (sourceUrl.includes('facebook')) sourceName = 'Facebook Marketplace';
    else if (sourceUrl.includes('gallito')) sourceName = 'Gallito Luis (Trato Directo)';
    else if (sourceUrl.includes('infocasas')) sourceName = 'InfoCasas (Dueño)';

    // 8. Armar título limpio con la primera línea útil
    const firstLine = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l.length > 6 && !l.startsWith('http'));

    setFormData((prev) => ({
      ...prev,
      title: firstLine ? firstLine.slice(0, 95) : prev.title,
      operation,
      category,
      neighborhood,
      priceCurrency,
      priceAmount: priceAmount || prev.priceAmount,
      contactPhone: contactPhone || prev.contactPhone,
      sourceUrl: sourceUrl || prev.sourceUrl,
      sourceName,
      internalNotes: text.slice(0, 600),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Por favor ingresa un título o descripción breve del inmueble.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          operation: formData.operation,
          category: formData.category,
          neighborhood: formData.neighborhood,
          priceAmount: Number(formData.priceAmount) || 0,
          priceCurrency: formData.priceCurrency,
          contactName: formData.contactName.trim() || 'Dueño Particular',
          contactPhone: formData.contactPhone.trim(),
          sourceName: formData.sourceName,
          sourceUrl: formData.sourceUrl.trim(),
          internalNotes: formData.internalNotes.trim(),
          origin: 'dueno_directo',
          status: 'detectado',
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.listing) {
        onSuccess(data.data.listing);
        onClose();
      } else {
        setError(data.error || 'Error al guardar el aviso.');
      }
    } catch (err: unknown) {
      console.error('Error al registrar aviso:', err);
      setError('Error de conexión al guardar el aviso.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-[#2D0B28] via-[#43123C] to-[#5E1754] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                Cargar Aviso de Dueño Vende
              </h3>
              <p className="text-xs text-purple-200 font-medium">
                Captación rápida de Mercado Libre, Facebook Marketplace o Cartel en Calle
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-left">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Autocompletado Inteligente Pegando Texto */}
          <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-3.5 space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-black text-[#5E1754]">
              <ClipboardPaste className="w-3.5 h-3.5 text-[#E85D04]" />
              <span>Autocompletado Rápido (Opcional): Pegá el texto de Facebook o Mercado Libre</span>
            </label>
            <textarea
              rows={2}
              value={rawPasteText}
              onChange={(e) => handleSmartPaste(e.target.value)}
              placeholder="Pegá acá el texto completo del aviso y el sistema detectará solo el teléfono (099...), precio, zona y tipo de propiedad..."
              className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5E1754]/30"
            />
          </div>

          {/* Alerta si detecta inmobiliaria */}
          {competitorWarning.isCompetitor && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-amber-900">
                <strong>Atención:</strong> El texto contiene señales de inmobiliaria ({competitorWarning.reason}). Verificá que sea realmente un dueño particular.
              </div>
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Título o Identificación de la Propiedad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Casa 3 dormitorios con fondo y garaje en Barrio Molino"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5E1754]/30 focus:border-[#5E1754]"
            />
          </div>

          {/* Operación y Categoría */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Operación</label>
              <select
                value={formData.operation}
                onChange={(e) => setFormData({ ...formData, operation: e.target.value as 'venta' | 'alquiler' })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              >
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tipología</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as 'casa' | 'apartamento' | 'terreno' | 'chacra' | 'local' | 'deposito',
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              >
                <option value="casa">Casa</option>
                <option value="chacra">Campo / Chacra</option>
                <option value="terreno">Terreno / Solar</option>
                <option value="apartamento">Apartamento</option>
                <option value="local">Local Comercial</option>
                <option value="deposito">Galpón / Depósito</option>
              </select>
            </div>
          </div>

          {/* Localidad en San José y Precio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#5E1754]" />
                  <span>Zona / Localidad en San José</span>
                </span>
              </label>
              <select
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              >
                <option value="Centro">Centro / Plazas (SJM)</option>
                <option value="Barrio Molino">Barrio Molino (SJM)</option>
                <option value="Barrio Arriaga">Barrio Arriaga (SJM)</option>
                <option value="Zona Hospital">Zona Hospital (SJM)</option>
                <option value="Parquización Arroyo Mallada">Arroyo Mallada (SJM)</option>
                <option value="San José de Mayo">San José de Mayo (General)</option>
                <option value="Ciudad del Plata">Ciudad del Plata / Sta. Mónica</option>
                <option value="Playa Pascual">Playa Pascual</option>
                <option value="Libertad">Libertad</option>
                <option value="Ecilda Paullier">Ecilda Paullier</option>
                <option value="Kiyú">Kiyú / Costa</option>
                <option value="Eje Rutas / Libertad">Eje Rutas 1, 3 y 11 / Chacras</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#E85D04]" />
                  <span>Precio Pretendido</span>
                </span>
              </label>
              <div className="flex space-x-2">
                <select
                  value={formData.priceCurrency}
                  onChange={(e) => setFormData({ ...formData, priceCurrency: e.target.value as 'USD' | 'UYU' })}
                  className="w-24 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
                >
                  <option value="USD">USD</option>
                  <option value="UYU">UYU ($)</option>
                </select>
                <input
                  type="number"
                  placeholder="Ej. 85000"
                  value={formData.priceAmount}
                  onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
                />
              </div>
            </div>
          </div>

          {/* Contacto: Nombre y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Nombre del Dueño</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Ej. Juan Gómez (o Particular)"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Teléfono / WhatsApp</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Ej. 099 123 456"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              />
            </div>
          </div>

          {/* Origen y Enlace */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fuente / Dónde se detectó</label>
              <select
                value={formData.sourceName}
                onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              >
                <option value="Mercado Libre (Dueño)">Mercado Libre (Dueño)</option>
                <option value="Facebook Marketplace">Facebook Marketplace</option>
                <option value="Grupo de Facebook San José">Grupo de Facebook San José</option>
                <option value="Gallito Luis (Trato Directo)">Gallito Luis (Trato Directo)</option>
                <option value="Cartel en la calle">Cartel en la calle</option>
                <option value="Dato / Recomendación">Dato / Recomendación</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Enlace Web (Opcional)</span>
                </span>
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.sourceUrl}
                onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
              />
            </div>
          </div>

          {/* Notas Internas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              <span className="flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Notas Internas (Dirección exacta, padrón, estado, etc.)</span>
              </span>
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Cartel visto en calle Ituzaingó casi Artigas. Casa con rejas negras..."
              value={formData.internalNotes}
              onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5E1754]"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#E85D04] hover:bg-[#FF8500] text-white text-xs font-black shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar en el Radar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
