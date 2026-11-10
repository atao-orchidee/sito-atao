// Calcola le prossime date degli incontri mensili a partire dalle regole
// salvate in src/data/sito.json (es. "ultima-domenica", "primo-sabato").
// Usato sia in fase di build sia nel browser, così la data mostrata è sempre attuale.

export type Incontro = {
  luogo: string;
  provincia?: string;
  indirizzo?: string;
  regola: string;
  orario?: string;
  nota?: string;
};

const GIORNI = ['domenica', 'lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato'];
const ORDINALI: Record<string, number> = { primo: 1, prima: 1, secondo: 2, seconda: 2, terzo: 3, terza: 3, quarto: 4, quarta: 4, ultimo: -1, ultima: -1 };

/** Data dell'incontro in un dato mese, o null se la regola non è riconosciuta. */
export function dataNelMese(regola: string, anno: number, mese: number): Date | null {
  const [ord, giorno] = regola.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split('-');
  const n = ORDINALI[ord];
  const g = GIORNI.indexOf(giorno);
  if (n === undefined || g < 0) return null;
  if (n > 0) {
    const primo = new Date(anno, mese, 1);
    const scarto = (g - primo.getDay() + 7) % 7;
    return new Date(anno, mese, 1 + scarto + (n - 1) * 7);
  }
  const ultimo = new Date(anno, mese + 1, 0);
  const scarto = (ultimo.getDay() - g + 7) % 7;
  return new Date(anno, mese, ultimo.getDate() - scarto);
}

/** Prossima data (oggi incluso) per una regola. */
export function prossimaData(regola: string, oggi = new Date()): Date | null {
  const inizio = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
  for (let i = 0; i < 3; i++) {
    const d = dataNelMese(regola, inizio.getFullYear(), inizio.getMonth() + i);
    if (d && d >= inizio) return d;
  }
  return null;
}

export function prossimiIncontri(incontri: Incontro[], oggi = new Date()) {
  return incontri
    .map((i) => ({ ...i, data: prossimaData(i.regola, oggi) }))
    .filter((i): i is Incontro & { data: Date } => i.data !== null)
    .sort((a, b) => a.data.getTime() - b.data.getTime());
}

/** "ultima-domenica" -> "l'ultima domenica del mese" */
export function regolaInParole(regola: string): string {
  const [ord, giorno] = regola.split('-');
  const articolo = ord.startsWith('ultim') ? "l'" : 'il ';
  const g = giorno.replace('lunedi', 'lunedì').replace('martedi', 'martedì').replace('mercoledi', 'mercoledì').replace('giovedi', 'giovedì').replace('venerdi', 'venerdì');
  return `${articolo}${ord} ${g} del mese`;
}

const fmt = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
export const dataLunga = (d: Date) => fmt.format(d);
