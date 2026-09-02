// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://smartcontrol.ro',
  // Error documents are routable deployment internals and must not be
  // advertised as indexable content. The approved privacy routes are content.
  integrations: [sitemap({ filter: (page) => ![
    '/en/404/',
  ].some((path) => page.endsWith(path)) })],
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
