# Portfolio Redesign — "stunning website" (apoi2)

Repo: github.com/apoi1/portfolio.dev (clone: /home/tilin/dev/projects/portfolio/portfolio.dev)
Branch: feature/stunning-redesign (from main @ 7ada4d3). Push stays PENDING user morning confirmation.
Live target: https://apoi2.is-a.dev (CNAME → apoi2.netlify.app, Netlify auto-deploy on push to main).
Mode: autonomous overnight run authorized by the user (2026-10-16 00:0x).

## Specs

S1 (verbatim): "quiero que revises mi repositorio y lo mejores de manera que se vea irreconocible, no importa que deje de estar trabajado en astro, simplemente ten en cuenta las limitaciones que tiene el hosting de netlify"
S2 (verbatim): "incluye todos los proyectos que he trabajado y la experiencia relevante que tengo, haciendo que sea mucho más llamativo para los reclutadores e igualmente no descuidando aspectos como el ceo" [seo]
S3 (verbatim): "siento que es bastante profesional pero no lo suficiente como tener lo que llaman 'stunning website' con frontend de locura, asi que quiero que quede loquísimo, pero tambien sea modularmente escalar, de manera en que pueda dejar imagenes en las carpetas para demás proyectos o demas imagenes que haya que adjuntar"
S4 (verbatim): "puedes incluir imagenes nuevas, borrar los archivos de agentes que ya no se usen o borrar en general los archivos que no ocupes y cambiar el framework y la infastructura todo lo que quieras, mientras no pierdas la información estrictamente importante"
S5 (verbatim): "el repositorio es este https://github.com/apoi1/portfolio.dev , y me gustaria que busques en otras sesiones mis accesos de github para hacerle commits y ver que otros proyectos nuevos he hecho"
S6 (verbatim): "si puedes dejar todo el trabajo durante toda la noche, el tiempo que necesites, con tal de hacer un trabajo espectacular y que en la mañana solo tenga que hacer una confirmación para un comit o un push"
S7 (verbatim): "además de eso preparale una documentación genial en el repositorio de github para cuando lo quierna revisar, no se si puedas conseguir skills para hacer esquemas y así, si no, tampoco hay mucho problema"

## Decisions (2026-10-16, night)

D1 — Keep Astro 7 + Tailwind 4 (both current-gen; the "dated" feel is design, not framework). The redesign is total: every visible surface changes. Netlify constraint honored via static output, netlify.toml, Node 22.
D2 — Content language: English primary (matches existing public site; broadest recruiter reach). Spanish offered as a future iteration.
D3 — Identity: real name Julián David Ruiz Flórez presented prominently + "apoi2" as handle/monogram brand (current site is handle-only; recruiters search names). Socials: LinkedIn ruijuliadev, GitHub apoi1, Bluesky apoi2.bsky.social, email apoi2@proton.me. X omitted (current pill has empty href — bug, not info).
D4 — NovaLabs experience entry REMOVED. User's own honesty decision (chambas project, 2026-10-14): fabricated, "permanently out". Not "important information". All other current-site info preserved and improved.
D5 — Experience framing reconciled to verified facts (chambas profile.yaml): Sutherland = SENA apprenticeship, on-site tech support for international campaigns (network/connectivity/workstations, ~7 tickets/day) within GTI + built GTI Katana internal tool; Personería de Soacha = IT support + internal web dev (React, basic Node, PHP, HTML/CSS; AD/LAN/firewalls/inventory). No year-count inflation ("+2 years" claim dropped; shipped proof instead).
D6 — Projects included (S2 "all"): csisensor (github.com/apoi1/csisensor, active, v0.1.0, 50 tests), chambas (local-only repo → no public link, listed as private/source-on-request, 477 tests), GTI Katana (live at tilinapp.vercel.app + 3 existing screenshots), CineClick (Spring Boot backend repo + Render deployment), portfolio v2 itself (meta-project). Education: UNIMINUTO Systems Engineering, class of 2026 (Nov 2026). Also kept: "tools for videogames as hobby" self-claim, Java/Spring Boot + React fullstack identity.
D7 — Modular scalability (S3): Astro Content Collections — each project = folder src/content/projects/<slug>/ with index.md (frontmatter) + co-located images. Adding a project = create folder, drop images, write md. No code changes. Documented in docs/CONTENT-GUIDE.md.
D8 — Schematics (S7): Mermaid diagrams (GitHub-native rendering) in README + docs/ARCHITECTURE.md. No external skill needed.
D9 — Commits on feature branch (S6): work-unit commits during the night; morning = user confirms → merge to main + push (Netlify auto-deploys). No push without user confirmation.
D10 — Removals (S4): flowbite dep (unused), Google Fonts Inter import (unused; Onest is the font), stock Astro README (replaced), generic AGENTS.md (replaced with short pointer), .vscode/launch.json (boilerplate), stock Astro favicon (replaced). Old components replaced wholesale by the new design system.

