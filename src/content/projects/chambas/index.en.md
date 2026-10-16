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

A **local-first, zero-cost job-search automation system** I run daily: it ingests postings from open, ToS-safe sources (RSS, Greenhouse, Lever, HN Who's Hiring, GetOnBoard…), scores every posting against a bilingual keyword profile, tracks applications through a pipeline with automatic follow-up reminders, computes funnel stats, and generates per-job CV and cover-letter tailoring bundles — under one binding rule: it can only select, reorder and rephrase **verified profile facts**; it never invents experience.

## Highlights

- **7 ingest sources** plus manual add, with anti-burnout daily caps baked in.
- **SQLite** storage with migrations; scoring fully driven by the target-role config — nothing hardcoded.
- **477 automated pytest cases** — the repo's real quality gate.
- **CLI + embedded web UI** (FastAPI), cron-driven digests, bilingual ES/EN throughout.
- Private by design: personal data lives outside git.

*Source is private for now — happy to walk through the architecture in an interview.*
