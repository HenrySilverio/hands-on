// Parser de frontmatter mínimo, sem dependências.
// Suporta: escalar, lista inline [a, b] e lista em bloco (- item). Suficiente para esta base.
import { readFileSync } from 'node:fs';

export function lerFrontmatter(caminho) {
  const bruto = readFileSync(caminho, 'utf8');
  if (!bruto.startsWith('---')) return { dados: null, corpo: bruto };
  const fim = bruto.indexOf('\n---', 3);
  if (fim === -1) return { dados: null, corpo: bruto };

  const bloco = bruto.slice(4, fim).split('\n');
  const dados = {};
  let chaveLista = null;

  for (const linha of bloco) {
    if (!linha.trim() || linha.trimStart().startsWith('#')) continue;

    const item = linha.match(/^\s+-\s+(.*)$/);
    if (item && chaveLista) { dados[chaveLista].push(limpar(item[1])); continue; }

    const par = linha.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!par) continue;
    const [, chave, valorBruto] = par;
    const valor = valorBruto.replace(/\s+#.*$/, '').trim();

    if (valor === '') { dados[chave] = []; chaveLista = chave; continue; }
    chaveLista = null;
    if (valor.startsWith('[')) {
      dados[chave] = valor.slice(1, -1).split(',').map(limpar).filter(Boolean);
    } else {
      dados[chave] = limpar(valor);
    }
  }
  return { dados, corpo: bruto.slice(fim + 4) };
}

const limpar = (s) => s.trim().replace(/^["']|["']$/g, '');
