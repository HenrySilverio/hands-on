#!/usr/bin/env node
/**
 * Sonda quais fontes de documentacao estruturada o Liquid publica.
 *
 * Uso:
 *   node probe-liquid-docs.mjs <base-url> [<base-url> ...]
 *
 * Ex.:
 *   node probe-liquid-docs.mjs https://static.bradesco.com.br/dsysliquid/dist/design-system-3.1.0
 *   node probe-liquid-docs.mjs https://<url-do-storybook-de-voces>
 *
 * Este script nao extrai nada. Ele responde uma unica pergunta: o que existe?
 * A resposta determina qual extrator faz sentido escrever. Escrever extrator
 * antes de saber o formato e desperdicio.
 *
 * Ordem de preferencia das fontes, da melhor para a pior:
 *   1. Custom Elements Manifest — JSON estruturado com tags, atributos, props,
 *      eventos, slots e descricoes. E a fonte que alimenta o autocomplete do
 *      VS Code e o proprio Storybook. Se existir, e o que vamos usar.
 *   2. Storybook index.json / stories.json — lista de stories com titulo e id.
 *      Da o mapa dos componentes e permite buscar args por story, mas a prosa
 *      da documentacao costuma estar compilada no bundle, fora de alcance.
 *   3. HTML renderizado — ultimo recurso, fragil, quebra a cada release.
 */

import { fetchRaw, getProxyUrl } from './lib/http.mjs';

const CANDIDATOS = [
  // Custom Elements Manifest e variantes
  { path: 'custom-elements.json', tipo: 'CEM' },
  { path: 'custom-elements-manifest.json', tipo: 'CEM' },
  { path: 'dist/custom-elements.json', tipo: 'CEM' },
  { path: 'docs/custom-elements.json', tipo: 'CEM' },
  // Dados para editor — mesmo conteudo, formato diferente
  { path: 'vscode-data.json', tipo: 'VSCODE-DATA' },
  { path: 'html-custom-data.json', tipo: 'VSCODE-DATA' },
  { path: 'vscode.html-custom-data.json', tipo: 'VSCODE-DATA' },
  { path: 'web-types.json', tipo: 'WEB-TYPES' },
  // Storybook
  { path: 'index.json', tipo: 'STORYBOOK' },
  { path: 'stories.json', tipo: 'STORYBOOK' },
  { path: 'project.json', tipo: 'STORYBOOK' },
  { path: 'metadata.json', tipo: 'STORYBOOK' },
  // Metadados do pacote — pode apontar para o manifesto via campo customElements
  { path: 'package.json', tipo: 'PACKAGE' },
];

function classificarJson(texto, tipo) {
  let dado;
  try {
    dado = JSON.parse(texto);
  } catch {
    return { valido: false, resumo: 'nao e JSON valido' };
  }

  if (tipo === 'CEM' && Array.isArray(dado.modules)) {
    const decls = dado.modules.flatMap((m) => m.declarations || []);
    const tags = decls.filter((d) => d.tagName).map((d) => d.tagName);
    return {
      valido: true,
      resumo: `Custom Elements Manifest, schema ${dado.schemaVersion || '?'}, ${dado.modules.length} modulos, ${tags.length} tags`,
      amostra: tags.slice(0, 8),
    };
  }

  if (tipo === 'VSCODE-DATA' && Array.isArray(dado.tags)) {
    return {
      valido: true,
      resumo: `VS Code custom data, ${dado.tags.length} tags`,
      amostra: dado.tags.slice(0, 8).map((t) => t.name),
    };
  }

  if (tipo === 'WEB-TYPES') {
    return { valido: true, resumo: `web-types, versao ${dado.version || '?'}` };
  }

  if (tipo === 'STORYBOOK') {
    const entries = dado.entries || dado.stories;
    if (entries && typeof entries === 'object') {
      const ids = Object.keys(entries);
      const titulos = [...new Set(ids.map((id) => entries[id].title).filter(Boolean))];
      return {
        valido: true,
        resumo: `Storybook v${dado.v || '?'}, ${ids.length} entradas, ${titulos.length} titulos`,
        amostra: titulos.slice(0, 8),
      };
    }
    return { valido: true, resumo: 'JSON de Storybook sem entries/stories reconheciveis' };
  }

  if (tipo === 'PACKAGE') {
    const campos = ['customElements', 'web-types', 'main', 'module', 'version']
      .filter((k) => dado[k])
      .map((k) => `${k}=${dado[k]}`);
    return { valido: true, resumo: `package.json — ${campos.join(', ') || 'sem campos relevantes'}` };
  }

  return { valido: true, resumo: `JSON com chaves: ${Object.keys(dado).slice(0, 6).join(', ')}` };
}

async function sondar(base) {
  const raiz = base.replace(/\/+$/, '');
  console.log(`\n=== ${raiz} ===`);
  const achados = [];

  for (const cand of CANDIDATOS) {
    const url = `${raiz}/${cand.path}`;
    try {
      const res = await fetchRaw(url, 'application/json,*/*');
      if (res.status !== 200) {
        console.log(`  [${res.status}] ${cand.path}`);
        continue;
      }
      const info = classificarJson(res.body, cand.tipo);
      const tamanho = (res.body.length / 1024).toFixed(0);
      console.log(`  [200] ${cand.path}  (${tamanho} KB)  ${info.resumo}`);
      if (info.amostra?.length) {
        console.log(`         amostra: ${info.amostra.join(', ')}`);
      }
      if (info.valido) achados.push({ ...cand, url, resumo: info.resumo });
    } catch (err) {
      console.log(`  [erro] ${cand.path} — ${err.message}`);
    }
  }

  return achados;
}

async function main() {
  const bases = process.argv.slice(2);
  if (!bases.length) {
    console.error('Uso: node probe-liquid-docs.mjs <base-url> [<base-url> ...]');
    console.error('Passe a raiz do CDN e, se souber, a raiz do Storybook publicado.');
    process.exit(1);
  }

  const proxy = getProxyUrl();
  console.log(proxy ? `Proxy detectado: ${proxy}` : 'Sem proxy no ambiente — conexao direta.');

  const todos = [];
  for (const base of bases) {
    todos.push(...(await sondar(base)));
  }

  console.log('\n=== Resultado ===');
  if (!todos.length) {
    console.log('Nenhuma fonte estruturada encontrada nas URLs informadas.');
    console.log('Isso nao significa que nao existe: pode estar em outro caminho ou host.');
    console.log('Abra o Storybook no navegador, abra o DevTools na aba Network, recarregue,');
    console.log('e procure por requisicoes a arquivos .json — o nome que aparecer ali e o caminho real.');
    return;
  }

  const prioridade = ['CEM', 'VSCODE-DATA', 'WEB-TYPES', 'STORYBOOK', 'PACKAGE'];
  todos.sort((a, b) => prioridade.indexOf(a.tipo) - prioridade.indexOf(b.tipo));

  console.log('Fontes encontradas, da melhor para a pior:');
  for (const a of todos) {
    console.log(`  ${a.tipo.padEnd(12)} ${a.url}`);
  }
  console.log(`\nMelhor fonte: ${todos[0].tipo} em ${todos[0].url}`);
}

main().catch((err) => {
  console.error('Erro:', err.message);
  if (err.cause) console.error('Causa raiz:', err.cause.code ?? err.cause.message);
  process.exit(1);
});