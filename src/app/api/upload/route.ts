import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
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

    for (let i = 0; i < images.length; i++) {
      const imgData = images[i];
      const assetId = `img-${Date.now()}-${i}`;
      let finalUrl = imgData;

      if (typeof imgData === 'string' && imgData.startsWith('data:image/')) {
        const mimeTypeMatch = imgData.match(/^data:(image\/\w+);base64,/);
        const contentType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/webp';
        const ext = contentType.split('/')[1] || 'webp';
        const fileName = `${assetId}.${ext}`;
        const base64Data = imgData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // 1. Si Vercel Blob Token está configurado (Vercel Cloud CDN)
        if (process.env.BLOB_READ_WRITE_TOKEN) {
          try {
            const blob = await put(`properties/${fileName}`, buffer, {
              access: 'public',
              contentType,
            });
            finalUrl = blob.url;
          } catch (blobErr) {
            console.error('Error al subir a Vercel Blob:', blobErr);
          }
        }

        // 2. Si no hay token de Blob o falló, intentar guardar en disco local (/public/uploads/)
        if (finalUrl === imgData) {
          try {
            await fs.mkdir(uploadDir, { recursive: true });
            const filePath = path.join(uploadDir, fileName);
            await fs.writeFile(filePath, buffer);
            finalUrl = `/uploads/properties/${fileName}`;
          } catch (fileErr) {
            console.warn('Usando Data URL directa debido a entorno serverless sin Vercel Blob:', fileErr);
          }
        }
      }

      processedAssets.push({
        id: assetId,
        blobUrl: finalUrl,
        webpUrl: finalUrl,
        thumbnailUrl: finalUrl,
        altText: `${propertyTitle || 'Foto de Propiedad'} - Imagen ${i + 1}`,
        isMain: i === 0,
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
