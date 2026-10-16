/**
 * Global motion & interaction system — Lenis smooth scroll + GSAP
 * ScrollTrigger choreography.
 *
 * Driven by declarative attributes in the markup:
 *   [data-hero-seq]   — hero entrance, staggered after the preloader
 *   [data-split]      — per-character reveal for display typography
 *   [data-reveal]     — scroll reveal (fade-up) | "fade" | "left" | "right" | "scale"
 *   [data-reveal-delay="0.2"]
 *   [data-stagger]    — stagger-reveals the element's children
 *   [data-counter]    — count-up numbers when scrolled into view
 *   [data-magnetic]    — pointer-attracted buttons (fine pointers only)
 *
 * Everything collapses to instant/visible states under
 * prefers-reduced-motion, and re-initializes on every astro:page-load
 * so ViewTransitions stay smooth.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

let lenis: Lenis | null = null;
let ctx: gsap.Context | null = null;
let tickerRaf: ((time: number) => void) | null = null;
let anchorsBound = false;

function initLenis(): Lenis | null {
  if (reduced) return null;
  const l = new Lenis({
    lerp: 0.11,
    smoothWheel: true,
    wheelMultiplier: 1,
  });
  // replace the previous ticker callback — orphaned rafs keep dead
  // Lenis instances animating (D3)
  if (tickerRaf) gsap.ticker.remove(tickerRaf);
  tickerRaf = (time: number) => l.raf(time * 1000);
  gsap.ticker.add(tickerRaf);
  gsap.ticker.lagSmoothing(0);
  l.on('scroll', ScrollTrigger.update);
  return l;
}

function scrollToTarget(target: string) {
  const id = target.split('#')[1];
  const el = id ? document.getElementById(id) : null;
  if (!el) return false;
  if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.1 });
  else el.scrollIntoView({ behavior: 'smooth' });
  return true;
}

/** Smooth same-page anchors (respects the fixed nav) — bound once (D2). */
function bindAnchors() {
  if (anchorsBound) return;
  anchorsBound = true;
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as HTMLElement)?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      const samePageHash =
        href.startsWith('#') ||
        (href.includes('#') && new URL(a.href).pathname === location.pathname);
      if (!samePageHash || href === '#') return;
      if (scrollToTarget(href)) e.preventDefault();
    },
    { passive: false },
  );
}

/** Split [data-split] text nodes into per-char spans for the reveal. */
function splitChars(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.textContent = '';
  el.setAttribute('aria-label', text);
  const frag = document.createDocumentFragment();
  for (const ch of text) {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.className = 'inline-block will-change-transform';
    span.setAttribute('aria-hidden', 'true');
    frag.appendChild(span);
  }
  el.appendChild(frag);
  return el.querySelectorAll('span');
}

function heroEntrance() {
  const seq = document.querySelectorAll<HTMLElement>('[data-hero-seq]');
  const splits = [...document.querySelectorAll<HTMLElement>('[data-split]')];
  const start = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    splits.forEach((el) => {
      const chars = splitChars(el);
      gsap.set(el, { overflow: 'hidden' });
      tl.fromTo(
        chars,
        { yPercent: 118 },
        { yPercent: 0, duration: 0.85, stagger: 0.028, ease: 'power4.out' },
        0,
      );
    });
    seq.forEach((el) => {
      const i = Number(el.dataset.heroSeq ?? '0');
      tl.fromTo(
        el,
        { y: 42, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        0.12 + i * 0.09,
      );
    });
  };
  if ((window as any).__preloaderDone) start();
  else document.addEventListener('preloader:done', start, { once: true });
}

function scrollReveals() {
  const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
  revealEls.forEach((el) => {
    const variant = el.dataset.reveal || 'up';
    const delay = parseFloat(el.dataset.revealDelay ?? '0');
    const from: gsap.TweenVars = { opacity: 0 };
    if (variant === 'up') from.y = 40;
    if (variant === 'left') from.x = -48;
    if (variant === 'right') from.x = 48;
    if (variant === 'scale') from.scale = 0.94;
    gsap.fromTo(
      el,
      from,
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: reduced ? 0 : 0.95,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const kids = [...group.children] as HTMLElement[];
    gsap.fromTo(
      kids,
      { y: 26, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: reduced ? 0 : 0.8,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      },
    );
  });
}

function counters() {
  document
    .querySelectorAll<HTMLElement>('[data-counter]')
    .forEach((el) => {
      const target = parseInt(el.dataset.counter ?? '0', 10);
      const suffix = el.dataset.suffix ?? '';
      const set = (v: number) => (el.textContent = `${v}${suffix}`);
      if (reduced) {
        set(target);
        return;
      }
      const state = { v: 0 };
      gsap.to(state, {
        v: target,
        duration: 1.6,
        ease: 'power2.out',
        snap: { v: 1 },
        onUpdate: () => set(Math.round(state.v)),
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });
}

function magnetic() {
  if (!finePointer || reduced) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.32;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.4,
        ease: 'power3.out',
      });
    };
    const onLeave = () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
}

const init = () => {
  (window as any).__motionReady = true;

  // teardown previous page's timelines
  ctx?.revert();
  ScrollTrigger.getAll().forEach((t) => t.kill());
  lenis?.destroy();
  (window as any).__lenisStop = null;

  if (reduced) {
    // everything visible, no choreography
    document
      .querySelectorAll<HTMLElement>('[data-reveal], [data-stagger]')
      .forEach((el) => (el.style.opacity = '1'));
    document
      .querySelectorAll<HTMLElement>('[data-stagger]')
      .forEach((el) => [...el.children].forEach((c) => ((c as HTMLElement).style.opacity = '1')));
    document
      .querySelectorAll<HTMLElement>('[data-hero-seq]')
      .forEach((el) => (el.style.opacity = '1'));
    counters();
    return;
  }

  lenis = initLenis();
  (window as any).__lenisStop = (stop: boolean) =>
    stop ? lenis?.stop() : lenis?.start();
  ctx = gsap.context(() => {
    heroEntrance();
    scrollReveals();
    counters();
  });
  magnetic();
  bindAnchors();
};

document.addEventListener('astro:page-load', init);
