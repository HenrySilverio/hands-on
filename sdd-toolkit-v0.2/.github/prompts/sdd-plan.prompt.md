---
agent: agent
model: Claude Opus 5 (copilot)
tools: ["read/readFile", "search", "edit/createFile", "edit/editFiles", "execute"]
description: SDD - transforma um briefing em proposta, tarefas, decisões e deltas de especificação.
---

# /sdd-plan

Transformar um briefing em acordo escrito, antes de qualquer linha de código.

## Entradas

Briefing: ${input:briefing:Caminho do arquivo em docs/briefings/}

Replanejar: ${input:changeId:change-id existente, ou vazio para uma mudança nova}

Contexto adicional: ${input:contexto:Caminhos separados por vírgula, ou vazio}

## Passo 0 - Contrato

Leia `.github/skills/sdd-workflow/SKILL.md`.

Se o briefing vier vazio ou apontar para arquivo inexistente, pare e peça o caminho. Não
invente o conteúdo do pedido.

Se `Replanejar` vier preenchido, você está atualizando uma mudança existente, não criando
outra. Se o change-id informado não existir, pare e liste as mudanças abertas — não crie pasta
nova com nome parecido.

Replanejar é legítimo e tem um caso principal: a implementação parou reportando uma decisão
durável que o plano não previu, e o rigor precisa subir de Lite para Full. Ao replanejar,
preserve as tarefas já marcadas `[x]`, não renumere agrupamento existente, e registre o motivo
em `## Divergências`. Replanejamento silencioso é indistinguível de descuido.

Se `Replanejar` vier vazio e já existir mudança aberta para este briefing, pare e pergunte se
é para replanejar aquela. Duas pastas para o mesmo briefing é o começo de duas mudanças
concorrentes na mesma capacidade.

## Passo 1 - Ler as entradas

Leia o briefing inteiro. Depois leia os caminhos de contexto adicional, se houver.

Não leia código nesta etapa. Código lido antes de o problema estar claro enviesa o plano
para o que já existe e queima contexto que a etapa seguinte vai precisar.

Marcador `[NÃO RESPONDIDO]` no briefing é pergunta em aberto. Se impede escrever um critério
verificável, aplique a regra de parada da seção Saída. Se não impede, planeje e devolva a
pergunta na saída.

## Passo 2 - Extrair restrições

Liste o que o briefing declara como proibido, intocável ou obrigatório manter compatível.
Essa lista vira a seção de restrições da proposta, transcrita, não parafraseada.

Restrição perdida entre o briefing e a proposta é a falha mais cara do fluxo, porque só
aparece na revisão, quando o código já existe.

## Passo 3 - Estado atual

Leia `.sdd/specs/index.md`.

Decida quais capacidades do índice a mudança toca. Leia o `spec.md` apenas dessas. Nunca
leia `specs/` inteiro.

Se o índice estiver vazio, ou se a capacidade afetada não constar dele, isso significa
"não documentado", nunca "não existe". Nesse caso, e só nesse caso, leia o código dos
caminhos de contexto para entender o comportamento atual.

Antes de escrever qualquer delta, leia `.github/skills/sdd-workflow/references/specs-e-deltas.md`.

## Passo 4 - Decisões vigentes

Leia `.sdd/decisoes/index.md`, se existir. É pequeno por construção.

Se a mudança tocar o assunto de uma decisão vigente, leia só esse registro. Duas saídas
possíveis, e as duas vão declaradas na intenção da proposta: a proposta **respeita** a decisão,
e isso vira restrição; ou a proposta **substitui** a decisão, e isso exige rigor Full e a linha
`Substitui:` no design.

Replanejar por cima de uma decisão vigente sem citá-la é como a alternativa descartada volta
ao código.

## Passo 5 - Histórico

Liste as pastas de `.sdd/changes/`, exceto `archive/`. Se alguma mudança aberta tocar a
mesma capacidade, declare o conflito na proposta em vez de planejar por cima dela.

Consulte `.sdd/changes/archive/` apenas se precisar do motivo de uma decisão anterior, e
só a pasta relevante. O archive é auditoria, não leitura de rotina.

## Passo 6 - Classificar rigor

Aplique a regra de rigor do SKILL.md e declare o resultado, Lite ou Full, com o gatilho
que o justificou. Alterar `specs/` não sobe o rigor.

Os três testes da decisão durável estão na seção 4 do SKILL.md, que você já carregou. Se o
resultado for Full por decisão ou por substituição, leia
`.github/skills/sdd-workflow/references/decisoes.md` antes do Passo 8; nos outros casos, não.

## Passo 7 - Git

Determine a branch de integração do repositório, que vira `Base`, e a branch de trabalho, que
vira `Branch`. Leia o estado do Git; não o altere, não crie branch, não comite.

O nome da branch de trabalho segue o padrão das instructions do projeto. Se não houver padrão
declarado, use o change-id. Os três metadados vão no topo da proposta.

## Passo 8 - Gerar

Leia `.github/skills/sdd-workflow/references/moldes-artefatos.md`.

Escolha o change-id e crie `.sdd/changes/<change-id>/` com:

1. `briefing.md` — cópia literal do arquivo de briefing, sem edição, sem resumo e sem
   reformatação.
2. `proposta.md` — metadados, intenção, escopo, restrições, critérios de aceite.
3. `design.md` — apenas em rigor Full. Cada decisão com `Durabilidade` declarada.
4. `tarefas.md` — agrupamentos em fatia vertical, cada um com `Demonstra:` e `Bloqueado por:`.
   O agrupamento de Verificação é obrigatório, vem por último, e é o único sem `Demonstra:`.
5. `deltas.md` — apenas se a mudança alterar comportamento observável.

O texto de cada delta é final: ele será copiado para `specs/` no arquivamento sem
reescrita. O mesmo vale para o texto de cada decisão permanente, que será copiado para
`decisoes/`. Se você não consegue escrever o texto final agora, o critério de aceite
correspondente ainda está vago — corrija o critério, não adie o delta.

Não atribua número a requisito nem a decisão. Os números são alocados na aplicação.

Antes de terminar, confira os portões de julgamento do SKILL.md, com atenção aos de cobertura:
todo critério que descreve comportamento novo ou alterado tem delta e todo delta tem critério;
todo agrupamento, exceto o de Verificação, demonstra comportamento e não camada; toda decisão
permanente traz alternativa descartada e consequência aceita.

## Passo 9 - Validar

Rode `node .sdd/sdd.mjs validate <change-id>`, se o arquivo existir, e corrija o que ele
apontar antes de encerrar. Erro de validador que chega ao `/sdd-review` é token gasto em modelo
caro para achar o que um script de meio segundo já tinha achado.

Se o Node não estiver disponível, diga isso na saída e confira os moldes à mão.

## Saída

No máximo quinze linhas: change-id; rigor e gatilho; branch e base; arquivos criados;
capacidades consultadas; capacidades afetadas pelos deltas, com a contagem por operação;
decisões marcadas como permanentes; conflitos com decisão vigente ou mudança aberta; perguntas
em aberto. Não reproduza o conteúdo dos artefatos.

Se houver ambiguidade que impeça um critério de aceite verificável, não escreva nada:
liste as perguntas e pare.
