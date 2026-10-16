import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from './site';

export type ProjectEntry = CollectionEntry<'projects'>;

/** "csisensor/indexen" → "csisensor" */
export const projectSlug = (entry: ProjectEntry): string =>
  entry.id.split('/')[0] ?? entry.id;

/**
 * "csisensor/indexes" → es, "csisensor/indexen" → en.
 * The glob loader slugifies dots: index.es.md → "indexes", index.en.md → "indexen".
 */
export const projectLocale = (entry: ProjectEntry): Locale =>
  entry.id.split('/')[1] === 'indexes' ? 'es' : 'en';

export async function getProjects(locale: Locale): Promise<ProjectEntry[]> {
  const all = await getCollection('projects');
  return all
    .filter((e) => projectLocale(e) === locale)
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getProject(
  locale: Locale,
  slug: string,
): Promise<ProjectEntry | undefined> {
  const all = await getCollection('projects');
  // ids are slugified: index.en → "indexen", index.es → "indexes"
  const tail = locale === 'es' ? 'indexes' : 'indexen';
  return all.find((e) => e.id === `${slug}/${tail}`);
}

/** Case-study path for a slug in a locale. */
export function caseHref(locale: Locale, slug: string): string {
  return locale === 'es' ? `/es/projects/${slug}` : `/projects/${slug}`;
}

/** Ordered prev/next siblings for case-page navigation. */
export function neighbors(
  projects: ProjectEntry[],
  slug: string,
): { prev?: ProjectEntry; next?: ProjectEntry } {
  const idx = projects.findIndex((p) => projectSlug(p) === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? projects[idx - 1] : undefined,
    next: idx < projects.length - 1 ? projects[idx + 1] : undefined,
  };
}
