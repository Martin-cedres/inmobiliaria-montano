import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import {
  ACTIVE_DEMAND_PROFILES,
  GOOGLE_MAPS_STATS,
  type ActiveDemandProfile,
} from '../src/data/reviewsAndDemands';

interface CardMediaMapping {
  filename: string;
  backgroundImage: string;
  hookTitle: string;
}

const CARD_MEDIA_BY_ID: Record<string, CardMediaMapping> = {
  'dem-venta-casas-bhu': {
    filename: '01-busqueda-compra-casas-bhu.jpg',
    backgroundImage: 'public/images/sample-house-1.webp',
    hookTitle: '¿Tenés una casa para vender?',
  },
  'dem-alquiler-residencial': {
    filename: '02-busqueda-alquiler-vivienda.jpg',
    backgroundImage: 'public/images/sample-apto-1.webp',
    hookTitle: '¿Tenés casa o apto para alquilar?',
  },
  'dem-venta-terrenos': {
    filename: '03-busqueda-compra-terrenos.jpg',
    backgroundImage: 'public/images/sample-terreno-1.webp',
    hookTitle: '¿Tenés un terreno para vender?',
  },
  'dem-alquiler-comercial': {
    filename: '04-busqueda-alquiler-comercial.jpg',
    backgroundImage: 'public/images/sample-deposito-1.webp',
    hookTitle: '¿Tenés local o galpón disponible?',
  },
  'dem-venta-chacras': {
    filename: '05-busqueda-compra-chacras.jpg',
    backgroundImage: 'public/images/sample-chacra-1.webp',
    hookTitle: '¿Tenés chacra o campo en venta?',
  },
  'dem-venta-inversion': {
    filename: '06-busqueda-compra-inversion.jpg',
    backgroundImage: 'public/images/sample-house-2.webp',
    hookTitle: '¿Querés vender rápido al contado?',
  },
};

const BROWSER_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

async function findBrowserExecutable(): Promise<string> {
  for (const candidate of BROWSER_CANDIDATES) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try next browser path
    }
  }
  throw new Error(
    'No se encontró Google Chrome ni Microsoft Edge instalado para renderizar las tarjetas.'
  );
}

