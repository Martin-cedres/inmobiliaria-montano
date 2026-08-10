'use client';

import React, { useState, useRef } from 'react';
import { ImageAsset } from '@/types/property';
import { compressImageToWebP } from '@/lib/imageCompression';
import {
  UploadCloud,
  Star,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Plus,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';

interface ImageUploaderProps {
  images: ImageAsset[];
  onChange: (images: ImageAsset[]) => void;
  propertyTitle?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  propertyTitle = 'Propiedad',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carga y compresión de archivos locales
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFiles(Array.from(files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processFiles = async (fileList: File[]) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const compressedDataUrls: string[] = [];

      for (const file of fileList) {
        try {
          const dataUrl = await compressImageToWebP(file, {
            maxWidth: 1600,
            quality: 0.82,
            maxSizeBytes: 10 * 1024 * 1024,
          });
          compressedDataUrls.push(dataUrl);
        } catch (err: any) {
          setErrorMessage(err?.message || `Error al procesar '${file.name}'.`);
        }
      }

      if (compressedDataUrls.length > 0) {
        // Enviar a la API para persistir o procesar
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: compressedDataUrls,
            propertyTitle,
          }),
        });

        const data = await res.json();
        if (data.success && Array.isArray(data.assets)) {
          const newAssets: ImageAsset[] = data.assets;
          
          // Si no había imágenes previas, la primera es la portada principal
          let updatedList = [...images, ...newAssets];
          if (!updatedList.some((img) => img.isMain) && updatedList.length > 0) {
            updatedList[0].isMain = true;
          }
          
          onChange(updatedList);
        }
      }
    } catch (error: any) {
      setErrorMessage(error?.message || 'Ocurrió un error al subir las imágenes.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Añadir imagen externa por URL
  const handleAddExternalUrl = () => {
    if (!externalUrl.trim()) return;
    const newAsset: ImageAsset = {
      id: `url-${Date.now()}`,
      blobUrl: externalUrl.trim(),
      webpUrl: externalUrl.trim(),
      thumbnailUrl: externalUrl.trim(),
      altText: propertyTitle,
      isMain: images.length === 0, // Si es la primera, marcar portada
    };

    const updated = [...images, newAsset];
    onChange(updated);
    setExternalUrl('');
    setShowUrlInput(false);
  };

  // Establecer Portada Principal ⭐ (Asegura isMain único)
  const setMainCover = (index: number) => {
    const updated = images.map((img, idx) => ({
      ...img,
      isMain: idx === index,
    }));
    onChange(updated);
  };

  // Mover imagen a la izquierda ⬅️
  const moveLeft = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onChange(updated);
  };

  // Mover imagen a la derecha ➡️
  const moveRight = (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onChange(updated);
  };

  // Eliminar imagen 🗑️
  const removeImage = (index: number) => {
    const wasMain = images[index]?.isMain;
    const updated = images.filter((_, idx) => idx !== index);

    // Si eliminamos la portada y quedan fotos, reasignar portada a la primera
    if (wasMain && updated.length > 0) {
      updated[0].isMain = true;
    }

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Banner de Mensaje de Error */}
      {errorMessage && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Zona Drag & Drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isProcessing
            ? 'bg-purple-50/50 border-[#5E1754]/40 cursor-wait'
            : 'border-slate-300 hover:border-[#5E1754] bg-slate-50/60 hover:bg-purple-50/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          {isProcessing ? (
            <>
              <Loader2 className="w-10 h-10 text-[#5E1754] animate-spin" />
              <p className="text-xs font-bold text-[#5E1754]">
                Compresionando WebP y Optimizando Fotos...
              </p>
              <p className="text-[11px] text-slate-400">Preservando orientación EXIF nativa</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-[#5E1754]/10 text-[#5E1754] rounded-2xl flex items-center justify-center shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-slate-800">
                  Arrastrá y soltá las fotografías de la propiedad aquí
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  o hacé clic para explorar tus archivos (JPG, PNG, WebP — máx. 10MB por foto)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Botón para Ingresar URL Externa */}
      <div className="flex justify-between items-center text-xs">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="inline-flex items-center space-x-1.5 text-[#5E1754] hover:text-[#E85D04] font-bold transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlInput ? 'Ocultar ingreso por URL' : '+ Agregar imagen por URL web'}</span>
        </button>

        <span className="text-slate-400 font-medium">
          {images.length} {images.length === 1 ? 'fotografía cargada' : 'fotografías cargadas'}
        </span>
      </div>

      {/* Input de URL externa */}
      {showUrlInput && (
        <div className="flex space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#5E1754]"
          />
          <button
            type="button"
            onClick={handleAddExternalUrl}
            className="bg-[#5E1754] hover:bg-[#4a1242] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          >
            Agregar
          </button>
        </div>
      )}

      {/* Grilla de Miniaturas y Reordenamiento */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-extrabold uppercase text-slate-600">
            Galería & Foto Principal (Tocá ⭐ para elegir portada)
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => {
              const url = img.webpUrl || img.blobUrl;
              return (
                <div
                  key={img.id || idx}
                  className={`relative group rounded-xl overflow-hidden border-2 transition-all aspect-[4/3] ${
                    img.isMain
                      ? 'border-[#E85D04] shadow-md ring-2 ring-[#E85D04]/30'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={url}
                    alt={img.altText || 'Foto'}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay en Hover con Acciones */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    
                    {/* Top Row: Botón Estrella Portada */}
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setMainCover(idx)}
                        title={img.isMain ? 'Foto de Portada Actual' : 'Marcar como Portada Principal'}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 ${
                          img.isMain
                            ? 'bg-[#E85D04] text-white'
                            : 'bg-white/80 hover:bg-white text-slate-800'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${img.isMain ? 'fill-white' : ''}`} />
                        <span>{img.isMain ? 'Portada' : 'Elegir'}</span>
                      </button>

                      {/* Botón Eliminar */}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        title="Eliminar foto"
                        className="bg-red-600/80 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Row: Botones de Reordenamiento (Flechas) */}
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveLeft(idx)}
                        title="Mover a la izquierda"
                        className="bg-white/80 hover:bg-white text-slate-800 p-1 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-[10px] font-bold text-white bg-slate-800/80 px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>

                      <button
                        type="button"
                        disabled={idx === images.length - 1}
                        onClick={() => moveRight(idx)}
                        title="Mover a la derecha"
                        className="bg-white/80 hover:bg-white text-slate-800 p-1 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* Badge Fijo de Portada Principal si aplica */}
                  {img.isMain && (
                    <div className="absolute top-2 left-2 bg-[#E85D04] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow flex items-center space-x-1 pointer-events-none">
                      <Star className="w-3 h-3 fill-white" />
                      <span>PORTADA</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