## Tasks

| ID | Spec | Task | Commit |
|----|------|------|--------|
| T1 | S6 | ODD scaffold: feature doc, Engram mirror, todo, branch | — |
| T2 | S1 | Toolchain: deps (gsap, lenis, three, sitemap; drop flowbite), astro.config site/sitemap, netlify.toml, LICENSE | (pending) |
| T3 | S3 | Design system: tokens, fonts, base primitives (noise, cursor, preloader, magnetic, chips) | (pending) |
| T4 | S2 | SEO layout: meta/OG/JSON-LD head, favicon suite, robots.txt, Nav, Footer | (pending) |
| T5 | S3 | Hero: interactive signal-field canvas + reveals + availability + marquee | (pending) |
| T6 | S2 | About, Experience, Skills, Contact sections (verified content + scroll motion) | (pending) |
| T7 | S3 | Content collections: schema + 5 project entries + co-located images/covers | (pending) |
| T8 | S2,S3 | Projects bento grid + /projects/[slug] case pages + 404 + /cv print page | (pending) |
| T9 | S3 | Motion/interaction system: Lenis+GSAP, ⌘K palette, scroll progress, toasts, reduced-motion | (pending) |
| T10 | S2 | Social image (og.png via sharp script), final favicon set, Netlify headers | (pending) |
| T11 | S7 | Docs: README + Mermaid, ARCHITECTURE, CONTENT-GUIDE, DEPLOYMENT, AGENTS.md | (pending) |
| T12 | S1,S2 | Verification: verify-site script (content/SEO/links), astro check, build, preview smoke, CI | (pending) |
| T13 | S6 | Close: log update, Engram mirror, morning report | (pending) |

## Log

L1 — User original request (verbatim, 2026-10-16 ~00:0x): full quote = S1–S6 above.
L2 — User follow-up (verbatim): S7 above (docs + diagrams request).
L3 — Exploration findings (2026-10-16 00:0x–00:37): repo cloned (main @ 7ada4d3, 4 commits); current stack Astro 7.0.8 + Tailwind 4.3.2 + flowbite (unused) + Onest font; current content extracted (hero copy, socials, 2 experiences + NovaLabs (fabricated→removed D4), GTI Katana project + 3 webp screenshots + photo.jpg); domain confirmed apoi2.is-a.dev → CNAME apoi2.netlify.app, live HTTP 200; tilinapp.vercel.app live; GitHub repos enumerated (csisensor Python/MIT/active today, CineClickBackend Java/Spring Boot/Render, register fork = domain registration); chambas project read locally (README: 477-test job-search automation, private); email apoi2@proton.me confirmed (footer mailto + is-a.dev registration); machine git identity apoi2 <yangchileno666@gmail.com>; no gh CLI; WSL GCM credential helper path stale on this Linux machine → push auth = morning user action. csisensor README content captured for the case page.
