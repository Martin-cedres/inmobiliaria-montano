import { NextRequest, NextResponse } from 'next/server';
import { findPropertyBySlugOrPrevious } from '@/lib/propertiesStore';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return new NextResponse('Slug is required', { status: 400 });
  }

  const result = await findPropertyBySlugOrPrevious(slug);
  if (!result) {
    return new NextResponse('Property not found', { status: 404 });
  }

  const property = result.property;
  const isReserved = property.status === 'reservado';
  const isSold = property.status === 'vendido';
  const isRented = property.status === 'alquilado';

  const statusText = isReserved ? 'RESERVADA' : isSold ? 'VENDIDA' : isRented ? 'ALQUILADA' : '';
  const bannerBg = isReserved ? '#f59e0b' : '#dc2626';

  // Obtener la imagen base
  const mainImage = property.images?.find((img) => img.isMain) || property.images?.[0];
  const rawImg = mainImage?.webpUrl || mainImage?.blobUrl;
  
  let imageBuffer: Buffer;
  try {
    if (rawImg && rawImg.startsWith('http')) {
      const res = await fetch(rawImg);
      const arrayBuf = await res.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuf);
    } else if (rawImg && rawImg.startsWith('/')) {
      const localPath = path.join(process.cwd(), 'public', rawImg);
      if (fs.existsSync(localPath)) {
        imageBuffer = fs.readFileSync(localPath);
      } else {
        imageBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'logo.png'));
      }
    } else {
      imageBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'logo.png'));
    }
  } catch {
    imageBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'logo.png'));
  }

  // Redimensionar la imagen base a 1200x630
  const baseImage = sharp(imageBuffer).resize(1200, 630, { fit: 'cover' });

  // Escapar caracteres XML para el SVG
  const safeTitle = (property.title || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const truncatedTitle = safeTitle.length > 55 ? safeTitle.substring(0, 52) + '...' : safeTitle;
  
  const hood = (property.location?.neighborhood || 'San José de Mayo')
    .replace(/&/g, '&amp;')
    .toUpperCase();

  // Construir SVG de superposición con nitidez vectorial
  const svgOverlay = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="darkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.8" />
          <stop offset="50%" stop-color="#000000" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.5" />
        </linearGradient>
      </defs>

      <!-- Gradiente oscuro para contraste -->
      <rect width="1200" height="630" fill="url(#darkGrad)" />

      <!-- Top Header: Logo / Ref -->
      <rect x="40" y="30" width="310" height="52" rx="26" fill="#ffffff" fill-opacity="0.95" />
      <text x="195" y="64" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#5E1754" text-anchor="middle" letter-spacing="1">INMOBILIARIA MONTAÑO</text>

      <rect x="1000" y="30" width="160" height="52" rx="26" fill="#e85d04" />
      <text x="1080" y="64" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#ffffff" text-anchor="middle">REF. #${property.codeRef}</text>

      ${
        statusText
          ? `
      <!-- Banda transversal de estado con rotación y micro-bordes blancos -->
      <g transform="rotate(-3 600 315)">
        <rect x="-100" y="272" width="1400" height="86" fill="${bannerBg}" stroke="#ffffff" stroke-width="3" stroke-opacity="0.7" />
        <text x="600" y="333" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="10">${statusText}</text>
      </g>
      `
          : ''
      }

      <!-- Bottom Bar: Ubicación y Título -->
      <text x="40" y="540" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800" fill="#f59e0b" letter-spacing="2">
        ${hood}, SAN JOSÉ
      </text>
      <text x="40" y="582" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" fill="#ffffff">
        ${truncatedTitle}
      </text>
    </svg>
  `;

  const finalBuffer = await baseImage
    .composite([
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
    ])
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();

  return new NextResponse(finalBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  });
}
