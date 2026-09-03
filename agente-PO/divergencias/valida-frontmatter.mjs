#!/usr/bin/env node
// Validador da base de conhecimento. Sem dependências. Roda com: node ferramentas/valida-frontmatter.mjs
// Regra sintática vira código; markdown fica com o que exige julgamento.
import { readdirSync, statSync, readFileSync } from 'node:fs';
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
    exige: ['tipo', 'classe', 'escopo', 'fonte', 'url', 'fonte_original',
            'obtido_em', 'curado_por', 'confianca', 'status', 'divergencias'],
    extra: (d, erro, corpo) => {
      if (!['alta', 'media', 'baixa'].includes(d.confianca))
        erro(`confianca inválida: ${d.confianca}`);
      if (!['vigente', 'revogada', 'substituida'].includes(d.status))
        erro(`status inválido: ${d.status}`);
      if (d.status === 'substituida' && (!d.substituida_por || d.substituida_por === 'null'))
        erro('status substituida exige substituida_por');
      // Portão de merge: ficha sem verificação de divergência não entra na base.
      // Para afrouxar, mova 'nao-verificada' para a lista de valores aceitos.
      if (!['completa', 'parcial'].includes(d.divergencias))
        erro(`divergencias: "${d.divergencias}" — verifique antes de commitar `
          + '(aceito: completa, parcial)');
      if (!['tribo', 'squad'].includes(d.escopo))
        erro(`escopo inválido: ${d.escopo} (use tribo ou squad)`);
      if (d.escopo === 'squad' && (!d.produto || d.produto === 'null'))
        erro('escopo squad exige o campo produto');
      if (!/##\s*Trecho literal/i.test(corpo))
        erro('falta a seção "## Trecho literal" — norma parafraseada sem citação não entra');
      if (!/##\s*Leitura de neg[óo]cio/i.test(corpo))
        erro('falta a seção "## Leitura de negócio"');
    } },
  { quando: (p) => p.includes('/evidencias/'),
    exige: ['tipo', 'produto', 'repositorio', 'gerado_por', 'atualizado_em'] },
  { quando: (p) => p.includes('/publicado/') || p.includes('/em-voo/'),
    exige: ['tipo', 'produto', 'prateleira', 'gerado_por', 'cobertura', 'atualizado_em'],
    extra: (d, erro) => {
      const esperada = d.__caminho.includes('/publicado/') ? 'publicado' : 'em-voo';
      if (d.prateleira !== esperada)
        erro(`prateleira "${d.prateleira}" não corresponde à pasta (${esperada})`);
    } },
  { quando: (p) => p.startsWith('tribo/') && p.endsWith('.md'),
    exige: ['tipo', 'escopo', 'atualizado_em'] },
];

// Texto de modelo que sobrou. Lacuna de verdade se escreve **[NÃO RESPONDIDO]** e é permitida.
// Texto de modelo em minuscula/maiuscula mista, entre < >.
const MODELO = /<preencha|<a preencher|<enunciado|<defini[çc][ãa]o|<nome d|<termo|<passo|<campo|<slug|<o que |lorem ipsum/i;
// TODO/FIXME so em caixa alta e isolados. NAO use \b: em JS ele é ASCII, e em
// "Método" o "é" conta como nao-palavra, fazendo "todo" casar. Toda tabela em
// portugues era reprovada por isso.
const MARCADOR = /(^|[^\p{L}])(TODO|FIXME)([^\p{L}]|$)/u;
const PLACEHOLDER = { test: (linha) => MODELO.test(linha) || MARCADOR.test(linha) };

// Marcador de lacuna é legítimo no CORPO, nunca como valor de campo obrigatório.
const LACUNA = /N[ÃA]O RESPONDIDO|a preencher|<preencha|\bTBD\b|\bTODO\b/i;

let erros = 0, arquivos = 0;

// Binário não entra na base: não versiona, incha o repositório e, com dado sensível,
// não sai mais do histórico. A ficha registra onde o original vive.
const BINARIOS = /\.(pdf|docx?|xlsx?|pptx?|png|jpe?g|gif|zip|msg|eml)$/i;
for (const caminho of varrerTudo(RAIZ)) {
  const rel = relative(RAIZ, caminho).replaceAll('\\', '/');
  if (BINARIOS.test(rel)) {
    console.error(`  ✗ ${rel}: binário na base — guarde o original fora do repositório e `
      + 'registre o endereço no campo fonte_original da ficha');
    erros++;
  }
}

for (const caminho of varrer(RAIZ)) {
  const rel = relative(RAIZ, caminho).replaceAll('\\', '/');
  if (rel.endsWith('README.md') || rel.endsWith('INDEX.md') || rel.endsWith('SETUP.md')) continue;
  const regra = REGRAS.find((r) => r.quando(rel));
  if (!regra) continue;

  arquivos++;
  const { dados, corpo } = lerFrontmatter(caminho);
  const bruto = readFileSync(caminho, 'utf8');
  const erro = (msg) => { console.error(`  ✗ ${rel}: ${msg}`); erros++; };

  if (!dados) { erro('sem frontmatter'); continue; }
  dados.__caminho = rel;
  for (const campo of regra.exige) {
    const v = dados[campo];
    if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0))
      erro(`campo obrigatório ausente ou vazio: ${campo}`);
    // Campo obrigatório preenchido com marcador de lacuna passava na checagem de presença.
    else if (LACUNA.test(Array.isArray(v) ? v.join(' ') : String(v)))
      erro(`campo obrigatório com marcador de lacuna: ${campo} = ${v}`);
  }
  regra.extra?.(dados, erro, corpo);

  if (rel.includes('/publicado/') || rel.includes('/em-voo/')) {
    const linhas = corpo.split('\n');
    const inicio = (bruto.match(/\n/g) || []).length - linhas.length + 1;
    linhas.forEach((linha, i) => {
      if (PLACEHOLDER.test(linha))
        erro(`linha ${inicio + i + 1}: sobrou texto de modelo — ${linha.trim().slice(0, 60)}`
          + ' (lacuna real se escreve **[NÃO RESPONDIDO]**)');
    });
  }
}

console.log(`\n${arquivos} arquivo(s) verificado(s), ${erros} problema(s).`);
process.exit(erros ? 1 : 0);

function* varrerTudo(dir) {
  for (const nome of readdirSync(dir)) {
    if (IGNORAR.has(nome) || nome === '.gitkeep') continue;
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) yield* varrerTudo(p);
    else yield p;
  }
}

function* varrer(dir) {
  for (const nome of readdirSync(dir)) {
    if (IGNORAR.has(nome)) continue;
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) yield* varrer(p);
    else if (nome.endsWith('.md')) yield p;
  }
}
