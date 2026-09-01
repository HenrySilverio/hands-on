---
name: formato-user-story
description: Formato canônico da user story da tribo ReabilitAI, com origem obrigatória em cada
  critério de aceite. Use ao escrever a story final para o Jira.
---

# Formato da user story

Caminho: `squads/<produto>/discovery/<TICKET>/story.md`

````markdown
# <TICKET> — <título curto e específico>

## História
Como <perfil de usuário>,
quero <capacidade>,
para <resultado de negócio>.

## Contexto
<duas ou três linhas; por que agora>

## Critérios de aceite
1. <comportamento observável>
   ↳ origem: `caminho/do/arquivo.md` (ou: resposta do PO em briefing.md)
2. ...

## Fora de escopo
<o que explicitamente não entra>

## Em aberto
- **[NÃO RESPONDIDO]** <lacuna de borda que sobreviveu>

## Decisões referenciadas
- `squads/<produto>/decisoes/<arquivo>.md`
````

## Regras

- **Critério sem `↳ origem:` não entra.** Não há exceção.
- Critério descreve comportamento observável pelo usuário, não implementação.
- Cenário de exceção só entra se alguém o mencionou. Não invente o caso de borda elegante.
- A seção `Em aberto` fica visível na story que vai para o Jira. Lacuna escondida vira retrabalho
  no refinamento técnico — que é exatamente o custo que este fluxo existe para eliminar.
