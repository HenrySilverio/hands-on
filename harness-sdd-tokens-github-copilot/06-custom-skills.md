# 06 — Custom Skills

---

> ⚠️ **AVISO DE GOVERNANÇA**
> Pastas de skills **não podem ser commitadas no repositório**. O push desses arquivos é bloqueado automaticamente pelo pipeline do banco. As skills ficam em `.github/skills/` na máquina local de cada desenvolvedor — fora do git. Modelos de skills são mantidos neste Confluence.
> **Justificativa:** Estes arquivos de configuração modificam o comportamento do GitHub Copilot no nível da IDE e são específicos do ambiente.
> **Implementação:** Copie os arquivos para a estrutura de diretório **.github/** do seu projeto e adicione as exclusões apropriadas no **.gitignore**.

---

## 📋 O que você vai encontrar neste documento

- O que são Agent Skills e qual problema elas resolvem
- Diferença entre skill, instruction e prompt file
- Estrutura da pasta de skill e do arquivo `SKILL.md`
- Quando criar uma skill vs. usar outras formas de customização
- Skills práticas para o dia a dia do recr-fed-agc-posvenda
- Como o Copilot decide quando carregar uma skill
- Como invocar uma skill manualmente com slash command

---

## 🧩 1. O que são Agent Skills

Uma skill é uma **capacidade especializada reutilizável** que você ensina ao Copilot. Ela não é apenas texto de instrução — pode conter scripts, exemplos de código, templates e outros recursos que o agente carrega quando a tarefa é relevante.

A diferença em relação às instructions: instructions são regras sempre ativas (stack, padrões, convenções). Skills são capacidades carregadas sob demanda, quando a tarefa atual corresponde ao que a skill resolve.

**Analogia:** instructions são o manual de conduta do time. Skills são os playbooks específicos — "como criar um store NgRx Signals no nosso projeto", "como configurar um teste Jest para Web Component".

Skills seguem o [padrão aberto agentskills.io](https://agentskills.io), que funciona também no Copilot CLI e no Copilot cloud agent.

---

## ⚖️ 2. Skills vs. outras formas de customização

|                                 | **Skill**                                        | **Instruction**              | **Prompt File**               | **Custom Agent**                     |
| ------------------------------- | ------------------------------------------------ | ---------------------------- | ----------------------------- | ------------------------------------ |
| **Quando é aplicada**           | Sob demanda (por relevância ou invocação manual) | Sempre (em toda sessão)      | Manualmente (slash command)   | Quando o agent está selecionado      |
| **Pode ter scripts e exemplos** | ✅ Sim                                           | ❌ Apenas texto              | ❌ Apenas texto               | ❌ Apenas texto                      |
| **Portabilidade**               | ✅ VS Code, CLI, Cloud Agent                     | VS Code e GitHub.com         | VS Code                       | VS Code                              |
| **Escopo**                      | Tarefa específica                                | Projeto inteiro              | Tarefa específica             | Persona específica                   |
| **Boa para**                    | Capacidades reutilizáveis com recursos           | Padrões e convenções globais | Prompts pontuais padronizados | Personas com controle de ferramentas |

---

## 📁 3. Estrutura da skill

Uma skill é uma **pasta** com um arquivo `SKILL.md` obrigatório e opcionalmente scripts, templates e exemplos.

```
.github/skills/
└── ngrx-signals-store/           ← nome da skill (kebab-case)
    ├── SKILL.md                  ← definição obrigatória
    ├── store-template.ts         ← template TypeScript
    └── examples/
        └── exemplo-store.ts      ← exemplo real do projeto
```

### O arquivo `SKILL.md`

```markdown
---
name: ngrx-signals-store
description: >
  Cria um NgRx Signals Store para o recr-fed-agc-posvenda.
  Use quando o dev pedir para criar um store, gerenciar estado,
  criar uma feature store ou implementar NgRx Signals.
---

# Como criar um NgRx Signals Store

[Instruções detalhadas aqui — veja exemplos nas seções abaixo]
```

### Campos do frontmatter

| **Campo**        | **Obrigatório** | **Descrição**                                                                                                             |
| ---------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `name`           | ✅ Sim          | Identificador único — só letras minúsculas, números e hífens. Deve ser igual ao nome da pasta. Máximo 64 caracteres       |
| `description`    | ✅ Sim          | O que a skill faz **e quando usar**. O Copilot usa este campo para decidir se a skill é relevante. Máximo 1024 caracteres |
| `argument-hint`  | Não             | Texto de dica no campo do chat quando a skill é invocada como slash command                                               |
| `user-invocable` | Não             | `false` para esconder do menu `/` (carregada só automaticamente)                                                          |

> **Atenção:** o campo `name` deve ser **exatamente igual** ao nome da pasta. Um erro aqui faz a skill falhar silenciosamente sem nenhum aviso.

---

## ❓ 4. Quando criar uma skill

Crie uma skill quando:

- A mesma tarefa se repete em vários contextos e dias diferentes
- A tarefa tem padrão específico do projeto que o modelo não conhece sozinho
- A tarefa se beneficia de um template ou script de referência
- Você quer que o modelo carregue o contexto automaticamente sem você lembrar de pedir

Não crie uma skill quando:

- A tarefa é pontual e não vai se repetir (use um prompt file)
- A regra deve se aplicar em toda sessão (use instructions)
- Você quer uma persona com controle de ferramentas (use um custom agent)

---

## 🧰 5. Skills práticas para o recr-fed-agc-posvenda

### Skill 1 — Angular Standalone Component

Localização: `.github/skills/angular-standalone/`

**`SKILL.md`:**

```markdown
---
name: angular-standalone
description: >
  Cria um componente Angular 21 standalone para o recr-fed-agc-posvenda.
  Use quando o dev pedir para criar um componente, uma tela, um widget
  ou qualquer elemento visual da aplicação.
---

# Criar Componente Angular 21 Standalone

## Regras obrigatórias

- Sempre standalone: true — nunca usar NgModule
- Injeção de dependência via inject() — nunca via construtor
- Inputs via input() signal — nunca @Input() decorator
- Outputs via output() — nunca @Output() EventEmitter
- Seletor com prefixo app- obrigatório (ex: app-historico-lista)
- ChangeDetectionStrategy.OnPush obrigatório
- Estilo em arquivo .scss separado

## Estrutura de arquivos
```

src/app/features/[feature]/components/[nome]/
├── [nome].component.ts
├── [nome].component.html
├── [nome].component.scss
└── [nome].component.spec.ts

````

## Template base

```typescript
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-[nome]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './[nome].component.html',
  styleUrl: './[nome].component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class [Nome]Component {
  // Injeção de dependência
  private readonly [service] = inject([Service]);

  // Inputs como signals
  readonly [input] = input<[Tipo]>();

  // Outputs
  readonly [event] = output<[Tipo]>();
}
````

## Referência de padrão

Consulte componentes existentes em:
src/app/features/posvenda/components/

````

---

### Skill 2 — NgRx Signals Store

Localização: `.github/skills/ngrx-signals-store/`

**`SKILL.md`:**

```markdown
---
name: ngrx-signals-store
description: >
  Cria um NgRx Signals Store para o recr-fed-agc-posvenda.
  Use quando o dev pedir para criar um store, gerenciar estado de feature,
  implementar NgRx Signals, criar actions ou computed signals.
---

# Criar NgRx Signals Store

## Estrutura obrigatória

````

src/app/features/[feature]/stores/
└── [nome].store.ts

````

## Template base

```typescript
import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap } from 'rxjs';
import { [Service] } from '../services/[service].service';
import { [Tipo] } from '../models/[model].model';

interface [Nome]State {
  items: [Tipo][];
  selectedItem: [Tipo] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: [Nome]State = {
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
};

export const [Nome]Store = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ items, isLoading, error }) => ({
    hasItems: computed(() => items().length > 0),
    hasError: computed(() => error() !== null),
    isReady: computed(() => !isLoading() && !error()),
  })),
  withMethods((store, service = inject([Service])) => ({
    load[Itens]: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          service.get[Itens]().pipe(
            tapResponse({
              next: (items) => patchState(store, { items, isLoading: false }),
              error: (err) => patchState(store, {
                error: 'Erro ao carregar dados',
                isLoading: false
              }),
            })
          )
        )
      )
    ),
  }))
);
````

## Padrões de nomenclatura

- Store: [Nome]Store (ex: RenegociacaoStore)
- State interface: [Nome]State
- Estado inicial: initialState
- Métodos de load: load[NomePlural] (ex: loadRenegociacoes)

````

---

### Skill 3 — Jest Unit Test

Localização: `.github/skills/jest-unit-test/`

**`SKILL.md`:**

```markdown
---
name: jest-unit-test
description: >
  Cria testes unitários Jest para o recr-fed-agc-posvenda.
  Use quando o dev pedir para criar testes, escrever specs,
  testar um service, store, component ou função.
---

# Criar Testes Jest

## Convenções de nomenclatura
- describe: '[NomeDoSujeito]' (ex: 'RenegociacaoStore')
- it: 'should [comportamento esperado]' (ex: 'should load renegociacoes on init')
- Arquivo: [nome].spec.ts no mesmo diretório do arquivo testado

## Cobertura mínima esperada
- Services: 80%
- Stores: 80% (cada action e computed separadamente)
- Components: 60% (foco em comportamento, não template)

## Template para Store

```typescript
import { TestBed } from '@angular/core/testing';
import { [Nome]Store } from './[nome].store';
import { [Service] } from '../services/[service].service';
import { of, throwError } from 'rxjs';

describe('[Nome]Store', () => {
  let store: InstanceType<typeof [Nome]Store>;
  let service: jest.Mocked<[Service]>;

  beforeEach(() => {
    const serviceMock = {
      get[Itens]: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        [Nome]Store,
        { provide: [Service], useValue: serviceMock },
      ],
    });

    store = TestBed.inject([Nome]Store);
    service = TestBed.inject([Service]) as jest.Mocked<[Service]>;
  });

  it('should initialize with empty state', () => {
    expect(store.items()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load items successfully', async () => {
    const mockItems = [{ id: '1', /* campos */ }];
    service.get[Itens].mockReturnValue(of(mockItems));

    store.load[Itens]();
    await TestBed.flushEffects();

    expect(store.items()).toEqual(mockItems);
    expect(store.isLoading()).toBe(false);
  });

  it('should handle error on load', async () => {
    service.get[Itens].mockReturnValue(throwError(() => new Error('API error')));

    store.load[Itens]();
    await TestBed.flushEffects();

    expect(store.error()).toBe('Erro ao carregar dados');
    expect(store.isLoading()).toBe(false);
  });
});
````

