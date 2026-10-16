/**
 * Post-build smoke test — verifies the generated static site over dist/.
 * Run: npm run verify   (after npm run build)
 *
 * Checks: page inventory, per-locale content markers, SEO tags,
 * hreflang pairing, internal links, sitemap, robots, 404, image assets.
 * Exit code 1 on any failure, with a compact report.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const SITE = 'https://apoi2.is-a.dev';
const errors = [];
const notes = [];

const page = (p) => join(DIST, p);
const read = (p) => readFileSync(page(p), 'utf8');

const PAGES = [
  '/index.html',
  '/es/index.html',
  '/404.html',
  '/cv/index.html',
  '/es/cv/index.html',
  ...['csisensor', 'chambas', 'gti-katana', 'cineclick', 'portfolio'].flatMap(
    (s) => [`/projects/${s}/index.html`, `/es/projects/${s}/index.html`],
  ),
];

// 1 — page inventory
for (const p of PAGES) {
  if (!existsSync(page(p))) errors.push(`missing page: ${p}`);
}
notes.push(`pages: ${PAGES.filter((p) => existsSync(page(p))).length}/${PAGES.length}`);

// 2 — home content markers per locale
const en = existsSync(page('/index.html')) ? read('/index.html') : '';
const es = existsSync(page('/es/index.html')) ? read('/es/index.html') : '';

const markers = [
  [en, 'Julián Ruiz', 'EN home: name'],
  [en, 'Case study', 'EN home: case-study label'],
  [en, 'Open to work', 'EN home: availability'],
  [en, 'csisensor', 'EN home: flagship project'],
  [es, 'Julián Ruiz', 'ES home: name'],
  [es, 'Ver caso', 'ES home: case-study label'],
  [es, 'Disponible para trabajar', 'ES home: availability'],
  [es, 'construido, probado', 'ES home: projects heading (ES)'],
];
for (const [html, needle, label] of markers) {
  if (html && !html.includes(needle)) errors.push(`marker not found — ${label}: "${needle}"`);
}

// 3 — SEO tags on every page
for (const p of PAGES) {
  const f = page(p);
  if (!existsSync(f)) continue;
  const html = readFileSync(f, 'utf8');
  const isEs = p.startsWith('dist/es/') || p === join(DIST, 'es/index.html');
  const checks = [
    ['canonical', /rel="canonical" href="https:\/\/apoi2\.is-a\.dev/],
    ['hreflang en', /hreflang="en"/],
    ['hreflang es', /hreflang="es"/],
    ['og:image', /property="og:image" content="https:\/\/apoi2\.is-a\.dev\/og(-es)?\.png"/],
    ['description', /name="description" content=".{20,}"/],
    ['JSON-LD', /application\/ld\+json/],
    ['lang attr', new RegExp(`<html lang="${isEs ? 'es' : 'en'}"`)],
  ];
  for (const [name, re] of checks) {
    if (!re.test(html)) errors.push(`${p}: missing ${name}`);
  }
}

// 4 — hreflang pairing consistency (EN ↔ ES same path family)
for (const slug of ['csisensor', 'chambas', 'gti-katana', 'cineclick', 'portfolio']) {
  const enCase = read(`/projects/${slug}/index.html`);
  if (!enCase.includes(`hreflang="es" href="${SITE}/es/projects/${slug}/"`)) {
    errors.push(`/projects/${slug}/: hreflang es must be /es/projects/${slug}/`);
  }
  const esCase = read(`/es/projects/${slug}/index.html`);
  if (!esCase.includes(`hreflang="en" href="${SITE}/projects/${slug}/"`)) {
    errors.push(`/es/projects/${slug}/: hreflang en must be /projects/${slug}/`);
  }
}

// 5 — internal links resolve to files
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
const allHtml = walk(DIST).filter((f) => f.endsWith('.html'));
let internalLinks = 0;
for (const file of allHtml) {
  const html = readFileSync(file, 'utf8');
  const hrefs = [...html.matchAll(/href="((?:\/|(?:\.\.\/)+)[^"#]*)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (href.startsWith('//')) continue;
    internalLinks++;
    let target = href;
    if (target.endsWith('/')) target += 'index.html';
    else if (!/\.[a-z0-9]+$/i.test(target)) target += '/index.html';
    const resolved = join(DIST, target.replace(/^\//, ''));
    if (!existsSync(resolved)) {
      errors.push(`${file.replace(DIST, '')}: broken link ${href}`);
    }
  }
}
notes.push(`internal links checked: ${internalLinks}`);

// 6 — infra files
for (const f of ['robots.txt', 'sitemap-index.xml', 'og.png', 'og-es.png', 'favicon.svg', 'apple-touch-icon.png']) {
  if (!existsSync(page(f))) errors.push(`missing public asset: ${f}`);
}
const sitemap = existsSync(page('sitemap-index.xml'))
  ? readFileSync(page('sitemap-index.xml'), 'utf8')
  : '';
for (const url of [
  `${SITE}/sitemap-0.xml`,
]) {
  if (!sitemap.includes(url)) errors.push(`sitemap-index missing ${url}`);
}
if (existsSync(page('sitemap-0.xml'))) {
  const sm = readFileSync(page('sitemap-0.xml'), 'utf8');
  for (const path of [
    '/',
    '/es/',
    '/cv/',
    '/es/cv/',
    '/projects/csisensor/',
    '/es/projects/csisensor/',
  ]) {
    if (!sm.includes(`${SITE}${path}`)) errors.push(`sitemap-0 missing ${path}`);
  }
  if (!sm.includes('hreflang')) errors.push('sitemap-0 missing hreflang alternates');
}

// report
console.log(`\n${notes.join(' · ')}`);
if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} problem(s):`);
  for (const e of errors) console.error('  -', e);
  process.exit(1);
}
console.log('✓ verify-site: all checks passed\n');
