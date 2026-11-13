// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// Tutte le pagine del sito sono generate in anticipo (statiche). Solo il pannello del CMS
// (/keystatic e /api/keystatic) gira come Worker su Cloudflare, per l'accesso dei volontari con GitHub.

export default defineConfig({
  site: 'https://www.orchidee-atao.it',
  // niente trailingSlash: 'always', altrimenti le rotte di Keystatic (/keystatic/..., /api/keystatic/...) vanno in 404
  integrations: [
    react(),
    sitemap({ filter: (pagina) => !pagina.includes('/keystatic') }),
    keystatic(),
  ],
  // Le foto sono ottimizzate durante la build (come prima): nessun servizio immagini a pagamento.
  adapter: cloudflare({ imageService: 'compile' }),
  // I redirect dagli indirizzi del vecchio sito sono in public/_redirects
  // (301 veri, gestiti da Cloudflare per i file statici).
});
