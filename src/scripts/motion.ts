/**
 * Global motion & interaction system.
 *
 * Stage: layout bootstrap — keeps the [data-reveal] gate honest
 * (window.__motionReady) while sections are being built.
 * The full Lenis + GSAP orchestration replaces this in T9.
 */

const init = () => {
  (window as any).__motionReady = true;
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.style.opacity = '1';
  });
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((el) => {
    el.style.opacity = '1';
    [...el.children].forEach((c) => ((c as HTMLElement).style.opacity = '1'));
  });
};

document.addEventListener('astro:page-load', init);
