# Deployment

How this site ships. Short version: **push to `main` → Netlify builds → live
on apoi2.is-a.dev**. Everything else is configuration detail.

## Quick path

1. Merge your work into `main` and push.
2. Netlify auto-builds (`npm run build` → `dist/`, Node 22) from `netlify.toml`.
3. Live in ~1 minute at [apoi2.is-a.dev](https://apoi2.is-a.dev).

## Netlify configuration (`netlify.toml`)

| Setting | Value | Why |
| --- | --- | --- |
| Build command | `npm run build` | Static Astro output |
| Publish dir | `dist` | Astro's static output |
| Node version | 22 | Matches `engines` in package.json |
| Headers | security + cache | See table below |

| Header | Value | Purpose |
| --- | --- | --- |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing guard |
| `X-Frame-Options` | `DENY` | No clickjacking embedding |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Privacy-conscious referrers |
| `Permissions-Policy` | camera/mic/geo off | Only what the site needs |
| `Cache-Control` | `/_astro/*` immutable · HTML must-revalidate | Hashed assets cache hard |

## The custom domain

- Registered through **is-a.dev** (free subdomains for developers) via the
  [register](https://github.com/apoi1/register) fork.
- DNS: `apoi2.is-a.dev → CNAME → apoi2.netlify.app`.
- Netlify serves both `apoi2.netlify.app` and the custom domain; the site
  canonicalizes every URL to `https://apoi2.is-a.dev` (see `astro.config.mjs`
  `site` + Layout canonical/hreflang tags).

## Netlify constraints honored by this design

| Constraint | How the site respects it |
| --- | --- |
| Static hosting (no long-running processes) | 100% static build; no SSR, no functions |
| Serverless functions are optional | None used — contact is mailto + copy-to-clipboard |
| Build minutes | Lean build (~3 s local, one page tree) |
| No persistent storage | Content lives in git, images optimized at build |

## Regenerating OG cards & favicons

```bash
npm run gen:og
```

Renders `public/og.png`, `public/og-es.png`, `apple-touch-icon.png` and
`favicon.png` from `scripts/generate-og.mjs` using sharp/librsvg.

> The OG typography uses the **Onest** variable font, which must be visible
> to fontconfig. One-time setup:
> `mkdir -p ~/.local/share/fonts && curl -L -o ~/.local/share/fonts/Onest-Variable.ttf
> "https://raw.githubusercontent.com/google/fonts/main/ofl/onest/Onest%5Bwght%5D.ttf" && fc-cache -f`
> Without it the cards render with system-font fallbacks (still fine).

Outputs are **committed** — Netlify builds never run the generator.

## Local verification before pushing

```bash
npm run check      # types
npm run build      # 15 static pages
npm run verify     # content/SEO/link smoke test over dist/
npm run preview    # http://localhost:4321 — test both themes + locales
```

## Next step

Changed content? → [CONTENT-GUIDE.md](CONTENT-GUIDE.md)
