# 09 — Prompt Files

---

> ⚠️ **AVISO DE GOVERNANÇA**
> Arquivos `.prompt.md` **não podem ser commitados no repositório**. O push desses arquivos é bloqueado automaticamente pelo pipeline do banco. Os prompts ficam em `.github/prompts/` na máquina local de cada desenvolvedor — fora do git. Modelos de prompts são mantidos neste Confluence.
> **Justificativa:** Estes arquivos de configuração modificam o comportamento do GitHub Copilot no nível da IDE e são específicos do ambiente.
> **Implementação:** Copie os arquivos para a estrutura de diretório **.github/** do seu projeto e adicione as exclusões apropriadas no **.gitignore**.

---

## 📋 O que você vai encontrar neste documento

- O que são prompt files e qual problema eles resolvem
- Diferença entre prompt file, instruction, skill e custom agent
- Estrutura do arquivo `.prompt.md`
- Quando criar um prompt file vs. usar outras formas de customização
- Prompts prontos para o dia a dia do recr-fed-agc-posvenda
- Como invocar um prompt file no chat
- Dicas para escrever prompts eficazes

---

## 📝 1. O que são Prompt Files

Prompt files são **templates de prompt reutilizáveis** invocados como slash commands no chat. Cada arquivo encapsula uma tarefa específica com suas instruções, contexto e configurações de modelo — tudo pronto para usar com um `/comando`.

Em vez de escrever o mesmo prompt do zero toda vez que precisar criar um componente Angular ou revisar um PR, você cria um prompt file uma vez e o aciona com `/criar-componente` ou `/revisar-pr`. O prompt abre pré-preenchido com todas as instruções necessárias.

**O problema que resolve:** inconsistência. Sem prompt files, cada dev escreve prompts diferentes para a mesma tarefa — com qualidade e resultado variando. Com prompt files, o time compartilha o mesmo prompt testado e refinado.

---

## ⚖️ 2. Prompt files vs. outras formas de customização

|                                   | **Prompt File**             | **Instruction**            | **Skill**                        | **Custom Agent**                    |
| --------------------------------- | --------------------------- | -------------------------- | -------------------------------- | ----------------------------------- |
| **Invocação**                     | Manual (`/comando`)         | Automática (sempre ativa)  | Automática ou manual (`/skill`)  | Seleção no dropdown                 |
| **Quando usar**                   | Tarefa pontual e recorrente | Padrões globais do projeto | Capacidade com scripts/templates | Persona com controle de ferramentas |
| **Escopo**                        | Uma tarefa específica       | Projeto inteiro            | Capacidade específica            | Sessão inteira                      |
| **Pode definir modelo**           | ✅ Sim                      | ❌ Não                     | ❌ Não                           | ✅ Sim                              |
| **Pode definir modo (ask/agent)** | ✅ Sim                      | ❌ Não                     | ❌ Não                           | ✅ Sim                              |

**Regra prática de decisão:**

- Tarefa que repete com resultado esperado fixo → **Prompt File**
- Regra que deve valer em toda sessão → **Instruction**
- Capacidade com template de código embutido → **Skill**
- Persona com ferramentas restritas e fluxo sequencial → **Custom Agent**

---

## 📄 3. Estrutura do arquivo `.prompt.md`

Prompt files ficam em `.github/prompts/` com extensão `.prompt.md`.

```markdown
---
name: "nome-do-comando"
description: "Descrição curta — aparece no menu /"
agent: agent
model: claude-haiku-4-5
tools: ["readFile", "editFile", "createFile"]
---

# Instruções do prompt

[Corpo em Markdown — descreve o que o agente deve fazer,
com quais padrões, restrições e formato de saída]
```

### Campos do frontmatter

| **Campo**     | **Obrigatório** | **Descrição**                                             |
| ------------- | --------------- | --------------------------------------------------------- |
| `name`        | Não             | Nome do slash command — se omitido, usa o nome do arquivo |
| `description` | Não             | Texto exibido no menu `/`                                 |
| `agent`       | Não             | Modo: `ask`, `agent`, `plan`, ou nome de um custom agent  |
| `model`       | Não             | Modelo a usar — se omitido, usa o selecionado no chat     |
| `tools`       | Não             | Ferramentas disponíveis para este prompt                  |

---

## ❓ 4. Quando criar um prompt file

Crie um prompt file quando:

- A mesma tarefa ocorre mais de 2 vezes por semana no time
- O prompt tem mais de 5 linhas e exige contexto específico do projeto
- Você quer garantir consistência de output entre devs diferentes
- A tarefa envolve escolha específica de modelo e modo

Não crie um prompt file quando:

- A tarefa é única e não vai se repetir
- A tarefa já é coberta automaticamente por uma instruction ou skill
- O prompt é simples o suficiente para digitar na hora (menos de 2 linhas)

---

## 🧰 5. Prompts prontos para o recr-fed-agc-posvenda

### Prompt 1 — Criar Componente Angular

`.github/prompts/criar-componente.prompt.md`

```markdown
---
name: "criar-componente"
description: "Cria um componente Angular 21 standalone completo com teste"
agent: agent
model: claude-haiku-4-5
tools: ["readFile", "createFile", "search"]
---

# Criar Componente Angular 21 Standalone

Crie um componente Angular 21 completo para o recr-fed-agc-posvenda.

## Informações necessárias

Se não foram fornecidas no prompt, pergunte:

1. Nome do componente (ex: historico-renegociacoes-lista)
2. Feature onde será criado (ex: posvenda)
3. Inputs esperados (campos e tipos)
4. Outputs esperados (eventos emitidos)
5. Precisa acessar algum store ou service?

## Regras obrigatórias

- standalone: true — nunca NgModule
- inject() para dependências — nunca construtor
- input() signals para inputs — nunca @Input()
- output() para outputs — nunca @Output()
- ChangeDetectionStrategy.OnPush
- Seletor com prefixo app-
- Arquivo .scss separado para estilos

## Estrutura a criar
```

src/app/features/[feature]/components/[nome]/
├── [nome].component.ts
├── [nome].component.html
├── [nome].component.scss
└── [nome].component.spec.ts

```

## Referência de padrão
Antes de criar, leia um componente existente similar:
#readFile src/app/features/posvenda/components/

## Teste obrigatório
Crie o arquivo `.spec.ts` com:
- describe('[NomeComponent]')
- it('should create') — teste básico de instanciação
- it('should [comportamento principal]') — pelo menos um teste de comportamento

Não implemente lógica de negócio complexa no componente.
Estado de negócio sempre via store.
```

---

### Prompt 2 — Criar NgRx Signals Store

`.github/prompts/criar-store.prompt.md`

```markdown
---
name: "criar-store"
description: "Cria um NgRx Signals Store completo com state, computed e methods"
agent: agent
model: claude-sonnet-4-6
tools: ["readFile", "createFile", "search"]
---

# Criar NgRx Signals Store

Crie um NgRx Signals Store completo para o recr-fed-agc-posvenda.

## Informações necessárias

Se não foram fornecidas, pergunte:

1. Nome da entidade gerenciada (ex: Renegociacao)
2. Fields do state (propriedades e tipos)
3. Quais métodos de carregamento de dados (quais endpoints?)
4. Quais computed signals são necessários?

## Estrutura a criar
```

src/app/features/[feature]/stores/
└── [nome].store.ts

````

## Padrão obrigatório do store
```typescript
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';

interface [Nome]State {
  items: [Tipo][];
  selectedItem: [Tipo] | null;
  isLoading: boolean;
  error: string | null;
}
````

## Referência de padrão

Leia um store existente antes de criar:
#readFile src/app/features/posvenda/stores/

## Teste obrigatório

Crie também o arquivo `.store.spec.ts` cobrindo:

- Estado inicial
- Cada método de carregamento (sucesso e erro)
- Cada computed signal

Cobertura mínima: 80%.

````

---

### Prompt 3 — Revisar PR

`.github/prompts/revisar-pr.prompt.md`

```markdown
---
name: "revisar-pr"
description: "Revisão completa de PR — padrões, segurança e cobertura de testes"
agent: ask
model: claude-sonnet-4-6
tools: ['readFile', 'search']
---

# Revisão de Pull Request — recr-fed-agc-posvenda

Realize uma revisão completa dos arquivos modificados neste PR.

## O que revisar

### 1. Padrões Angular 21
- [ ] Componentes são standalone (sem NgModule)
- [ ] inject() usado para injeção (não construtor)
- [ ] input()/output() signals (não @Input()/@Output())
- [ ] ChangeDetectionStrategy.OnPush nos componentes
- [ ] Estado via store (não estado local no componente)

### 2. Segurança
- [ ] Nenhum token, senha ou chave hardcoded
- [ ] Chamadas HTTP apenas via service (não diretamente no componente)
- [ ] catchError no pipe de todos os observables HTTP
- [ ] Validação de inputs antes de enviar ao backend
- [ ] Nenhum dado sensível em console.log ou URLs

### 3. Qualidade de código
- [ ] Nomenclatura seguindo os padrões do projeto
- [ ] Sem código comentado ou console.log em produção
- [ ] Sem any tipagem — tipos explícitos em todos os lugares
- [ ] Sem lógica duplicada que poderia ser extraída para um service

### 4. Testes
- [ ] Cobertura mínima respeitada (services: 80%, stores: 80%, components: 60%)
- [ ] Casos de erro cobertos nos testes
- [ ] Nomenclatura de testes correta (describe/it)

## Formato de saída
Entregue a revisão em quatro seções:
  ✅ **Aprovado:** O que está correto e seguindo os padrões
  ⚠️ **Atenção:** O que precisa de ajuste antes do merge
  ❌ **Bloqueante:** O que impede o merge (violação de segurança, padrão crítico)
  💡 **Sugestão:** Melhorias opcionais (não bloqueam o merge)

Inclua o nome do arquivo e a linha específica em cada apontamento.
````

---

### Prompt 4 — Debug com Contexto

`.github/prompts/debug.prompt.md`

```markdown
---
name: "debug"
description: "Debug estruturado — identifica causa raiz e propõe solução mínima"
agent: ask
model: claude-sonnet-4-6
tools: ["readFile", "search"]
---

# Debug Estruturado

Ajude a identificar e resolver o problema descrito.

## O que preciso de você antes de propor qualquer solução

1. **Identifique a causa raiz** — não o sintoma, a causa.
2. **Localize o problema** — arquivo, método, linha aproximada.
3. **Determine a origem** — o problema está na implementação ou na spec/design?
4. **Proponha a solução mínima** — a menor mudança que resolve, sem alterar escopo.

## Formato de resposta esperado

**Causa raiz identificada:**
[explicação objetiva]

**Localização:**
[arquivo e contexto]

**Solução proposta:**
[descrição da mudança mínima]

**Impacto:**
[outros arquivos ou comportamentos afetados]

**Código sugerido:**
[apenas se a solução for clara — não implemente ainda sem aprovação]

## Regras

- Não implemente nada sem minha aprovação explícita
- Se não tiver certeza da causa raiz, diga isso — não chute
- Se o problema for na spec e não na implementação, sinalize antes de propor código
- Se após 3 tentativas não resolver, indique que é hora de usar Opus 4.8 com thinking LOW
```

---

### Prompt 5 — Iniciar Feature com SDD

`.github/prompts/iniciar-feature.prompt.md`

```markdown
---
name: "iniciar-feature"
description: "Inicia o ciclo SDD de uma nova feature — cria os artefatos de planejamento"
agent: plan
model: claude-sonnet-4-6
tools: ["readFile", "createFile", "search"]
---

# Iniciar Feature com SDD

Vamos iniciar o ciclo SDD para uma nova feature do recr-fed-agc-posvenda.

## Passo 1 — Entendimento (não crie nada ainda)

Se a feature não foi descrita detalhadamente, pergunte:

1. Qual é o objetivo da feature para o gerente/usuário?
2. Quais dados precisam ser exibidos ou manipulados?
3. Há integração com alguma API ou endpoint específico?
4. Existem critérios de aceite definidos com o PO?

## Passo 2 — Exploração do projeto (antes de criar a spec)

Verifique o estado atual do projeto:
#readFile src/app/features/posvenda/

Identifique:

- Stores e services existentes que podem ser reaproveitados
- Componentes similares que podem servir como referência de padrão
- Dependências técnicas que precisam ser resolvidas antes

## Passo 3 — Criação dos artefatos SDD

Crie os seguintes arquivos em `.sdd/changes/[nome-da-feature]/`:
```

.sdd/changes/[nome-da-feature]/
├── proposal.md → contexto, escopo, critérios de aceite
├── design.md → decisões técnicas, arquitetura, contratos de API
├── tasks.md → lista ordenada de tasks atômicas
└── specs/
└── [nome]/
└── spec.md → interfaces TypeScript e comportamento esperado

```

## Regra final
Ao concluir, informe que os artefatos estão prontos para **revisão humana obrigatória**
antes de qualquer implementação. Não inicie código de produção.
```

---

## ⚡ 6. Como invocar um prompt file no chat

1. Clique no campo de chat do Copilot
2. Digite `/` — o menu de slash commands aparece
3. Procure pelo nome do prompt (ex: `/criar-componente`)
4. Selecione o prompt — ele abre pré-preenchido no campo de chat
5. Adicione o contexto específico da tarefa (nome do componente, detalhes) e envie

Para criar um prompt file com IA: no chat, use `/create-prompt` e descreva a tarefa que quer automatizar.

---

## 💡 7. Dicas para escrever prompt files eficazes

> 💡 **Inclua um passo de "pergunte se não souber".** Para tarefas que exigem nome do componente, feature de destino ou outros parâmetros variáveis, instrua o modelo a perguntar antes de criar. Isso evita que o agente assuma e crie no lugar errado.
>
> 💡 **Defina o formato de saída.** Prompts de revisão e análise ficam muito melhores quando o formato da resposta está especificado (seções, checkboxes, agrupamento por severidade).
>
> 💡 **Inclua referências de padrão com `#readFile`.** Um prompt de "criar componente" que lê um componente existente gera resultado muito mais alinhado com o projeto do que um que parte do zero.
>
> 💡 **Escolha o modelo e o modo com intenção.** Um prompt de revisão (`/revisar-pr`) usa modo `ask` e não precisa de `editFile`. Um prompt de implementação (`/criar-componente`) usa modo `agent` com `createFile`. Especificar isso evita que o modelo use ferramentas erradas.
>
> 💡 **Mantenha cada prompt com foco em uma tarefa.** Um prompt que faz "criar componente, criar service e criar testes" vai resultar em muita coisa de uma vez, difícil de revisar. Prefira um prompt por entrega.

---

## 🔗 Referências

- [Use Prompt Files in VS Code — VS Code Docs](https://code.visualstudio.com/docs/agent-customization/prompt-files)
- [Prompt Examples — VS Code Docs](https://code.visualstudio.com/docs/agents/guides/prompt-examples)

---

_Documento: 09 — Prompt Files | Junho 2026_
_Anterior: [08 — Hooks](./08-hooks.md) | Voltar ao início: [00 — Índice](./00-indice.md)_
