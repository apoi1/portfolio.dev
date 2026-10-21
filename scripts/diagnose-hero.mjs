/**
 * Hero diagnostics — screenshots the live (or local) site headlessly,
 * measures inter-frame pixel diffs (is the backdrop actually animating?),
 * measures the click-ripple response, and dumps the browser console
 * (THREE.js shader-compile errors live there).
 * Usage: node scripts/diagnose-hero.mjs [url]
 */
import { chromium } from 'playwright';
import sharp from 'sharp';

const url = process.argv[2] ?? 'https://apoi2.is-a.dev';
const out = (n) => `/tmp/diag-${n}.png`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text().slice(0, 400)}`));
page.on('pageerror', (e) => logs.push(`[PAGEERROR] ${e.message.slice(0, 400)}`));

await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(4500); // preloader + settle

await page.screenshot({ path: out('a') });
await page.waitForTimeout(3000);
await page.screenshot({ path: out('b') });
await page.mouse.click(640, 300); // click mid-hero for the phosphor ripple
await page.waitForTimeout(400);
await page.screenshot({ path: out('c') });
await browser.close();

const raw = async (f) =>
  (await sharp(out(f)).raw().toBuffer({ resolveWithObject: true })).data;

const [a, b, c] = await Promise.all([raw('a'), raw('b'), raw('c')]);

const diff = (x, y) => {
  let sum = 0, n = 0;
  for (let i = 0; i < x.length; i += 97) { sum += Math.abs(x[i] - y[i]); n++; }
  return +(sum / n).toFixed(3);
};
const stats = (x) => {
  let m = 0, m2 = 0, n = 0;
  for (let i = 0; i < x.length; i += 97) { const v = x[i]; m += v; m2 += v * v; n++; }
  m /= n;
  return { mean: +m.toFixed(1), std: +Math.sqrt(m2 / n - m * m).toFixed(1) };
};

console.log('═══ DIAGNÓSTICO DEL HERO ═══');
console.log('frame A:', JSON.stringify(stats(a)));
console.log('frame B:', JSON.stringify(stats(b)));
console.log('A→B diff medio (fondo animado si > ~0.4):', diff(a, b));
console.log('B→C diff medio (ripple de click si > ~0.2):', diff(b, c));
console.log('═══ CONSOLA DEL NAVEGADOR (errores GLSL/THREE viven acá) ═══');
if (logs.length === 0) console.log('(consola limpia)');
logs.forEach((l) => console.log(l));
