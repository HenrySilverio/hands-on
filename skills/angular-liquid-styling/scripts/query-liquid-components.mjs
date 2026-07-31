#!/usr/bin/env node
/**
 * Consulta pontual ao catalogo de componentes gerado por extract-liquid-components.mjs.
 *
 * Uso: node query-liquid-components.mjs <termo> [--dir=<diretorio>] [--lista]
 *
 * Ex.:
 *   node query-liquid-components.mjs button --dir=.github/liquid-catalog
 *   node query-liquid-components.mjs --lista --dir=.github/liquid-catalog
 *
 * Imprime so o resultado filtrado. O Copilot deve ler esta saida, nunca abrir o
 * liquid-components-index.json inteiro.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);
const termo = argv.find((a) => !a.startsWith('--'));
const soLista = argv.includes('--lista');
const dirArg = argv.find((a) => a.startsWith('--dir='));
const DIR = dirArg ? dirArg.replace('--dir=', '') : '.';

if (!termo && !soLista) {
  console.error('Uso: node query-liquid-components.mjs <termo> [--dir=<diretorio>] [--lista]');
  process.exit(1);
}

function normalizar(t) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function main() {
  const raw = await readFile(path.join(DIR, 'liquid-components-index.json'), 'utf-8');
  const idx = JSON.parse(raw);

  if (soLista) {
    for (const c of idx.componentes) console.log(c.componente);
    console.error(`\n${idx.componentes.length} componentes.`);
    return;
  }

  const alvo = normalizar(termo);
  const achados = idx.componentes.filter((c) => normalizar(c.componente).includes(alvo));

  if (!achados.length) {
    console.log(`(nenhum componente contendo "${termo}" — rode --lista para ver todos)`);
    return;
  }

  for (const c of achados) {
    console.log(`# ${c.componente}   [${c.grupo}]`);
    for (const [variante, stories] of Object.entries(c.variantes)) {
      console.log(`  variante: ${variante}`);
      for (const s of stories) {
        console.log(`    - ${s.story}`);
        console.log(`      ${s.link}`);
      }
    }
    if (c.classesProvaveis?.length) {
      console.log(`  classes CSS provaveis (heuristica por nome, confira antes de usar):`);
      for (const cls of c.classesProvaveis) console.log(`    .${cls}`);
    }
    console.log('');
  }

  console.error(`${achados.length} componente(s) encontrado(s).`);
  console.error('A prosa da documentacao e os exemplos de codigo nao estao no catalogo — abra o link da story.');
}

main().catch((err) => {
  console.error('Erro:', err.message);
  console.error('Rode extract-liquid-components.mjs primeiro para gerar liquid-components-index.json.');
  process.exit(1);
});