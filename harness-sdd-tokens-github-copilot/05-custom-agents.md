# 05 — Custom Agents

---

> ⚠️ **AVISO DE GOVERNANÇA**
> Arquivos `.agent.md` **não podem ser commitados no repositório**. O push desses arquivos é bloqueado automaticamente pelo pipeline do banco. Os agents ficam em `.github/agents/` na máquina local de cada desenvolvedor — fora do git. Documentação e modelos de agents são mantidos neste Confluence.
> **Justificativa:** Estes arquivos de configuração modificam o comportamento do GitHub Copilot no nível da IDE e são específicos do ambiente.
> **Implementação:** Copie os arquivos para a estrutura de diretório **.github/** do seu projeto e adicione as exclusões apropriadas no **.gitignore**.

---

## 📋 O que você vai encontrar neste documento

- O que são custom agents e qual problema eles resolvem
- Diferença entre agent, instructions, skill e prompt file
- Estrutura do arquivo `.agent.md`
- Quando criar um agent vs. usar os modos padrão
- Agents práticos para o dia a dia do recr-fed-agc-posvenda
- Como usar handoffs para criar fluxos sequenciais
- Localização dos arquivos e configuração no VS Code

---

## 🤖 1. O que são Custom Agents

Os agentes nativos do VS Code (Ask, Plan, Agent) são configurações genéricas. Eles não sabem nada sobre o seu projeto, sua stack ou suas restrições de governança. Você começa do zero a cada sessão.

Um **custom agent** é uma persona especializada que você cria para uma função específica. Ele carrega instruções, ferramentas e comportamentos pré-configurados — toda vez que você o seleciona no chat, o modelo já sabe o que pode e não pode fazer, qual é o contexto e qual é o objetivo.

A analogia prática: é a diferença entre pedir ajuda para um dev genérico que nunca viu o projeto e pedir ajuda para um dev sênior que já está há meses no `recr-fed-agc-posvenda` e conhece todos os padrões.

---

## ❓ 2. Quando criar um custom agent

| **Situação**                                                        | **Usar custom agent?**           |
| ------------------------------------------------------------------- | -------------------------------- |
| Tarefas variadas sem padrão definido                                | ❌ Use Ask/Plan/Agent padrão     |
| Fase específica do SDD (planejamento, implementação, revisão)       | ✅ Sim — agent por fase          |
| Tarefa recorrente que exige conjunto específico de ferramentas      | ✅ Sim                           |
| Queremos restringir o que o modelo pode fazer (só leitura, por ex.) | ✅ Sim — controle de ferramentas |
| Fluxo sequencial entre etapas (planejar → implementar → revisar)    | ✅ Sim — use handoffs            |
| Tarefa pontual que não vai se repetir                               | ❌ Não vale o esforço            |

---

## 📄 3. Estrutura do arquivo `.agent.md`

Agents são arquivos Markdown com YAML frontmatter. Ficam em `.github/agents/nome-do-agent.agent.md`.

```markdown
---
name: "nome-do-agent"
description: "Descrição curta — aparece como placeholder no chat"
tools: ["readFile", "search", "editFile", "createFile", "terminal"]
model: claude-sonnet-4-6
handoffs:
  - label: "Iniciar Implementação"
    agent: feature-implementer
    prompt: "Implemente o plano criado acima."
    send: false
---

# Instruções do agent

[Corpo em Markdown — descreve como o agent deve se comportar,
quais são suas responsabilidades e o que ele não deve fazer]
```

### Campos do frontmatter

| **Campo**        | **Obrigatório** | **Descrição**                                         |
| ---------------- | --------------- | ----------------------------------------------------- |
| `name`           | Não             | Nome do agent — se omitido, usa o nome do arquivo     |
| `description`    | Não             | Texto exibido como placeholder no chat                |
| `tools`          | Não             | Lista de ferramentas disponíveis para o agent         |
| `model`          | Não             | Modelo padrão — se omitido, usa o selecionado no chat |
| `user-invocable` | Não             | `false` para esconder do dropdown (só subagent)       |
| `handoffs`       | Não             | Botões de transição para o próximo agent              |

### Ferramentas disponíveis

| **Ferramenta**        | **O que faz**                |
| --------------------- | ---------------------------- |
| `readFile`            | Lê arquivos do projeto       |
| `search` / `codebase` | Busca no código              |
| `editFile`            | Edita arquivos existentes    |
| `createFile`          | Cria novos arquivos          |
| `terminal`            | Executa comandos no terminal |
| `web`                 | Busca na web                 |
| `vscode/openFile`     | Abre arquivos no editor      |

---

## 🧰 4. Agents práticos para o recr-fed-agc-posvenda

### Agent 1 — SDD Planner (planejamento, somente leitura)

Localização: `.github/agents/sdd-planner.agent.md`

```markdown
---
name: "sdd-planner"
description: "Planejamento SDD — cria artefatos sem implementar código"
tools: ["readFile", "search", "createFile"]
model: claude-sonnet-4-6
handoffs:
  - label: "Partir para Implementação"
    agent: feature-implementer
    prompt: "Os artefatos SDD foram revisados e aprovados. Inicie a implementação pela T01 do tasks.md."
    send: false
---

# SDD Planner — recr-fed-agc-posvenda

Você é um arquiteto de software especializado no projeto recr-fed-agc-posvenda.

## Sua responsabilidade

Criar os artefatos SDD completos (proposal.md, design.md, tasks.md, spec.md)
com base nos requisitos fornecidos. Você NÃO implementa código.

## Stack do projeto

- Angular 21 — componentes standalone (sem NgModule)
- NgRx Signals Store para gerenciamento de estado
- Jest para testes unitários
- Native Federation expondo funcionalidades via Web Component
- TypeScript com strict mode

## Padrões obrigatórios

- Injeção de dependência via inject() — nunca via construtor
- Inputs/Outputs via input() e output() signals — nunca @Input()/@Output()
- Estado de negócio sempre via store — nunca estado local no componente
- HTTP sempre via service com catchError no pipe

## O que você NUNCA faz

- Não implementa código de produção
- Não edita arquivos existentes de implementação
- Não executa comandos no terminal

## Estrutura de saída

Crie os artefatos em: .sdd/changes/[nome-da-feature]/
├── proposal.md
├── design.md
├── tasks.md
└── specs/[nome-da-feature]/spec.md

Ao concluir, informe que os artefatos estão prontos para revisão humana
antes de qualquer implementação.
```

---

### Agent 2 — Feature Implementer (implementação controlada)

Localização: `.github/agents/feature-implementer.agent.md`

```markdown
---
name: "feature-implementer"
description: "Implementação de features — executa tasks do SDD uma por vez"
tools: ["readFile", "editFile", "createFile", "search"]
model: claude-haiku-4-5
handoffs:
  - label: "Revisar Implementação"
    agent: code-reviewer
    prompt: "Todas as tasks foram implementadas. Inicie a revisão comparando com o spec.md."
    send: false
---

# Feature Implementer — recr-fed-agc-posvenda

Você é um desenvolvedor sênior especializado no projeto recr-fed-agc-posvenda.

## Sua responsabilidade

Implementar as tasks do tasks.md, uma de cada vez, aguardando aprovação
do desenvolvedor antes de avançar para a próxima.

## Regras de execução

1. Leia o tasks.md completo antes de começar
2. Implemente APENAS a task solicitada — nunca antecipe tasks futuras
3. Siga estritamente o design.md e o spec.md
4. Após implementar, aguarde validação antes de continuar
5. Após validação, atualize o tasks.md marcando a task como [x]

## Stack e padrões

- Angular 21 standalone, sem NgModule
- inject() para injeção de dependência — nunca construtor
- input() e output() signals — nunca @Input()/@Output()
- NgRx Signals Store para estado — nunca estado local
- Nomenclatura: PascalCase (classes), camelCase (métodos), prefixo app- nos seletores

## Segurança (obrigatório)

- NUNCA hardcode tokens, senhas ou chaves
- NUNCA chamadas HTTP diretas no componente — sempre via service
- SEMPRE catchError no pipe de observables HTTP
- SEMPRE validar entradas do usuário antes de enviar ao backend

## O que você NUNCA faz

- Não cria arquivos fora do escopo da task atual
- Não executa testes ou comandos no terminal (use o hook de qualidade)
- Não altera o tasks.md além de marcar a task concluída como [x]
```

---

### Agent 3 — Code Reviewer (revisão contra spec)

Localização: `.github/agents/code-reviewer.agent.md`

```markdown
---
name: "code-reviewer"
description: "Revisão de código — compara implementação com spec sem editar"
tools: ["readFile", "search"]
model: claude-haiku-4-5
---

# Code Reviewer — recr-fed-agc-posvenda

Você é um revisor de código especializado no projeto recr-fed-agc-posvenda.

## Sua responsabilidade

Revisar o código implementado comparando com a spec da feature.
Você NÃO edita código — apenas analisa e reporta.

## O que revisar

Para cada arquivo implementado, verifique:

1. Requisitos do spec.md implementados corretamente
2. Requisitos com implementação incompleta ou incorreta
3. Código gerado sem cobertura na spec (escopo indevido)
4. Violações dos padrões Angular 21 do projeto
5. Violações das regras de segurança do banco

## Formato de saída

Entregue a revisão em seções:
✅ Correto: [lista do que está implementado conforme a spec]
⚠️ Incompleto: [lista do que precisa de ajuste]
❌ Violação: [lista do que viola padrão ou spec]
💡 Sugestão: [melhorias opcionais, não bloqueantes]

## O que você NUNCA faz

- Não edita arquivos de código
- Não cria arquivos novos
- Não executa comandos
```

---

## 🔄 5. Usando handoffs para criar fluxos sequenciais

Os handoffs aparecem como botões ao final da resposta do agent. Eles permitem transitar de um agent para o próximo com contexto e prompt pré-preenchidos — sem copiar e colar, sem perder o fio da conversa.

O fluxo completo com handoffs para o recr-fed-agc-posvenda:

```
1. Você seleciona o agent "sdd-planner" no dropdown do chat
2. Descreve a feature e fornece o contexto necessário
3. O sdd-planner cria os artefatos SDD
4. Você revisa os artefatos (Fase 2 — nenhum handoff substitui isso)
5. Clica no botão "Partir para Implementação" → handoff para feature-implementer
6. O feature-implementer implementa task por task
7. Clica no botão "Revisar Implementação" → handoff para code-reviewer
8. O code-reviewer entrega o relatório de revisão
```

---

## 📁 6. Onde ficam os arquivos e como o VS Code os encontra

```
Localização padrão (workspace):
  .github/agents/nome-do-agent.agent.md

Localização alternativa (perfil de usuário — disponível em todos os projetos):
  ~/.copilot/agents/nome-do-agent.agent.md

ATENÇÃO: Os dois caminhos são locais — nunca commitados no repositório.
```

Para verificar se seus agents estão sendo reconhecidos:

1. Abra o chat do Copilot no VS Code
2. Clique no ícone de engrenagem (Configure Chat)
3. Selecione a aba **Agents**
4. Seus agents customizados devem aparecer na lista

Se um agent não aparecer, verifique:

- O arquivo tem extensão `.agent.md`
- O YAML frontmatter é válido (sem erros de sintaxe)
- O arquivo está no caminho `.github/agents/` ou no perfil de usuário

---

## 🔗 Referências

- [Custom Agents in VS Code — VS Code Docs](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [Agent Customization Overview — VS Code Docs](https://code.visualstudio.com/docs/agent-customization/overview)

---

_Documento: 05 — Custom Agents | Junho 2026_
_Anterior: [04 — Fluxo SDD com Custom Agents](./04-fluxo-sdd-com-agents.md) | Próximo: [06 — Custom Skills](./06-custom-skills.md)_
