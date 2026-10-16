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

La mitad backend de una **aplicación full-stack de películas** — pública en GitHub y deployada en Render. Cuando voy full-stack, esta es la forma que alcanzo: Java con Spring Boot, capas claras, tipado fuerte y convenciones aburridas de la mejor manera.

## La arquitectura

El repo sigue el layering clásico de Spring, una preocupación por capa, con el package nombrado por la marca (`dev.apoi2.cineclick`):

- **Controller** — `MovieController` y `ReviewController` exponen la superficie REST: listado de películas, detalles y el flujo de reseñas (crear / leer / borrar).
- **Service** — las reglas de negocio y la validación viven acá, lejos de la capa HTTP.
- **Repository** — Spring Data JPA habla con el almacén; los modelos se quedan delgados y honestos.
- Un bootstrap `MoviesApplication`, un build Maven con wrapper (`./mvnw`), un `Dockerfile` para correr containerizado y una prueba de humo que arranca el contexto completo.

## Deployment

La API está viva en [cineclickbackend.onrender.com](https://cineclickbackend.onrender.com) — lo que la vuelve fácil de chequear con un `curl` cualquiera durante una entrevista, y obliga al código a sobrevivir un cold start real en vez de vivir solo en mi máquina.

## Por qué está en el portafolio

Es el centro honesto de mi stack: no es un sistema de investigación como csisensor ni una automatización personal como chambas — un backend convencional y bien estructurado exactamente del tipo que los equipos de producción publican todos los días.
