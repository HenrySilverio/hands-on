# Apresentação Hands-on — GitHub Copilot no VS Code
### Conteúdo de slides (a partir do slide 3) — baseado em workshop/docs-ai/

---

## Slide 3 — Cronograma

**Título do slide:** Cronograma da apresentação

| # | Título | Descrição (8–10 palavras) |
|---|--------|----------------------------|
| 1 | Tokens, Custos e Escolha de Modelo | Como a cobrança por uso muda seu dia a dia |
| 2 | Harness Engineering | O ambiente configurado ao redor do modelo de IA |
| 3 | Spec-Driven Development (SDD) | Especificação antes do código, em cinco fases |
| 4 | Custom Instructions | Padrões do projeto aplicados automaticamente em toda sessão |
| 5 | Custom Skills | Capacidades reutilizáveis carregadas sob demanda pela tarefa |
| 6 | Custom Agents | Personas especializadas com ferramentas e modelo restritos |
| 7 | Hooks e Prompt Files | Automação de qualidade e comandos padronizados para o time |
| 8 | Hands-on Prático | Montando o harness completo no recr-fed-agc-posvenda, ao vivo |

---

## Slide 4 — Tokens, Custos e Escolha de Modelo

**Título:** De assinatura fixa para consumo real

- Desde jun/2026: GitHub Copilot cobra por **GitHub AI Credits** (uso real, não mais mensalidade fixa)
- Token = unidade de processamento de texto — você paga para **ler** (input) e para **gerar** (output)
- Português consome ~50% mais tokens que inglês (vocabulário treinado majoritariamente em inglês)
- **Regra de ouro:** use o modelo mais leve que resolve o problema — suba de nível só se insatisfatório
- Diferença entre modelo leve e premium pode chegar a **40x** de custo para o mesmo resultado

**Chamada para o próximo slide:** a escolha certa de modelo por tarefa é a decisão de maior impacto no orçamento do time.

---

## Slide 5 — Escolha Inteligente de Modelo por Tarefa

**Título:** O modelo certo para cada tarefa

| Tarefa | Modelo recomendado |
|---|---|
| Autocompletar, boilerplate | Haiku 4.5 |
| Exploração e perguntas rápidas | Haiku 4.5 |
| Interface/model/componente simples | Haiku 4.5 |
| Store NgRx Signals, service complexo | Sonnet 5 |
| SDD completo (proposal + design + tasks) | Sonnet 5 |
| Decisão arquitetural de impacto amplo | Sonnet 5 (thinking LOW) |
| Bug persistente após 3+ tentativas | Opus 4.8 |
| Análise de segurança em fluxo crítico | Opus 4.8 |

- ⚠️ **Modo Auto**: evitar no banco — pode escalar para modelo premium sem aviso e sem controle de custo
- ⚠️ **Thinking**: manter desabilitado no ciclo SDD do dia a dia; ativar só com justificativa documentada
- 💾 **Cache de sessão**: uma sessão por feature (não por arquivo) economiza tokens de contexto repetido

---

## Slide 6 — Harness Engineering: o conceito

**Título:** O que é o harness

- Termo vindo da engenharia de testes → ambiente controlado onde o modelo opera
- **Harness = tudo que você configura ao redor do modelo** para que ele se comporte como você quer, sem repetir isso em cada prompt
- A diferença de qualidade entre um prompt genérico e um harness bem configurado **não é o modelo — é o contexto**
- Peças do harness no nosso ambiente:
  - **Instructions** → padrões sempre ativos
  - **Agents** → personas com ferramentas restritas
  - **Skills** → capacidades carregadas sob demanda
  - **Hooks** → automação garantida por código
  - **Prompt Files** → comandos reutilizáveis (`/slash`)
  - **Contexto de arquivos** → `#readFile`, `#fileSearch`

---

## Slide 7 — Harness: sem vs. com configuração

**Título:** O impacto real do harness

**Sem harness:**
- Componente com NgModule, `@Input()`, estado local
- 3–5 rounds de correção → 8.000–15.000 tokens

**Com harness bem configurado:**
- Standalone component, signals, `inject()`, integração com store
- 0–1 rounds de correção → 2.000–4.000 tokens

> A diferença não é mágica — é contexto certo, no momento certo.

---

## Slide 8 — Spec-Driven Development (SDD): o conceito

**Título:** Especificação antes do código

- **Definição:** a especificação precede e guia a implementação
- No banco, não é burocracia — é **proteção**: código em produção financeira precisa ser rastreável, revisado e previsível
- 🔐 Regra de ouro: **spec errada gera código errado** — corrigir custa 5x mais tokens do que corrigir a spec
- SDD **orquestra** TDD, BDD e DDD — não compete com eles
- IA não tem contexto de negócio: descrição vaga → código vago; descrição precisa → código preciso

---

## Slide 9 — SDD: o fluxo em 5 fases

**Título:** As cinco fases do SDD

| Fase | O que fazer | Modo | Modelo |
|---|---|---|---|
| 0 — Explorar | Entender o problema antes de escrever | Ask | Haiku 4.5 |
| 1 — Propose | Criar proposal, design, tasks e spec | Plan | Sonnet 5 |
| 2 — Validar | **Gate crítico — revisão humana** | Review | Você |
| 3 — Apply | Implementar task por task | Agent | Haiku/Sonnet |
| 4 — Verify | Testar e validar contra a spec | Ask | Haiku 4.5 |
| 5 — Archive | Mover para Confluence e arquivar | Manual | — |

> ⚠️ A regra inegociável: **nunca pule a Fase 2**.

---

