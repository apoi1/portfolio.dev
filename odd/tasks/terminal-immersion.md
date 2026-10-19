# Terminal Immersion — real-terminal command set + palette executes commands (apoi2 · portfolio.dev)

Repo: github.com/apoi1/portfolio.dev (local: /home/APOI2/Development/Web/Portfolio/portfolio-website)
Branch: continues on `feature/brand-refresh` (same delivery; push still gated on user review).
Context: user liked the new mockup and the fixed palette panel, then asked for a fully real-terminal experience; their `cd projects` attempt (made in the palette, which only filtered) surfaced the real requirement: one coherent command language across palette and terminal.

## Specs

S1 (verbatim): "ok, faltaria hacer mas immersiva la terminal, en donde cada uno de los comandos sea alusivo a uno de terminal real, hacerlo totalmente estilo de una terminal real"
S2 (verbatim): "ya que de momento el cd projects que me mencionas no me aparece en el portfolio que estoy viendo"
S3 (verbatim): "almenos el cuadro ahora si aparece bien, eso si, el mockup me gusta mas"
S4 (verbatim, 2026-10-19): "en español abajo del nombre en la primera seccion en español dice tambien conocido comoapoi2, pero lo dice pegado, recuerda ponerle un espacio entre \"conocido como\" y \"apoi2\""
S5 (verbatim, 2026-10-19): "en el prompt que va cambiando que dice cosas como 'building: full-stack' la parte de 'building' o 'contruyendo' no se lee a simple vista, creo que es del mismo color del contenedor, puedes revisar si el contraste está bien"
S6 (verbatim, 2026-10-19): "ya vi la terminal que hablabas, pero crei que era la de ctrl+K, me gustaria que esa se comportara como terminal"

## Decisions (2026-10-19)

D1 — Palette executes shell commands (S2): on Enter, before the filter/active-item path, the palette input accepts real commands: `cd <section|project-slug|~|..|home>` (scrolls or navigates, then closes) and `sudo hire apoi2` (runs the secret item). Anything else keeps the fuzzy-filter + active-item behavior. The palette and the Skills terminal now share one command language.
D2 — Skills terminal becomes a real shell (S1): new commands — `pwd` (prints the cwd path), `history` (numbered session history, capped at 50), `cat <file>` (readable files: status.txt · contact.txt · cv.txt; missing operand and missing-file print real-Unix-format errors), `uname` (site flavor system info), `exit`/`logout` (playful refusal — there is no escape). `help` becomes a real multi-line manual; output gains `whitespace-pre-line` so multi-line strings render as real terminal output. Tab completion (bash-like): first Tab completes the unique match or the common prefix; pools: bare commands, `cd` targets (sections + ~ + ..), `cat` files.
D3 — Real-Unix output formats: unknown command → the existing localized "command not found" line; `cat` errors → `cat: <file>: No such file or directory` (localized template, {f} placeholder). Restraint kept: no boot sequence, no fake OS — the terminal stays the site's instrument, all output terse.
D4 — i18n: every new user-visible string lives in ui.ts with EN+ES keys shape-identical (AGENTS.md invariant 1). The palette placeholder now hints the command path.
D5 — Palette IS a terminal now (S6, supersedes D1's narrower cd-only interception): the Ctrl+K input executes the same command language as the Skills terminal — cd (sections + project slugs + ~ / .. / home), ls, help, whoami, pwd, uname, history, cat <file>, open <target> (github · linkedin · bluesky · cv, matched by item label or /cv href), email (runs the copy item), sudo (runs the secret item), theme, lang, clear, konami, exit/logout/close. Command output renders INSIDE the palette in a dedicated `#cmdk-out` block (terminal-style, multi-line, mono) replacing the suggestions list; typing returns to suggestion mode; non-command text keeps the fuzzy-filter + active-item path. The item list remains the command discovery surface.
D6 — Hero fixes (S4+S5): the aka/apoi2 gap is fixed with an explicit `mr-1.5` on a wrapping span (the JSX-style whitespace between expression and element was compiler-eaten — the bug existed in EN too as "a.k.a.apoi2"); the rotator prefix gets `text-violet` (amber prompt semantics, pairing with the › — and a real contrast bump: 10.67:1 dark / 5.31:1 light, verified in the T5 audit).

## Tasks

| ID | Spec | Task | Commit |
|----|------|------|--------|
| T1 | S1–S3 | Feature doc + Engram mirror | (pending) |
| T2 | S2 | Palette: shell-command execution on Enter (cd + sudo) | this commit (superseded in breadth by D5/T7 — full command set) |
| T3 | S1 | Terminal: pwd/history/cat/uname/exit + multi-line help + Tab completion | this commit |
| T4 | S1,D4 | i18n EN+ES for all new strings | this commit |
| T5 | S1–S3 | Verify: build + check + verify + HMR review | this commit (see L4) |
| T6 | S1–S3 | Close: report; push still user-gated | (pending) |
| T7 | S4–S6 | Hero aka gap + rotator prefix contrast + palette-as-terminal execution layer | this commit |

## Log

L1 — User request (verbatim, 2026-10-19): S1–S3 above.
L2 — Root cause of S2: the user typed `cd Projects` in the Ctrl+K palette (now terminal-styled but filter-only) — no execution, no feedback. The fix is behavioral (D1), not just visual: both surfaces speak the same command language.
L3 — Scope growth (2026-10-19, same review round): user confirmed the palette panel renders correctly and the mockup is liked (S3); reported the ES hero aka gap (S4) and the rotator prefix readability (S5); and after finding the Skills terminal clarified that the palette is the one they want behaving as a terminal (S6) → D5 supersedes D1 in breadth (full command set + in-palette output), D6 covers the hero fixes. All strings shared via ui.ts skills.terminal.out; ES mirrors EN keys exactly.
L4 — Verification (2026-10-19): first run caught 1 error (ts2307 — palette script import one level too deep: '../../i18n/ui' from components/, fixed to '../i18n/ui'); re-run fully green: build 15 pages · astro check 0 errors 0 warnings · verify 258 links + 64 script srcs (up from 49 — the new terminal scripts) + legacy hexes 0 · rotator-prefix contrast verified numerically: amber on base 10.67:1 (dark) / 5.31:1 (light). HMR live on localhost:4321 for user review.
