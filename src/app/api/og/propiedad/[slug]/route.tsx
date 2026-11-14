/* eslint-disable @next/next/no-img-element */
import fs from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import sharp from 'sharp';
import { findPropertyBySlugOrPrevious } from '@/lib/propertiesStore';
import {
  buildClosureSocialCaptureCopy,
  CLOSURE_THEME_MAP,
  getCategoryDisplayName,
  isClosedOrReservedStatus,
} from '@/components/admin/flyer-templates/closurePresets';

export const runtime = 'nodejs';

let cachedLogoDataUri: string | null = null;
let cachedFonts: { bold: Buffer; black: Buffer } | null = null;

async function getOgFonts(): Promise<Array<{ name: string; data: Buffer; weight: 700 | 900; style: 'normal' }>> {
  if (!cachedFonts) {
    const fontsDir = path.join(process.cwd(), 'src', 'app', 'api', 'og', 'fonts');
    const [bold, black] = await Promise.all([
      fs.readFile(path.join(fontsDir, 'Inter-Bold.ttf')),
      fs.readFile(path.join(fontsDir, 'Inter-Black.ttf')),
    ]);
    cachedFonts = { bold, black };
  }
  return [
    { name: 'Inter', data: cachedFonts.bold, weight: 700, style: 'normal' },
    { name: 'Inter', data: cachedFonts.black, weight: 900, style: 'normal' },
  ];
}

