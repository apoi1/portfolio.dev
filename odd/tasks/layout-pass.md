# Layout Pass — palette stacking fix + terminal command bar + section rhythm (apoi2 · portfolio.dev)

Repo: github.com/apoi1/portfolio.dev (local: /home/APOI2/Development/Web/Portfolio/portfolio-website)
Branch: continues on `feature/brand-refresh` (same delivery; push still gated on user review).
Scope: user chose "Layout pass ahora, luego push" — skills-guided disposition improvements reviewed against the current composition map, NOT a v3 overhaul. Content, motion system, i18n and architecture stay.

## Specs

S1 (verbatim): "al momento de que probe el ctrl+k se difumino todo, incluyendo el cuadro que bota el comando, revisa eso a la hora del checking, no se si era esa la intencion"
S2 (verbatim): "ya que estas modificando el layout podrias revisar de que manera esta superpuesto ese cuadro para que tambien se le haga blur y ver si puede parecer mas el prompt real de una terminal con el desplegable, en vez de solo el resplegable"
S3 (decision, 2026-10-19): user selected "Layout pass ahora, luego push" — apply the frontend skills to the page disposition before the push, same branch, one delivery.

## Decisions (2026-10-19, two-pass design process per frontend-design)

D1 — Palette stacking root cause (S1+S2): the Ctrl+K overlay (`absolute inset-0`) is a positioned element; the panel is a non-positioned in-flow sibling → CSS painting order puts the overlay ABOVE the panel, so the panel is inside the overlay's backdrop image and the new `backdrop-blur-md` blurred the panel too (and the pre-existing `bg-base/75` had been veiling it at 75% all along). Fix: `relative z-10` on the panel — the panel paints above the overlay; blur then applies only to the page behind.
D2 — Terminal command bar (S2): the palette becomes the same machine's command window — matching the Skills terminal identity: titlebar (traffic lights + `apoi2@bogota:~` + esc), prompt row (`apoi2@bogota:~$` + mono input), results list, statusbar (↑↓ ↵ + close hint, unchanged). Fuzzy filter, keyboard nav, actions and bilingual strings untouched.
D3 — Section rhythm (S3, composition map reviewed against both skills' calibration lists): the site's openers are already distinctive (waveform mark + two-piece heading — a system, not a template), the hero is left-aligned on the signal-field canvas, About is an asymmetric 5/7 grid, Contact is a giant outlined-word finale, the marquee and signal field are explicit user-requested v2 features and stay. The two disposition moves that break the remaining monotony:
  (a) Experience recomposed into an asymmetric editorial layout — left rail (heading + education/languages, sticky on lg) beside the roles timeline — killing the "stack of centered identical sections" repetition; mobile gets a compact side-by-side spec strip under the heading, then the roles.
  (b) Projects bento asymmetry starts earlier: featured card spans both columns from `md` (was `lg`) — no more plain 2-col grid on tablets.
D4 — Restraint (frontend-design: "spend your boldness in one place; remove one accessory"): Hero, About, Skills, Contact, Nav, Footer keep their current compositions — they already vary alignment, scale and gesture; the terminal identity is the one bold moment and now runs through Skills + palette coherently. No v3 redesign in this pass.

## Tasks

| ID | Spec | Task | Commit |
|----|------|------|--------|
| T1 | S1–S3 | Feature doc + Engram mirror | this commit |
| T2 | S1,S2 | Palette: `relative z-10` panel + terminal titlebar + prompt row | this commit |
| T3 | S3 | Experience: asymmetric rail recomposition | this commit |
| T4 | S3 | Projects: featured spans from `md` | this commit |
| T5 | S1–S3 | Verify: build + check + verify + HMR review | this commit (see L3) |
| T6 | S1–S3 | Close: report; push still user-gated | report of 2026-10-19 |

## Log

L1 — User request (verbatim, 2026-10-19): S1 + S2 above; scope decision S3 via user choice.
L2 — Composition map (all sections read): Hero left-aligned on canvas; About 5/7 grid + counters; Experience centered timeline + 2 cards below; Projects 2-col grid (featured `lg:col-span-2`); Skills terminal+channels; Contact outlined-word finale; Marquee user-feature; Footer 3-col + Bogotá clock; palette overlay/panel stacking per D1.
L3 — Implementation + verification (2026-10-19): palette panel got `relative z-10` (paints above the overlay → backdrop-blur now frosts ONLY the page behind; also un-veils the panel from the old 75% dim) + terminal chrome (traffic-light titlebar with `apoi2@bogota:~` + esc, prompt row `apoi2@bogota:~$` with mono input, results, statusbar — functionality untouched); Experience recomposed as 5/7 asymmetric grid with lg:sticky rail (heading + education/languages, side-by-side on sm, stacked on lg) beside the roles timeline; ProjectCard featured span moved lg→md. Suite green: build 15 pages · astro check 0 errors (zod hints remain in push backlog) · verify 258 links + 49 script srcs + legacy hexes 0 · HMR live on localhost:4321.
