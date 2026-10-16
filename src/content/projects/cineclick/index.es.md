---
title: 'CineClick — películas full-stack'
tagline: 'El backend Spring Boot de una aplicación de películas — API REST de movies y reviews, con Docker y deployada en Render.'
description: 'Backend REST en Spring Boot para una aplicación full-stack de películas: endpoints de películas y reseñas, arquitectura en capas (controller → service → repository), Maven, Docker, viva en Render.'
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

La mitad backend de una **aplicación full-stack de películas** — pública en GitHub: una API REST en Spring Boot para películas y reseñas con la arquitectura clásica en capas (controller → service → repository), build con Maven, soporte Docker y un deploy vivo en Render.

## Qué hay adentro

- Endpoints REST para películas y reseñas (`MovieController`, `ReviewController`) — flujos de creación, lectura y borrado.
- Repositorios Spring Data JPA con una capa de servicios que hace la validación.
- Build Dockerizado; lo primero que alcanzo cuando voy full-stack es **Java + Spring Boot**.

Este es el stack que más disfruto para backend: tipado fuerte, capas claras y convenciones aburridas de la buena manera.
