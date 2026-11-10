const dataCompleta = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
const meseAnno = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' });

export const formattaData = (d: Date) => dataCompleta.format(d);
export const formattaMese = (d: Date) => meseAnno.format(d);
export const isoData = (d: Date) => d.toISOString().slice(0, 10);

/** Primo paragrafo di un testo Markdown, senza sintassi, accorciato. */
export function estratto(md: string | undefined, max = 180): string {
  const testo = (md ?? '')
    .split(/\n{2,}/)
    .find((p) => p.trim() && !p.startsWith('!') && !p.startsWith('#')) ?? '';
  const pulito = testo.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_\\]/g, '').trim();
  return pulito.length > max ? pulito.slice(0, max).replace(/\s+\S*$/, '') + '…' : pulito;
}
