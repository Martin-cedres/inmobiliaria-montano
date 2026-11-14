import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { Property } from '../src/types/property';
import {
  buildDefaultClosureCopy,
  CLOSURE_THEME_MAP,
  isClosedOrReservedStatus,
} from '../src/components/admin/flyer-templates/closurePresets';
import {
  escapeHtml,
  fileToDataUri,
  imageSourceToJpegDataUri,
  launchHeadlessBrowser,
} from './lib/cardRenderUtils';

type TargetFormat = '9x16' | '4x5';

interface FormatSpec {
  id: TargetFormat;
  folder: string;
  width: number;
  height: number;
  photoHeight: number;
  paddingCss: string;
}

const FORMATS: FormatSpec[] = [
  {
    id: '9x16',
    folder: 'whatsapp-9x16',
    width: 1080,
    height: 1920,
    photoHeight: 500,
    paddingCss: '126px 60px 175px 60px',
  },
  {
    id: '4x5',
    folder: 'facebook-4x5',
    width: 1080,
    height: 1350,
    photoHeight: 380,
    paddingCss: '46px 56px 50px 56px',
  },
];

function buildClosureCardHtml(
  property: Property,
  format: FormatSpec,
  logoDataUri: string,
  photoDataUri: string
): string {
  const copy = buildDefaultClosureCopy(property);
  const theme = CLOSURE_THEME_MAP[copy.outcome];
  const isStory = format.id === '9x16';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: ${format.width}px;
      height: ${format.height}px;
      overflow: hidden;
      font-family: 'Segoe UI Variable', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background: #2D0B28;
      color: #0F172A;
    }
    .canvas {
      position: relative;
      width: ${format.width}px;
      height: ${format.height}px;
      background: linear-gradient(165deg, #2D0B28 0%, #4A1142 42%, #23071F 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: ${format.paddingCss};
    }
    .bg-photo {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: ${Math.round(format.height * 0.48)}px;
      background-image: url('${photoDataUri}');
      background-size: cover;
      background-position: center;
      opacity: 0.16;
    }
    .bg-fade {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: ${Math.round(format.height * 0.50)}px;
      background: linear-gradient(180deg, rgba(45,11,40,0.68) 0%, rgba(45,11,40,0.48) 45%, #3B0E35 96%);
    }
    .glow-top {
      position: absolute;
      top: -120px; right: -120px;
      width: 520px; height: 520px;
      border-radius: 9999px;
      background: radial-gradient(circle, rgba(255,184,0,0.20) 0%, rgba(255,184,0,0) 70%);
    }
    .glow-bottom {
      position: absolute;
      bottom: -90px; left: -120px;
      width: 560px; height: 560px;
      border-radius: 9999px;
      background: radial-gradient(circle, rgba(232,93,4,0.22) 0%, rgba(232,93,4,0) 70%);
    }
    .layer { position: relative; z-index: 2; }

    /* Cabecera Blanca Corporativa */
    .brand-bar {
      background: rgba(255,255,255,0.98);
      border-radius: 28px;
      padding: ${isStory ? '18px 34px' : '15px 30px'};
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      box-shadow: 0 20px 50px rgba(10, 2, 12, 0.35);
      border: 2px solid rgba(255, 184, 0, 0.45);
    }
    .logo-wrap { display: flex; align-items: center; gap: 22px; }
    .logo-img { height: ${isStory ? '106px' : '88px'}; width: auto; display: block; }
    .brand-meta-title {
      font-size: ${isStory ? '24px' : '22px'};
      font-weight: 900;
      color: #5E1754;
      text-transform: uppercase;
      letter-spacing: -0.01em;
    }
    .brand-meta-services {
      font-size: ${isStory ? '20px' : '18px'};
      font-weight: 700;
      color: #64748B;
      margin-top: 3px;
    }
    .trust-pill {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      padding-left: 22px;
      border-left: 2px solid #E2E8F0;
    }
    .rating-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 26px; font-weight: 900; color: #0F172A;
    }
    .stars { color: #F59E0B; letter-spacing: 2px; font-size: 22px; }
    .trust-sub { font-size: 18px; font-weight: 700; color: #475569; }
    .city-tag {
      font-size: 16px; font-weight: 800; color: #5E1754;
      background: #F5EAF4; padding: 4px 13px; border-radius: 999px; margin-top: 2px;
    }

    /* Hook superior */
    .hook-section {
      text-align: center;
      margin: ${isStory ? '18px 0 16px 0' : '10px 0 8px 0'};
    }
    .hook-kicker {
      display: inline-flex; align-items: center;
      background: rgba(255,184,0,0.16);
      border: 2px solid rgba(255,184,0,0.55);
      color: #FFD166;
      font-size: ${isStory ? '20px' : '18px'};
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: ${isStory ? '8px 24px' : '6px 20px'};
      border-radius: 999px;
      margin-bottom: ${isStory ? '12px' : '8px'};
    }
    .hook-title {
      font-size: ${isStory ? '58px' : '48px'};
      font-weight: 900;
      color: #FFFFFF;
      line-height: 1.08;
      letter-spacing: -0.025em;
      text-shadow: 0 6px 24px rgba(0,0,0,0.35);
    }

    /* Tarjeta blanca principal */
    .card {
      background: #FFFFFF;
      border-radius: 40px;
      padding: ${isStory ? '36px 40px' : '28px 34px'};
      box-shadow: 0 34px 80px rgba(8,2,12,0.52);
      border: 2px solid rgba(255,255,255,0.95);
      display: flex;
      flex-direction: column;
      gap: ${isStory ? '22px' : '16px'};
      position: relative;
      overflow: hidden;
    }
    .card-accent {
      position: absolute; top: 0; left: 0; right: 0;
      height: 10px;
      background: ${theme.accentGradient};
    }

    /* Foto + Faja Diagonal */
    .photo-box {
      position: relative;
      width: 100%;
      height: ${format.photoHeight}px;
      border-radius: 26px;
      overflow: hidden;
      background: #0F172A;
      border: 2px solid #E2E8F0;
      margin-top: 4px;
    }
    .photo-img {
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
    }
    .photo-grad {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.72) 100%);
    }
    .photo-top-badges {
      position: absolute; top: 18px; left: 18px; right: 18px;
      display: flex; align-items: center; justify-content: space-between;
      z-index: 3;
    }
    .cat-pill {
      background: rgba(255,255,255,0.96);
      color: #5E1754;
      font-size: 18px; font-weight: 900; text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 8px 18px; border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .ref-pill {
      background: rgba(15,23,42,0.75);
      color: #FFFFFF;
      border: 1.5px solid rgba(255,255,255,0.3);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 18px; font-weight: 800;
      padding: 8px 16px; border-radius: 12px;
    }
    .ribbon {
      position: absolute;
      left: -15%; right: -15%;
      top: 50%;
      transform: translateY(-50%) rotate(-11deg);
      background: ${theme.ribbonBg};
      border-top: 4px solid #FFFFFF;
      border-bottom: 4px solid #FFFFFF;
      padding: ${isStory ? '16px 0' : '12px 0'};
      text-align: center;
      box-shadow: 0 14px 36px rgba(0,0,0,0.65);
      z-index: 2;
    }
    .ribbon-text {
      color: #FFFFFF;
      font-size: ${isStory ? '54px' : '46px'};
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      text-shadow: 0 3px 10px rgba(0,0,0,0.45);
    }
    .zone-overlay {
      position: absolute; bottom: 18px; left: 18px; right: 18px;
      z-index: 3;
      display: flex;
    }
    .zone-chip {
      display: inline-flex; align-items: center; gap: 10px;
      background: rgba(15,23,42,0.78);
      border: 1.5px solid rgba(255,255,255,0.25);
      color: #FFFFFF;
      font-size: 20px; font-weight: 800;
      padding: 10px 18px; border-radius: 16px;
    }

    .prop-title {
      font-size: ${isStory ? '34px' : '28px'};
      font-weight: 900;
      color: #0F172A;
      line-height: 1.22;
      letter-spacing: -0.02em;
      text-wrap: balance;
    }

    .boxes {
      display: grid;
      grid-template-columns: 1fr;
      gap: ${isStory ? '14px' : '10px'};
    }
    .info-box {
      display: flex; flex-direction: column;
      background: #F8FAFC;
      border: 2px solid #E2E8F0;
      border-radius: 22px;
      padding: ${isStory ? '18px 22px' : '14px 18px'};
    }
    .info-label {
      font-size: 16px; font-weight: 900; text-transform: uppercase;
      letter-spacing: 0.06em; color: #64748B; margin-bottom: 3px;
    }
    .info-text {
      font-size: ${isStory ? '22px' : '19px'};
      font-weight: 700; color: #1E293B; line-height: 1.32;
    }

    /* CTA Captación */
    .cta-box {
      background: ${theme.ctaGradient};
      color: #FFFFFF;
      border-radius: 24px;
      padding: ${isStory ? '22px 28px' : '18px 24px'};
      display: flex; align-items: center; justify-content: space-between;
      gap: 18px;
      box-shadow: 0 14px 32px rgba(94,23,84,0.28);
    }
    .cta-left { display: flex; align-items: center; gap: 16px; }
    .wa-circle {
      width: 58px; height: 58px; border-radius: 9999px;
      background: #25D366;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 6px 18px rgba(37,211,102,0.4);
    }
    .cta-top { font-size: ${isStory ? '24px' : '22px'}; font-weight: 900; line-height: 1.2; }
    .cta-sub { font-size: ${isStory ? '19px' : '17px'}; font-weight: 600; color: rgba(255,255,255,0.92); margin-top: 2px; }
    .cta-phone {
      background: rgba(255,255,255,0.16);
      border: 1.5px solid rgba(255,255,255,0.45);
      border-radius: 16px;
      padding: 11px 20px;
      font-size: ${isStory ? '25px' : '23px'};
      font-weight: 900;
      white-space: nowrap;
    }

    /* Footer */
    .footer-block {
      display: flex; justify-content: center;
      margin-top: ${isStory ? '18px' : '12px'};
    }
    .contact-pill {
      display: inline-flex; align-items: center;
      background: rgba(255,255,255,0.10);
      border: 1.5px solid rgba(255,184,0,0.35);
      padding: ${isStory ? '13px 32px' : '10px 26px'};
      border-radius: 999px;
      font-size: ${isStory ? '22px' : '20px'};
      font-weight: 800;
      color: #FFD166;
    }
  </style>
</head>
<body>
  <div class="canvas">
    <div class="bg-photo"></div>
    <div class="bg-fade"></div>
    <div class="glow-top"></div>
    <div class="glow-bottom"></div>

    <header class="layer brand-bar">
      <div class="logo-wrap">
        <img class="logo-img" src="${logoDataUri}" alt="Inmobiliaria Montaño" />
        <div>
          <div class="brand-meta-title">Inmobiliaria Montaño</div>
          <div class="brand-meta-services">Ventas • Alquileres • Tasaciones</div>
        </div>
      </div>
      <div class="trust-pill">
        <div class="rating-row">
          <span class="stars">★★★★★</span>
          <span>5.0</span>
        </div>
        <div class="trust-sub">Calificación en Google</div>
        <div class="city-tag">San José de Mayo</div>
      </div>
    </header>

    <div class="layer hook-section">
      <div class="hook-kicker">${escapeHtml(theme.kicker)}</div>
      <div class="hook-title">${escapeHtml(theme.hookTitle)}</div>
    </div>

    <main class="layer card">
      <div class="card-accent"></div>

      <div class="photo-box">
        <img class="photo-img" src="${photoDataUri}" alt="${escapeHtml(copy.propertyTitle)}" />
        <div class="photo-grad"></div>

        <div class="photo-top-badges">
          <span class="cat-pill">${escapeHtml(copy.categoryLabel)}</span>
          <span class="ref-pill">Ref. #${escapeHtml(property.codeRef)}</span>
        </div>

        <div class="ribbon">
          <span class="ribbon-text">${escapeHtml(copy.outcome)}</span>
        </div>

        <div class="zone-overlay">
          <div class="zone-chip">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFB800" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${escapeHtml(copy.zoneLabel)}</span>
          </div>
        </div>
      </div>

      <h1 class="prop-title">${escapeHtml(copy.propertyTitle)}</h1>

      <div class="boxes">
        <div class="info-box">
          <div class="info-label">Operación Concretada</div>
          <div class="info-text">${escapeHtml(copy.proofText)}</div>
        </div>

        <div class="info-box">
          <div class="info-label">Clientes en Espera</div>
          <div class="info-text">${escapeHtml(copy.demandText)}</div>
        </div>
      </div>

      <div class="cta-box">
        <div class="cta-left">
          <div class="wa-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.72 2.74 4.23 3.73.59.23 1.05.37 1.41.48.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43z"/></svg>
          </div>
          <div>
            <div class="cta-top">${escapeHtml(copy.ctaTitle)}</div>
            <div class="cta-sub">${isStory ? 'Respondé este estado o escribinos' : 'Escribinos directo por WhatsApp'}</div>
          </div>
        </div>
        <div class="cta-phone">092 776 715</div>
      </div>
    </main>

    <footer class="layer footer-block">
      <div class="contact-pill">25 de Mayo 338, San José • www.inmobiliariamontano.uy</div>
    </footer>
  </div>
</body>
</html>`;
}

async function main() {
  const rootDir = process.cwd();
  const dbPath = path.join(rootDir, 'src', 'db', 'properties.json');
  const properties = JSON.parse(await fs.readFile(dbPath, 'utf8')) as Property[];

  const closedProperties = properties.filter((p) => isClosedOrReservedStatus(p.status));
  if (closedProperties.length === 0) {
    console.log('No hay propiedades vendidas, alquiladas o reservadas en properties.json.');
    return;
  }

  const logoDataUri = await fileToDataUri(path.join(rootDir, 'public', 'logo-clean.png'), 'image/png');
  const browser = await launchHeadlessBrowser();

  try {
    for (const property of closedProperties) {
      const mainImg = property.images?.find((img) => img.isMain) || property.images?.[0];
      const imgSource = mainImg?.webpUrl || mainImg?.blobUrl || '/logo.png';
      const photoDataUri = await imageSourceToJpegDataUri(imgSource, rootDir, 1080, 720);

      for (const fmt of FORMATS) {
        const outDir = path.join(rootDir, 'public', 'cierres-social', fmt.folder);
        await fs.mkdir(outDir, { recursive: true });

        const context = await browser.newContext({
          viewport: { width: fmt.width, height: fmt.height },
          deviceScaleFactor: 1,
        });
        const page = await context.newPage();

        try {
          const html = buildClosureCardHtml(property, fmt, logoDataUri, photoDataUri);
          await page.setContent(html, { waitUntil: 'load' });
          const pngBuffer = await page.screenshot({ type: 'png' });

          const slugStatus = property.status;
          const fileName = `${property.codeRef.toLowerCase()}-${slugStatus}-${fmt.id}.jpg`;
          const outPath = path.join(outDir, fileName);

          await sharp(pngBuffer).jpeg({ quality: 92, mozjpeg: true }).toFile(outPath);
          console.log(`Generada: public/cierres-social/${fmt.folder}/${fileName}`);
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Error generando tarjetas de cierre:', err);
  process.exit(1);
});
