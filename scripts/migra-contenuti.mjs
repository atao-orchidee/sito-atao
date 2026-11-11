// Importa i contenuti del vecchio sito (legacy/xml/*.xml) nelle content collection di Astro.
//
//   node scripts/migra-contenuti.mjs           crea solo i file che non esistono ancora
//   node scripts/migra-contenuti.mjs --force   rigenera tutto (sovrascrive le modifiche fatte dal CMS!)
//
// Le foto vengono collegate solo se sono già state scaricate in legacy/cache
// (vedi scripts/scarica-immagini.mjs): dopo il download, rilanciare con --force.
import { mkdirSync, writeFileSync, existsSync, copyFileSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import {
  ROOT, leggiRecord, fotoDelRecord, htmlInMarkdown, pulisciTesto,
  slugify, slugUnico, immagineInCache, estensione,
} from './legacy/comune.mjs';

const FORCE = process.argv.includes('--force');
const CONTENT = join(ROOT, 'src', 'content');
const ASSETS = join(ROOT, 'src', 'assets');
const DATA = join(ROOT, 'src', 'data');
const stats = { scritti: 0, saltati: 0, foto: 0, fotoMancanti: 0 };

// Correzioni di errori evidenti nei testi originali.
const CORREZIONI = [
  ['Nel 1924 il botanico John Lindley', 'Nel 1824 il botanico John Lindley'],
];
const correggi = (s) => CORREZIONI.reduce((t, [da, a]) => t.split(da).join(a), s);

// ---------- scrittura file ----------

function yamlValore(v, rientro) {
  if (Array.isArray(v)) {
    if (!v.length) return ' []';
    return '\n' + v.map((el) => {
      if (el && typeof el === 'object') {
        const righe = Object.entries(el).filter(([, x]) => x !== undefined && x !== null && x !== '');
        return righe.map(([k, x], i) => `${rientro}${i ? '  ' : '- '}${k}:${yamlValore(x, rientro + '    ')}`).join('\n');
      }
      return `${rientro}- ${JSON.stringify(el)}`;
    }).join('\n');
  }
  return ' ' + JSON.stringify(v);
}

function frontmatter(dati) {
  const righe = Object.entries(dati)
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length))
    .map(([k, v]) => `${k}:${yamlValore(v, '  ')}`);
  return `---\n${righe.join('\n')}\n---\n`;
}

function scrivi(percorso, testo) {
  if (existsSync(percorso) && !FORCE) { stats.saltati++; return; }
  mkdirSync(join(percorso, '..'), { recursive: true });
  writeFileSync(percorso, testo, 'utf8');
  stats.scritti++;
}

const scriviVoce = (collezione, slug, dati, corpo = '') =>
  scrivi(join(CONTENT, collezione, `${slug}.md`), frontmatter(dati) + (corpo ? `\n${correggi(corpo)}\n` : ''));

/** Copia la foto scaricata in src/assets/<collezione>/ e restituisce il percorso relativo al file .md. */
function foto(collezione, miniatura) {
  const sorgente = immagineInCache(miniatura);
  if (!sorgente) { stats.fotoMancanti++; return null; }
  const nome = slugify(basename(miniatura).replace(/\.[^.]+$/, '')) + estensione(sorgente);
  const dest = join(ASSETS, collezione, nome);
  mkdirSync(join(ASSETS, collezione), { recursive: true });
  if (!existsSync(dest) || FORCE) copyFileSync(sorgente, dest);
  stats.foto++;
  return `../../assets/${collezione}/${nome}`;
}

const galleria = (collezione, rec) =>
  fotoDelRecord(rec)
    .map((f) => ({ immagine: foto(collezione, f.miniatura), didascalia: f.didascalia || undefined }))
    .filter((f) => f.immagine);

/** Immagini inline per il corpo dei testi lunghi (guide, articoli, notizie). */
const immaginiInline = (collezione, rec, alt) =>
  fotoDelRecord(rec)
    .map((f) => [foto(collezione, f.miniatura), f.didascalia || alt])
    .filter(([p]) => p)
    .map(([p, d]) => `![${d.replace(/[[\]]/g, '')}](${p})`)
    .join('\n\n');

const maiuscolaIniziale = (t) => (t === t.toUpperCase() ? t.charAt(0) + t.slice(1).toLowerCase() : t);

// ---------- orchidee dei soci ----------

// Abbreviazioni e refusi nel primo termine del nome -> genere corretto.
const ALIAS_GENERI = {
  paph: 'Paphiopedilum',
  oprhys: 'Ophrys',
  slc: 'Sophrolaeliocattleya',
  blc: 'Brassolaeliocattleya',
};
const REFUSI_NOMI = [[/^Oprhys\b/, 'Ophrys'], [/\.(jpe?g|gif|png)$/i, '']];

