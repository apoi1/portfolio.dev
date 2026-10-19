#!/usr/bin/env node
/**
 * WCAG 2.x contrast audit of the brand palette (brand-refresh).
 * Run: npm run audit:contrast
 *
 * Thresholds: body-text pairs >= 4.5, large/accent pairs >= 3.0.
 * `faint` is decorative-only (exempt). Exit 1 on any FAIL.
 */
const lin = (c) => {
  const cs = c / 255;
  return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
};
const lum = (h) => {
  const s = h.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const DARK = '#0d0c0a';
const LIGHT = '#f4f0e6';

const pairs = [
  ['dark', 'ink', '#f4f1e8', DARK, 4.5],
  ['dark', 'soft', '#aba595', DARK, 4.5],
  ['dark', 'faint', '#6f6a5d', DARK, null],
  ['dark', 'brand-as-text', '#ffb000', DARK, 4.5],
  ['dark', 'brand-as-accent', '#ffb000', DARK, 3.0],
  ['dark', 'gold', '#e8bc5a', DARK, 3.0],
  ['dark', 'cta text-on-brand', DARK, '#ffb000', 4.5],
  ['light', 'ink', '#181510', LIGHT, 4.5],
  ['light', 'soft', '#595344', LIGHT, 4.5],
  ['light', 'faint', '#8b857a', LIGHT, null],
  ['light', 'brand-as-text', '#8a5800', LIGHT, 4.5],
  ['light', 'accent', '#7a5200', LIGHT, 3.0],
  ['light', 'cta text-on-brand', LIGHT, '#8a5800', 4.5],
];

let fails = 0;
console.log('\nphosphor-trace palette — WCAG contrast audit');
for (const [theme, name, fg, bg, th] of pairs) {
  const r = ratio(fg, bg);
  const verdict = th === null ? 'EXEMPT' : r >= th ? 'PASS' : 'FAIL';
  if (verdict === 'FAIL') fails++;
  console.log(`  ${theme.padEnd(5)} ${name.padEnd(20)} ${r.toFixed(2)}:1  ${verdict}`);
}
if (fails) {
  console.error(`\n✗ ${fails} pair(s) below threshold`);
  process.exit(1);
}
console.log('\n✓ contrast audit: all thresholds met\n');
