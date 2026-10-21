/**
 * Motion preference — tri-state override of prefers-reduced-motion.
 *
 *   'on'  → force full motion (html.motion-force)
 *   'off' → force calm mode (html.motion-off)
 *   unset → follow the OS setting (auto)
 *
 * The boot script in Layout.astro mirrors this class pre-paint; all
 * runtime gates call motionReduced() instead of raw matchMedia. Changing
 * the preference reloads the page — module-level state stays honest.
 */
export const MOTION_KEY = 'apoi2-motion';
export type MotionPref = 'on' | 'off' | null;

export function getMotionPref(): MotionPref {
  try {
    const v = localStorage.getItem(MOTION_KEY);
    return v === 'on' || v === 'off' ? v : null;
  } catch {
    return null;
  }
}

export function motionReduced(): boolean {
  const pref = getMotionPref();
  if (pref === 'on') return false;
  if (pref === 'off') return true;
  return window.matchMedia('(pref-reduced-motion: reduce)').matches;
}

/** cycles auto → on → off → auto and reloads */
export function cycleMotion(): string {
  const current = getMotionPref();
  const next: MotionPref = current === null ? 'on' : current === 'on' ? 'off' : null;
  try {
    if (next === null) localStorage.removeItem(MOTION_KEY);
    else localStorage.setItem(MOTION_KEY, next);
  } catch {}
  window.location.reload();
  return next === null ? 'auto' : (next as string);
}
