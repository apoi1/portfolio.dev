# Content guide

How to add projects, images and translations. If you can create a folder,
you can publish a project on this site.

## Quick path

1. Create `src/content/projects/<slug>/` (`slug` = URL, kebab-case).
2. Add `index.en.md` + `index.es.md` (frontmatter + body) and a `cover` image.
3. `npm run build` — card, case pages (`/projects/<slug>` + `/es/projects/<slug>`),
   palette entry and sitemap update automatically.

## Folder anatomy

```text
src/content/projects/csisensor/
├── index.en.md       ← required
├── index.es.md       ← required
├── cover.svg         ← required (16:10 recommended)
└── shot-1.webp       ← optional gallery (list in `gallery:`)
```

## Frontmatter reference

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | ✅ | Case-page `<h1>`; keep it recognizable |
| `tagline` | string | ✅ | One-sentence pitch shown on the card |
| `description` | string | ✅ | SEO meta + OG description (~150–180 chars) |
| `tech` | string[] | ✅ | Card shows first 4–6, then `+N` |
| `year` | number | ✅ | Shown on card + case page |
| `status` | `live` \| `active` \| `private` \| `wip` | ✅ | Drives the status LED and labels |
| `order` | number | ✅ | Grid position (1 = first; featured slot is `featured: true`) |
| `featured` | boolean | ➖ | Big bento slot (default `false`) |
| `links.repo` | URL | ➖ | GitHub icon on card + button on case page |
| `links.live` | URL | ➖ | "Live" button + status LED context |
| `cover` | image path | ✅ | `./cover.svg` — relative to the markdown file |
| `gallery` | image paths | ➖ | `gallery: [./shot-1.webp, …]` |

## Writing rules

- **Both locales must exist.** `es` is type-identical to `en`; a project
  missing one locale drops out of that locale's grid silently.
- **Keep `tech`, `year`, `status`, `order`, `links`, `cover`, `gallery`
  identical in both files** — only `title`, `tagline`, `description` and
  the body are translated.
- YAML gotcha: inside single-quoted strings, apostrophes must be doubled —
  `'Sutherland''s GTI team'` (a raw `'` breaks the frontmatter parse).
- The body is Markdown; `##` sections, lists, `> quotes` and **bold** all
  render with the case-page styles.

## Images

- **Cover:** 16:10 (e.g. 880×550). SVG, PNG or WebP. SVG covers can be
  hand-drawn blueprint art — see the existing four for the style.
- **Gallery:** any count; each is optimized by Astro's image pipeline.
  Real screenshots beat art when you have them.
- Real photos → `.webp`; diagram art → `.svg`.

## Checklist before you commit

- [ ] Both `index.en.md` and `index.es.md` exist and parse (`npm run check`)
- [ ] `cover` renders (not a broken path)
- [ ] Apostrophes in frontmatter escaped (`''`)
- [ ] `npm run build` green + `npm run verify` passes

## Next step

Example walk-through: read `src/content/projects/csisensor/` — it uses every
feature (featured slot, repo link, gallery-less SVG cover, bilingual bodies).
