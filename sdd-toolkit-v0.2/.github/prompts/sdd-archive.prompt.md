---
agent: agent
model: Claude Sonnet 5 (copilot)
tools:
  ["read/readFile", "search", "edit/createFile", "edit/editFiles", "execute"]
description: SDD - aplica os deltas em specs/, promove as decisões permanentes e arquiva a mudança.
---

# /sdd-archive

Fechar a mudança: absorver o que ela alterou no estado do sistema, absorver o porquê, e
tirá-la das mudanças abertas. Etapa mecânica, sem julgamento.

## Entradas

Mudança: ${input:changeId:change-id, ou vazio para listar as abertas}

## Passo 0 - Contrato

Leia `.github/skills/sdd-workflow/SKILL.md`.

Se a mudança vier vazia ou inexistente, liste as pastas de `.sdd/changes/`, exceto
archive, e pare.

## Passo 1 - Precondições

Confira, e pare no primeiro que falhar:

1. Existe em `.sdd/changes/<change-id>/revisao/`, para **cada um dos dois eixos**, um arquivo
   com veredito APROVADO cujo `Commit revisado` é o HEAD atual da branch declarada. Um eixo
   aprovado e outro reprovado não arquiva, e a ordem em que foram corrigidos não importa.
2. A árvore de trabalho está limpa. Alteração não commitada não foi revisada por ninguém.
3. Todas as tarefas estão marcadas `[x]`.
4. `proposta.md` existe e declara os três metadados.

Se houver aprovação de um eixo, mas apontando para um commit anterior, o HEAD avançou depois
da revisão: a mudança foi alterada e não está revisada. Diga qual eixo precisa rodar de novo e
pare.

Sem a pasta `revisao/`, não há aprovação — a palavra do operador não é precondição. Diga que o
`/sdd-review` ainda não rodou nesta mudança e pare.

Tarefa pendente com trabalho já feito não é motivo para arquivar: é motivo para voltar ao
`/sdd-implement` e marcar.

## Passo 2 - Aplicar os deltas

Só quando `deltas.md` existir. Antes de aplicar, leia
`.github/skills/sdd-workflow/references/specs-e-deltas.md`.

Leia `.sdd/specs/index.md` e o `spec.md` de cada capacidade citada. Depois, para cada
entrada:

- `ADICIONAR`: acrescente o requisito ao fim da capacidade, alocando o próximo número da
  sequência. Número nunca é reaproveitado, mesmo que haja lacuna. Se a capacidade não
  existir, crie a pasta, o `spec.md` e a linha no índice.
- `SUBSTITUIR`: troque o corpo do requisito alvo pelo texto do delta, mantendo o
  identificador.
- `REMOVER`: apague o requisito alvo e seus cenários. O número fica vago.

O texto do delta é copiado literalmente. Não reescreva, não reinterprete, não ajuste
estilo, não corrija concordância.

Se qualquer alvo não existir, pare antes de escrever qualquer arquivo e reporte. Aplicação
parcial deixa `specs/` num estado que não corresponde a nenhuma mudança.

Não toque em nada além dos `spec.md` citados e do índice. Não reordene requisitos, não
reformate o que não foi tocado.

## Passo 3 - Promover as decisões

Só quando `design.md` existir e contiver decisão marcada `Durabilidade: permanente`. Antes de
promover, leia `.github/skills/sdd-workflow/references/decisoes.md`.

Leia `.sdd/decisoes/index.md`. Para cada decisão permanente, em ordem de aparição no design:

1. Aloque o próximo `DEC-<numero>` da sequência global, sempre com três dígitos e zeros à
   esquerda. Número nunca é reaproveitado.
2. Crie `.sdd/decisoes/DEC-<numero>-<slug>.md` com o cabeçalho e o texto das quatro partes,
   **copiado literalmente** do `design.md`. Data é a de hoje; Mudança é o change-id;
   Capacidades é o campo homônimo da decisão; Estado nasce `vigente`.
3. Se houver `Substitui: DEC-<alvo>`, troque o `Estado` do alvo para
   `substituída por DEC-<numero>`. Não edite o texto do alvo.
4. Acrescente a linha no índice.

Se um alvo de `Substitui:` não existir, pare antes de escrever qualquer arquivo. Mesma regra
dos deltas: a marcação foi escrita contra um estado que já mudou.

Decisão marcada `local` não é promovida. Ela vai para o archive dentro do `design.md`, como
sempre foi.

Este passo não julga. Se a decisão está marcada como permanente e tem as quatro partes, ela
sobe. Se falta parte, isso era achado do `/sdd-review` e a mudança não deveria estar aprovada:
pare e reporte.

## Passo 4 - Mover

Crie `.sdd/changes/archive/AAAA-MM-DD-<change-id>/` com a data de hoje e mova a pasta
inteira da mudança para lá, incluindo `briefing.md`, `design.md`, `deltas.md` e a pasta
`revisao/` completa. Nada é apagado nem reescrito na movimentação — `revisao/` é o registro de
que a mudança foi auditada, e é a primeira coisa que uma auditoria procura.

## Passo 5 - Conferir

Confira que a pasta original não existe mais em `.sdd/changes/`, que o destino contém os
mesmos arquivos, e que cada decisão promovida aparece no índice com o mesmo identificador do
arquivo criado.

Não comite e não abra pull request. Esta etapa escreve dentro de `.sdd/` e não mexe no Git.

## Saída

No máximo doze linhas: caminho de destino; arquivos movidos; capacidades alteradas;
contagem de operações por tipo, adicionar, substituir e remover; capacidades criadas, se
houver; decisões promovidas, com identificador e título; decisões substituídas; pendências que
impediram o arquivamento, se houver.
