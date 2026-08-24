---
agent: agent
model: Claude Sonnet 5 (copilot)
tools:
  ["read/readFile", "search", "edit/createFile", "edit/editFiles", "execute"]
description: SDD - executa as tarefas de uma mudança, marcando o checklist conforme conclui.
---

# /sdd-implement

Executar o checklist até que a implementação satisfaça os critérios de aceite.

## Entradas

Mudança: ${input:changeId:change-id, ou vazio para listar as abertas}

Contexto adicional: ${input:contexto:Caminhos separados por vírgula, ou vazio}

## Passo 0 - Contrato

Leia `.github/skills/sdd-workflow/SKILL.md`.

Se a mudança vier vazia, liste as pastas de `.sdd/changes/`, exceto archive, com a contagem
de tarefas concluídas sobre o total, e pare pedindo a escolha. Se vier inexistente, liste
as opções e pare.

## Passo 1 - Conferir a branch

Leia `Branch` no topo de `proposta.md` e compare com a branch atual do repositório.

Se forem diferentes, **pare**. Diga qual é a esperada e qual é a atual, e não faça nada. Não
crie a branch, não troque de branch, não comite: esta etapa lê o estado do Git e não o altera.

Implementar na branch errada produz uma mudança empilhada em cima de outra, que a revisão vai
julgar como escopo expandido e reprovar corretamente. É mais barato parar aqui.

Se `proposta.md` não declarar `Branch`, isso é defeito de planejamento. Pare e reporte.

## Passo 2 - Carregar na ordem certa

Leia proposta, depois design se existir, depois tarefas. Depois disso, e só depois, leia os
caminhos de contexto adicional e o código necessário.

Ler código antes de saber o que deve ser feito queima contexto e enviesa a solução para o
que já existe. As regras técnicas vêm das instructions do projeto e de outras skills; este
prompt não define nenhuma.

Não leia `briefing.md`, `deltas.md`, `.sdd/specs/` nem `.sdd/decisoes/`. A proposta é o acordo;
o resto é entrada de outra etapa e só ocuparia contexto.

## Passo 3 - Escolher o agrupamento

Execute **um** agrupamento por invocação, inclusive quando ele for o de Verificação. Escolha o
de menor número entre os pendentes cujos `Bloqueado por:` já estão inteiramente concluídos.

Se `tarefas.md` declarar `Precondição:` no topo, confira que ela está satisfeita antes de
escolher qualquer agrupamento. O caso comum é linha de base de refactor, que precisa estar
commitada contra o código antigo — e commitar não é desta etapa.

Se nenhum agrupamento estiver liberado, pare e diga o que falta fechar. Se todos estiverem
`[x]`, a mudança está pronta para o `/sdd-review`; se ela já foi reprovada, o caminho é
reinvocar o `/sdd-plan`, não improvisar aqui.

Se o agrupamento escolhido não couber nesta sessão, pare e reporte: fatia grossa é defeito de
planejamento, e quebrá-la aqui altera o plano em silêncio.

Um agrupamento fechado é uma fatia vertical demonstrável. É o ponto natural de commit, e é
por isso que ele é a unidade desta etapa.

## Passo 4 - Executar

Para cada tarefa pendente do agrupamento, em ordem:

1. Implemente a menor mudança que a satisfaz.
2. Rode a verificação correspondente, seja build, lint ou teste, quando aplicável.
3. Edite o arquivo de tarefas trocando `[ ]` por `[x]` naquela linha, somente após a
   verificação passar. Não altere o texto da tarefa, não reordene, não remova.
4. Se a tarefa se mostrar impossível ou errada, pare imediatamente e reporte. Não improvise
   caminho alternativo sem aprovação.

## Passo 5 - Divergência

Se um critério de aceite se revelar errado, incompleto ou inviável: pare de codificar,
descreva o critério afetado, o que a realidade mostrou e as opções, e aguarde decisão. Não
edite a proposta por conta própria.

Ajustar a proposta em silêncio para caber no código destrói o valor do fluxo: ela deixa de
ser acordo e vira registro do que já foi feito. O mesmo vale para `deltas.md`, `design.md`,
`.sdd/specs/` e `.sdd/decisoes/`, que esta etapa não edita em nenhuma hipótese.

Se a divergência for uma **decisão durável** que o plano não previu — pelos três testes do
SKILL.md — diga isso com todas as letras: a saída é reinvocar o `/sdd-plan` no mesmo
change-id para subir o rigor, não registrar a decisão aqui.

## Passo 6 - Fechamento

Ao concluir o agrupamento, confirme que o comportamento da linha `Demonstra:` acontece de
fato. O agrupamento de Verificação não tem `Demonstra:`: nele, o fechamento é a saída limpa
dos comandos.

Rode `node .sdd/sdd.mjs validate <change-id>`, se o arquivo existir. Erro do validador é
defeito de artefato e reprova na revisão; reporte, não conserte o plano.

**Commite nesta branch antes de invocar o `/sdd-review`.** O commit é seu, não meu: esta etapa
não escreve no Git. Mas sem ele o diff vem vazio e a revisão para — a fatia fechada é
exatamente o ponto em que o commit faz sentido.

## Saída

No máximo quinze linhas: branch conferida; agrupamento executado e o que ele demonstra;
tarefas concluídas nesta sessão, com número e título; arquivos criados ou alterados; resultado
do validador e dos comandos de verificação; agrupamentos ainda bloqueados e por quem;
divergências ou bloqueios; e o lembrete de commitar antes da revisão. Não reproduza diffs.
