const dataCompleta = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
const meseAnno = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' });

export const formattaData = (d: Date) => dataCompleta.format(d);
export const formattaMese = (d: Date) => meseAnno.format(d);
const giornoSett = new Intl.DateTimeFormat('it-IT', { weekday: 'long', timeZone: 'UTC' });
const meseUTC = new Intl.DateTimeFormat('it-IT', { month: 'long', timeZone: 'UTC' });
const completaUTC = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Date di un evento in parole: "sabato 21 e domenica 22 novembre 2026" (o il giorno singolo). */
export function dateInParole(inizio: Date, fine?: Date): string {
  if (!fine || fine.getTime() === inizio.getTime()) return completaUTC.format(inizio);
  const stessoMese = inizio.getUTCMonth() === fine.getUTCMonth() && inizio.getUTCFullYear() === fine.getUTCFullYear();
  if (!stessoMese) return `dal ${completaUTC.format(inizio)} al ${completaUTC.format(fine)}`;
  const giorni = (fine.getTime() - inizio.getTime()) / 86400000;
  const unione = giorni === 1 ? ' e ' : ' a ';
  return `${giornoSett.format(inizio)} ${inizio.getUTCDate()}${unione}${giornoSett.format(fine)} ${fine.getUTCDate()} ${meseUTC.format(fine)} ${fine.getUTCFullYear()}`;
}

export const isoData = (d: Date) => d.toISOString().slice(0, 10);

/** Fine della giornata indicata (le date del CMS sono a mezzanotte): un evento resta "in programma" fino a sera. */
export const fineGiorno = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59));

/** Script per il browser: nasconde gli elementi [data-fine] già passati, così un evento sparisce
    anche se il sito non viene ripubblicato. */
export const nascondiPassati = `for (const el of document.querySelectorAll('[data-fine]')) if (Date.now() > Date.parse(el.dataset.fine)) el.hidden = true;`;

/** Primo paragrafo di un testo Markdown, senza sintassi, accorciato. */
export function estratto(md: string | undefined, max = 180): string {
  const testo = (md ?? '')
    .split(/\n{2,}/)
    .find((p) => p.trim() && !p.startsWith('!') && !p.startsWith('#')) ?? '';
  const pulito = testo.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_\\]/g, '').trim();
  return pulito.length > max ? pulito.slice(0, max).replace(/\s+\S*$/, '') + '…' : pulito;
}
