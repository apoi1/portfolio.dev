/** Single source of truth for the site identity — used by layout SEO, JSON-LD, sections. */

export const SITE = 'https://apoi2.is-a.dev';

export const IDENTITY = {
  fullName: 'Julián David Ruiz Flórez',
  shortName: 'Julián Ruiz',
  handle: 'apoi2',
  email: 'apoi2@proton.me',
  location: { city: 'Soacha — Bogotá', country: 'Colombia', coords: '4.5989° N, 74.0678° W' },
  github: 'https://github.com/apoi1',
  linkedin: 'https://www.linkedin.com/in/ruijuliadev',
  bluesky: 'https://bsky.app/profile/apoi2.bsky.social',
} as const;

export type Locale = 'en' | 'es';

/** EN/ES counterpart for a path: '/'↔'/es/', '/projects/x'↔'/es/projects/x' */
export function altPath(pathname: string, to: Locale): string {
  const clean = pathname.split(/[?#]/)[0];
  const isEs = clean === '/es' || clean.startsWith('/es/');
  if (to === 'es') return isEs ? clean : `/es${clean === '/' ? '' : clean}`;
  return isEs ? clean.replace(/^\/es/, '') || '/' : clean;
}
