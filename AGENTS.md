# AGENTS.md

Pointers for AI agents (and humans in a hurry) working on this repo.
Everything deeper lives in `docs/`.

## Commands

```bash
npm run dev        # dev server
npm run build      # static build → dist/ (15 pages)
npm run check      # astro check — types (must be 0 errors)
npm run verify     # post-build content/SEO/link smoke test
npm run gen:og     # regenerate OG cards + favicon PNGs (outputs are committed)
```

## Where things are

| Concern | Location |
| --- | --- |
| Project content | `src/content/projects/<slug>/` (EN+ES markdown, images) |
| UI copy (all strings, both locales) | `src/i18n/ui.ts` (`es` is type-checked against `en`) |
| Identity (name, links, domain) | `src/lib/site.ts` |
| Collection helpers | `src/lib/projects.ts` |
| Design tokens + themes | `src/styles/global.css` (dark default, `[data-theme="light"]` overrides) |
| Motion attributes | `data-reveal`, `data-stagger`, `data-hero-seq`, `data-split`, `data-counter`, `data-magnetic` — wired in `src/scripts/motion.ts` |

## Invariants — do not break these

1. Every project exists in **both locales**; non-translated frontmatter stays identical between the two files.
2. Component scripts re-init on `astro:page-load` (ViewTransitions) — window-level listeners bind once behind a module flag.
3. Glob loader slugifies dots: `index.en.md` → id `…/indexen`, `index.es.md` → `…/indexes` (see `projectLocale()`).
4. `prefers-reduced-motion` must always leave all content visible.
5. Conventional Commits, English. Never commit credentials.

## Read next

- `docs/ARCHITECTURE.md` — how the systems fit together
- `docs/CONTENT-GUIDE.md` — how to add a project
- `docs/DEPLOYMENT.md` — Netlify + domain + OG regeneration
