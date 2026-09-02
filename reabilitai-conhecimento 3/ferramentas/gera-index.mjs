#!/usr/bin/env node
// Gera o INDEX.md. Índice escrito à mão desatualiza em duas semanas e passa a mentir para o agente.
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { lerFrontmatter } from './frontmatter.mjs';

const RAIZ = process.cwd();
const IGNORAR = new Set(['.git', 'node_modules', '.github', 'ferramentas', 'inbox']);

const linhas = [
  '<!-- GERADO por ferramentas/gera-index.mjs. Não edite à mão. -->',
  '# Índice da base ReabilitAI', '',
  'Comece por aqui. Cada arquivo é curto e trata de um assunto.', '',
  '| Arquivo | Tipo | Escopo | Prateleira | Atualizado |',
  '| --- | --- | --- | --- | --- |',
];

const linhasTabela = [];
for (const caminho of varrer(RAIZ)) {
  const rel = relative(RAIZ, caminho).replaceAll('\\', '/');
  if (/README\.md$|INDEX\.md$|SETUP\.md$/.test(rel)) continue;
  if (rel.includes('/historico/')) continue; // histórico não é fonte de regra; fora do índice
  const { dados } = lerFrontmatter(caminho);
  if (!dados) continue;
  linhasTabela.push(
    `| [\`${rel}\`](${rel}) | ${dados.tipo ?? '—'} | ${dados.escopo ?? dados.produto ?? '—'} `
    + `| ${dados.prateleira ?? '—'} | ${dados.atualizado_em ?? dados.decidido_em ?? '—'} |`
  );
}

linhasTabela.sort();
linhas.push(...linhasTabela, '',
  '## Pastas fora deste índice', '',
  '- `historico/` — stories entregues. Registro auditável, **nunca** fonte de regra vigente.',
  '- `inbox/` — matéria-prima não revisada.', '');

writeFileSync(join(RAIZ, 'INDEX.md'), linhas.join('\n'));
console.log(`INDEX.md gerado com ${linhasTabela.length} entrada(s).`);

function* varrer(dir) {
  for (const nome of readdirSync(dir)) {
    if (IGNORAR.has(nome)) continue;
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) yield* varrer(p);
    else if (nome.endsWith('.md')) yield p;
  }
}
