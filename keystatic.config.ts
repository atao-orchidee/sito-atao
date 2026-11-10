// Configurazione del CMS Keystatic: il pannello per i volontari che aggiornano il sito.
// In sviluppo si apre su http://127.0.0.1:4321/keystatic e salva i file sul computer.
// Online (https://www.orchidee-atao.it/keystatic) i volontari entrano con GitHub e ogni salvataggio
// diventa una modifica nel repository: Netlify ripubblica il sito da solo in un paio di minuti.
// I campi corrispondono agli schemi in src/content.config.ts.
import { config, collection, singleton, fields } from '@keystatic/core';

// Repository GitHub del sito, nella forma "account/nome". Da aggiornare quando l'account ATAO esiste.
const REPOSITORY = 'ATAO-ACCOUNT/sito-atao' as const;

const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];

const immagine = (cartella: string, label: string) =>
  fields.image({ label, directory: `src/assets/${cartella}`, publicPath: `../../assets/${cartella}/` });

const testo = (cartella: string, label = 'Testo') =>
  fields.markdoc({
    label,
    extension: 'md',
    options: { image: { directory: `src/assets/${cartella}`, publicPath: `../../assets/${cartella}/` } },
  });

const galleria = (cartella: string) =>
  fields.array(
    fields.object({
      immagine: immagine(cartella, 'Foto'),
      didascalia: fields.text({ label: 'Didascalia' }),
    }),
    { label: 'Foto', itemLabel: (p) => p.fields.didascalia.value || 'Foto' },
  );

// "primo sabato", "ultima domenica"...: valori letti da src/lib/incontri.ts
const REGOLE = ['primo', 'secondo', 'terzo', 'quarto', 'ultimo'].flatMap((o) =>
  ['sabato', 'domenica', 'venerdi'].map((g) => {
    const ord = g === 'domenica' ? o.replace(/o$/, 'a') : o;
    return { label: `${ord} ${g.replace('venerdi', 'venerdì')} del mese`, value: `${ord}-${g}` };
  }),
);

