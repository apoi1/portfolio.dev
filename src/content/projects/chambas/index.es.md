---
title: 'chambas — automatización de búsqueda de empleo, local-first'
tagline: 'Sistema local y de costo cero para automatizar la búsqueda de empleo: ingesta, scoring, seguimiento y tailoring — con una regla de integridad estricta.'
description: 'Sistema personal de automatización de búsqueda de empleo: ingresa vacantes de fuentes abiertas, las califica contra un perfil bilingüe, hace seguimiento con recordatorios y genera paquetes de personalización de CV — 477 pruebas automatizadas, SQLite, FastAPI, todo local.'
tech: ['Python', 'SQLite', 'FastAPI', 'Typer CLI', 'Jinja2', 'pytest']
year: 2026
status: private
order: 2
featured: false
links: {}
cover: ./cover.svg
gallery: []
---

Un **sistema local-first y de costo cero para automatizar la búsqueda de empleo** que corro todos los días. Convirtió la parte más agotadora de una cacería de trabajo — leer docenas de vacantes que no encajan — en un escaneo de cinco minutos de las que sí encajan.

## El loop diario

1. **Ingesta** — `chambas ingest` trae vacantes nuevas de 7 fuentes abiertas y seguras para sus términos (feeds RSS/Atom, Remotive, RemoteOK, HN Who's Hiring, Greenhouse, Lever, GetOnBoard) a un almacén SQLite local. Las plataformas que prohíben scraping nunca se tocan; esas entran a mano con `chambas add`.
2. **Scoring** — cada vacante se califica contra mis perfiles bilingües (ES/EN) de palabras clave por rol objetivo — nada hardcodeado, todo impulsado por `profile.yaml`. Las palabras de exclusión se matchean por límite de palabra, porque un filtro naïve por substring una vez me escondió todas las vacantes que contenían la palabra "international".
3. **Seguimiento** — las postulaciones avanzan por un pipeline con recordatorios automáticos de follow-up (día 7 por defecto) y estadísticas de embudo que muestran exactamente dónde se fuga el proceso.
4. **Tailoring** — por cada vacante se renderiza un borrador de CV y carta desde mi perfil verificado — con topes anti-burnout diarios para que el sistema sugiera una cantidad sana de trabajo, no una lista infinita.

## La regla de integridad

El sistema solo puede **seleccionar, reordenar y reformular hechos de mi perfil verificado** — nunca inventa experiencia. Esa regla es el punto: la automatización le debe quitar el papeleo a la honestidad, no la honestidad al trabajo.

## La ingeniería

- **477 casos pytest automatizados** — la verdadera compuerta de calidad del repo: conectores de ingesta (fixture-driven, sin red), scoring, el motor de follow-ups y el renderer de tailoring.
- **SQLite con migraciones**, `chambas init` idempotente y una CLI de 14 comandos (`ingest`, `score`, `track`, `status`, `note`, `followups`, `digest`, `stats`, `tailor`, `brief`, …).
- **Automatización por cron** — ingesta cada 6 horas, un digest cada mañana; la interfaz web (FastAPI) es embebida, no deployada.
- **Bilingüe de punta a punta** — palabras clave en español para el mercado local, en inglés para lo remoto; el digest respeta los topes del día.

*El código es privado por ahora — con gusto recorro la arquitectura en una entrevista.*