```

---

## 🧠 6. Como o Copilot decide quando carregar uma skill

O Copilot lê o campo `description` de cada skill disponível e decide se a skill é relevante para a tarefa atual. Por isso, a descrição precisa mencionar **o que a skill faz e em quais situações ela deve ser usada**.

**Descrição ruim:**
```

description: Cria stores NgRx

```

**Descrição boa:**
```

description: >
Cria um NgRx Signals Store para o recr-fed-agc-posvenda.
Use quando o dev pedir para criar um store, gerenciar estado de feature,
implementar NgRx Signals, criar actions ou computed signals.

```

A segunda descrição menciona os termos que o dev vai usar no prompt ("criar um store", "gerenciar estado", "NgRx Signals"), aumentando a chance de a skill ser carregada automaticamente.

---

## ⚡ 7. Invocação manual com slash command

Toda skill com `user-invocable: true` (padrão) aparece no menu de slash commands do chat. Para invocar manualmente:

1. No campo de chat, digite `/`
2. Procure pelo nome da skill (ex: `/ngrx-signals-store`)
3. Pressione Enter — a skill é carregada como contexto da próxima mensagem

Para gerar uma skill com IA a partir de uma descrição, use `/create-skill` no chat.

---

## 🔗 Referências

- [Use Agent Skills in VS Code — VS Code Docs](https://code.visualstudio.com/docs/agent-customization/agent-skills)
- [agentskills.io — Padrão aberto de skills](https://agentskills.io)

---

*Documento: 06 — Custom Skills | Junho 2026*
*Anterior: [05 — Custom Agents](./05-custom-agents.md) | Próximo: [07 — Custom Instructions](./07-custom-instructions.md)*
```
