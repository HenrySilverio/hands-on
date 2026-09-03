---
name: navegar-base
description: Como encontrar informação no repositório de conhecimento da tribo ReabilitAI sem ler
  a base inteira, e quais pastas nunca devem ser usadas como fonte de regra vigente. Use antes de
  qualquer consulta à base.
---

# Navegar a base

## Ordem de leitura

1. `INDEX.md` na raiz — mapa de produtos e domínios. **Sempre primeiro.** Ele é gerado; se
   estiver desatualizado, é bug do gerador, não motivo para varrer o repositório.
2. `tribo/glossario.md` — quando o termo da pergunta for ambíguo.
3. O arquivo específico apontado pelo índice.

Não faça varredura ampla. A base é escrita em arquivos curtos por assunto justamente para que a
resposta esteja em um ou dois arquivos.

## O que cada prateleira significa

| Pasta | Significa | Pode citar como |
| --- | --- | --- |
| `publicado/` | está em PRODUÇÃO agora | regra vigente |
| `em-voo/` | mergeado, ainda não publicado | "muda na próxima release" |
| `decisoes/` com `status: vigente` | decisão de negócio em vigor | decisão |
| `decisoes/` com `status: superada` | histórico | apenas contexto |
| `evidencias/` | onde a regra é implementada, por repositório | **nunca** como regra — só para responder "onde fica" |
| `historico/` | stories entregues | **nunca** como regra |
| `inbox/` | matéria-prima não revisada | **nunca** |

## Como citar

Sempre o caminho completo do arquivo. Quando o arquivo tiver `sha` ou `release` no frontmatter,
inclua. Exemplo: `squads/cockpit-renegociacao/publicado/regras-negocio.md@a3f21c9`.

Citação sem caminho não vale. Se você não consegue apontar o arquivo, você não sabe — diga isso.

## Produto e repositórios não são a mesma coisa

Um produto é entregue por vários repositórios — no cockpit, dois fronts e alguns BFFs. A base é
organizada por **domínio de negócio**, nunca por repositório. Uma regra existe uma vez em
`publicado/`, e os repositórios que a implementam aparecem em `evidencias/` como prova, não como
estrutura.

Consequência prática: nunca responda "essa regra é do repositório X". Responda a regra, e cite o
arquivo de `publicado/`. Só mencione repositório quando a pergunta for explicitamente sobre onde
algo é implementado.

## Uma squad nunca lê a pasta de outra

Tribo é compartilhada. Squad é isolada.

Ao atender uma demanda do produto X, você lê **apenas** `tribo/` e `squads/X/`. Nunca abra, cite ou
use como referência qualquer arquivo de `squads/<outro>/` — nem para comparar, nem para ilustrar,
nem para "ver como resolveram lá".

A regra de precedência tribo × squad **não cobre isso**: ela trata camada geral contra camada
específica. Entre squads não existe precedência nenhuma — existem produtos diferentes, com regras
que podem ser legitimamente opostas. Citar a regra de um produto para o PO de outro é a falha mais
difícil de detectar da base inteira, porque a resposta parece bem fundamentada e vem com caminho de
arquivo.

Se a pergunta só se responde olhando outra squad, diga isso e pare: é conversa entre as duas
squads, não consulta à base.

## O campo `cobertura`

Todo arquivo de `publicado/` e `em-voo/` declara quais repositórios já foram extraídos. Leia esse
campo antes de responder que algo não existe: a base cresce um repositório por vez, e o que ainda
não foi extraído não é ausência de regra — é ausência de leitura.

## Quando a base não cobre

Responda "a base não cobre isto" e diga qual pasta deveria cobrir. Isso alimenta o ritual de
curadoria da sprint e é mais valioso que um palpite bem escrito.
