// Scarica dal vecchio sito le foto (preferendo la versione grande delle pagine "ingrandimento")
// e i documenti allegati (PDF/ZIP). Rispetta il Crawl-delay del server e riprende da dove si era fermato.
//
//   node scripts/scarica-immagini.mjs
//
// Le foto finiscono in legacy/cache/ (con un manifest.json), i documenti in public/documenti/.
// Al termine: node scripts/migra-contenuti.mjs --force
import { mkdirSync, writeFileSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname, basename, posix } from 'node:path';
import { ROOT, CACHE, XML_DIR, SITO_VECCHIO, estraiImmagini, caricaManifest } from './legacy/comune.mjs';

const PAUSA_MS = 2500; // robots.txt: Crawl-delay: 2
const TIMEOUT_MS = 20000;
const DOCUMENTI = join(ROOT, 'public', 'documenti');
const UA = 'Mozilla/5.0 (compatible; migrazione-sito-associazione)';

const manifest = caricaManifest();
const salvaManifest = () => writeFileSync(join(CACHE, 'manifest.json'), JSON.stringify(manifest, null, 1));
const attendi = (ms) => new Promise((r) => setTimeout(r, ms));

let pausaErrore = 30_000;
async function scarica(percorso) {
  const url = SITO_VECCHIO + percorso.split('/').map(encodeURIComponent).join('/');
  for (;;) {
    await attendi(PAUSA_MS);
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(TIMEOUT_MS) });
      pausaErrore = 30_000;
      if (!res.ok) return { stato: res.status };
      return { stato: res.status, corpo: Buffer.from(await res.arrayBuffer()), tipo: res.headers.get('content-type') ?? '' };
    } catch (e) {
      // server irraggiungibile o che ci limita: aspettiamo sempre di più (max 15 minuti) e riproviamo
      console.log(`  rete non disponibile (${e.cause?.code ?? e.name}), riprovo tra ${Math.round(pausaErrore / 1000)} s`);
      await attendi(pausaErrore);
      pausaErrore = Math.min(pausaErrore * 2, 15 * 60_000);
    }
  }
}

function salvaInCache(percorso, corpo) {
  const dest = join(CACHE, percorso);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, corpo);
  return percorso;
}

// ---------- raccolta di tutte le immagini e degli allegati citati negli XML ----------

const immagini = new Map(); // miniatura -> pagina di ingrandimento (o null)
const allegati = new Set();
for (const f of readdirSync(XML_DIR).filter((f) => f.endsWith('.xml'))) {
  const xml = readFileSync(join(XML_DIR, f), 'utf8')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  for (const { miniatura, ingrandimento } of estraiImmagini(xml)) {
    if (!immagini.has(miniatura) || (!immagini.get(miniatura) && ingrandimento)) immagini.set(miniatura, ingrandimento);
  }
  for (const m of xml.matchAll(/href="?(File_scaricabili\/[^"\s>]+)"?/gi)) allegati.add(m[1]);
}

const totale = immagini.size + allegati.size;
console.log(`Da scaricare: ${immagini.size} foto e ${allegati.size} documenti (già fatti: ${Object.keys(manifest).length}).`);

let n = 0;
const conteggio = { grandi: 0, miniature: 0, mancanti: 0, documenti: 0 };
for (const [miniatura, ingrandimento] of immagini) {
  n++;
  if (manifest[miniatura]) continue;
  let voce = null;

  if (ingrandimento) {
    const pagina = await scarica(ingrandimento);
    const src = pagina.corpo?.toString('latin1').match(/<img[^>]*src="([^"]+)"/i)?.[1];
    if (src) {
      const percorsoGrande = posix.normalize(posix.join(posix.dirname(ingrandimento), src)).replace(/^\/+/, '');
      const grande = await scarica(percorsoGrande);
      if (grande.corpo && /^image\//.test(grande.tipo)) {
        voce = { file: salvaInCache(percorsoGrande, grande.corpo), tipo: 'grande', byte: grande.corpo.length };
        conteggio.grandi++;
      }
    }
  }
  if (!voce) {
    const mini = await scarica(miniatura);
    if (mini.corpo && /^image\//.test(mini.tipo)) {
      voce = { file: salvaInCache(miniatura, mini.corpo), tipo: 'miniatura', byte: mini.corpo.length };
      conteggio.miniature++;
    } else {
      voce = { file: null, tipo: 'mancante', stato: mini.stato };
      conteggio.mancanti++;
    }
  }
  manifest[miniatura] = voce;
  salvaManifest();
  if (n % 10 === 0) console.log(`[${n}/${totale}] grandi ${conteggio.grandi}, solo miniatura ${conteggio.miniature}, mancanti ${conteggio.mancanti}`);
}

mkdirSync(DOCUMENTI, { recursive: true });
for (const a of allegati) {
  n++;
  const dest = join(DOCUMENTI, basename(a));
  if (existsSync(dest)) continue;
  const r = await scarica(a);
  if (r.corpo) { writeFileSync(dest, r.corpo); conteggio.documenti++; }
  else console.log(`  documento non disponibile (${r.stato}): ${a}`);
}

console.log(`Fatto. Foto grandi: ${conteggio.grandi}, solo miniatura: ${conteggio.miniature}, mancanti: ${conteggio.mancanti}, documenti: ${conteggio.documenti}.`);
console.log('Ora esegui: node scripts/migra-contenuti.mjs --force');
