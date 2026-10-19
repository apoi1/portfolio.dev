# Brand Refresh — "phosphor trace" identity (apoi2 · portfolio.dev)

Repo: github.com/apoi1/portfolio.dev (local: /home/APOI2/Development/Web/Portfolio/portfolio-website)
Branch: `feature/brand-refresh` (from main @ 1cdbbed, v2.2.2). Push stays a user decision.
Scope (user choice 2026-10-19): full brand refresh — distinctive mark/favicon + palette/typography/tokens + PNG suite + OG cards + theme-color. Architecture, motion system and content stay intact. Stack change was authorized if needed but is NOT needed (Astro 7 + Tailwind 4 are current-gen, same reasoning as v2's D1).

## Specs

S1 (verbatim): "puedes darme un resumen de como hace gentle-shell para manejar las skills, y si por ejemplo quiero instalar una skill de frontend para usarla para ayudarme a crear un frontend para mi proyecto de portfolio"
S2 (verbatim): "Me gustaria que buscaras skills ya creadas para diseño web que sean bien conocidas por dar excelentes resultados"
S3 (verbatim): "la ruta de mi proyecto de portfolio esta en home/Development/Web/Portfolio, sin embargo en mi repositorio actualizado con los ultimos cambios que hice están en mi repositorio de github https://github.com/apoi1/portfolio.dev, conviene actualizar mis archivos y no me importa si para mejorar el diseño y poner un favicon que no sea generico se necesite cambiar el stack no importaria"
S4 (verbatim): "continua lo anterior tambien, ya que lo interrumpi sin querer"
S5 (decision, 2026-10-19): user selected scope "Refresh de marca completo" — "Mark/favicon distintivo + refresh de paleta, tipografía y tokens, suite PNG, tarjetas OG y theme-color. Arquitectura, motion y contenido intactos."

## Decisions (2026-10-19)

D1 — Skills installed (user-level agent skills, `~/.gentle-shell/agent/skills/`): `frontend-design` (anthropics/skills, the well-known distinctive-UI skill) + `frontend-create` (npm pi-frontend-create 1.0.3, anti-AI-cliché checklist). Both read in full before designing; both Apache-2.0.
D2 — Local repo synced to origin/main v2.2.2 (fast-forward 7ada4d3→1cdbbed; stale 1-line local change preserved in `stash@{0}`). GitHub is the source of truth.
D3 — Stack STAYS: Astro 7 static + Tailwind 4 + three.js/GSAP/Lenis. Authorized latitude to change stack unused — current-gen stack, v2's D1 reasoning still holds.
D4 — Design direction: **"phosphor trace" instrument identity**, grounded in the client's actual subject matter (real-time signal systems, sensors, RF test equipment): warm instrument-charcoal bezel, phosphor-amber trace as the single bold brand hue, graticule-neutral supporting colors, dual-theme as today (dark default). Replaces the violet→cyan gradient brand — purple gradients + cyan accents are the top AI-design tells per both skills; the current favicon is exactly that cliché, which is what the user rejected ("favicon que no sea generico").
D5 — Motion system, signal-field canvas, marquee, easter eggs, bilingual i18n and content STAY (explicit user-requested v2 features; skill banned-lists yield to explicit user requests). The signal-field hero palette follows tokens automatically (`--sig-a/b`).
D6 — Typography: Onest Variable + JetBrains Mono stay (neither is on the banned list; mono is scoped to data/measurement contexts, semantically right for the instrument identity). A display-face swap is v3 territory, out of scope.
D7 — Token NAMES stay, VALUES change: renaming `--color-violet` etc. would cascade through every component's utility classes; the value swap keeps the diff reviewable. Naming debt documented here. (Verified against actual usage in T1.)
D8 — Favicon mark: flat (no gradient) oscilloscope-bezel rounded square in warm charcoal with a single phosphor-amber trace carrying one deliberate overshoot/ringing peak — the signal-systems glyph. Must read at 16px: 2 colors, bold geometry. PNG suite + OG cards regenerate through the existing `scripts/generate-og.mjs` pipeline (outputs committed, per repo convention).
D9 — Token plan (T1 outcome, verified against usage map). Dark (default): base #0D0C0A warm instrument charcoal, raised #151310, overlay #1C1915, ink #F4F1E8, soft #ABA595, faint #6F6A5D, warm-white hairline alphas. Brand slots (names stay, values change): violet→#FFB000 phosphor amber P3 (the trace), vio→#9A6C00 (scroll thumb lineage), lilac→#E8BC5A elegant gold (workhorse accent text, 35 usages), cyan→#5F8FBF restrained steel blue (demoted from primary; not teal), mint→#34C77E phosphor-green (status), amber→#FFC95C, rose→#E85D75. Grad trio (--grad-a/b/c) becomes amber→gold→green duotone = the real dual-channel scope story (CH1 amber/CH2 green), replacing violet→cyan in `.text-grad` (7 usages: wordmark "apoi2", headings, preloader, 404) and the Nav underline. Signal-field: --sig-a #FFB000 + --sig-b #34C77E (hero canvas flips with zero JS changes). Light: base #F4F0E6 warm paper (HP-instrument echo), ink #181510, violet→#8A5800 deep amber, lilac→#7A5200, cyan→#3E6285, mint→#0E7A45, amber→#946A00, rose→#C2304E; sig vars follow. theme-color: #0D0C0A dark / #F4F0E6 light (Layout ×2, ThemeToggle ×1). delights.ts + signal-field.ts fallbacks follow the same hues.
D10 — CTA contrast handling: the 5 `bg-violet text-white glow-violet` instances (Hero, Contact, CVView, ProjectCase + About photo frame) get text-white → text-(--color-base) so they stay legible on amber in BOTH themes (dark: charcoal-on-amber ≈9.5:1; light: paper-on-deep-amber ≈5.1:1). Verified numerically in T5's audit.

## Tasks

| ID | Spec | Task | Commit |
|----|------|------|--------|
| T1 | S2,S3,S5 | Token map audit: grep every hardcoded brand hex + utility-class usage across src/; finalize the compact token plan (color hex set, dark+light) reviewed against the skills' calibration lists | f4c4647 |
| T2 | S3,S5 | New `public/favicon.svg` mark (bezel + phosphor trace, no gradient, 16px-legible) | 799be14 |
| T3 | S3,S5 | `global.css` token values (dark + light + sig vars) + `theme-color` in Layout + hardcoded hexes found in T1 | 5f37a06 (extended to covers, see L7) |
| T4 | S3,S5 | `generate-og.mjs` identity update + regenerate og.png/og-es.png/apple-touch-icon.png/favicon.png; commit outputs | (pending) |
| T5 | S3 | Verification: programmatic WCAG contrast audit of new pairs, `npm run build` + `check` + `verify`, dist smoke (favicon suite, theme-color, OG), docs touch if token/palette docs drift | (pending) |
| T6 | S1–S5 | Close: doc log + Engram mirror + report; native assess per RDD entry rule | (pending) |

## Log

L1 — User original request (verbatim, 2026-10-19): S1 above (gentle-shell skills summary + frontend-skill installation for the portfolio).
L2 — User follow-up (verbatim): S2 (search for well-known web-design skills with excellent results). Skills search performed: frontend-design (anthropics/skills) and pi-frontend-create found, vetted (Apache-2.0, gallery-published) and installed; browser-tools (badlogic/pi-skills) noted as optional verification complement, not installed.
L3 — User follow-up (verbatim): S3 + project context (local path /home/APOI2/Development/Web/Portfolio, GitHub apoi1/portfolio.dev as updated source of truth, stack-change latitude). Local was stale (4-commit July history) with one trivial uncommitted change (trailing-space fix in an index.astro line that upstream v2.2.2 rewrote wholesale) → stashed as "pre-sync", fast-forwarded to 1cdbbed, npm install run (esbuild install-script warning noted for build time).
L4 — User follow-up (verbatim): S4 (continue after accidental interruption).
L5 — Scope decision: user selected "Refresh de marca completo" (S5). Feature branch `feature/brand-refresh` created; this document is the spec source for all tasks.
L6 — Design plan per frontend-design's two-pass process (compact token system, reviewed against both skills' anti-AI calibration lists before building): see D4–D8.
L7 — T3 execution (2026-10-19): audit gap found and closed — T1's grep excluded `.svg`, so the 4 project `cover.svg` files (chambas, cineclick, csisensor, portfolio) still carried the old violet→cyan palette; their composition is content (untouched), their palette is brand → mechanically remapped to the new system (violet→amber, lilac→gold, cyan/mint→channel green, old surfaces→warm charcoal). Also caught beyond T1's map: Cursor.astro hardcoded cursor rgb, pulse-dot keyframe rgb, the 404 CTA and the Layout skip-link (5+1 text-on-amber swaps, not 4).
L8 — Slice boundary (2026-10-19): work-unit slice 1 closed at T3 (f4c4647 + 799be14 + 5f37a06 ≈ 429 authored lines). T4–T6 form the closing slice (generator identity + assets + verification + close).
