#!/usr/bin/env node
// Validador da base de conhecimento. Sem dependências. Roda com: node ferramentas/valida-frontmatter.mjs
// Regra sintática vira código; markdown fica com o que exige julgamento.
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { lerFrontmatter } from './frontmatter.mjs';

const RAIZ = process.cwd();
const IGNORAR = new Set(['.git', 'node_modules', '.github', 'ferramentas', 'inbox']);

const REGRAS = [
  { quando: (p) => p.includes('/historico/'),
    exige: ['tipo', 'ticket', 'produto', 'entregue_em', 'base_consultada', 'qualidade'],
    extra: (d, erro) => {
      const semSha = (d.base_consultada ?? []).filter((r) => !r.includes('@'));
      if (semSha.length)
        erro(`base_consultada sem SHA em: ${semSha.join(', ')} (use caminho@sha) — `
             + 'sem isso o registro não é auditável');
      if (!['comum', 'referencia'].includes(d.qualidade))
        erro(`qualidade inválida: ${d.qualidade}`);
    } },
  { quando: (p) => p.includes('/decisoes/'),
    exige: ['tipo', 'titulo', 'status', 'decidido_em', 'decidido_por', 'origem'],
    extra: (d, erro) => {
      if (!['proposta', 'vigente', 'superada'].includes(d.status))
        erro(`status inválido: ${d.status}`);
      if (Array.isArray(d.decidido_por) && d.decidido_por.length === 0)
        erro('decidido_por vazio — decisão sem dono não é decisão');
    } },
  { quando: (p) => p.includes('/externas/'),
    exige: ['tipo', 'classe', 'fonte', 'url', 'obtido_em', 'curado_por', 'confianca'],
    extra: (d, erro, corpo) => {
      if (!['alta', 'media', 'baixa'].includes(d.confianca))
        erro(`confianca inválida: ${d.confianca}`);
      if (!/##\s*Trecho literal/i.test(corpo))
        erro('falta a seção "## Trecho literal" — norma parafraseada sem citação não entra');
      if (!/##\s*Leitura de neg[óo]cio/i.test(corpo))
        erro('falta a seção "## Leitura de negócio"');
    } },
  { quando: (p) => p.includes('/publicado/') || p.includes('/em-voo/'),
    exige: ['tipo', 'produto', 'prateleira', 'gerado_por', 'atualizado_em'],
    extra: (d, erro) => {
      const esperada = d.__caminho.includes('/publicado/') ? 'publicado' : 'em-voo';
      if (d.prateleira !== esperada)
        erro(`prateleira "${d.prateleira}" não corresponde à pasta (${esperada})`);
    } },
  { quando: (p) => p.startsWith('tribo/') && p.endsWith('.md'),
    exige: ['tipo', 'escopo', 'atualizado_em'] },
];

let erros = 0, arquivos = 0;

for (const caminho of varrer(RAIZ)) {
  const rel = relative(RAIZ, caminho).replaceAll('\\', '/');
  if (rel.endsWith('README.md') || rel.endsWith('INDEX.md') || rel.endsWith('SETUP.md')) continue;
  const regra = REGRAS.find((r) => r.quando(rel));
  if (!regra) continue;

  arquivos++;
  const { dados, corpo } = lerFrontmatter(caminho);
  const erro = (msg) => { console.error(`  ✗ ${rel}: ${msg}`); erros++; };

  if (!dados) { erro('sem frontmatter'); continue; }
  dados.__caminho = rel;
  for (const campo of regra.exige) {
    const v = dados[campo];
    if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0))
      erro(`campo obrigatório ausente ou vazio: ${campo}`);
  }
  regra.extra?.(dados, erro, corpo);

  if (/\bTODO\b|<preencha>/i.test(corpo) && rel.includes('/publicado/'))
    erro('conteúdo de placeholder em publicado/ — a prateleira de PRODUÇÃO não aceita rascunho');
}

console.log(`\n${arquivos} arquivo(s) verificado(s), ${erros} problema(s).`);
process.exit(erros ? 1 : 0);

function* varrer(dir) {
  for (const nome of readdirSync(dir)) {
    if (IGNORAR.has(nome)) continue;
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) yield* varrer(p);
    else if (nome.endsWith('.md')) yield p;
  }
}
