// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical production URL (custom domain, CNAME'd to apoi2.netlify.app).
  site: 'https://apoi2.is-a.dev',

  // Bilingual site: EN at / (default), ES at /es/*
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', es: 'es' },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