const FILE_ORCHIDEE = ['A-B', 'C', 'D', 'E-L', 'M-O', 'P', 'Q-Z'].map((p) => `Foto_orchidee_pag_${p}.xml`);
const slugOrchidee = new Set();
for (const file of FILE_ORCHIDEE) {
  for (const r of leggiRecord(file)) {
    const nome = REFUSI_NOMI.reduce((n, [re, giusto]) => n.replace(re, giusto), pulisciTesto(r.nome));
    if (!nome) continue;
    const primo = nome.split(/\s+/)[0].replace(/[^A-Za-zÀ-ÿ×-]/g, '');
    const genere = ALIAS_GENERI[primo.toLowerCase()] ?? primo;
    const collezione = pulisciTesto(r.proprietario).replace(/^collezione\s+(di\s+)?/i, '');
    scriviVoce('orchidee', slugUnico(slugify(nome), slugOrchidee), {
      nome,
      genere: genere.charAt(0).toUpperCase() + genere.slice(1).toLowerCase(),
      collezione: collezione || undefined,
      foto: galleria('orchidee', r).map((f) => ({ ...f, didascalia: f.didascalia ?? nome })),
    }, htmlInMarkdown(r.descrizione));
  }
}

// ---------- generi ----------

const slugGeneri = new Set();
for (const r of leggiRecord('Elenco_Generi_e_specie.xml')) {
  const nome = pulisciTesto(r.specie);
  const img = fotoDelRecord(r)[0];
  scriviVoce('generi', slugUnico(slugify(nome), slugGeneri), {
    nome,
    foto: img ? foto('generi', img.miniatura) : undefined,
  }, htmlInMarkdown(r.descrizione));
}

// ---------- cronache (mostre ed eventi passati) ----------

const slugCronache = new Set();
for (const r of leggiRecord('Elenco_Cronache.xml')) {
  const data = pulisciTesto(r.data);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) continue;
  const titolo = pulisciTesto(r.titolo) || pulisciTesto(r.descrizione).split(/[.!:]/)[0].slice(0, 80) || `Cronaca del ${data}`;
  const corpo = [htmlInMarkdown(r.descrizione), htmlInMarkdown(r.resoconto)].filter(Boolean).join('\n\n');
  scriviVoce('cronache', slugUnico(`${data}-${slugify(titolo)}`, slugCronache), {
    titolo,
    data,
    sommario: pulisciTesto(r.descrizione).slice(0, 240) || undefined,
    foto: galleria('cronache', r),
  }, corpo);
}

// ---------- guide: coltivazione, parassiti, materiali ----------

const consigli = leggiRecord('Consigli.xml').map((r) => [pulisciTesto(r.nome_link).toLowerCase(), pulisciTesto(r.descrizione)]);
// prima frase del vecchio testo introduttivo, come sommario della guida
const sommarioDa = (chiave) => {
  const t = consigli.find(([k]) => k.includes(chiave))?.[1];
  return t ? (t.match(/^.{40,220}?[.!?](\s|$)/)?.[0] ?? t.slice(0, 200)).trim() : undefined;
};

function guidaASezioni(file, campoTesto = 'descrizione') {
  return leggiRecord(file).map((r) => {
    const titolo = maiuscolaIniziale(pulisciTesto(r.titolo));
    return [titolo ? `## ${titolo}` : '', htmlInMarkdown(r[campoTesto]), immaginiInline('guide', r, titolo)]
      .filter(Boolean).join('\n\n');
  }).join('\n\n');
}

