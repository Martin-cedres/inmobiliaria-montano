#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const url = process.argv[2] || 'http://localhost:3001';
const outputFile = path.join(process.cwd(), 'temp-desktop-audit.json');

console.log(`Iniciando auditoría desktop para: ${url} ...`);
const cmd = `npx lighthouse "${url}" --output=json --output-path="${outputFile}" --only-categories=performance,accessibility,best-practices,seo --preset=desktop --chrome-flags="--headless=new --no-sandbox"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  const audit = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
  const cats = audit.categories;
  const a = audit.audits;

  console.log('\n==============================================');
  console.log('            RESULTADOS LIGHTHOUSE DESKTOP     ');
  console.log('==============================================');
  console.log(`Rendimiento (Performance):   ${Math.round((cats.performance?.score || 0) * 100)} / 100`);
  console.log(`Accesibilidad:               ${Math.round((cats.accessibility?.score || 0) * 100)} / 100`);
  console.log(`Buenas Prácticas:            ${Math.round((cats['best-practices']?.score || 0) * 100)} / 100`);
  console.log(`SEO:                         ${Math.round((cats.seo?.score || 0) * 100)} / 100`);

  console.log('\n---------------- CORE WEB VITALS -------------');
  console.log(`FCP (First Contentful Paint):    ${a['first-contentful-paint']?.displayValue}`);
  console.log(`LCP (Largest Contentful Paint):  ${a['largest-contentful-paint']?.displayValue}`);
  console.log(`TBT (Total Blocking Time):       ${a['total-blocking-time']?.displayValue}`);
  console.log(`CLS (Cumulative Layout Shift):   ${a['cumulative-layout-shift']?.displayValue}`);
  console.log(`Speed Index:                     ${a['speed-index']?.displayValue}`);

  fs.copyFileSync(outputFile, path.join(process.cwd(), 'desktop-last-audit.json'));
  fs.unlinkSync(outputFile);
} catch (err) {
  console.error('Error durante la ejecución de Lighthouse:', err.message);
  if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  process.exit(1);
}
