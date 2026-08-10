import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ImageAsset } from '@/types/property';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { images, propertyTitle } = body; // images: string[] (Data URLs or URLs)

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'No se recibieron imágenes válidas.' },
        { status: 400 }
      );
    }

    const processedAssets: ImageAsset[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'properties');

    // Intentar crear la carpeta de descargas en desarrollo local
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch {
      // Ignorar si no hay permisos de escritura (Serverless / Vercel)
    }

    for (let i = 0; i < images.length; i++) {
      const imgData = images[i];
      const assetId = `img-${Date.now()}-${i}`;
      let finalUrl = imgData;

      // Si es una Data URL en base64 y estamos en local, intentar guardarla en el sistema de archivos
      if (typeof imgData === 'string' && imgData.startsWith('data:image/')) {
        try {
          const base64Data = imgData.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const fileName = `${assetId}.webp`;
          const filePath = path.join(uploadDir, fileName);

          await fs.writeFile(filePath, buffer);
          finalUrl = `/uploads/properties/${fileName}`;
        } catch (fileErr) {
          console.warn('Almacenando Data URL directa debido a entorno serverless:', fileErr);
          finalUrl = imgData; // Fallback serverless
        }
      }

      processedAssets.push({
        id: assetId,
        blobUrl: finalUrl,
        webpUrl: finalUrl,
        thumbnailUrl: finalUrl,
        altText: `${propertyTitle || 'Foto de Propiedad'} - Imagen ${i + 1}`,
        isMain: i === 0, // Por defecto la primera es la portada
      });
    }

    return NextResponse.json({
      success: true,
      assets: processedAssets,
    });
  } catch (error: any) {
    console.error('Error al procesar imágenes:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al guardar imágenes.' },
      { status: 500 }
    );
  }
}
