---
title: 'chambas — job-search automation, local-first'
tagline: 'A zero-cost, local job-search automation system: ingest, score, track and tailor — under a strict integrity rule.'
description: 'A personal job-search automation system that ingests postings from open sources, scores them against a bilingual profile, tracks applications with follow-up reminders and generates CV tailoring bundles — 477 automated tests, SQLite, FastAPI, fully local.'
tech: ['Python', 'SQLite', 'FastAPI', 'Typer CLI', 'Jinja2', 'pytest']
year: 2026
status: private
order: 2
featured: false
links: {}
cover: ./cover.svg
gallery: []
---

A **local-first, zero-cost job-search automation system** I run every day. It turned the most exhausting part of a job hunt — reading dozens of postings that don't fit — into a five-minute scan of what actually does.

## The daily loop

1. **Ingest** — `chambas ingest` pulls new postings from 7 open, ToS-safe sources (RSS/Atom feeds, Remotive, RemoteOK, HN Who's Hiring, Greenhouse, Lever, GetOnBoard) into a local SQLite store. Platforms that forbid scraping are never touched; those enter by hand with `chambas add`.
2. **Score** — every posting is scored against my bilingual (ES/EN) target-role keyword profiles — nothing hardcoded, all driven by `profile.yaml`. Exclusion keywords are word-boundary matched, because a naive substring filter once hid every posting containing the word "international".
3. **Track** — applications move through a pipeline with automatic follow-up reminders (day 7 by default) and funnel stats that show exactly where the process leaks.
4. **Tailor** — per-job bundles render a CV and cover-letter draft from my verified profile — with anti-burnout daily caps so the system suggests a healthy amount of work, not an infinite list.

## The integrity rule

The system may only **select, reorder and rephrase facts from my verified profile** — it never invents experience. That rule is the point: automation should remove the busywork from honesty, not the honesty from the work.

## The engineering

- **477 automated pytest cases** — the repo's real quality gate, covering ingest connectors (fixture-driven, no network), scoring, the follow-up engine and the tailoring renderer.
- **SQLite with migrations**, idempotent `chambas init`, and a CLI surface of 14 commands (`ingest`, `score`, `track`, `status`, `note`, `followups`, `digest`, `stats`, `tailor`, `brief`, …).
- **Cron automation** — ingest every 6 hours, a digest every morning; the web UI (FastAPI) is embedded, not deployed.
- **Bilingual everywhere** — Spanish keywords for the local market, English for remote; the digest respects the day's caps.

*Source is private for now — happy to walk through the architecture in an interview.*
