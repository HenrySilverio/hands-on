---
agent: agent
model: Claude Sonnet 5 (copilot)
tools: ["search"]
description: Discovery - diz qual comando usar agora, e para. Não executa nada.
---

# /discovery-rota

Você descreve a situação. Este comando devolve o próximo comando a digitar, e para.

Ele **não** entrevista, **não** escreve briefing, **não** planeja e **não** dispara o comando
que acabou de recomendar. O que você recebe de volta é a próxima coisa a digitar, em chat
novo. Executar aqui carregaria a conversa de roteamento para dentro da etapa recomendada,
que é exatamente o desperdício que o fluxo existe para evitar.

## Entradas

Situação: ${input:situacao:Onde você está e o que quer fazer, em uma ou duas frases}

## Passo 0 - Orientar

Se a situação já disser onde a pessoa está, não leia nada e responda pelo mapa abaixo.

Só quando a pessoa não souber em que ponto está, liste `docs/briefings/` e as pastas de
`.sdd/changes/` exceto `archive/`, e use isso para localizá-la. Este comando não tem
`read/readFile`, de propósito: nome e existência bastam para orientar, e abrir arquivo é custo
sem retorno numa etapa que não decide nada.

## O mapa

Este mapa é o segundo ponto de acoplamento declarado no SKILL.md. Ele cita comandos e
caminhos do `sdd-workflow`, é mantido à mão, e falha em silêncio: se o outro toolkit mudar de
comando ou de estrutura de pastas, nada quebra — este mapa apenas passa a apontar para o lugar
errado. Revise-o junto com o `sdd-workflow`.

Se a situação não couber em nenhuma linha, diga isso em vez de inventar um comando.

### Fluxo principal, da necessidade ao arquivamento

```code
necessidade → /discovery-grill    → briefing
briefing    → /sdd-plan           → proposta, tarefas, deltas
proposta    → /sdd-implement      → código
código      → /sdd-review         → veredito
aprovado    → /sdd-archive        → spec atualizada
```

Cada seta é um chat novo. Um chat por etapa não é preciosismo: é a diferença entre carregar
oito mil tokens e carregar sessenta mil.

### Entradas alternativas

| Situação                                              | Comando                | Por quê                                                              |
| ----------------------------------------------------- | ---------------------- | -------------------------------------------------------------------- |
| tenho uma dor ou ideia, nada escrito                  | `/discovery-grill`     | entrevista do zero                                                    |
| tenho ticket, chamado ou bug já escrito               | `/discovery-triagem`   | aproveita o texto e pergunta só o que falta                           |
| não consigo decidir sem ver funcionando               | `/discovery-prototipo` | a pergunta não é entrevistável                                        |
| tenho briefing pronto                                 | `/sdd-plan`            | a descoberta já acabou                                                |

### Retornos e desvios

| Situação                                              | Rota                                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| o `/sdd-plan` devolveu perguntas e não escreveu nada  | `/discovery-grill` só sobre essas perguntas, atualize o briefing, rode o `/sdd-plan` de novo |
| o briefing tem `[NÃO RESPONDIDO]` e você quer avançar | não avance. É a mesma rota acima                                          |
| o `/sdd-review` reprovou                              | `/sdd-plan` no mesmo change-id: o achado vira agrupamento novo e o motivo entra em `## Divergências`. Depois `/sdd-implement`, depois `/sdd-review` de novo |
| o `/sdd-review` reprovou por critério errado, não por código errado | pare. Decisão humana: corrigir a proposta e reabrir, ou aceitar o escopo como está |
| um eixo aprovou e o outro reprovou                    | corrija só o eixo reprovado e rode `/sdd-review` com `eixo` preenchido. O archive exige os dois |
| o `/sdd-implement` parou reportando divergência       | pare. Decisão humana, não há comando                                      |
| a mudança é grande demais para uma sessão             | quebre em briefings menores, um por capacidade, cada um entregando valor sozinho. Não existe comando para isso hoje |
| o protótipo respondeu a pergunta                      | volte ao `/discovery-grill` ou edite o briefing à mão, registrando a decisão em `Contexto útil` |

### Quando não usar fluxo nenhum

Se ninguém vai revisar a mudança, não há acordo a escrever. Corrigir um typo, ajustar um
texto fixo, subir uma versão de dependência sem quebra: faça direto.

O fluxo existe para mudança que alguém vai auditar. Cerimônia acima do risco é desperdício, e
desperdício de cerimônia é o que faz equipe abandonar processo.

## Onde a decisão é humana

Estes pontos não têm comando, e é assim de propósito:

- escolher entre quebrar, mesclar ou sequenciar quando há conflito entre mudanças abertas;
- decidir se uma divergência reportada pelo `/sdd-implement` muda o plano ou o código;
- aceitar ou recusar uma restrição descoberta tarde;
- decidir que uma necessidade não vale ser feita.

## Saída

No máximo seis linhas: onde você está; o comando a digitar em seguida, com o argumento
esperado; por que esse e não o vizinho mais parecido; e, se houver, qual decisão humana
precisa acontecer antes.

Não execute o comando recomendado. Não peça permissão para executá-lo.
