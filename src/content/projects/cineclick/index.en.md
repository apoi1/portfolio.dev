---
title: 'CineClick — movies full-stack'
tagline: 'The Spring Boot backend of a movies full-stack app — REST API for movies and reviews, Dockerized and deployed on Render.'
description: 'Spring Boot REST backend for a movies full-stack application: movies and reviews endpoints, layered architecture (controller → service → repository), Maven, Docker, live on Render.'
tech: ['Java', 'Spring Boot', 'Maven', 'Docker', 'REST', 'JPA']
year: 2026
status: live
order: 4
featured: false
links:
  repo: https://github.com/apoi1/CineClickBackend
  live: https://cineclickbackend.onrender.com
cover: ./cover.svg
gallery: []
---

The backend half of a **movies full-stack application** — public on GitHub and deployed on Render. When I go full-stack, this is the shape I reach for: Java with Spring Boot, clear layers, strong typing, conventions that are boring in the best way.

## The architecture

The repo follows Spring's classic layering, one concern per layer, with the package named after the brand (`dev.apoi2.cineclick`):

- **Controller** — `MovieController` and `ReviewController` expose the REST surface: movie listings, details, and the review flow (create / read / delete).
- **Service** — business rules and validation live here, away from the HTTP layer.
- **Repository** — Spring Data JPA talks to the store; models stay thin and honest.
- A `MoviesApplication` bootstrap, a Maven build with the wrapper (`./mvnw`), a `Dockerfile` for containerized runs, and a smoke test that boots the whole context.

## Deployment

The API is live at [cineclickbackend.onrender.com](https://cineclickbackend.onrender.com) — which makes it easy to check with a plain `curl` during an interview, and forces the code to survive a real cold start instead of only living on my machine.

## Why it's on the portfolio

It's the honest middle of my stack: not a research system like csisensor, not a personal automation like chambas — a conventional, well-structured backend of exactly the kind production teams ship every day.