export default config({
  // In sviluppo salva sui file locali, salvo PUBLIC_CMS_GITHUB=si nel file .env (serve una volta sola,
  // per creare l'app GitHub del CMS: vedi PUBBLICAZIONE.md). Online salva sempre su GitHub.
  storage:
    import.meta.env.DEV && import.meta.env.PUBLIC_CMS_GITHUB !== 'si'
      ? { kind: 'local' }
      : { kind: 'github', repo: REPOSITORY },
  ui: {
    brand: { name: 'ATAO' },
    navigation: {
      Orchidee: ['orchidee', 'generi'],
      Associazione: ['eventi', 'cronache', 'notizie', 'pagine'],
      Coltivare: ['guide'],
      Impostazioni: ['sito', 'associazioni'],
    },
  },
  collections: {
    orchidee: collection({
      label: 'Orchidee dei soci',
      path: 'src/content/orchidee/*',
      slugField: 'nome',
      format: { contentField: 'testo' },
      columns: ['genere', 'collezione'],
      previewUrl: '/orchidee/{slug}/',
      schema: {
        nome: fields.slug({ name: { label: 'Nome botanico', description: 'Es. Brassavola nodosa. Genere ed epiteto vengono messi in corsivo automaticamente.' } }),
        genere: fields.text({ label: 'Genere', validation: { isRequired: true } }),
        collezione: fields.text({ label: 'Collezione del socio', description: 'Nome e iniziale del cognome, es. Giuliana C.' }),
        foto: galleria('orchidee'),
        temperatura: fields.select({
          label: 'Temperatura di coltivazione',
          options: [
            { label: 'Non indicata', value: '' },
            { label: 'Fresca', value: 'fresca' },
            { label: 'Intermedia', value: 'intermedia' },
            { label: 'Calda', value: 'calda' },
          ],
          defaultValue: '',
        }),
        luce: fields.select({
          label: 'Luce',
          options: [
            { label: 'Non indicata', value: '' },
            { label: 'Bassa', value: 'bassa' },
            { label: 'Media', value: 'media' },
            { label: 'Alta', value: 'alta' },
          ],
          defaultValue: '',
        }),
        fioritura: fields.multiselect({ label: 'Mesi di fioritura', options: MESI.map((m) => ({ label: m, value: m })) }),
        origine: fields.text({ label: 'Origine', description: 'Es. Messico, Madagascar' }),
        inEvidenza: fields.checkbox({ label: 'In evidenza', defaultValue: false }),
        testo: testo('orchidee', 'Descrizione e coltivazione'),
      },
    }),

    generi: collection({
      label: 'Generi',
      path: 'src/content/generi/*',
      slugField: 'nome',
      format: { contentField: 'testo' },
      previewUrl: '/generi/{slug}/',
      schema: {
        nome: fields.slug({ name: { label: 'Genere' } }),
        foto: immagine('generi', 'Foto'),
        testo: testo('generi'),
      },
    }),

    eventi: collection({
      label: 'Mostre ed eventi',
      path: 'src/content/eventi/*',
      slugField: 'titolo',
      format: { contentField: 'testo' },
      columns: ['data', 'luogo'],
      schema: {
        titolo: fields.slug({ name: { label: 'Titolo' } }),
        data: fields.date({ label: 'Data di inizio', validation: { isRequired: true } }),
        dataFine: fields.date({ label: 'Data di fine', description: 'Solo se l’evento dura più giorni' }),
        orario: fields.text({ label: 'Orario', description: 'Es. 9:00 – 18:00' }),
        luogo: fields.text({ label: 'Luogo', validation: { isRequired: true } }),
        indirizzo: fields.text({ label: 'Indirizzo' }),
        tipo: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Mostra', value: 'mostra' },
            { label: 'Incontro', value: 'incontro' },
            { label: 'Conferenza', value: 'conferenza' },
            { label: 'Altro', value: 'altro' },
          ],
          defaultValue: 'mostra',
        }),
        locandina: immagine('eventi', 'Locandina'),
        link: fields.text({ label: 'Sito dell’evento (facoltativo)' }),
        testo: testo('eventi', 'Descrizione'),
      },
    }),

    cronache: collection({
      label: 'Cronache',
      path: 'src/content/cronache/*',
      slugField: 'titolo',
      format: { contentField: 'testo' },
      columns: ['data'],
      previewUrl: '/cronache/{slug}/',
      schema: {
        titolo: fields.slug({ name: { label: 'Titolo' } }),
        data: fields.date({ label: 'Data', validation: { isRequired: true } }),
        sommario: fields.text({ label: 'Sommario', multiline: true }),
        foto: galleria('cronache'),
        testo: testo('cronache', 'Racconto'),
      },
    }),

    guide: collection({
      label: 'Guide ed esperienze',
      path: 'src/content/guide/*',
      slugField: 'titolo',
      format: { contentField: 'testo' },
      columns: ['categoria', 'autore'],
      previewUrl: '/guide/{slug}/',
      schema: {
        titolo: fields.slug({ name: { label: 'Titolo' } }),
        categoria: fields.select({
          label: 'Categoria',
          options: [
            { label: 'Guida di coltivazione', value: 'guida' },
            { label: 'Esperienza di un socio', value: 'esperienza' },
          ],
          defaultValue: 'esperienza',
        }),
        autore: fields.text({ label: 'Autore' }),
        ordine: fields.integer({ label: 'Ordine', defaultValue: 100 }),
        sommario: fields.text({ label: 'Sommario', multiline: true }),
        copertina: immagine('guide', 'Copertina'),
        testo: testo('guide'),
      },
    }),

    notizie: collection({
      label: 'Notizie',
      path: 'src/content/notizie/*',
      slugField: 'titolo',
      format: { contentField: 'testo' },
      previewUrl: '/notizie/{slug}/',
      schema: {
        titolo: fields.slug({ name: { label: 'Titolo' } }),
        data: fields.date({ label: 'Data' }),
        ordine: fields.integer({ label: 'Ordine', defaultValue: 100 }),
        sommario: fields.text({ label: 'Sommario', multiline: true }),
        copertina: immagine('notizie', 'Copertina'),
        testo: testo('notizie'),
      },
    }),

    pagine: collection({
      label: 'Pagine',
      path: 'src/content/pagine/*',
      slugField: 'titolo',
      format: { contentField: 'testo' },
      schema: {
        titolo: fields.slug({ name: { label: 'Titolo' } }),
        sommario: fields.text({ label: 'Sommario', multiline: true }),
        testo: testo('pagine'),
      },
    }),
  },

  singletons: {
    sito: singleton({
      label: 'Dati del sito e incontri',
      path: 'src/data/sito',
      format: { data: 'json' },
      schema: {
        nome: fields.text({ label: 'Nome dell’associazione' }),
        sigla: fields.text({ label: 'Sigla' }),
        fondazione: fields.integer({ label: 'Anno di fondazione' }),
        email: fields.text({ label: 'Email della segreteria' }),
        sede: fields.text({ label: 'Sede dell’associazione', description: 'Indirizzo completo, es. Contrà Angelini 2, Schio (VI)' }),
        annuncio: fields.object(
          {
            attivo: fields.checkbox({ label: 'Mostra l’annuncio in cima a tutte le pagine', defaultValue: false }),
            testo: fields.text({ label: 'Testo dell’annuncio' }),
            link: fields.text({ label: 'Link (facoltativo)', description: 'Es. /incontri/' }),
          },
          { label: 'Annuncio' },
        ),
        incontri: fields.array(
          fields.object({
            luogo: fields.text({ label: 'Comune' }),
            provincia: fields.text({ label: 'Provincia (sigla)' }),
            indirizzo: fields.text({ label: 'Indirizzo' }),
            regola: fields.select({ label: 'Quando', options: REGOLE, defaultValue: 'ultima-domenica' }),
            orario: fields.text({ label: 'Orario', description: 'Es. 15:00 – 17:30' }),
            nota: fields.text({ label: 'Nota', description: 'Facoltativa, es. Incontro con esperto' }),
          }),
          { label: 'Incontri mensili', itemLabel: (p) => p.fields.luogo.value || 'Sede' },
        ),
      },
    }),

    associazioni: singleton({
      label: 'Altre associazioni',
      path: 'src/data/associazioni',
      format: { data: 'json' },
      schema: {
        voci: fields.array(
          fields.object({
            nome: fields.text({ label: 'Nome' }),
            sigla: fields.text({ label: 'Sigla' }),
            referente: fields.text({ label: 'Referente' }),
            sito: fields.text({ label: 'Sito web' }),
            email: fields.text({ label: 'Email' }),
          }),
          { label: 'Associazioni e siti', itemLabel: (p) => p.fields.nome.value || 'Voce' },
        ),
      },
    }),
  },
});
