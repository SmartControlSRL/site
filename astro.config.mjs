// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://smartcontrol.ro',
  // /en/404/ is a locale-specific server error document, not an indexable
  // route. Astro already omits the root 404.html; exclude its EN counterpart.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/en/404/') })],
  // RO is the default locale at `/`; EN lives under `/en/`. Full parity.
  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
