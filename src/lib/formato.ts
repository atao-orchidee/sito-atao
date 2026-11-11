const dataCompleta = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
const meseAnno = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' });

export const formattaData = (d: Date) => dataCompleta.format(d);
export const formattaMese = (d: Date) => meseAnno.format(d);
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