async function getLogoDataUri(): Promise<string | null> {
  if (cachedLogoDataUri) return cachedLogoDataUri;
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo-clean.png');
    const buf = await fs.readFile(logoPath);
    const resized = await sharp(buf)
      .resize({ height: 96, fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();
    cachedLogoDataUri = `data:image/png;base64,${resized.toString('base64')}`;
    return cachedLogoDataUri;
  } catch {
    return null;
  }
}

async function resolvePropertyPhotoDataUri(rawUrl?: string): Promise<string | null> {
  if (!rawUrl) return null;

  let sourceBuffer: Buffer | null = null;

  try {
    if (rawUrl.startsWith('data:')) {
      const commaIndex = rawUrl.indexOf(',');
      if (commaIndex === -1) return null;
      const base64Part = rawUrl.slice(commaIndex + 1);
      sourceBuffer = Buffer.from(base64Part, 'base64');
    } else if (rawUrl.startsWith('/')) {
      const cleanRel = rawUrl.split('?')[0].replace(/^\/+/, '');
      const absPath = path.join(process.cwd(), 'public', cleanRel);
      sourceBuffer = await fs.readFile(absPath);
    } else if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      try {
        const res = await fetch(rawUrl, { signal: controller.signal, cache: 'force-cache' });
        if (res.ok) {
          sourceBuffer = Buffer.from(await res.arrayBuffer());
        }
      } finally {
        clearTimeout(timer);
      }
    }

    if (!sourceBuffer) return null;

    const normalizedJpeg = await sharp(sourceBuffer)
      .rotate()
      .resize(1200, 630, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 86, mozjpeg: true })
      .toBuffer();

    return `data:image/jpeg;base64,${normalizedJpeg.toString('base64')}`;
  } catch {
    return null;
  }
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const found = await findPropertyBySlugOrPrevious(slug);

  if (!found) {
    return new Response('Property not found', { status: 404 });
  }

  const { property } = found;
  const mainImage = property.images?.find((img) => img.isMain) || property.images?.[0];
  const rawPhoto = mainImage?.blobUrl || mainImage?.webpUrl || mainImage?.thumbnailUrl;

  const [logoDataUri, photoDataUri, fonts] = await Promise.all([
    getLogoDataUri(),
    resolvePropertyPhotoDataUri(rawPhoto),
    getOgFonts(),
  ]);

  const isClosedOrReserved = isClosedOrReservedStatus(property.status);
  const capture = buildClosureSocialCaptureCopy(property);
  const theme = CLOSURE_THEME_MAP[capture.outcome];
  const categoryLabel = getCategoryDisplayName(property.category);

  const response = new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#2D0B28',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        {/* Foto protagonista 1200x630 */}
        {photoDataUri && (
          <img
            src={photoDataUri}
            alt={capture.cleanTitle}
            width={1200}
            height={630}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1200px',
              height: '630px',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Viñeta oscura para máximo contraste */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '630px',
            display: 'flex',
            backgroundImage:
              'linear-gradient(180deg, rgba(25,10,24,0.68) 0%, rgba(15,23,42,0.16) 40%, rgba(25,10,24,0.92) 100%)',
          }}
        />

        {/* Barra superior: Marca + Categoría + Referencia */}
        <div
          style={{
            position: 'absolute',
            top: '28px',
            left: '36px',
            right: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.96)',
              borderRadius: '18px',
              padding: '10px 20px',
              border: '2px solid rgba(255,184,0,0.65)',
              boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
            }}
          >
            {logoDataUri && (
              <img
                src={logoDataUri}
                alt="Inmobiliaria Montaño"
                width={52}
                height={52}
                style={{ objectFit: 'contain', marginRight: '14px' }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#5E1754',
                  letterSpacing: '0.02em',
                }}
              >
                INMOBILIARIA MONTAÑO
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#475569',
                  marginTop: '2px',
                }}
              >
                <span style={{ color: '#0F172A', fontWeight: 900, marginRight: '5px' }}>5.0</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginRight: '6px' }}>
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <svg key={idx} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span>Calificación en Google • San José</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: 'rgba(255,255,255,0.96)',
                color: '#5E1754',
                fontSize: '16px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '10px 18px',
                borderRadius: '14px',
              }}
            >
              {categoryLabel}
            </div>
            <div
              style={{
                display: 'flex',
                backgroundColor: 'rgba(15,23,42,0.85)',
                color: '#FFFFFF',
                border: '2px solid rgba(255,255,255,0.35)',
                fontSize: '16px',
                fontWeight: 700,
                padding: '10px 18px',
                borderRadius: '14px',
              }}
            >
              Ref. #{property.codeRef}
            </div>
          </div>
        </div>

        {/* Faja Diagonal Oficial (VENDIÓ / ALQUILÓ / RESERVÓ) */}
        {isClosedOrReserved && (
          <div
            style={{
              position: 'absolute',
              top: '235px',
              left: '-140px',
              width: '1480px',
              height: '112px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.ribbonBg,
              borderTop: '5px solid #FFFFFF',
              borderBottom: '5px solid #FFFFFF',
              transform: 'rotate(-9deg)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.65)',
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                fontSize: '64px',
                fontWeight: 900,
                letterSpacing: '0.16em',
              }}
            >
              {capture.outcome}
            </span>
          </div>
        )}

        {/* Franja inferior de captación para propietarios */}
        <div
          style={{
            position: 'absolute',
            bottom: '26px',
            left: '36px',
            right: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(29, 8, 28, 0.94)',
            border: '2px solid rgba(255,184,0,0.45)',
            borderRadius: '20px',
            padding: '18px 26px',
            boxShadow: '0 14px 36px rgba(0,0,0,0.45)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '830px' }}>
            <span
              style={{
                color: '#FFD166',
                fontSize: '23px',
                fontWeight: 900,
                letterSpacing: '-0.01em',
              }}
            >
              {isClosedOrReserved
                ? capture.ogBannerLine
                : `${capture.cleanTitle} • ${capture.zoneLabel}`}
            </span>
            <span
              style={{
                color: '#F8FAFC',
                fontSize: '18px',
                fontWeight: 700,
                marginTop: '4px',
              }}
            >
              {isClosedOrReserved
                ? capture.ogBannerSubline
                : 'Consultá detalles, fotos y ubicación con Inmobiliaria Montaño'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundImage: 'linear-gradient(135deg, #E85D04 0%, #FF6B00 100%)',
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: 900,
              padding: '12px 24px',
              borderRadius: '14px',
              border: '2px solid rgba(255,255,255,0.28)',
            }}
          >
            092 776 715
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  );

  return response;
}
