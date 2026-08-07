# sdd-discovery v0.1 — decisões de projeto

Toolkit irmão do `sdd-toolkit`, cobrindo o trecho **da necessidade até o briefing**. Criado
depois de análise dos nove skills do Matt Pocock (aihero.dev) contra o `sdd-toolkit-v0.1`.

## Composição

| Comando | Papel | Modelo |
| --- | --- | --- |
| `/discovery-rota` | roteador entre os dois toolkits. Recomenda e para | mais barato |
| `/discovery-grill` | entrevista em rodadas, do zero ao briefing | mais capaz |
| `/discovery-triagem` | ticket/chamado → briefing, entrevistando só as lacunas | mais capaz |
| `/discovery-prototipo` | responde pergunta de design com código descartável | intermediário |

Estrutura: `.github/prompts/discovery-*.prompt.md`, `.github/skills/discovery-workflow/SKILL.md`
+ 3 references (`tecnica-grilling`, `molde-briefing`, `modos-prototipo`), `docs/briefings/`,
`docs/prototipos/`.

## Decisões que não devem ser revertidas sem motivo

**Trava anti-inferência.** O briefing contém apenas o que foi respondido. Lacuna vira
marcador `**[NÃO RESPONDIDO]**`, nunca suposição. Motivo: briefing inferido *parece* completo,
o `/sdd-plan` deixa de encontrar ambiguidade, e a ambiguidade reaparece no código.

**Lacuna bloqueante vs. de borda.** Bloqueante (falta sintoma ou resultado esperado) → não
grava, devolve as perguntas. De borda → grava com marcador. O marcador **não garante** que o
`/sdd-plan` pare: a regra dele é condicional. O que ele garante é que a lacuna existe por
escrito e não virou invenção.

**Dois acoplamentos declarados, não um.** (1) formato do briefing — quebra visível;
(2) mapa de rotas do `/discovery-rota` — falha em silêncio, mantido à mão, revisar quando o
`sdd-toolkit` mudar.

**Grilling não lê código.** Nenhum prompt de entrevista tem `search`. Código lido antes do
problema estar claro enviesa para o que já existe.

**Protótipo não grava briefing.** Devolve a linha sugerida; quem grava é o humano. A conclusão
do protótipo é do modelo, precisa de aceite explícito.

**`/discovery-rota` é autossuficiente.** Único prompt que não carrega o `SKILL.md`
(`tools: ["search"]`). Carregar o contrato para consultar uma tabela é pagar contexto por nada.

## Lacunas conhecidas no `sdd-toolkit-v0.1` (ainda não corrigidas)

1. **Rationale arquitetural morre no archive.** `design.md` é por mudança e vai para
   `archive/`. `specs/` absorve comportamento; nada absorve decisão. Falta terceira camada
   permanente (equivalente a ADR), alimentada pelo `/sdd-archive`.
2. **`/sdd-review` é caolho.** Só tem eixo spec. Falta eixo standards independente (padrões do
   repo + code smells), com veredito separado — modelo dos dois sub-agentes do `/code-review`.
3. **Sem resposta para mudança maior que uma sessão.** Falta fatia vertical e grafo de
   bloqueio no `tarefas.md` (conceito de `/to-tickets`).
4. **Zero disciplina de Git.** Nenhum comando menciona branch ou commit. Rastreabilidade
   ticket → change-id → commit é requisito de auditoria em banco.
5. **Roteamento de modelo invertido.** `/sdd-implement` está com Opus (README manda
   intermediário); `/sdd-review` está com Sonnet (README manda o mais capaz). O README também
   afirma que os quatro prompts vêm com Sonnet, o que já não é verdade em dois.

## Não trazer do Matt

Dependência de issue tracker (o `.sdd/` em Git é melhor para banco), `wayfinder` completo
(pressupõe subagentes e worktrees paralelos, que o Copilot Chat não entrega), spec descartável
(a camada `specs/` permanente + deltas é melhor para sistema regulado).