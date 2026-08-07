---
name: sdd-workflow
description: Fluxo guiado por especificação sobre a pasta .sdd/ do repositório. Use SEMPRE que o pedido envolver planejar, propor, implementar, revisar ou arquivar uma mudança, e sempre que aparecerem os termos briefing, proposta, critério de aceite, tarefas, delta, capacidade, decisão, fatia vertical, ou os comandos /sdd-plan, /sdd-implement, /sdd-review, /sdd-archive. Use também quando pedirem para criar ou alterar algo sem que exista proposta: a resposta correta é abrir a proposta antes de escrever código.
---

# SDD - Contrato de fluxo

Fonte única de verdade do fluxo. Os quatro prompts são invocadores finos deste contrato.

## Escopo

Processo e artefatos. Não cobre stack, framework nem padrões de código.

As regras técnicas vivem nas instructions do projeto. O `/sdd-review` é a única etapa que
**audita** contra elas, e só no eixo de padrões. As outras etapas consultam apenas o que uma
regra deste contrato citar nominalmente: padrão de nome de branch e padrão de teste.

## Dependências

Git, apenas em leitura. Node 18+ para o validador, que é opcional. Sem CLI própria, sem npm,
sem binário.

## 1. Estrutura

Na raiz do repositório:

| Caminho                                        | Papel                                                                   |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| `docs/briefings/<assunto>.md`                  | entrada crua, escrita à mão. Fica fora de `.sdd/`                       |
| `.sdd/specs/index.md`                          | índice das capacidades. Único arquivo de `specs/` lido sem critério     |
| `.sdd/specs/<capacidade>/spec.md`              | comportamento atual do sistema naquela capacidade                       |
| `.sdd/decisoes/index.md`                       | índice das decisões permanentes. Pequeno por construção                 |
| `.sdd/decisoes/DEC-<numero>-<slug>.md`         | uma decisão arquitetural durável                                        |
| `.sdd/changes/<change-id>/proposta.md`         | metadados, intenção, escopo, restrições e critérios de aceite           |
| `.sdd/changes/<change-id>/design.md`           | decisões técnicas. Opcional, só em rigor Full                           |
| `.sdd/changes/<change-id>/tarefas.md`          | checklist de implementação, em fatias verticais                         |
| `.sdd/changes/<change-id>/deltas.md`           | alterações a aplicar em `specs/`. Só se houver mudança de comportamento |
| `.sdd/changes/<change-id>/revisao/`            | um arquivo por eixo revisado. Escrito pelo `/sdd-review`                |
| `.sdd/changes/<change-id>/briefing.md`         | cópia do briefing original, feita no planejamento                       |
| `.sdd/changes/archive/AAAA-MM-DD-<change-id>/` | mudanças concluídas                                                     |
| `.sdd/sdd.mjs`                                 | validador dos portões mecânicos. Opcional                               |

Ausência de `.sdd/changes/` equivale a nenhuma mudança aberta, e não é erro.

Três camadas, três perguntas diferentes:

| Camada       | Responde                        | Tempo verbal              | Muda quando        |
| ------------ | ------------------------------- | ------------------------- | ------------------ |
| `specs/`     | o que o sistema **faz** hoje    | presente do indicativo    | no arquivamento    |
| `decisoes/`  | **por que** ele é assim         | passado, com alternativas | no arquivamento    |
| `changes/`   | o que uma mudança **vai fazer** | futuro                    | durante a mudança  |

`specs/` sem `decisoes/` produz um sistema documentado que ninguém entende: seis meses depois
ninguém sabe por que o contrato é aquele, e a alternativa descartada volta como proposta.
`decisoes/` sem `specs/` produz o inverso. As duas são absorvidas pelo mesmo comando, no mesmo
momento, pelo mesmo mecanismo de cópia literal.

## 2. Entradas do fluxo

O planejamento recebe duas coisas:

| Entrada  | Natureza                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------- |
| briefing | obrigatório. Arquivo do usuário em `docs/briefings/` com a necessidade, as restrições e o que não pode ser feito |
| contexto | opcional. Zero ou mais caminhos de arquivo: alvos da alteração, contrato, mapa de dependências, o que for        |