scriviVoce('guide', 'coltivazione', {
  titolo: 'La coltivazione delle orchidee',
  categoria: 'guida',
  ordine: 1,
  sommario: sommarioDa('coltivazione') ?? 'Temperatura, luce, umidità, acqua e rinvasi: le basi per coltivare le orchidee.',
}, guidaASezioni('Coltivazione.xml').replace(/^## La coltivazione delle orchidee\n\n/i, ''));

scriviVoce('guide', 'parassiti', {
  titolo: 'Parassiti e avversità',
  categoria: 'guida',
  ordine: 2,
  sommario: sommarioDa('parassiti') ?? 'Come riconoscere e combattere i parassiti e le avversità delle orchidee.',
}, guidaASezioni('Parassiti.xml'));

scriviVoce('guide', 'materiali', {
  titolo: 'Materiali per la coltivazione',
  categoria: 'guida',
  ordine: 3,
  sommario: 'Cestelli, concimi, sfagno, corteccia e canestri: i materiali scelti dall’associazione e disponibili per i soci.',
}, guidaASezioni('Elenco_Materiali.xml', 'testo'));

// ---------- esperienze dei soci: un articolo per ogni titolo ----------

const articoli = [];
for (const r of leggiRecord('Esperienze_coltivazione.xml')) {
  const titolo = pulisciTesto(r.titolo);
  if (titolo || !articoli.length) articoli.push({ titolo: titolo || 'Esperienza di coltivazione', parti: [] });
  articoli[articoli.length - 1].parti.push(r);
}
const slugGuide = new Set(['coltivazione', 'parassiti', 'materiali']);
articoli.forEach((a, i) => {
  // "Serra fredda (di Manuele T.)" -> titolo "Serra fredda", autore "Manuele T."
  const m = a.titolo.match(/^(.*?)\s*\((?:di|a cura di|rag\.|estratti da)?\s*([^)]+)\)\s*$/i);
  const titolo = (m ? m[1] : a.titolo).replace(/^[“"]\s*|\s*[”"]$/g, '').trim();
  const autore = m?.[2]?.trim();
  const corpo = a.parti
    .map((r) => [htmlInMarkdown(r.descrizione), immaginiInline('guide', r, titolo)].filter(Boolean).join('\n\n'))
    .join('\n\n');
  scriviVoce('guide', slugUnico(slugify(titolo), slugGuide), {
    titolo,
    categoria: 'esperienza',
    autore,
    ordine: 10 + i,
    sommario: pulisciTesto(a.parti[0].descrizione).slice(0, 220).replace(/\s+\S*$/, '') + '…',
  }, corpo);
});

// ---------- notizie dall'associazione ----------

const notizie = [];
for (const r of leggiRecord('Elenco_Notizie.xml')) {
  const titolo = pulisciTesto(r.titolo);
  if (titolo || !notizie.length) notizie.push({ titolo, parti: [] });
  notizie[notizie.length - 1].parti.push(r);
}
const slugNotizie = new Set();
notizie.forEach((n, i) => {
  const titolo = maiuscolaIniziale(n.titolo).replace(/\bSTATUTO\b/, 'statuto');
  const corpo = n.parti.map((r, j) => {
    const testo = j > 0 && pulisciTesto(r.testo) ? `### ${pulisciTesto(r.testo)}` : htmlInMarkdown(r.testo);
    const allegati = Object.keys(r).filter((k) => k.startsWith('link_download')).map((k) => htmlInMarkdown(r[k])).filter(Boolean);
    return [testo, immaginiInline('notizie', r, titolo), allegati.map((a) => `- ${a}`).join('\n')].filter(Boolean).join('\n\n');
  }).join('\n\n');
  const primaFoto = fotoDelRecord(n.parti[0])[0];
  scriviVoce('notizie', slugUnico(slugify(titolo), slugNotizie), {
    titolo,
    ordine: i + 1,
    copertina: primaFoto ? foto('notizie', primaFoto.miniatura) : undefined,
  }, corpo);
});

// ---------- pagina "L'associazione" (dal vecchio HTML statico) ----------

const htmlPresentazione = readFileSync(join(ROOT, 'legacy', 'html', 'Pagina_present_Atao.html'), 'utf8');
const contenuti = htmlPresentazione.match(/<div id="contenuti">([\s\S]*?)<\/div>\s*<!--<div class="img1">/i)?.[1] ?? '';
scrivi(join(CONTENT, 'pagine', 'associazione.md'), frontmatter({
  titolo: "L'associazione",
  sommario: 'Dal 1988 un gruppo di appassionati del Triveneto che coltiva, studia e fa conoscere le orchidee.',
}) + '\n' + htmlInMarkdown(contenuti.replace(/<div class="titolo">[\s\S]*?<\/div>/i, '')) + '\n');

// ---------- dati del sito (JSON, modificabili dal CMS) ----------

mkdirSync(DATA, { recursive: true });

scrivi(join(DATA, 'sito.json'), JSON.stringify({
  nome: 'Associazione Triveneta Amatori Orchidee',
  sigla: 'ATAO',
  fondazione: 1988,
  email: 'segreteria.atao@gmail.com',
  annuncio: { attivo: false, testo: '', link: '' },
  incontri: [
    { luogo: 'Breda di Piave', provincia: 'TV', indirizzo: 'Via Villa Olivi 16 (municipio)', regola: 'ultima-domenica', orario: '10:00 – 12:00', nota: 'Sede principale' },
    { luogo: 'Zanè', provincia: 'VI', indirizzo: 'Centro Socio Culturale, aula 7, piazza Aldo Moro', regola: 'primo-sabato', orario: '15:00 – 17:30', nota: '' },
    { luogo: 'Limena', provincia: 'PD', indirizzo: 'Sede del Comune', regola: 'secondo-sabato', orario: '15:00 – 17:30', nota: '' },
  ],
}, null, 2) + '\n');

console.log(`Migrazione completata: ${stats.scritti} file scritti, ${stats.saltati} già presenti (usa --force per rigenerarli).`);
console.log(`Foto collegate: ${stats.foto}. Foto non ancora scaricate: ${stats.fotoMancanti}.`);
