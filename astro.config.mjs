// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';

// Tutte le pagine del sito sono generate in anticipo (statiche). Solo il pannello del CMS
// (/keystatic e /api/keystatic) gira come funzione su Netlify, per l'accesso dei volontari con GitHub.

export default defineConfig({
  site: 'https://www.orchidee-atao.it',
  // niente trailingSlash: 'always', altrimenti le rotte di Keystatic (/keystatic/..., /api/keystatic/...) vanno in 404
  integrations: [
    react(),
    sitemap({ filter: (pagina) => !pagina.includes('/keystatic') }),
    keystatic(),
  ],
  adapter: netlify(),
  // I redirect dagli indirizzi del vecchio sito sono in public/_redirects
  // (301 veri, gestiti da Netlify).
});