Trate qualquer entrada de contexto como material de leitura, seja qual for a origem. Não
assuma formato, não assuma ferramenta que a gerou, não invente caminho que não foi passado.

O briefing é matéria-prima descartável: as restrições dele são transcritas para a proposta no
planejamento, e daí em diante a proposta é o acordo. A cópia em `briefing.md` existe só para
auditoria no archive. Nenhuma etapa depois do planejamento lê essa cópia — reler o pedido
original convida a reabrir decisão que já foi negociada.

Um marcador `[NÃO RESPONDIDO]` no briefing é uma pergunta que ninguém respondeu. Trate como
ambiguidade: se ela impede escrever um critério verificável, pare. Se não impede, planeje e
devolva a pergunta na saída.

## 3. change-id e Git

Change-id em kebab-case, iniciado por verbo, no máximo quatro palavras. **Chave de ticket vai
dentro da proposta, nunca no id.**

A proposta declara três metadados no topo, antes da primeira seção: `Ticket`, `Branch` e
`Base`. `Branch` é onde a implementação acontece. `Base` é a branch de integração — aquela em
que a mudança vai aterrissar; na dúvida, a branch padrão do remoto.

O padrão de nome de branch vem das instructions do projeto. Se não houver padrão declarado,
use o próprio change-id.

**Nenhum prompt deste fluxo instrui escrita em Git.** Não crie branch, não comite, não abra
pull request, não mude o estado do repositório fora de `.sdd/`. O que o fluxo faz é se recusar
a trabalhar no lugar errado: a implementação para se a branch atual não for a declarada, e a
revisão para se não conseguir determinar o diff contra a base.

Isto é uma regra do contrato, não uma trava técnica: três prompts declaram terminal porque
precisam rodar teste, lint e `mv`. Se a sua organização quiser a garantia de verdade,
restrinja a allowlist de comandos do Copilot a leitura de Git, movimentação de arquivo e os
comandos de build.

Commitar é do operador, e o momento é o fechamento de cada fatia. A rastreabilidade que
interessa numa auditoria — ticket, change-id, branch — está escrita na proposta desde o
planejamento.

## 4. Rigor

Padrão é Lite: proposta e tarefas, sem design.

Suba para Full, com design obrigatório, se houver ao menos um:

- mudança de contrato entre camadas;
- operação irreversível ou migração de dados;
- exigência regulatória ou de segurança;
- mais de um repositório envolvido;
- decisão durável, pelos três testes abaixo;
- substituição de uma decisão vigente em `.sdd/decisoes/`.

Tocar `specs/` não sobe o rigor. Quase toda mudança útil altera comportamento observável; se
isso bastasse para exigir design, o rigor Lite deixaria de existir na prática.

### Os três testes da decisão durável

Uma decisão é durável quando as três valem ao mesmo tempo:

1. **Difícil de reverter.** Mudar de ideia depois custa migração, quebra de contrato ou
   retrabalho em mais de um lugar.
2. **Surpreendente sem contexto.** Quem lê só o código pergunta "por que assim?".
3. **Trade-off real.** Existia alternativa defensável, descartada por um motivo que pode
   deixar de valer.

Falhou uma das três, é decisão local: fica no `design.md` e vai para o archive com a mudança.
Escolher entre duas bibliotecas equivalentes não é decisão durável. Amarrar formato de dado,
contrato entre camadas ou modelo de consistência por anos, é.

### Reclassificação

A implementação pode revelar uma decisão durável numa mudança classificada como Lite. Nesse
caso a implementação **para e reporta**, como em qualquer divergência, e o operador reinvoca
`/sdd-plan` no mesmo change-id: o rigor sobe, `design.md` nasce, e o motivo entra em
`## Divergências`.

Nenhuma outra etapa registra decisão. Se o implement pudesse, a decisão deixaria de ser acordo
prévio e viraria justificativa do que já foi feito.

## 5. Formato

Leia `references/moldes-artefatos.md` antes de escrever qualquer artefato.

