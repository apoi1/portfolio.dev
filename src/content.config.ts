import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Projects collection — one folder per project under src/content/projects:
 *
 *   src/content/projects/<slug>/
 *     ├── index.en.md   ← English entry (frontmatter + case body)
 *     ├── index.es.md   ← Spanish entry (same shape, translated)
 *     ├── cover.svg     ← card/OG cover (any image format)
 *     └── *.webp|png    ← optional gallery images (list under `gallery:`)
 *
 * Adding a project = adding a folder. No component code changes.
 * `order` controls grid position; `featured` gets the big bento slot.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/index.*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string(),
      description: z.string(),
      tech: z.array(z.string()),
      year: z.number(),
      status: z.enum(['live', 'active', 'private', 'wip']),
      order: z.number(),
      featured: z.boolean().default(false),
      links: z
        .object({
          repo: z.url().optional(),
          live: z.url().optional(),
        })
        .default({}),
      cover: image(),
      gallery: z.array(image()).default([]),
    }),
});

export const collections = { projects };
