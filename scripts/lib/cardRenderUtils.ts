import fs from 'node:fs/promises';
import { chromium, type Browser } from 'playwright-core';
import sharp from 'sharp';

const BROWSER_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

export async function findBrowserExecutable(): Promise<string> {
  for (const candidate of BROWSER_CANDIDATES) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try next candidate
    }
  }
  throw new Error(
    'No se encontró Google Chrome ni Microsoft Edge instalado para renderizar las tarjetas.'
  );
}

export async function launchHeadlessBrowser(): Promise<Browser> {
  const executablePath = await findBrowserExecutable();
  return chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function fileToDataUri(filePath: string, mimeType: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export async function imageSourceToJpegDataUri(
  source: string,
  rootDir: string,
  targetWidth = 1080,
  targetHeight = 820
): Promise<string> {
  let rawBuffer: Buffer;
  if (source.startsWith('http://') || source.startsWith('https://')) {
    const res = await fetch(source);
    if (!res.ok) {
      throw new Error(`No se pudo descargar imagen remota (${res.status}): ${source}`);
    }
    rawBuffer = Buffer.from(await res.arrayBuffer());
  } else {
    const rel = source.replace(/^\/+/, '');
    rawBuffer = await fs.readFile(`${rootDir}/${rel}`);
  }

  const jpegBuffer = await sharp(rawBuffer)
    .resize(targetWidth, targetHeight, { fit: 'cover' })
    .jpeg({ quality: 88 })
    .toBuffer();

  return `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
}
