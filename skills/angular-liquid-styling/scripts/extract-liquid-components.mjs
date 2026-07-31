#!/usr/bin/env node
/**
 * Extrai o catalogo de componentes do Storybook do Liquid a partir do index.json.
 *
 * Uso:
 *   node extract-liquid-components.mjs <storybook-base-url> --out=<dir> [--classes=<dir>]
 *
 * Ex.:
 *   node extract-liquid-components.mjs https://static.bradesco.com.br/dsysliquid/dist/storybook-3.1.0 \
 *     --out=.github/liquid-catalog --classes=.github/liquid-catalog
 *
 * O que este script consegue e o que nao consegue:
 *
 * CONSEGUE: o mapa completo de componentes, quais variantes de documentacao cada um
 * publica (HTML, Web Component), os nomes das stories de cada variante, e o link direto
 * para abrir cada story no navegador.
 *
 * NAO CONSEGUE: a prosa da documentacao e os exemplos de codigo. No Storybook, esse
 * conteudo vem de MDX compilado para dentro dos bundles JS. Extrair de la exige executar
 * o bundle ou fazer parsing de codigo minificado, e quebra a cada release do design system.
 * Se voce precisa do exemplo de codigo exato, abra o link da story — o catalogo te leva
 * direto nela em vez de voce procurar no menu.
 *
 * Com --classes, o script cruza cada componente com as classes CSS extraidas por
 * extract-liquid-classes.mjs. Esse cruzamento e heuristico: casa pelo nome do componente
 * dentro do nome da classe. Ele acerta na maioria e erra em componente cujo nome da classe
 * nao lembra o nome no Storybook. Trate como pista, nao como verdade.
 */

import { fetchText } from './lib/http.mjs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const base = args.find((a) => !a.startsWith('--'));
const outArg = args.find((a) => a.startsWith('--out='));
const classesArg = args.find((a) => a.startsWith('--classes='));

if (!base) {
  console.error('Uso: node extract-liquid-components.mjs <storybook-base-url> --out=<dir> [--classes=<dir>]');
  process.exit(1);
}

const OUT_DIR = outArg ? outArg.replace('--out=', '') : '.';
const CLASSES_DIR = classesArg ? classesArg.replace('--classes=', '') : null;
const BASE = base.replace(/\/+$/, '');

/**
 * Titulos vem no formato Grupo/Subgrupo/Componente/Variante, por exemplo
 * DesignSystem/Components/Accordion/HTML. O componente e o penultimo segmento e a
 * variante de documentacao e o ultimo. Titulo com menos de dois segmentos nao e
 * componente (paginas soltas como Suporte ou Atualizacoes) e fica de fora.
 */
function parseTitulo(titulo) {
  const partes = titulo.split('/').map((p) => p.trim()).filter(Boolean);
  if (partes.length < 2) return null;
  const variante = partes[partes.length - 1];
  const componente = partes[partes.length - 2];
  const grupo = partes.slice(0, -2).join('/') || '(raiz)';
  return { grupo, componente, variante };
}

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

async function carregarClasses(dir) {
  try {
    const raw = await readFile(path.join(dir, 'liquid-classes-index.json'), 'utf-8');
    const index = JSON.parse(raw);
    return Object.values(index.groups).flat();
  } catch {
    console.error('Aviso: liquid-classes-index.json nao encontrado — seguindo sem o cruzamento de classes.');
    return null;
  }
}

async function main() {
  console.error(`Buscando ${BASE}/index.json ...`);
  const raw = await fetchText(`${BASE}/index.json`, 'application/json');
  const idx = JSON.parse(raw);
  const entries = idx.entries || idx.stories || {};

  const componentes = {};
  let ignorados = 0;

  for (const [id, entry] of Object.entries(entries)) {
    const parsed = parseTitulo(entry.title || '');
    if (!parsed) {
      ignorados++;
      continue;
    }
    const chave = `${parsed.grupo}/${parsed.componente}`;
    if (!componentes[chave]) {
      componentes[chave] = {
        grupo: parsed.grupo,
        componente: parsed.componente,
        variantes: {},
      };
    }
    const v = componentes[chave].variantes;
    if (!v[parsed.variante]) v[parsed.variante] = [];
    v[parsed.variante].push({
      story: entry.name || '(sem nome)',
      id,
      tipo: entry.type || 'story',
      link: `${BASE}/?path=/story/${id}`,
    });
  }

  const todasClasses = CLASSES_DIR ? await carregarClasses(CLASSES_DIR) : null;
  if (todasClasses) {
    for (const c of Object.values(componentes)) {
      const alvo = normalizar(c.componente);
      c.classesProvaveis = todasClasses.filter((cls) => normalizar(cls).includes(alvo)).sort();
    }
  }

  const lista = Object.values(componentes).sort((a, b) => a.componente.localeCompare(b.componente));

  const saida = {
    _meta: {
      fonte: `${BASE}/index.json`,
      extraidoEm: new Date().toISOString(),
      totalEntradas: Object.keys(entries).length,
      totalComponentes: lista.length,
      entradasIgnoradas: ignorados,
      cruzamentoClasses: Boolean(todasClasses),
      limitacao:
        'Contem o mapa de componentes e stories, nao a prosa da documentacao nem exemplos de codigo. Use o campo link para abrir a story no navegador.',
    },
    componentes: lista,
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, 'liquid-components-index.json'), JSON.stringify(saida, null, 2));

  const linhas = [
    `# Componentes do Liquid no Storybook`,
    '',
    `Fonte: ${BASE}/index.json`,
    `Componentes: ${lista.length} — entradas de story: ${Object.keys(entries).length}`,
    '',
    '| Componente | Grupo | Variantes documentadas | Stories |',
    '|---|---|---|---|',
    ...lista.map((c) => {
      const vs = Object.keys(c.variantes);
      const total = vs.reduce((n, v) => n + c.variantes[v].length, 0);
      return `| ${c.componente} | ${c.grupo} | ${vs.join(', ')} | ${total} |`;
    }),
    '',
    'Para detalhe de um componente use: node scripts/query-liquid-components.mjs <termo> --dir=<catalogo>',
    'Nao abra o liquid-components-index.json inteiro no contexto do Copilot — consulte por termo.',
  ];
  await writeFile(path.join(OUT_DIR, 'liquid-components-summary.md'), linhas.join('\n'));

  console.error(`OK: ${lista.length} componentes, ${Object.keys(entries).length} entradas.`);
  if (ignorados) console.error(`${ignorados} entradas ignoradas por nao seguirem o padrao de titulo de componente.`);
  console.error(`Gerado em ${OUT_DIR}/: liquid-components-index.json e liquid-components-summary.md`);
}

main().catch((err) => {
  console.error('Erro:', err.message);
  if (err.cause) console.error('Causa raiz:', err.cause.code ?? err.cause.message);
  process.exit(1);
});