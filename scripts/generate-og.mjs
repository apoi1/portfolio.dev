/**
 * Generates social/OG images (EN + ES) and the PNG favicon suite.
 * Run: npm run gen:og
 *
 * Requires the Onest variable font visible to fontconfig
 * (google/fonts ofl/onest) — falls back gracefully to system fonts.
 * Outputs are committed to public/ so Netlify builds stay pure-static.
 */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const copy = {
  en: {
    kicker: 'SYSTEMS ENGINEER — BOGOTÁ, COLOMBIA',
    role: 'Real-time signal systems · Full-stack web products',
    status: 'Open to work',
  },
  es: {
    kicker: 'INGENIERO DE SISTEMAS — BOGOTÁ, COLOMBIA',
    role: 'Sistemas en tiempo real · Productos web full-stack',
    status: 'Disponible para trabajar',
  },
};

const svg = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0V60" fill="none" stroke="#F4F1E8" stroke-opacity="0.045"/>
    </pattern>
    <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFB000" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#FFB000"/>
      <stop offset="1" stop-color="#34C77E" stop-opacity="0.2"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.5">
      <stop offset="0" stop-color="#FFB000" stop-opacity="0.20"/>
      <stop offset="1" stop-color="#FFB000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="#0D0C0A"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- radar top-right -->
  <g transform="translate(985 175)" stroke="#34C77E" fill="none">
    <circle r="40" stroke-opacity="0.45"/>
    <circle r="80" stroke-opacity="0.3"/>
    <circle r="120" stroke-opacity="0.18" stroke-dasharray="3 8"/>
    <circle r="18" fill="#34C77E" fill-opacity="0.85" stroke="none"/>
    <path d="M18 0 L170 -95" stroke-opacity="0.5"/>
    <path d="M18 0 L150 120" stroke-opacity="0.5"/>
  </g>

  <!-- kicker -->
  <text x="80" y="150" font-family="DejaVu Sans Mono, monospace" font-size="21" letter-spacing="7" fill="#ABA595">${c.kicker}</text>
  <rect x="80" y="172" width="64" height="3" fill="#FFB000"/>

  <!-- name -->
  <text x="76" y="300" font-family="Onest, sans-serif" font-weight="900" font-size="118" letter-spacing="-3" fill="#F4F1E8">Julián Ruiz</text>
  <text x="80" y="368" font-family="Onest, sans-serif" font-weight="800" font-size="52" fill="#FFB000">apoi2</text>

  <!-- role -->
  <text x="80" y="432" font-family="Onest, sans-serif" font-weight="500" font-size="29" fill="#ABA595">${c.role}</text>

  <!-- status + domain -->
  <circle cx="92" cy="552" r="8" fill="#34C77E"/>
  <text x="114" y="560" font-family="DejaVu Sans Mono, monospace" font-size="23" fill="#F4F1E8">${c.status}</text>
  <text x="1140" y="560" text-anchor="end" font-family="DejaVu Sans Mono, monospace" font-size="23" fill="#6F6A5D">apoi2.is-a.dev</text>

  <!-- signal waves -->
  <path d="M0 508c80-26 160-26 240 0s160 26 240 0 160-26 240 0 160 26 240 0 200-20 240-10" fill="none" stroke="url(#wave)" stroke-width="4" stroke-linecap="round"/>
  <path d="M0 560c100-18 200-18 300 0s200 18 300 0 200-18 300 0 200 18 300 0" fill="none" stroke="#34C77E" stroke-opacity="0.28" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

const targets = [
  [copy.en, 'public/og.png'],
  [copy.es, 'public/og-es.png'],
];

for (const [c, out] of targets) {
  await sharp(Buffer.from(svg(c))).png({ compressionLevel: 9 }).toFile(out);
  console.log('✓', out);
}

const favicon = await readFile('public/favicon.svg');
await sharp(favicon, { density: 384 })
  .resize(180, 180)
  .png()
  .toFile('public/apple-touch-icon.png');
console.log('✓ public/apple-touch-icon.png');

await sharp(favicon, { density: 384 }).resize(48, 48).png().toFile('public/favicon.png');
console.log('✓ public/favicon.png');
