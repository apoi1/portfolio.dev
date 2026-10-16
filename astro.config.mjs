// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical production URL (custom domain, CNAME'd to apoi2.netlify.app).
  // Used for sitemap.xml, canonical URLs and Open Graph metadata.
  site: 'https://apoi2.is-a.dev',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
