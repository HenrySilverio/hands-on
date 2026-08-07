---
agent: agent
model: Claude Opus 5 (copilot)
tools: ["read/readFile", "search", "execute", "edit/createFile"]
description: SDD - audita uma mudança em dois eixos independentes, padrões e especificação, e grava os dois vereditos.
---

# /sdd-review

Auditar. Esta etapa não corrige nada: ela emite veredito.

Dois eixos, dois vereditos. Código pode cumprir a proposta inteira e violar todo padrão do
repositório, ou o contrário. Veredito único deixa o eixo que passou esconder o que falhou.

A única escrita permitida é criar arquivo novo em `.sdd/changes/<change-id>/revisao/`. Este
prompt declara apenas criação de arquivo, nunca edição: o revisor não consegue alterar arquivo
que já existe, e portanto não consegue mexer no código que audita nem reescrever um veredito
anterior. Criar arquivo novo em outro caminho ele ainda conseguiria — fechar isso é allowlist
da organização, não prosa deste arquivo.

## Entradas

Mudança: ${input:changeId:change-id, ou vazio para listar as abertas}

Eixo: ${input:eixo:padroes, spec, ou vazio para os dois}

## Passo 0 - Contrato e diff

Leia `.github/skills/sdd-workflow/SKILL.md` e
`.github/skills/sdd-workflow/references/eixos-de-revisao.md`. As regras dos dois eixos e o
formato do registro de veredito estão lá; este prompt não os repete.

Se a mudança vier vazia ou inexistente, liste as opções e pare.

Se `eixo` vier preenchido, execute **somente** aquele eixo e grave somente o veredito dele. Se
vier vazio, execute os dois, nesta ordem.

Leia `Branch` e `Base` no topo de `proposta.md`. **Leia apenas os metadados neste passo; não
leia o corpo da proposta ainda** — a independência do eixo 1 depende disso.

Confira o estado da árvore de trabalho **antes de olhar o diff**. Se houver alteração não
commitada em arquivo de código, pare e diga que há commit pendente, qualquer que seja o diff.
Não comite. Revisar com trabalho fora do commit aprova um estado que o arquivamento não
consegue conferir depois.

Com a árvore limpa, obtenha o diff entre `Base` e `Branch` e o HEAD atual de `Branch`. Se o
diff vier vazio, pare e reporte: revisão sem diff é opinião.

Rodar os dois eixos em dois chats separados é mais forte que rodar em um. Use o parâmetro
`eixo` quando a mudança for grande ou sensível.

---

# EIXO 1 - Padrões

Roda primeiro e **não lê a proposta**. Aplique a seção "Eixo 1 - Padrões" da referência: ordem
de carga das instructions, regra do `applyTo`, baseline, formato do achado e regra de promoção
a lint.

Feche com o veredito de padrões, pelas condições da referência.

---

# EIXO 2 - Especificação

Quando os dois eixos rodam na mesma sessão, este só começa depois de fechado o veredito de
padrões, e não revisita os achados dele. Numa sessão `eixo=spec`, comece direto aqui.

## Passo 2.0 - Artefatos e validador

Leia `proposta.md` e `tarefas.md`.

Se `deltas.md` existir, leia `deltas.md`, `.github/skills/sdd-workflow/references/specs-e-deltas.md`,
`.sdd/specs/index.md` e o `spec.md` de cada capacidade citada nos deltas.

Se `design.md` existir, leia `design.md`,
`.github/skills/sdd-workflow/references/decisoes.md`, `.sdd/decisoes/index.md`, e o `DEC-...`
de cada decisão vigente cujo assunto o design toca — sem o corpo do registro não há como
detectar contradição.

Não leia `briefing.md`. O acordo auditável é a proposta.

Rode `node .sdd/sdd.mjs validate <change-id>`, se o arquivo existir, **antes** de julgar
qualquer coisa. Os portões sintáticos precisam estar respondidos antes dos Passos 2.3 e 2.4,
que dependem deles para não gastar raciocínio em conferência mecânica. Não conserte falha;
registre e siga.

## Passo 2.1 - Critérios contra código

Para cada critério de aceite, localize a implementação e o teste que o cobrem. Registre uma
das três situações: coberto, coberto parcialmente, ou não coberto.

Critério coberto por código sem teste é parcial, não coberto.

## Passo 2.2 - Tarefas contra realidade

Toda tarefa marcada `[x]` precisa ter evidência: arquivo alterado ou comando executado.
Tarefa marcada sem evidência é achado, não detalhe.

Todo agrupamento com tarefas concluídas, **exceto o de Verificação**, precisa ter o
comportamento da linha `Demonstra:` observável no código. Agrupamento fechado que não
demonstra nada é fatia horizontal disfarçada, e é achado.

## Passo 2.3 - Conferir os deltas

Só quando `deltas.md` existir.

Verifique nas duas direções:

- Todo critério de aceite que descreve comportamento observável novo ou alterado tem
  delta correspondente. Critério sem delta significa que o sistema vai mudar sem que a
  spec registre.
- Todo delta tem critério de aceite correspondente. Delta sem critério é escopo entrando
  pela porta dos fundos: comportamento que ninguém negociou e ninguém testou.

Verifique os alvos e o texto pelas regras de `references/specs-e-deltas.md`. Delta que
descreve a intenção em vez de trazer o texto final não é aplicável mecanicamente e reprova.

## Passo 2.4 - Conferir as decisões

Só quando `design.md` existir.

- Toda decisão marcada `permanente` traz as quatro partes completas, com alternativa
  descartada e consequência aceita, e a linha `Capacidades`. É esse texto que vai ser copiado.
- Nenhuma decisão permanente contradiz uma vigente sem declarar `Substitui:`.
- A classificação `local` ou `permanente` de cada decisão resiste aos três testes do SKILL.md.
  Decisão durável marcada como local some no archive; decisão trivial marcada como permanente
  transforma `decisoes/` no archive de novo.

Presença de `Durabilidade` e existência do alvo de `Substitui:` são portões mecânicos: não
gaste raciocínio neles, rode o validador.

## Passo 2.5 - Verificação

Rode lint, checagem de tipos e testes, se os comandos estiverem declarados no agrupamento de
verificação. Não conserte falha; reporte.

## Passo 2.6 - Veredito de especificação

Feche pelas condições da seção "Vereditos" da referência.

---

## Passo 3 - Gravar

Crie um arquivo por eixo executado em `.sdd/changes/<change-id>/revisao/`, no nome e no
formato da referência. Nunca sobrescreva arquivo existente. Não escreva mais nada.

## Saída

No máximo vinte e cinco linhas, nesta ordem: veredito de padrões e seus achados em ordem de
gravidade, cada um com arquivo, linha e a regra ou item citado; recomendações de promoção a
lint; veredito de especificação e seus achados, cada um com o artefato e o que está errado;
resultado do validador e dos comandos de verificação; o que precisa acontecer para aprovar
cada eixo.

Não declare vencedor entre os eixos e não produza veredito consolidado. O arquivamento exige
os dois APROVADO; um não compensa o outro.

Não proponha o código da correção.
