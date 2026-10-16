---
title: 'portfolio.dev — this website'
tagline: 'The site you are on: bilingual, dual-theme, motion-first — and still 100% static on Netlify.'
description: 'My portfolio rebuilt from scratch: Astro 7 + Tailwind 4, bilingual EN/ES with hreflang, dark/light themes, a three.js interactive hero, GSAP scroll choreography and content collections — static on Netlify.'
tech: ['Astro', 'Tailwind CSS', 'GSAP', 'three.js', 'TypeScript', 'Netlify']
year: 2026
status: live
order: 5
featured: false
links:
  repo: https://github.com/apoi1/portfolio.dev
  live: https://apoi2.is-a.dev
cover: ./cover.svg
gallery: []
---

The site you're on — rebuilt from scratch as a **bilingual, dual-theme, motion-first portfolio** that stays 100% static on Netlify. You can read every line of it in the repo.

## The systems behind it

- **Content as folders** — Astro content collections drive every project card and this very page: one folder per project, two markdown entries (EN/ES), co-located covers and galleries, validated by a Zod schema at build time. Adding a project is a file operation, not a code change.
- **i18n with receipts** — English at `/`, Spanish at `/es/`; the Spanish dictionary is type-checked against the English shape, so a missing translation is a build error. Every page ships hreflang alternates, per-locale OG cards and JSON-LD.
- **Theming as variables** — dark is default; light mode is one `[data-theme="light"]` block re-declaring the same CSS variables, resolved by Tailwind utilities at runtime — zero build fork, zero flash-of-wrong-theme, and the three.js hero recolors live via the same custom properties.
- **Motion with a contract** — a declarative attribute system (`data-reveal`, `data-stagger`, `data-counter`, `data-magnetic`) wired to Lenis + GSAP, with every effect collapsing to visible static content under `prefers-reduced-motion`. The one orchestrated sequence is the preloader-to-hero handoff; everything else stays quiet.
- **The signal field** — the hero is ~12,000 additive-blended points undulating as radio waves, rippling around your pointer, reading its palette from CSS variables. It's the aesthetic thesis of the whole site: this is what I work on, drawn with the physics it comes from.

## The details recruiters can check

- **Quality gates in CI** — `astro check` (zero type errors), a 15-page build, and a custom `verify` script that re-checks the generated site: page inventory, both locales' content markers, SEO tags, hreflang pairing, 258 internal links, script sources, and even that `netlify.toml` still parses (a lesson from a real deploy incident).
- **Security + caching headers** via `netlify.toml`; immutable hashed assets; print-ready CVs at `/cv` and `/es/cv`.
- **Easter eggs** — a styled console greeting for the devtools-curious, a Konami code that boosts the hero signal, a hidden `sudo hire apoi2` in the ⌘K palette, and signal rain on the 404.
