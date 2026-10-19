/**
 * Delights — small, quiet easter eggs inspired by the portfolios people
 * remember: a styled console greeting for the devtools-curious, a Konami
 * "signal boost" with a confetti burst, click sparkles, and a tab-title
 * wink when the visitor drifts away.
 *
 * Rules honored everywhere: user-triggered motion answers the user's
 * action; prefers-reduced-motion keeps only non-motion delights; every
 * listener survives ViewTransitions (astro:page-load re-init).
 */
import { getUI } from '../i18n/ui';
import type { Locale } from '../lib/site';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(pointer: fine)').matches;

const locale = (): Locale =>
  (document.documentElement.lang === 'es' ? 'es' : 'en');

/** Devtools greeting — the classic portfolio wink for recruiters who open the console. */
function consoleGreeting() {
  const style = 'background:#ffb000;color:#0d0c0a;padding:4px 10px;border-radius:6px 0 0 6px;font-weight:bold';
  const style2 = 'background:#34c77e;color:#0d0c0a;padding:4px 10px;border-radius:0 6px 6px 0;font-weight:bold';
  console.log(
    `%c apoi2 %c signal received `,
    style,
    style2,
  );
  console.log(
    "%cYou opened devtools — I already like you.\n%cLooking for a systems engineer who tests what he ships?\n→ apoi2@proton.me · github.com/apoi1 · 527 automated tests say hi",
    'font-size:14px;color:#e8bc5a;font-family:monospace',
    'font-size:12px;color:#8b8ba6;font-family:monospace',
  );
}

/** Click sparkles — six tiny particles per click, fine pointers only. */
function sparkles() {
  if (!fine || reduced) return;
  const onPointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('#cmdk, #preloader')) return;
    const colors = ['#e8bc5a', '#ffb000', '#34c77e', '#5f8fbf'];
    for (let i = 0; i < 6; i++) {
      const p = document.createElement('span');
      const size = 3 + Math.random() * 4;
      p.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;background:${colors[i % colors.length]};border-radius:${Math.random() > 0.5 ? '50%' : '1px'};pointer-events:none;z-index:99;opacity:1;transition:transform .6s cubic-bezier(.16,1,.3,1),opacity .6s ease`;
      document.body.appendChild(p);
      const angle = Math.random() * Math.PI * 2;
      const dist = 22 + Math.random() * 34;
      requestAnimationFrame(() => {
        p.style.transform = `translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px) scale(.2)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 700);
    }
  };
  document.addEventListener('pointerdown', onPointerDown, { passive: true });
}

/** Konami → signal boost + confetti. */
const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

let konamiBound = false;
let progress = 0;

function confettiBurst() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:98';
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);
  const colors = ['#e8bc5a', '#ffb000', '#34c77e', '#5f8fbf', '#ffc95c'];
  const parts = Array.from({ length: 110 }, () => ({
    x: window.innerWidth / 2 + (Math.random() - 0.5) * 90,
    y: window.innerHeight / 2 + (Math.random() - 0.5) * 40,
    vx: (Math.random() - 0.5) * 13,
    vy: -6 - Math.random() * 8,
    s: 3 + Math.random() * 5,
    c: colors[Math.floor(Math.random() * colors.length)],
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
  }));
  const t0 = performance.now();
  const tick = (t: number) => {
    const dt = (t - t0) / 1000;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let alive = false;
    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy + dt * 2.4;
      p.vy += 0.32;
      p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.max(0, 1 - dt / 2.2);
      if (ctx.globalAlpha > 0.02) alive = true;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.7);
      ctx.restore();
    }
    if (alive) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}

function konami() {
  if (konamiBound) return;
  konamiBound = true;
  document.addEventListener('keydown', (e) => {
    const expected = KONAMI[progress];
    if (
      (expected === 'b' || expected === 'a'
        ? e.key.toLowerCase() === expected
        : e.key === expected)
    ) {
      progress++;
      if (progress === KONAMI.length) {
        progress = 0;
        const t = getUI(locale());
        if (!reduced) {
          confettiBurst();
          document.dispatchEvent(new CustomEvent('konami'));
        }
        (window as any).__toast?.(t.delights.konamiToast);
      }
    } else {
      progress = e.key === KONAMI[0] ? 1 : 0;
    }
  });
}

/** Tab-title wink when the visitor drifts away. */
let titleBound = false;
function titleWink() {
  if (titleBound) return;
  titleBound = true;
  let prev = document.title;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      prev = document.title;
      document.title = getUI(locale()).delights.idleTitle;
    } else {
      document.title = prev;
    }
  });
  document.addEventListener('astro:after-swap', () => {
    prev = document.title;
  });
}

const init = () => {
  consoleGreeting();
  sparkles();
  konami();
  titleWink();
};

document.addEventListener('astro:page-load', init);
