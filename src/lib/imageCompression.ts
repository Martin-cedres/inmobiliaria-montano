/**
 * Utilidad de compresión de imágenes en el cliente (Client-side WebP Compression)
 * Redimensiona imágenes hasta un ancho máximo manteniendo la relación de aspecto,
 * preserva la orientación EXIF nativa de celulares y comprime a WebP.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number; // p. ej. 10MB original
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export async function compressImageToWebP(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const maxWidth = options.maxWidth || 1600;
  const maxHeight = options.maxHeight || 1600;
  const quality = options.quality || 0.82;
  const maxSizeBytes = options.maxSizeBytes || 10 * 1024 * 1024; // 10MB

  // 1. Validar tipo de archivo
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`El formato '${file.type}' no es válido. Usá JPG, PNG, WebP o AVIF.`);
  }

  // 2. Validar tamaño máximo del archivo original
  if (file.size > maxSizeBytes) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`La imagen pesa ${sizeMB} MB. El límite máximo permitido es 10 MB por foto.`);
  }

  return new Promise((resolve, reject) => {
    // Intentar usar createImageBitmap con orientación EXIF automática
    if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
      createImageBitmap(file, { imageOrientation: 'from-image' })
        .then((bitmap) => {
          let { width, height } = bitmap;

          // Calcular proporciones manteniendo aspecto
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('No se pudo inicializar el contexto Canvas 2D.'));
            return;
          }

          ctx.drawImage(bitmap, 0, 0, width, height);
          bitmap.close();

          const dataUrl = canvas.toDataURL('image/webp', quality);
          resolve(dataUrl);
        })
        .catch(() => {
          // Fallback con HTMLImageElement nativo
          fallbackImageElement(file, maxWidth, maxHeight, quality, resolve, reject);
        });
    } else {
      fallbackImageElement(file, maxWidth, maxHeight, quality, resolve, reject);
    }
  });
}

function fallbackImageElement(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number,
  resolve: (res: string) => void,
  reject: (err: Error) => void
) {
  const img = new Image();
  const url = URL.createObjectURL(file);

  img.onload = () => {
    URL.revokeObjectURL(url);

    let { width, height } = img;

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('No se pudo inicializar Canvas.'));
      return;
    }

    ctx.drawImage(img, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/webp', quality);
    resolve(dataUrl);
  };

  img.onerror = () => {
    URL.revokeObjectURL(url);
    reject(new Error('Error al procesar el archivo de imagen.'));
  };

  img.src = url;
}
