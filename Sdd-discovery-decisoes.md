# sdd-toolkit v0.2 e sdd-discovery v0.1 — decisões de projeto

Dois toolkits irmãos para GitHub Copilot Chat. Contrato entre eles: o arquivo em
`docs/briefings/`. Mais um segundo acoplamento declarado: o mapa de rotas do `/discovery-rota`.

## sdd-discovery v0.1 — da necessidade ao briefing

| Comando | Papel | Modelo |
| --- | --- | --- |
| `/discovery-rota` | roteador entre os dois toolkits. Recomenda e para | mais barato |
| `/discovery-grill` | entrevista em rodadas, do zero ao briefing | mais capaz |
| `/discovery-triagem` | ticket/chamado → briefing, entrevistando só as lacunas | mais capaz |
| `/discovery-prototipo` | responde pergunta de design com código descartável | intermediário |

### Decisões que não devem ser revertidas

**Trava anti-inferência.** O briefing contém apenas o que foi respondido. Lacuna vira marcador
`**[NÃO RESPONDIDO]**`. Briefing inferido *parece* completo, o `/sdd-plan` deixa de encontrar
ambiguidade, e ela reaparece no código.

**Lacuna bloqueante vs. de borda.** Bloqueante (falta sintoma ou resultado esperado) → não
grava, devolve as perguntas. De borda → grava com marcador. O marcador **não garante** que o
`/sdd-plan` pare; garante que a lacuna existe por escrito e não virou invenção.

**Grilling não lê código.** Nenhum prompt de entrevista tem `search`.

**Protótipo não grava briefing.** Devolve a linha sugerida; quem grava é o humano.

**`/discovery-rota` é autossuficiente:** `tools: ["search"]`, não carrega o `SKILL.md`.

## sdd-toolkit v0.2 — as seis mudanças sobre a v0.1

| Mudança | Motivo |
| --- | --- |
| Camada `.sdd/decisoes/`, promovida pelo archive a partir de `design.md` | o rationale morria no archive e a alternativa descartada voltava como proposta |
| `/sdd-review` com dois eixos independentes e dois vereditos | o eixo spec sozinho aprovava código que violava todo padrão do repo |
| `.sdd/padroes.md` como fonte declarada do eixo 1 | `copilot-instructions.md` é escrito para gerar código e cobrado em toda requisição; regra de auditoria precisa ser verificável contra diff |
| Fatia vertical obrigatória em `tarefas.md`, com `Demonstra:` e `Bloqueado por:` | não havia unidade de trabalho honesta; agrupamento por camada escondia dependência |
| `Ticket`, `Branch` e `Base` na proposta, conferidos pelo implement e pelo review | implementar na branch errada era invisível até a revisão |
| `revisao/<eixo>-<commit>.md`, escrito pelo review e conferido pelo archive | veredito que só existia no chat era inverificável |
| `.sdd/sdd.mjs`, validador sem dependências | os itens acima criaram portões sintáticos, e regra sintática deve virar código |
| Roteamento de modelo corrigido | implement rodava em Opus e review em Sonnet, o inverso da doutrina |

### Invariantes do v0.2

- **Nenhuma etapa escreve Git.** O fluxo lê estado e se recusa a trabalhar no lugar errado. É
  regra de contrato, não trava técnica — os quatro prompts têm terminal. Fechar de verdade é
  allowlist da organização.
- **O archive ignora `revisao/` ao conferir a árvore limpa.** Sem essa exceção o fluxo
  deadlockaria: o veredito é escrito depois do commit que aprova; commitá-lo faria o HEAD
  avançar e invalidaria a própria aprovação.
- **Depois de um REPROVADO o caminho é `/sdd-plan`, não `/sdd-implement`.** Quando a revisão
  roda, o checklist já está todo `[x]`, e o implement não inventa tarefa nem edita o texto de
  `tarefas.md`. Achado vira agrupamento novo, motivo em `## Divergências`.
- **O `/sdd-review` declara `edit/createFile` e não `edit/editFiles`.** Não consegue alterar
  arquivo existente — nem o código que audita, nem um veredito já gravado.
- **Linha de base de refactor é precondição do operador**, declarada como `Precondição:` no
  topo de `tarefas.md`, nunca como primeiro agrupamento: quem executaria não pode commitar.

### Custo

Contexto por invocação (palavras, sem o que é lido sob demanda): plan 2.382→4.168,
implement 1.241→2.477, review 1.281→3.587, archive 2.137→3.432. O eixo de padrões é metade do
salto da revisão. O validador puxa na direção oposta: cada portão que ele absorve sai do
markdown.

## Método que funcionou

Revisão adversarial por subagente depois de cada versão, com categorias fixas: contrato
quebrado, contradição interna, regra órfã, vazamento de acoplamento, ferramentas incoerentes,
ciclo/deadlock, regressão, auto-contradição de doutrina. Encontrou 13 defeitos no discovery v1,
8 regressões na v2, e no sdd v0.2 um deadlock duro entre as precondições do archive mais a
ausência de caminho depois de um REPROVADO. Repetir a cada versão.

## Não trazer do Matt Pocock

Dependência de issue tracker (o `.sdd/` em Git é melhor para banco), `wayfinder` completo
(pressupõe subagentes e worktrees paralelos, que o Copilot Chat não entrega), spec descartável
(a camada `specs/` permanente + deltas é melhor para sistema regulado).

## Próximo passo natural

Mover para o `sdd.mjs` os portões mecânicos que ainda estão em markdown, e avaliar se a fatia
vertical + grafo de bloqueio já cobre mudança multi-sessão ou se falta um equivalente enxuto do
`wayfinder`.