// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Tailwind 4 se integra vía PostCSS (postcss.config.mjs) porque el plugin
// @tailwindcss/vite aún no es compatible con el bundler Rolldown de Vite 8
// (Astro 6). @import "tailwindcss" está en src/styles/global.css.
// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    esbuild: {
      drop: ['console', 'debugger'],
    },
  },
});
