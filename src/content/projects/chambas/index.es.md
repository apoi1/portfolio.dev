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

Un **sistema local-first y de costo cero para automatizar la búsqueda de empleo** que corro a diario: ingresa vacantes de fuentes abiertas y seguras para sus términos (RSS, Greenhouse, Lever, HN Who's Hiring, GetOnBoard…), califica cada vacante contra un perfil bilingüe de palabras clave, hace seguimiento de las postulaciones por un pipeline con recordatorios automáticos de follow-up, calcula estadísticas de embudo y genera paquetes de personalización de CV y carta de presentación por vacante — bajo una regla vinculante: solo puede seleccionar, reordenar y reformular **hechos verificados del perfil**; nunca inventa experiencia.

## Aspectos destacados

- **9 fuentes de ingesta** más alta manual, con topes anti-burnout incorporados.
- **SQLite** con migraciones; el scoring está 100% impulsado por la configuración de roles objetivo — nada hardcodeado.
- **477 casos de prueba pytest** — la verdadera compuerta de calidad del repo.
- **CLI + interfaz web embebida** (FastAPI), digests por cron, bilingüe ES/EN de punta a punta.
- Privado por diseño: los datos personales viven fuera de git.

*El código es privado por ahora — con gusto recorro la arquitectura en una entrevista.*