Se um molde impedir escrever um critério verificável, o molde perde: critério verificável é o
produto, molde é o formato. Mas o desvio vai registrado em `## Divergências` na proposta.
Desvio silencioso de molde é o mesmo defeito de expandir escopo em silêncio — a etapa
seguinte compara o plano com a entrada, encontra diferença e não tem como saber se foi
julgamento ou descuido.

Carregue sob demanda, e só isto: `references/specs-e-deltas.md` quando a mudança consultar ou
alterar comportamento registrado em `specs/`; `references/decisoes.md` quando `design.md`
existir ou for gerado; `references/eixos-de-revisao.md` apenas no `/sdd-review`. Fora disso,
não carregue: é contexto pago sem retorno.

Regra de tarefas, que vale em todas as etapas: toda tarefa é item de checklist markdown.
Pendente usa `- [ ]`, concluída usa `- [x]`, com x minúsculo. Nunca use outro marcador,
nunca risque texto, nunca remova tarefa concluída. O arquivo é o controle de progresso.

## 6. Fatia vertical

Cada agrupamento de `tarefas.md`, **exceto o de Verificação**, é uma fatia vertical: atravessa
todas as camadas necessárias para produzir comportamento demonstrável, e cabe numa sessão.

Agrupar por camada — todo o backend, depois todo o frontend — é proibido. Fatia horizontal
não entrega nada até a última landar, esconde a dependência entre camadas até tarde demais, e
transforma qualquer interrupção em trabalho pela metade.

Teste, aplicado a cada agrupamento: **o que dá para demonstrar quando ele fechar?** A resposta
tem que ser comportamento observável, não "a camada de serviço está pronta".

Prefactor vem primeiro, no seu próprio agrupamento, nunca misturado com feature.

Se a mudança não couber em poucos agrupamentos, isso não é um plano grande: são duas mudanças.
Declare a linha de corte na proposta e planeje a primeira.

## 7. Portões de qualidade

Estes exigem julgamento e são conferidos pela etapa:

- Todo critério de aceite é verificável, ou seja, daria para escrever um teste a partir dele.
- Todo critério aparece em ao menos uma tarefa.
- Todo critério que descreve comportamento observável novo ou alterado tem delta correspondente.
- Toda tarefa tem critério de conclusão observável, e todo agrupamento, exceto o de
  Verificação, demonstra comportamento e não estado de camada.
- Toda decisão marcada como permanente traz alternativa descartada e consequência aceita.
- Nenhuma decisão permanente contradiz uma vigente sem declarar qual está substituindo.
- Nenhuma restrição declarada no briefing foi violada pelo plano.
- Toda contradição entre entrada e realidade que alterou escopo, restrição ou critério está
  registrada em `## Divergências`. Divergência ausente vira reprovação de algo correto.

Os portões **mecânicos** — formato de campo, alvo inexistente, ciclo no grafo de bloqueio — não
estão enumerados aqui de propósito. Rode `node .sdd/sdd.mjs validate <change-id>` ao encerrar
o planejamento e ao encerrar a implementação, e corrija o que ele apontar. Se o Node não
estiver disponível, os mesmos itens estão nos moldes, que você carrega para escrever.

Regra em markdown é cobrada em token toda vez que carrega; regra em código custa zero, sempre.

## 8. Limites

- Não escreva código de produção no planejamento.
- Não altere a proposta durante a implementação. Se a realidade contradisser o plano, pare
  e reporte antes de seguir.
- Não edite `.sdd/specs/` nem `.sdd/decisoes/` fora do arquivamento. As duas são acordo
  prévio, não registro do que foi feito; implementação que edita spec ou decisão transforma
  uma coisa na outra.
- Não marque tarefa como concluída sem evidência: comando executado ou arquivo alterado.
- Ambiguidade não se resolve por suposição. Liste as perguntas e pare.
- Não crie, renomeie nem apague nada fora de `.sdd/` durante planejamento e arquivamento. A
  única exceção é a leitura do briefing e do contexto adicional.
- Não execute comando de escrita do Git em nenhuma etapa. Ler estado é permitido; mudar
  estado, não.
