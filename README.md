# Sito ATAO – Associazione Triveneta Amatori Orchidee

Nuovo sito di [orchidee-atao.it](https://www.orchidee-atao.it), costruito con [Astro](https://astro.build) e il CMS [Keystatic](https://keystatic.com). Il sito pubblicato è completamente statico: niente PHP né database da aggiornare.

## Avvio in locale

Serve Node.js 22.23 o superiore.

```sh
npm install
npm run dev
```

- Sito: http://127.0.0.1:4321
- CMS per modificare i contenuti: http://127.0.0.1:4321/keystatic

```sh
npm run build     # genera il sito in dist/
npm run preview   # mostra la versione generata
```

## Dove stanno i contenuti

| Cosa | Cartella | Nel CMS |
|---|---|---|
| Orchidee dei soci | `src/content/orchidee/` | Orchidee dei soci |
| Generi | `src/content/generi/` | Generi |
| Mostre in programma | `src/content/eventi/` | Mostre ed eventi |
| Cronache delle mostre | `src/content/cronache/` | Cronache |
| Guide ed esperienze dei soci | `src/content/guide/` | Guide ed esperienze |
| Notizie e documenti | `src/content/notizie/` | Notizie |
| Testo "L'associazione" | `src/content/pagine/` | Pagine |
| Email, annuncio in cima al sito, sedi e regole degli incontri mensili | `src/data/sito.json` | Dati del sito e incontri |
| Altre associazioni | `src/data/associazioni.json` | Altre associazioni |

La data del prossimo incontro si calcola da sola dalle regole (es. "ultima domenica del mese"), anche nel browser: non serve ripubblicare il sito ogni mese.

## Importazione dal vecchio sito

I testi del vecchio sito (Adobe Spry) sono in `legacy/xml/` e sono già stati importati.

```sh
node scripts/scarica-immagini.mjs          # scarica foto e PDF dal vecchio server (lento: rispetta il Crawl-delay)
node scripts/migra-contenuti.mjs --force   # rigenera i contenuti collegando le foto scaricate
```

Attenzione: `--force` sovrascrive anche le modifiche fatte dal CMS. Va usato solo prima che i volontari inizino a modificare i contenuti.

## Pubblicazione

Il sito si pubblica su Netlify (configurazione in `netlify.toml`). Le pagine sono tutte statiche; solo il pannello del CMS gira come funzione Netlify, per l'accesso dei volontari con GitHub. Il file `public/_redirects` reindirizza i vecchi indirizzi (`Pagina_*.html`) alle nuove pagine.

In locale il CMS salva sui file del computer; online salva sul repository GitHub e Netlify ripubblica da solo.

**La guida completa, passo per passo, è in [PUBBLICAZIONE.md](PUBBLICAZIONE.md).**
