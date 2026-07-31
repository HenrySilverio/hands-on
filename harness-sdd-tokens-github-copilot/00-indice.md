# GitHub Copilot no VS Code — Guia de Boas Práticas

## Documentação Técnica | Time de Desenvolvimento

---

> ⚠️ **AVISO DE GOVERNANÇA**
> Nenhum arquivo de configuração do GitHub Copilot (instructions, agents, skills, hooks, prompts) deve ser commitado no repositório. O push desses arquivos deve ser bloqueado. Toda configuração vive **localmente na máquina do desenvolvedor** e a documentação oficial fica neste Confluence. Consulte o time de arquitetura em caso de dúvidas sobre o que pode ou não entrar no repositório.
> **Justificativa:** Estes arquivos de configuração modificam o comportamento do GitHub Copilot no nível da IDE e são específicos do ambiente.
> **Implementação:** Copie os arquivos para a estrutura de diretório **.github/** do seu projeto e adicione as exclusões apropriadas no **.gitignore**.

---

## ℹ️ Sobre esta documentação

Esta documentação foi criada para o time de desenvolvimento do **RECR** e demais aplicações que utilizam o GitHub Copilot no VS Code com plano Copilot Business.

O objetivo é centralizar as boas práticas de uso, otimização de consumo de tokens e os recursos de personalização do Copilot — tudo adaptado à realidade do banco, com governança, exemplos reais e orientações práticas que vão do estagiário ao desenvolvedor sênior.

---

## 📖 Como usar esta documentação

Cada página abaixo é independente. Você pode ler na ordem ou ir direto ao tópico que precisa. Os documentos são completos — você não precisa consultar outra fonte para executar o que está descrito.

---

## 📚 Índice de Documentos

### 💰 Custos e Otimização

| **Doc**                                         | **Descrição**                                                                                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [01 — Tokens e Custos](./01-tokens-e-custos.md) | Como funciona a nova cobrança por uso, impacto financeiro de cada decisão, como escolher o modelo certo e estratégias para não estourar a cota |

---

### 🏗️ Metodologia de Desenvolvimento

| **Doc**                                                                  | **Descrição**                                                                                                                                      |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [02 — Harness Engineering](./02-harness-engineering.md)                  | O que é o harness no contexto do VS Code + Copilot, como o ecossistema se conecta e como otimizar o ambiente para extrair mais qualidade de código |
| [03 — Spec-Driven Development (SDD)](./03-sdd.md)                        | O que é SDD, por que adotar no banco, fluxo completo de uso manual (sem framework) e com OpenSpec, estrutura de arquivos e exemplos práticos       |
| [04 — Fluxo SDD com Agents especializados](./04-fluxo-sdd-com-agents.md) | Por que separar o fluxo em agents, o ganho real de qualidade e o passo a passo completo do sdd-planner ao code-reviewer                            |

---

### 🛠️ Personalização do Copilot

> Todos os recursos abaixo são configurados **localmente** e **nunca commitados no repositório**.

| **Doc**                                                 | **Descrição**                                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [05 — Custom Agents](./05-custom-agents.md)             | O que são agentes customizados, como criar, quando usar e exemplos práticos para o dia a dia                                   |
| [06 — Custom Skills](./06-custom-skills.md)             | O que são skills, diferença para instructions, como criar e quando usar capacidades especializadas reutilizáveis               |
| [07 — Custom Instructions](./07-custom-instructions.md) | O que são instructions, tipos disponíveis, o workaround oficial do banco para o `copilot-instructions.md` e exemplos completos |
| [08 — Hooks](./08-hooks.md)                             | O que são hooks, ciclo de vida do agente, como automatizar validações e garantir qualidade sem esforço manual                  |
| [09 — Prompt Files](./09-prompt-files.md)               | O que são prompt files (slash commands), como criar prompts reutilizáveis para tarefas recorrentes e exemplos prontos          |

---

## ⚙️ Contexto do ambiente

| **Item**                     | **Valor**                                                        |
| ---------------------------- | ---------------------------------------------------------------- |
| **Plano**                    | Copilot Business                                                 |
| **Ferramenta base**          | VS Code + GitHub Copilot                                         |
| **Stack de referência**      | Angular 21, NgRx Signals, Jest, Native Federation, Web Component |
| **Projeto de exemplo**       | `recr-fed-agc-posvenda`                                          |
| **Restrição de repositório** | Nenhum arquivo de configuração do Copilot pode ser commitado     |
| **Armazenamento de configs** | Local na máquina do desenvolvedor                                |
| **Armazenamento de docs**    | Este Confluence                                                  |

---

## 🤖 Modelos disponíveis (Assinatura Business)

### 🟣 Anthropic (Claude)

| **Modelo**       | **Uso recomendado**                        | **Custo relativo** |
| ---------------- | ------------------------------------------ | ------------------ |
| Claude Haiku 4.5 | Autocompletar, exploração, tarefas simples | $                  |
| Claude Sonnet 5  | Uso geral do dia a dia                     | $$                 |
| Claude Opus 4.8  | Tarefas complexas, análise arquitetural    | $$$                |

### 🔵 OpenAI (GPT)

| **Modelo**    | **Uso recomendado**                            | **Custo relativo** |
| ------------- | ---------------------------------------------- | ------------------ |
| GPT-5 mini    | Tarefas rotineiras de alto volume              | $                  |
| GPT-5.4 mini  | Completions rápidas, alto volume               | $                  |
| GPT-5.3 Codex | Refatoração e geração de código                | $$                 |
| GPT-5.4       | Fluxos corporativos e análises críticas        | $$                 |
| GPT-5.5       | Automações complexas, decisões de alto impacto | $$$                |

### 🟢 Google (Gemini)

| **Modelo**             | **Uso recomendado**                         | **Custo relativo** |
| ---------------------- | ------------------------------------------- | ------------------ |
| Gemini 3 Flash Preview | ⚠️ Experimental — não usar em produção      | $                  |
| Gemini 3.5 Flash       | Velocidade + raciocínio ágil                | $$                 |
| Gemini 3.1 Pro Preview | ⚠️ Alta complexidade — validar estabilidade | $$$                |

> **Regra de ouro:** use o modelo mais leve que resolve o problema. Suba de nível apenas quando o resultado for insatisfatório.

---

## 📋 Regras rápidas de governança

> ⛔ **PERMITIDO**
>
> - Criar arquivos de configuração (.instructions.md, .agent.md, hooks, SKILL.md) localmente
> - Manter configs pessoais em pasta local fora do git
> - Referenciar arquivos com #readFile e #fileSearch
> - Usar o chat em modo Ask, Plan e Agent com contexto controlado
>
> ⛔ **PROIBIDO**
>
> - Commitar qualquer arquivo de configuração do Copilot no repositório
> - Usar @workspace (lê o projeto inteiro e pode zerar a cota)
> - Usar modo Auto de modelos (perde controle de custo)
> - Ativar thinking em tarefas simples
> - Deixar multi-file edits sem #readFile explícito

---

## 💬 Dúvidas e contribuições

Encontrou algo desatualizado ou quer contribuir com um exemplo? Edite esta página no Confluence ou entre em contato com o time de arquitetura.

---

_Documentação técnica — GitHub Copilot no VS Code | Junho 2026_