async function fileToDataUri(filePath: string, mimeType: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

async function webpToJpegDataUri(filePath: string): Promise<string> {
  const jpegBuffer = await sharp(filePath)
    .resize(1080, 960, { fit: 'cover' })
    .jpeg({ quality: 82 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildCardHtml(
  profile: ActiveDemandProfile,
  media: CardMediaMapping,
  logoDataUri: string,
  bgDataUri: string
): string {
  const isAlquiler = profile.operation === 'alquiler';
  const badgeColor = isAlquiler ? '#5E1754' : '#C2410C';
  const badgeLabel = isAlquiler ? 'Búsqueda de Alquiler' : 'Búsqueda de Compra';
  const ctaGradient = isAlquiler
    ? 'linear-gradient(135deg, #5E1754 0%, #832776 100%)'
    : 'linear-gradient(135deg, #C2410C 0%, #E85D04 100%)';

  const operationIcon = isAlquiler
    ? `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`
    : `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      font-family: 'Segoe UI Variable', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background: #2D0B28;
      color: #0F172A;
    }
    .canvas {
      position: relative;
      width: 1080px;
      height: 1920px;
      background: linear-gradient(165deg, #2D0B28 0%, #4A1142 42%, #23071F 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 132px 60px 185px 60px;
    }
    .bg-photo {
      position: absolute;
      top: 0;
      left: 0;
      width: 1080px;
      height: 820px;
      background-image: url('${bgDataUri}');
      background-size: cover;
      background-position: center;
      opacity: 0.18;
      filter: saturate(1.05);
    }
    .bg-photo-fade {
      position: absolute;
      top: 0;
      left: 0;
      width: 1080px;
      height: 860px;
      background: linear-gradient(180deg, rgba(45, 11, 40, 0.72) 0%, rgba(45, 11, 40, 0.55) 45%, #3B0E35 96%);
    }
    .glow-top {
      position: absolute;
      top: -120px;
      right: -120px;
      width: 520px;
      height: 520px;
      border-radius: 9999px;
      background: radial-gradient(circle, rgba(255, 184, 0, 0.20) 0%, rgba(255, 184, 0, 0) 70%);
    }
    .glow-bottom {
      position: absolute;
      bottom: -80px;
      left: -120px;
      width: 560px;
      height: 560px;
      border-radius: 9999px;
      background: radial-gradient(circle, rgba(232, 93, 4, 0.22) 0%, rgba(232, 93, 4, 0) 70%);
    }
    .layer {
      position: relative;
      z-index: 2;
    }

    /* Header con Logo Corporativo */
    .brand-bar {
      background: rgba(255, 255, 255, 0.98);
      border-radius: 30px;
      padding: 20px 34px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      box-shadow: 0 20px 50px rgba(10, 2, 12, 0.35);
      border: 2px solid rgba(255, 184, 0, 0.45);
    }
    .logo-wrap {
      display: flex;
      align-items: center;
      gap: 22px;
    }
    .logo-img {
      height: 118px;
      width: auto;
      display: block;
      flex-shrink: 0;
    }
    .brand-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .brand-meta-title {
      font-size: 24px;
      font-weight: 900;
      color: #5E1754;
      letter-spacing: -0.01em;
      text-transform: uppercase;
    }
    .brand-meta-services {
      font-size: 20px;
      font-weight: 700;
      color: #64748B;
    }
    .trust-pill {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      padding-left: 24px;
      border-left: 2px solid #E2E8F0;
    }
    .rating-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 26px;
      font-weight: 900;
      color: #0F172A;
    }
    .stars {
      color: #F59E0B;
      letter-spacing: 2px;
      font-size: 24px;
    }
    .trust-sub {
      font-size: 20px;
      font-weight: 700;
      color: #475569;
    }
    .city-tag {
      font-size: 18px;
      font-weight: 800;
      color: #5E1754;
      background: #F5EAF4;
      padding: 4px 14px;
      border-radius: 999px;
    }

    /* Hook de Estado WhatsApp */
    .hook-section {
      text-align: center;
      margin: 26px 0 22px 0;
    }
    .hook-kicker {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 184, 0, 0.16);
      border: 2px solid rgba(255, 184, 0, 0.55);
      color: #FFD166;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 10px 26px;
      border-radius: 999px;
      margin-bottom: 16px;
    }
    .hook-title {
      font-size: 52px;
      font-weight: 900;
      color: #FFFFFF;
      line-height: 1.1;
      letter-spacing: -0.02em;
      text-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
    }

    /* Tarjeta Principal (mismo lenguaje que ActiveDemandBoard) */
    .demand-card {
      background: #FFFFFF;
      border-radius: 42px;
      padding: 46px 46px 42px 46px;
      box-shadow: 0 34px 80px rgba(8, 2, 12, 0.52);
      border: 2px solid rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      gap: 28px;
      position: relative;
      overflow: hidden;
    }
    .card-accent-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 12px;
      background: ${isAlquiler ? 'linear-gradient(90deg, #5E1754, #E85D04)' : 'linear-gradient(90deg, #C2410C, #FFB800)'};
    }
    .card-badges {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-top: 6px;
    }
    .op-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: ${badgeColor};
      color: #FFFFFF;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 14px 24px;
      border-radius: 16px;
    }
    .cat-badge {
      font-size: 24px;
      font-weight: 800;
      color: #475569;
      background: #F1F5F9;
      padding: 12px 22px;
      border-radius: 14px;
    }
    .card-title {
      font-size: 43px;
      font-weight: 900;
      color: #0F172A;
      line-height: 1.18;
      letter-spacing: -0.02em;
      text-wrap: balance;
    }
    .card-desc {
      font-size: 28px;
      font-weight: 500;
      color: #475569;
      line-height: 1.42;
    }
    .specs-stack {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .spec-box {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      background: #F8FAFC;
      border: 2px solid #E2E8F0;
      border-radius: 24px;
      padding: 24px 26px;
    }
    .spec-icon {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .spec-icon-zone {
      background: #FFF0E6;
      color: #E85D04;
    }
    .spec-icon-backing {
      background: #ECFDF5;
      color: #059669;
    }
    .spec-label {
      font-size: 20px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #64748B;
      margin-bottom: 4px;
    }
    .spec-value {
      font-size: 26px;
      font-weight: 700;
      color: #0F172A;
      line-height: 1.32;
    }

    /* CTA dentro de la tarjeta */
    .cta-box {
      background: ${ctaGradient};
      color: #FFFFFF;
      border-radius: 26px;
      padding: 26px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      box-shadow: 0 14px 32px rgba(94, 23, 84, 0.28);
    }
    .cta-left {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .wa-circle {
      width: 64px;
      height: 64px;
      border-radius: 9999px;
      background: #25D366;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 6px 18px rgba(37, 211, 102, 0.4);
    }
    .cta-text-top {
      font-size: 27px;
      font-weight: 900;
      line-height: 1.2;
    }
    .cta-text-sub {
      font-size: 21px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      margin-top: 3px;
    }
    .cta-phone {
      background: rgba(255, 255, 255, 0.16);
      border: 1.5px solid rgba(255, 255, 255, 0.4);
      border-radius: 18px;
      padding: 12px 22px;
      font-size: 28px;
      font-weight: 900;
      white-space: nowrap;
    }

    /* Footer de marca */
    .footer-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 28px;
      text-align: center;
    }
    .contact-line {
      display: inline-flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.10);
      border: 1.5px solid rgba(255, 184, 0, 0.35);
      padding: 14px 32px;
      border-radius: 999px;
      font-size: 24px;
      font-weight: 800;
      color: #FFD166;
      letter-spacing: 0.01em;
    }
  </style>
</head>
<body>
  <div class="canvas">
    <div class="bg-photo"></div>
    <div class="bg-photo-fade"></div>
    <div class="glow-top"></div>
    <div class="glow-bottom"></div>

    <!-- Header -->
    <div class="layer brand-bar">
      <div class="logo-wrap">
        <img class="logo-img" src="${logoDataUri}" alt="Inmobiliaria Montaño" />
        <div class="brand-meta">
          <div class="brand-meta-title">Inmobiliaria Montaño</div>
          <div class="brand-meta-services">Ventas • Alquileres • Tasaciones</div>
        </div>
      </div>
      <div class="trust-pill">
        <div class="rating-row">
          <span class="stars">★★★★★</span>
          <span>${GOOGLE_MAPS_STATS.ratingValue.toFixed(1)}</span>
        </div>
        <div class="trust-sub">Calificación en Google</div>
        <div class="city-tag">San José de Mayo</div>
      </div>
    </div>

    <!-- Hook -->
    <div class="layer hook-section">
      <div class="hook-kicker">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <span>Demanda Activa de Clientes</span>
      </div>
      <div class="hook-title">${escapeHtml(media.hookTitle)}</div>
    </div>

    <!-- Main Card -->
    <main class="layer demand-card">
      <div class="card-accent-top"></div>

      <div class="card-badges">
        <span class="op-badge">
          ${operationIcon}
          <span>${escapeHtml(badgeLabel)}</span>
        </span>
        <span class="cat-badge">${escapeHtml(profile.categoryTag)}</span>
      </div>

      <h1 class="card-title">${escapeHtml(profile.title)}</h1>
      <p class="card-desc">${escapeHtml(profile.description)}</p>

      <div class="specs-stack">
        <div class="spec-box">
          <div class="spec-icon spec-icon-zone">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <div class="spec-label">Zonas Buscadas</div>
            <div class="spec-value">${escapeHtml(profile.zones)}</div>
          </div>
        </div>

        <div class="spec-box">
          <div class="spec-icon spec-icon-backing">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div>
            <div class="spec-label">Respaldo de Interesados</div>
            <div class="spec-value">${escapeHtml(profile.backing)}</div>
          </div>
        </div>
      </div>

      <div class="cta-box">
        <div class="cta-left">
          <div class="wa-circle">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.72 2.74 4.23 3.73.59.23 1.05.37 1.41.48.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43z"/></svg>
          </div>
          <div>
            <div class="cta-text-top">Tengo una propiedad así</div>
            <div class="cta-text-sub">Respondé este estado y conversamos</div>
          </div>
        </div>
        <div class="cta-phone">092 776 715</div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="layer footer-block">
      <div class="contact-line">25 de Mayo 338, San José  •  www.inmobiliariamontano.uy</div>
    </footer>
  </div>
</body>
</html>`;
}

async function main() {
  const rootDir = process.cwd();
  const outDir = path.join(rootDir, 'public', 'estados-whatsapp');
  await fs.mkdir(outDir, { recursive: true });

  const logoPath = path.join(rootDir, 'public', 'logo-clean.png');
  const logoDataUri = await fileToDataUri(logoPath, 'image/png');
  const executablePath = await findBrowserExecutable();

  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1080, height: 1920 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const profile of ACTIVE_DEMAND_PROFILES) {
      const media = CARD_MEDIA_BY_ID[profile.id];
      if (!media) {
        continue;
      }

      const bgPath = path.join(rootDir, media.backgroundImage);
      const bgDataUri = await webpToJpegDataUri(bgPath);
      const html = buildCardHtml(profile, media, logoDataUri, bgDataUri);

      await page.setContent(html, { waitUntil: 'load' });
      const pngBuffer = await page.screenshot({ type: 'png' });

      const outPath = path.join(outDir, media.filename);
      await sharp(pngBuffer)
        .jpeg({ quality: 92, mozjpeg: true })
        .toFile(outPath);

      console.log(`Generada: public/estados-whatsapp/${media.filename}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Error al generar tarjetas JPG:', err);
  process.exit(1);
});
