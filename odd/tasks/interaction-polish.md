# Interaction Polish — Ctrl+K backdrop, immersive terminal, logo coherence (apoi2 · portfolio.dev)

Repo: github.com/apoi1/portfolio.dev (local: /home/APOI2/Development/Web/Portfolio/portfolio-website)
Branch: continues on `feature/brand-refresh` (same delivery; brand-refresh closed at 7bb9baa, push pending user review on localhost).
Context: user reviewed the brand refresh on `npm run dev` (localhost:4321) and requested this batch before authorizing the push.

## Specs

S1 (verbatim): "además arreglar lo del ctrl+k, que difumine el fondo y no toda la pantalla"
S2 (verbatim): "además ese easter egg de la terminal quiero que parezca más una terminal en donde las partes de cada uno de las secciones sea algo asi como "cd About" "cd Experience" y estéticamente se relacione más con una terminar y no tanto con una web para ser más imersivo"
S3 (verbatim): "el favicon se actualizó pero los logos en la página no, así que hay que asegurar esa coherencia"
S4 (verbatim): "antes que nada quiero saber si estas skills de frontend pueden modificar tambien el mockup de la pagina ya con un diseño y disposición mejor si me gustaria revisar para hacer el push" — capability question: answered in close report; layout pass stays an explicit follow-up decision, NOT part of this batch.

## Decisions (2026-10-19)

D1 — Ctrl+K (S1): overlay keeps full coverage (an overlay is inherently fullscreen) but switches from uniform dim (`bg-base/75`, no blur) to a frosted backdrop (`bg-base/60` + `backdrop-blur`) so the page behind blurs softly while the palette panel and its options stay crisp — matching the premium ⌘K pattern and the S1 wording ("difumine el fondo").
D2 — Logo coherence (S3): the in-page "logos" are the `Icon name="signal"` marks in Nav.astro:53 and Footer.astro:42 — still the old 4-bars glyph from the previous favicon. The `signal` entry in Icon.astro is replaced with the new phosphor-trace step-response geometry (favicon path scaled 128→24 viewBox), so every in-page mark matches the favicon. No new assets; one path swap in the unified icon set.
D3 — Terminal (S2): keep the Skills section placement and bilingual content model (AGENTS.md invariants), but: (a) `cd <Section>` navigates (case-insensitive match against about/experience/projects/skills/contact, plus `cd ~`/`cd ..`/`cd home` → top), confirmed by a short output line, using smooth scroll; (b) `ls` lists the sections like a directory listing; (c) prompt becomes bash-style `apoi2@bogota:~$`; (d) caret tuned to the brand amber; (e) `help` (EN+ES, shape-identical) gains the cd/ls commands. Terminal output stays terse like a real shell.
D4 — Scope discipline: layout/mockup redesign (S4) is NOT in this batch — one focused question at close decides whether a skills-guided layout pass happens before or after the push.

## Tasks

| ID | Spec | Task | Commit |
|----|------|------|--------|
| T1 | S1–S4 | Feature doc + Engram mirror | this commit |
| T2 | S3 | Icon `signal` → phosphor-trace path (Nav + Footer inherit) | this commit |
| T3 | S1 | Ctrl+K overlay → frosted backdrop, panel crisp | this commit |
| T4 | S2 | Terminal: cd/ls navigation, bash prompt, caret, help EN+ES | this commit |
| T5 | S1–S3 | Verify: build + check + verify + HMR live review | this commit (see L3) |
| T6 | S4 | Close: report, mockup question, push still user-gated | report of 2026-10-19 (push pending user OK) |

## Log

L1 — User request (verbatim, 2026-10-19, reviewing on localhost): S1–S4 above.
L2 — Diagnosis: Ctrl+K overlay is `absolute inset-0 bg-base/75` (flat dim, no blur); terminal lives in Skills.astro with `$` prompt and command map in i18n ui.ts (en:135, es:352 — shape-checked); in-page logos are Icon `signal` (Nav:53, Footer:42) still drawing the old 4-bars glyph `M2 20h.01 / M7 20v-4 / M12 20v-8 / M17 20V8 / M22 20V4`.
L3 — Implementation + verification (2026-10-19): Icon `signal` now carries the favicon's step-response trace scaled to 24×24 (`M4.9 17.2 H9.4 V9.8 C9.4 5.3 14.3 5.3 13.9 9.4 C13.7 11.3 15.8 10.5 16.5 9.8 H19.1`); Ctrl+K overlay is `bg-base/60 backdrop-blur-md` (frosted background, panel untouched); terminal got full bash prompt `apoi2@bogota:~$` everywhere (intro pairs, print(), input row), amber `caret-violet`, `cd <section>` (about/experience/projects/skills/contact + `cd`/`cd ~`/`cd ..`/`cd home` → top) with mint confirmation `→ #section` and smooth scroll, `ls` section listing, localized help/ls/cdNotFound in EN+ES with shape-identical keys. Suite green: build 15 pages · astro check 0 errors (17 pre-existing zod hints remain — in the push backlog) · verify 258 links + 49 script srcs + legacy hexes 0 · dev server HMR live on localhost:4321 for user review.
