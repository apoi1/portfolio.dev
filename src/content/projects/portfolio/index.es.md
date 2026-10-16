---
title: 'portfolio.dev — este sitio web'
tagline: 'El sitio en el que estás: bilingüe, con tema oscuro/claro y foco en el movimiento — y aun así 100% estático en Netlify.'
description: 'Mi portafolio reconstruido desde cero: Astro 7 + Tailwind 4, bilingüe EN/ES con hreflang, temas oscuro/claro, hero interactivo en three.js, coreografía de scroll con GSAP y content collections — estático en Netlify.'
tech: ['Astro', 'Tailwind CSS', 'GSAP', 'three.js', 'TypeScript', 'Netlify']
year: 2026
status: live
order: 5
featured: false
links:
  repo: https://github.com/apoi1/portfolio.dev
  live: https://apoi2.is-a.dev
cover: ./cover.svg
gallery: []
---

El sitio en el que estás — reconstruido desde cero como un **portafolio bilingüe, con doble tema y foco en el movimiento** que sigue siendo 100% estático en Netlify. Cada línea se puede leer en el repo.

## Los sistemas detrás

- **Contenido en carpetas** — las content collections de Astro generan cada tarjeta de proyecto y esta misma página: una carpeta por proyecto, dos entradas markdown (EN/ES), portadas y galerías co-localizadas, validadas por un schema Zod en build. Agregar un proyecto es una operación de archivos, no de código.
- **i18n con recibos** — inglés en `/`, español en `/es/`; el diccionario español se type-checkea contra la forma del inglés, así que una traducción faltante es un error de build. Cada página trae alternates hreflang, OG cards por idioma y JSON-LD.
- **Temas como variables** — el modo oscuro es el default; el claro es un solo bloque `[data-theme="light"]` que redeclara las mismas variables CSS, resueltas por las utilidades de Tailwind en runtime — cero bifurcación de build, cero flash de tema equivocado, y el hero en three.js se recolorea en vivo con las mismas custom properties.
- **Movimiento con contrato** — un sistema declarativo de atributos (`data-reveal`, `data-stagger`, `data-counter`, `data-magnetic`) cableado a Lenis + GSAP, donde cada efecto colapsa a contenido estático visible bajo `prefers-reduced-motion`. La única secuencia orquestada es el relevo preloader→hero; todo lo demás se queda quieto.
- **El campo de señales** — el hero son ~12.000 puntos con blending aditivo ondulando como ondas de radio, rippliando alrededor de tu cursor, leyendo su paleta de variables CSS. Es la tesis estética del sitio entero: esto es en lo que trabajo, dibujado con la física de donde viene.

## Los detalles que un reclutador puede comprobar

- **Compuertas de calidad en CI** — `astro check` (cero errores de tipos), un build de 15 páginas y un script `verify` custom que re-chequea el sitio generado: inventario de páginas, marcadores de contenido en ambos idiomas, tags SEO, emparejamiento hreflang, 258 links internos, fuentes de scripts y hasta que `netlify.toml` siga parseando (una lección de un incidente de deploy real).
- **Headers de seguridad y caché** vía `netlify.toml`; assets hasheados inmutables; CVs listos para imprimir en `/cv` y `/es/cv`.
- **Easter eggs** — un saludo estilizado en consola para los curiosos del devtools, un código Konami que amplifica la señal del hero, un `sudo hire apoi2` escondido en la paleta ⌘K y lluvia de señales en el 404.