## Slide 10 — SDD: estrutura de artefatos

**Título:** Os quatro artefatos do SDD

- `.sdd/changes/[nome-da-feature]/`
  - **proposal.md** — O quê + Por quê (contexto, escopo, critérios de aceite)
  - **design.md** — Como + Decisões técnicas (arquitetura, contratos de API)
  - **tasks.md** — O que fazer + Ordem (tarefas atômicas)
  - **specs/spec.md** — Contrato técnico (interfaces, cenários, validações)
- ✅ Estes arquivos **vivem no repositório** durante o desenvolvimento — são documentação da feature
- ❌ O que **nunca** entra no repo: configs do Copilot (instructions, agents, skills, hooks, prompts)

---

## Slide 11 — Custom Instructions

**Título:** O onboarding automático do Copilot

- Regras, padrões e contexto **aplicados automaticamente em toda sessão**
- Elimina repetir "use standalone", "use inject()", "siga o padrão do projeto" em cada prompt
- Workaround do banco: pasta local `.github/instructions/*.instructions.md` (nunca `.github/copilot-instructions.md`)
- Campo `applyTo` permite regras condicionais: `"**"`, `"**/*.ts"`, `"**/*.spec.ts"`
- Exemplos práticos: stack técnica, padrões Angular/HTTP, regras de segurança, padrões de teste Jest
- 💡 Seja específico e use proibições explícitas — "NUNCA usar NgModule" funciona melhor que "prefira standalone"

---

## Slide 12 — Custom Skills

**Título:** Capacidades reutilizáveis sob demanda

- Skill = capacidade especializada que pode incluir scripts, templates e exemplos reais do projeto
- Diferença de instructions: instructions são **sempre ativas**; skills são carregadas **quando relevantes**
- Estrutura: pasta com `SKILL.md` obrigatório (`name` + `description` decidem quando a skill é usada)
- Exemplos práticos: componente Angular standalone, NgRx Signals Store, testes Jest
- Padrão aberto (agentskills.io) — funciona também no Copilot CLI e Cloud Agent
- 💡 A descrição precisa citar os termos que o dev usaria no prompt, para o Copilot carregar a skill sozinho

---

## Slide 13 — Custom Agents

**Título:** Personas com ferramentas restritas

- Agent nativo (Ask/Plan/Agent) não conhece seu projeto — começa do zero a cada sessão
- Custom agent = persona pré-configurada com ferramentas, modelo e comportamento fixos
- **Restrição estrutural, não comportamental**: se o agent não tem `editFile`, ele fisicamente não pode editar código
- Os três agents do fluxo SDD:
  - 🧭 **sdd-planner** — só lê e cria artefatos (sem `editFile`)
  - 🛠️ **feature-implementer** — implementa task por task, aguarda validação
  - 🔍 **code-reviewer** — só lê e reporta, nunca corrige sozinho
- **Handoffs** conectam os agents com prompt pré-preenchido — sem copiar contexto manualmente

---

## Slide 14 — Hooks

**Título:** Instructions influenciam, hooks executam

- Hooks = scripts shell disparados em eventos do ciclo de vida do agente (JSON em `.github/hooks/`)
- Diferença chave: instruction é um pedido; **hook é garantido, independente do que o modelo decidiu**
- Eventos mais úteis no dia a dia:
  - **PostToolUse** → lint e testes automáticos após cada edição
  - **PreToolUse** → bloqueia comandos perigosos antes de executar (`rm -rf`, `DROP TABLE`)
- Casos de uso reais: Quality Gate, Security Guard, Audit Logger, Test Runner
- ⚠️ Hooks rodam com permissão do seu usuário — teste sempre antes de ativar

---

## Slide 15 — Prompt Files

**Título:** Comandos reutilizáveis para o time

- Prompt file = template de prompt invocado como `/comando` no chat
- Resolve inconsistência: sem prompt file, cada dev escreve o mesmo pedido de forma diferente
- Pode definir **modelo** e **modo** (`ask`/`agent`/`plan`) — o dev não precisa lembrar de configurar
- Exemplos prontos: `/criar-componente`, `/criar-store`, `/revisar-pr`, `/debug`, `/iniciar-feature`
- Criar quando a tarefa se repete +2x por semana e exige consistência entre devs

---

## Slide 16 — Por que juntos: Agents + Prompt Files + Skills

**Título:** A combinação que traz o melhor resultado

| Configuração | Resultado |
|---|---|
| Prompt File sozinho | 7/10 — roteiro bom, execução sem controle |
| Custom Agent sozinho | 7/10 — execução controlada, roteiro variável |
| Agent + Prompt File | 9/10 — roteiro fixo + execução controlada |
| **Agent + Prompt File + Skill** | **10/10** — roteiro + controle + padrão real do projeto |

- Prompt File decide **o quê fazer** (roteiro)
- Custom Agent decide **quem executa** (ferramentas, modelo, restrições)
- Skill decide **como fazer bem** (padrão real do projeto)

---

## Slide 17 — Hands-on: o cenário do dia

**Título:** O que vamos fazer ao vivo

- Configurar o harness completo em uma pasta local `.github/` (fora do git)
- Criar os três agents (`sdd-planner`, `feature-implementer`, `code-reviewer`)
- Criar uma skill de camada de dados (dto → model → mapper → service → mock)
- Rodar o ciclo SDD completo em uma feature real do `recr-fed-agc-posvenda`
- Do requisito ao código revisado — passando pelo gate humano da Fase 2

> ⚠️ Lembrete de governança: nada disso é commitado. Toda config vive local; a doc oficial fica no Confluence.
