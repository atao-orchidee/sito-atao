// Funzioni condivise dagli script che importano il vecchio sito (Adobe Spry + XML).
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const LEGACY = join(ROOT, 'legacy');
export const XML_DIR = join(LEGACY, 'xml');
export const CACHE = join(LEGACY, 'cache');
export const SITO_VECCHIO = 'https://www.orchidee-atao.it/';

const parser = new XMLParser({
  ignoreAttributes: true,
  processEntities: true,
  htmlEntities: true,
  parseTagValue: false,
  trimValues: true,
});

/** Legge un file XML del vecchio sito e restituisce l'elenco dei record (figli della radice). */
export function leggiRecord(nomeFile) {
  const xml = readFileSync(join(XML_DIR, nomeFile), 'utf8');
  const doc = parser.parse(xml);
  const radice = Object.keys(doc).find((k) => k !== '?xml');
  const contenuto = doc[radice] ?? {};
  const tipo = Object.keys(contenuto).find((k) => !k.startsWith('@'));
  if (!tipo) return [];
  const record = contenuto[tipo];
  return (Array.isArray(record) ? record : [record]).filter((r) => r && typeof r === 'object');
}

/** Estrae le immagini da un campo tipo <a href="Pagine_ingrandimenti/x.html"><img src="Immagini/..."/></a>. */
export function estraiImmagini(html) {
  if (!html) return [];
  const out = [];
  const re = /<a[^>]*href="?([^"\s>]+)"?[^>]*>\s*<img[^>]*src="([^"]+)"[^>]*>\s*<\/a>|<img[^>]*src="([^"]+)"[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const miniatura = m[2] ?? m[3];
    const ingrandimento = m[1] && /Pagine_ingrandimenti\//i.test(m[1]) ? m[1] : null;
    out.push({ miniatura, ingrandimento });
  }
  return out;
}

/** Tutti i campi fotoN di un record, in ordine, con l'eventuale didascaliaN. */
export function fotoDelRecord(rec) {
  const chiavi = Object.keys(rec)
    .filter((k) => /^foto\d*$/.test(k))
    .sort((a, b) => (parseInt(a.slice(4)) || 0) - (parseInt(b.slice(4)) || 0));
  const out = [];
  for (const k of chiavi) {
    const n = k.slice(4);
    const didascalia = pulisciTesto(rec[`didascalia${n}`] ?? '');
    for (const img of estraiImmagini(rec[k])) out.push({ ...img, didascalia });
  }
  return out;
}

// Pagine del vecchio sito -> nuove rotte.
const MAPPA_PAGINE = {
  'pagina_coltivazione.html': '/guide/coltivazione/',
  'pagina_parassiti.html': '/guide/parassiti/',
  'pagina_esperienze_coltivazione.html': '/guide/esperienze-dei-soci/',
  'pagina_materiali.html': '/guide/materiali/',
  'pagina_generi_e_specie.html': '/generi/',
  'pagina_cronache.html': '/cronache/',
  'pagina_notizie.html': '/notizie/',
  'pagina_contatti.html': '/contatti/',
  'pagina_present_atao.html': '/associazione/',
  'pagina_appuntamenti.html': '/incontri/',
  'pagina_links.html': '/associazione/#altre-associazioni',
};

function mappaLink(href) {
  const h = href.trim();
  if (/^(https?:|mailto:)/i.test(h)) return h;
  const nome = basename(h).toLowerCase();
  if (MAPPA_PAGINE[nome]) return MAPPA_PAGINE[nome];
  if (/^pagina_foto_orchidee/i.test(nome)) return '/orchidee/';
  if (/^file_scaricabili\//i.test(h)) return '/documenti/' + basename(h);
  return SITO_VECCHIO + h.replace(/^\//, '');
}

/** Rimuove tag e spazi superflui: per titoli, didascalie e campi su una riga. */
export function pulisciTesto(s) {
  return String(s ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Converte il pseudo-HTML dei campi XML in Markdown leggibile. */
export function htmlInMarkdown(html) {
  if (!html) return '';
  let s = String(html).replace(/ /g, ' ').replace(/\r/g, '');
  // le immagini dentro al testo vengono gestite a parte
  s = s.replace(/<a[^>]*>\s*<img[^>]*>\s*<\/a>/gi, '').replace(/<img[^>]*>/gi, '');
  s = s.replace(/<a[^>]*href="?([^"\s>]+)"?[^>]*>([\s\S]*?)<\/a>/gi, (_, href, testo) => {
    const t = pulisciTesto(testo) || href;
    return `[${t}](${mappaLink(href)})`;
  });
  s = s.replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, (_, __, t) => (t.trim() ? `**${t.trim()}**` : ''));
  s = s.replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, (_, __, t) => (t.trim() ? `*${t.trim()}*` : ''));
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/?(p|div)[^>]*>/gi, '\n\n');
  s = s.replace(/<[^>]+>/g, '');
  // entità rimaste doppiamente codificate nel vecchio XML (es. "creer&agrave;")
  const ACCENTI = { agrave: 'à', egrave: 'è', eacute: 'é', igrave: 'ì', ograve: 'ò', ugrave: 'ù', Agrave: 'À', Egrave: 'È', amp: '&', quot: '"', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', hellip: '…', laquo: '«', raquo: '»' };
  s = s.replace(/&([a-zA-Z]+);/g, (m, nome) => ACCENTI[nome] ?? m);
  // caratteri che in Markdown/Markdoc hanno un significato speciale
  s = s.replace(/\{%/g, '{ %').replace(/</g, '&lt;');
  const righe = s.split('\n').map((r) => r.replace(/[ \t]+/g, ' ').trim());
  // ogni riga del vecchio testo diventa un paragrafo
  const out = [];
  for (const r of righe) {
    if (r === '') {
      if (out.length && out[out.length - 1] !== '') out.push('');
    } else {
      if (out.length && out[out.length - 1] !== '') out.push('');
      out.push(r.replace(/^(#{1,6}|[-*+]|\d+\.)\s/, (m) => '\\' + m));
    }
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function slugify(s) {
  return String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/, '');
}

/** Restituisce uno slug unico rispetto a quelli già usati. */
export function slugUnico(base, usati) {
  let s = base || 'senza-titolo';
  let i = 2;
  while (usati.has(s)) s = `${base}-${i++}`;
  usati.add(s);
  return s;
}

let _manifest;
export function caricaManifest() {
  if (_manifest) return _manifest;
  const p = join(CACHE, 'manifest.json');
  _manifest = existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {};
  return _manifest;
}

/** Percorso locale (nella cache) dell'immagine migliore disponibile per una miniatura, o null. */
export function immagineInCache(miniatura) {
  const voce = caricaManifest()[miniatura];
  if (voce?.file && existsSync(join(CACHE, voce.file))) return join(CACHE, voce.file);
  return null;
}

export const estensione = (p) => extname(p).toLowerCase().replace('.jpeg', '.jpg');
