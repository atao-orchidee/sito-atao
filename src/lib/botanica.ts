// Scompone un nome botanico secondo le convenzioni di nomenclatura:
// genere ed epiteti in corsivo; nomi di ibridi (grex), cultivar tra virgolette,
// segni d'ibridazione e rango (var., subsp.) in tondo.
export type Parte = { testo: string; corsivo: boolean };

const RANGHI = new Set(['var.', 'subsp.', 'ssp.', 'fma.', 'f.', 'sp.', 'spp.', 'aff.', 'cf.', 'x', '×', 'sib', 'hybr.']);

export function partiNome(nome: string): Parte[] {
  const parti: Parte[] = [];
  let dentroParentesi = 0;
  let dentroVirgolette = false;
  let indiceParola = 0;
  for (const t of nome.split(/(\s+)/)) {
    if (t === '' || /^\s+$/.test(t)) { parti.push({ testo: t, corsivo: false }); continue; }
    const pulito = t.replace(/^[('"‘“]+|[)'"’”,;]+$/g, '');
    const apre = (t.match(/\(/g) ?? []).length;
    const chiude = (t.match(/\)/g) ?? []).length;
    if (/^['‘"“]/.test(t)) dentroVirgolette = true;
    let corsivo = false;
    if (!dentroParentesi && !dentroVirgolette && !apre) {
      if (indiceParola === 0) corsivo = /^[A-Z][a-z]+\.?$/.test(pulito);
      else corsivo = /^[a-zà-ÿ-]+$/.test(pulito) && !RANGHI.has(pulito.toLowerCase());
    }
    parti.push({ testo: t, corsivo });
    dentroParentesi += apre - chiude;
    if (/['’"”]$/.test(t)) dentroVirgolette = false;
    indiceParola++;
  }
  // unisce le parti adiacenti con lo stesso stile (gli spazi seguono la parte precedente)
  const unite: Parte[] = [];
  for (const p of parti) {
    const ultima = unite[unite.length - 1];
    if (ultima && (ultima.corsivo === p.corsivo || /^\s*$/.test(p.testo))) ultima.testo += p.testo;
    else unite.push({ ...p });
  }
  return unite;
}
