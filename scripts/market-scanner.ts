import fs from 'node:fs';
import path from 'node:path';
import { executeMarketScan } from '../src/lib/marketScanner';

// Cargar variables de entorno desde .env.local
if (process.loadEnvFile) {
  try {
    process.loadEnvFile('.env.local');
  } catch {
    // Silencioso
  }
} else {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  } catch {
    // Silencioso
  }
}

async function main() {
  const args = process.argv.slice(2);

  // Modo inicio de sesión único para Mercado Libre
  if (args.includes('--login-ml')) {
    console.log('==================================================================');
    console.log(' INICIANDO NAVEGADOR PARA CONECTAR SESIÓN DE MERCADO LIBRE UY');
    console.log(' 1. Iniciá sesión normalmente en la ventana de Chrome que se abrirá.');
    console.log(' 2. Una vez dentro de Mercado Libre, cerrá la ventana de Chrome.');
    console.log(' 3. Tu sesión quedará guardada localmente en tu PC.');
    console.log('==================================================================');
    const pw = require('playwright-core');
    const profileDir = path.join(process.cwd(), '.playwright-ml-profile');
    const context = await pw.chromium.launchPersistentContext(profileDir, {
      channel: 'chrome',
      headless: false,
      ignoreDefaultArgs: ['--enable-automation'],
      args: ['--disable-blink-features=AutomationControlled'],
      locale: 'es-UY',
    });
    const page = context.pages()[0] || (await context.newPage());
    await page.goto('https://inmuebles.mercadolibre.com.uy/san-jose/');
    await new Promise<void>((resolve) => {
      context.on('close', () => resolve());
    });
    console.log('[OK] Sesión de Mercado Libre guardada correctamente.');
    return;
  }

  console.log('==================================================================');
  console.log(' RADAR CAZADOR DE DUEÑOS VENDE — DEPARTAMENTO DE SAN JOSÉ');
  console.log(' Portales: El Gallito Luis + InfoCasas + Mercado Libre');
  console.log(' Operación: Venta y Alquiler | Todas las localidades y tipologías');
  console.log('==================================================================');

  const result = await executeMarketScan();

  console.log('==================================================================');
  console.log(' ESCANEO FINALIZADO CON ÉXITO');
  console.log(` Total Dueños Directos en Radar: ${result.totalListings}`);
  console.log(` Nuevos Dueños Detectados Hoy  : ${result.newEntriesCount}`);
  console.log(` Rebajas de Precio de Dueños   : ${result.priceDropsCount}`);
  console.log(' Base de datos sincronizada con https://www.inmobiliariamontano.uy/admin/mercado');
  console.log('==================================================================');
}

main().catch((err) => {
  console.error('[ERROR CRÍTICO EN ESCÁNER]:', err);
  process.exit(1);
});
