import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'] as const;
export const TEMPERATURE = ['fresca', 'intermedia', 'calda'] as const;
export const LUCI = ['bassa', 'media', 'alta'] as const;

// Il CMS salva i campi vuoti come "" o null: per gli schemi equivalgono a "non indicato".
const facoltativo = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === '' || v === null ? undefined : v), schema.optional());

const md = (cartella: string) => glob({ base: `./src/content/${cartella}`, pattern: '**/*.md' });

const orchidee = defineCollection({
  loader: md('orchidee'),
  schema: ({ image }) =>
    z.object({
      nome: z.string(),
      genere: z.string(),
      collezione: facoltativo(z.string()),
      foto: z.array(z.object({ immagine: image(), didascalia: facoltativo(z.string()) })).default([]),
      // dati di coltivazione: facoltativi, compilati dai soci dal CMS
      temperatura: facoltativo(z.enum(TEMPERATURE)),
      luce: facoltativo(z.enum(LUCI)),
      fioritura: z.array(z.enum(MESI)).default([]),
      origine: facoltativo(z.string()),
      inEvidenza: z.boolean().default(false),
    }),
});

const generi = defineCollection({
  loader: md('generi'),
  schema: ({ image }) => z.object({ nome: z.string(), foto: facoltativo(image()) }),
});

const cronache = defineCollection({
  loader: md('cronache'),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      data: z.coerce.date(),
      sommario: facoltativo(z.string()),
      foto: z.array(z.object({ immagine: image(), didascalia: facoltativo(z.string()) })).default([]),
    }),
});

const eventi = defineCollection({
  loader: md('eventi'),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      data: z.coerce.date(),
      dataFine: facoltativo(z.coerce.date()),
      orario: facoltativo(z.string()),
      luogo: z.string(),
      indirizzo: facoltativo(z.string()),
      tipo: z.enum(['mostra', 'incontro', 'conferenza', 'altro']).default('mostra'),
      sommario: facoltativo(z.string()),
      locandina: facoltativo(image()),
      link: facoltativo(z.string()),
    }),
});

const guide = defineCollection({
  loader: md('guide'),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      categoria: z.enum(['guida', 'esperienza']),
      autore: facoltativo(z.string()),
      ordine: z.number().default(100),
      sommario: facoltativo(z.string()),
      copertina: facoltativo(image()),
    }),
});

const notizie = defineCollection({
  loader: md('notizie'),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      data: facoltativo(z.coerce.date()),
      ordine: z.number().default(100),
      sommario: facoltativo(z.string()),
      copertina: facoltativo(image()),
    }),
});

const pagine = defineCollection({
  loader: md('pagine'),
  schema: z.object({ titolo: z.string(), sommario: facoltativo(z.string()) }),
});

export const collections = { orchidee, generi, cronache, eventi, guide, notizie, pagine };
