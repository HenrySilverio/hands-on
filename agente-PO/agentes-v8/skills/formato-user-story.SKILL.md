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
   ↳ origem: <em linguagem humana: "regra publicada: prazo máximo de parcelamento" ou
     "definido pelo PO no discovery de 03/09">
2. ...

## Fora de escopo
<o que explicitamente não entra>

## Em aberto
- **[NÃO RESPONDIDO]** <lacuna de borda que sobreviveu>

## Decisões referenciadas
- <título da decisão> — decidida em <data> por <quem>
````

## Regras

- **Critério sem `↳ origem:` não entra.** Não há exceção.
- **A story é autocontida. Nenhum caminho deste repositório entra nela.** Ela vai para o Jira e de
  lá para o time de desenvolvimento, que trabalha noutro repositório com outro harness. Caminho
  como `squads/.../publicado/regras-negocio.md` não resolve nada lá: aponta para arquivo que não
  existe naquele contexto, e confunde as ferramentas do dev, que tentam achá-lo no código.
  A origem na story é **descritiva**; a rastreabilidade com caminho e SHA vive no registro de
  `historico/`, que é onde ela é auditada.
- **Nunca cite o próprio artefato de discovery como origem.** "origem: .../story.md" é circular e
  não prova nada. A origem é a resposta do PO ou a regra da base — nunca o arquivo que você está
  escrevendo.
- Critério descreve comportamento observável pelo usuário, não implementação.
- Cenário de exceção só entra se alguém o mencionou. Não invente o caso de borda elegante.
- A seção `Em aberto` fica visível na story que vai para o Jira. Lacuna escondida vira retrabalho
  no refinamento técnico — que é exatamente o custo que este fluxo existe para eliminar.
