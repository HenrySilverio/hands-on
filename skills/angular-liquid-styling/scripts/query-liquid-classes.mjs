#!/usr/bin/env node
/**
 * Consulta pontual ao índice de classes Liquid — gerado por extract-liquid-classes.mjs.
 *
 * Uso: node scripts/query-liquid-classes.mjs <termo> [--group] [--dir=<dir>] [--out=<caminho>]
 *
 * Ex.:
 *   node scripts/query-liquid-classes.mjs btn --dir=.github/liquid-catalog
 *   node scripts/query-liquid-classes.mjs card --group --dir=.github/liquid-catalog
 *   node scripts/query-liquid-classes.mjs snackbar --dir=.github/liquid-catalog \
 *     --out=docs/briefings/new-component-shared
 *
 * Sem --out, imprime no stdout: é o modo de consulta rápida no chat.
 *
 * Com --out, grava um recorte em markdown do catálogo, pronto para ser referenciado
 * por #readFile ao lado de um briefing. O recorte existe para que o /sdd-plan receba
 * apenas as classes relevantes àquela mudança, em vez do índice completo — apontar o
 * plano para o liquid-classes-index.json carregaria milhares de classes no contexto
 * para usar poucas.
 *
 * O caminho de --out pode ser um arquivo .md ou um diretório. Sendo diretório, o arquivo
 * é criado dentro dele como <termo>-classes.md. Diretórios são criados se não existirem.
 */

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);
const term = argv.find((a) => !a.startsWith('--'));
const groupOnly = argv.includes('--group');
const dirArg = argv.find((a) => a.startsWith('--dir='));
const outArg = argv.find((a) => a.startsWith('--out='));
const DIR = dirArg ? dirArg.replace('--dir=', '') : '.';
const OUT = outArg ? outArg.replace('--out=', '') : null;

if (!term) {
  console.error('Uso: node scripts/query-liquid-classes.mjs <termo> [--group] [--dir=<dir>] [--out=<caminho>]');
  process.exit(1);
}

async function resolverCaminhoSaida(destino, termo) {
  const pareceArquivo = path.extname(destino).toLowerCase() === '.md';
  if (pareceArquivo) {
    await mkdir(path.dirname(destino), { recursive: true });
    return destino;
  }
  // Sem extensão .md: trata como diretório, mesmo que ainda não exista.
  try {
    const info = await stat(destino);
    if (!info.isDirectory()) {
      throw new Error(`--out aponta para um arquivo sem extensão .md: ${destino}`);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  await mkdir(destino, { recursive: true });
  return path.join(destino, `${termo}-classes.md`);
}

function montarMarkdown({ termo, versao, extraidoEm, grupos }) {
  const total = grupos.reduce((n, g) => n + g.classes.length, 0);
  const linhas = [
    `# Classes Liquid para "${termo}"`,
    '',
    `Recorte do catálogo de classes do Liquid Design System, gerado por consulta ao índice.`,
    `Não é a lista completa do design system — contém apenas as classes cujo nome inclui o`,
    `termo consultado.`,
    '',
    `| Campo | Valor |`,
    `|---|---|`,
    `| Termo consultado | ${termo} |`,
    `| Versão do Liquid | ${versao || 'não informada no índice'} |`,
    `| Catálogo extraído em | ${extraidoEm || 'não informado no índice'} |`,
    `| Recorte gerado em | ${new Date().toISOString()} |`,
    `| Classes no recorte | ${total} |`,
    '',
  ];

  if (!grupos.length) {
    linhas.push(`Nenhuma classe encontrada para o termo "${termo}".`, '');
  } else {
    for (const g of grupos) {
      linhas.push(`## ${g.grupo}`, '');
      for (const c of g.classes) linhas.push(`- \`.${c}\``);
      linhas.push('');
    }
  }

  linhas.push(
    '---',
    '',
    'Regenerar este recorte:',
    '',
    `    node .github/skills/angular-liquid-styling/scripts/query-liquid-classes.mjs ${termo} --dir=.github/liquid-catalog --out=<este-diretório>`,
    ''
  );

  return linhas.join('\n');
}

async function main() {
  const raw = await readFile(path.join(DIR, 'liquid-classes-index.json'), 'utf-8');
  const index = JSON.parse(raw);
  const needle = term.toLowerCase();

  if (groupOnly) {
    const matchedGroups = Object.keys(index.groups).filter((g) => g.toLowerCase().includes(needle));
    console.log(matchedGroups.length ? matchedGroups.join('\n') : `(nenhum grupo contém "${term}")`);
    return;
  }

  const grupos = [];
  for (const grupo of Object.keys(index.groups)) {
    const classes = index.groups[grupo].filter((c) => c.toLowerCase().includes(needle));
    if (classes.length) grupos.push({ grupo, classes });
  }
  const total = grupos.reduce((n, g) => n + g.classes.length, 0);

  if (OUT) {
    const destino = await resolverCaminhoSaida(OUT, term);
    const md = montarMarkdown({
      termo: term,
      versao: index._meta?.version,
      extraidoEm: index._meta?.extractedAt,
      grupos,
    });
    await writeFile(destino, md, 'utf-8');
    console.error(`Recorte gravado em ${destino} — ${total} classe(s).`);
    if (total === 0) {
      console.error('Atenção: o recorte está vazio. Confira o termo antes de referenciá-lo num briefing.');
    }
    return;
  }

  for (const g of grupos) {
    console.log(`# ${g.grupo}`);
    for (const c of g.classes) console.log(`  .${c}`);
  }

  if (total === 0) {
    console.log(`(nenhuma classe encontrada contendo "${term}" — tente um termo mais curto ou rode --group)`);
  } else {
    console.error(`\n${total} classe(s) encontrada(s).`);
  }
}

main().catch((err) => {
  console.error('Erro:', err.message);
  console.error('Rode extract-liquid-classes.mjs primeiro para gerar liquid-classes-index.json.');
  process.exit(1);
});