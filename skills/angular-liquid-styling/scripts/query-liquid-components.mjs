#!/usr/bin/env node
/**
 * Consulta pontual ao catalogo de componentes gerado por extract-liquid-components.mjs.
 *
 * Uso: node query-liquid-components.mjs <termo> [--dir=<dir>] [--lista] [--out=<caminho>]
 *
 * Ex.:
 *   node query-liquid-components.mjs button --dir=.github/liquid-catalog
 *   node query-liquid-components.mjs snackbar --dir=.github/liquid-catalog \
 *     --out=docs/briefings/new-component-shared
 *
 * Sem --out, imprime no stdout: modo de consulta rapida no chat.
 *
 * Com --out, grava um recorte em markdown pronto para ser referenciado por #readFile
 * ao lado de um briefing, pelo mesmo motivo do recorte de classes: o /sdd-plan deve
 * receber so o que e relevante aquela mudanca, nao o catalogo inteiro.
 *
 * O caminho de --out pode ser um arquivo .md ou um diretorio. Sendo diretorio, o arquivo
 * e criado dentro dele como <termo>-componente.md. Diretorios sao criados se nao existirem.
 */

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);
const termo = argv.find((a) => !a.startsWith('--'));
const soLista = argv.includes('--lista');
const dirArg = argv.find((a) => a.startsWith('--dir='));
const outArg = argv.find((a) => a.startsWith('--out='));
const DIR = dirArg ? dirArg.replace('--dir=', '') : '.';
const OUT = outArg ? outArg.replace('--out=', '') : null;

if (!termo && !soLista) {
  console.error('Uso: node query-liquid-components.mjs <termo> [--dir=<dir>] [--lista] [--out=<caminho>]');
  process.exit(1);
}

function normalizar(t) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function resolverCaminhoSaida(destino, termo) {
  if (path.extname(destino).toLowerCase() === '.md') {
    await mkdir(path.dirname(destino), { recursive: true });
    return destino;
  }
  try {
    const info = await stat(destino);
    if (!info.isDirectory()) throw new Error(`--out aponta para arquivo sem extensao .md: ${destino}`);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  await mkdir(destino, { recursive: true });
  return path.join(destino, `${termo}-componente.md`);
}

function montarMarkdown(termo, achados, meta) {
  const l = [
    `# Componentes Liquid para "${termo}"`,
    '',
    'Recorte do catalogo de componentes do Storybook do Liquid. Contem o mapa de stories e,',
    'quando o catalogo foi gerado com cruzamento, as classes CSS provaveis.',
    '',
    'Este recorte nao contem a prosa da documentacao nem exemplos de codigo: no Storybook do',
    'Liquid esse conteudo vem de MDX compilado para dentro dos bundles JS. Quando o exemplo',
    'exato importar, abra o link da story. Nao infira uso a partir do nome do componente.',
    '',
    '| Campo | Valor |',
    '|---|---|',
    `| Termo consultado | ${termo} |`,
    `| Fonte | ${meta?.fonte || 'nao informada'} |`,
    `| Catalogo extraido em | ${meta?.extraidoEm || 'nao informado'} |`,
    `| Recorte gerado em | ${new Date().toISOString()} |`,
    `| Componentes no recorte | ${achados.length} |`,
    '',
  ];

  if (!achados.length) {
    l.push(`Nenhum componente encontrado para o termo "${termo}".`, '');
    return l.join('\n');
  }

  for (const c of achados) {
    l.push(`## ${c.componente}`, '', `Grupo: ${c.grupo}`, '');
    for (const [variante, stories] of Object.entries(c.variantes)) {
      l.push(`### Variante: ${variante}`, '');
      for (const s of stories) l.push(`- ${s.story} — ${s.link}`);
      l.push('');
    }
    if (c.classesProvaveis?.length) {
      l.push('### Classes CSS provaveis', '', 'Cruzamento heuristico por nome. Confirme antes de usar.', '');
      for (const cls of c.classesProvaveis) l.push(`- \`.${cls}\``);
      l.push('');
    }
  }

  l.push('---', '', 'Regenerar este recorte:', '',
    `    node .github/skills/angular-liquid-styling/scripts/query-liquid-components.mjs ${termo} --dir=.github/liquid-catalog --out=<este-diretorio>`, '');
  return l.join('\n');
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

  if (OUT) {
    const destino = await resolverCaminhoSaida(OUT, termo);
    await writeFile(destino, montarMarkdown(termo, achados, idx._meta), 'utf-8');
    console.error(`Recorte gravado em ${destino} — ${achados.length} componente(s).`);
    if (!achados.length) {
      console.error('Atencao: o recorte esta vazio. Confira o termo antes de referencia-lo num briefing.');
    }
    return;
  }

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