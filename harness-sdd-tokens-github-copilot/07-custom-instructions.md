# 07 — Custom Instructions

---

> ⚠️ **AVISO DE GOVERNANÇA — LEIA ANTES DE QUALQUER COISA**
> O arquivo `copilot-instructions.md` e qualquer arquivo `.instructions.md` **não podem ser commitados no repositório**. O banco bloqueia o push desses arquivos automaticamente no pipeline — você receberá um erro no terminal ao tentar. Eles devem existir **apenas localmente na sua máquina**. Este documento explica onde criá-los e como configurar o VS Code para encontrá-los. Documentação e modelos de instructions ficam neste Confluence.
> **Justificativa:** Estes arquivos de configuração modificam o comportamento do GitHub Copilot no nível da IDE e são específicos do ambiente.
> **Implementação:** Copie os arquivos para a estrutura de diretório **.github/** do seu projeto e adicione as exclusões apropriadas no **.gitignore**.

---

## 📋 O que você vai encontrar neste documento

- O que são custom instructions e qual problema elas resolvem
- Os tipos de arquivos de instruction disponíveis
- O workaround oficial do banco (pasta `/instructions` com `.instructions.md`)
- Instructions completas prontas para o recr-fed-agc-posvenda
- Como usar `applyTo` para instructions por tipo de arquivo
- Como verificar se as instructions estão sendo aplicadas
- Dicas para escrever instructions eficazes

---

## 📜 1. O que são Custom Instructions

Instructions são arquivos Markdown que definem **regras, padrões e contexto** que o Copilot aplica automaticamente em todas as sessões de chat. Em vez de repetir "use standalone components", "use inject()", "siga o padrão NgRx Signals" em cada prompt, você escreve uma vez nas instructions e o modelo carrega esse contexto automaticamente.

Pense nas instructions como o **onboarding técnico do Copilot** para o seu projeto. Tudo que você explicaria para um dev novo que vai trabalhar no `recr-fed-agc-posvenda` deve estar nas instructions.

---

## 📂 2. Tipos de arquivos de instruction

| **Tipo**                    | **Arquivo**                       | **Quando é aplicado**                                         | **Escopo**                   |
| --------------------------- | --------------------------------- | ------------------------------------------------------------- | ---------------------------- |
| **Sempre ativo (global)**   | `.github/copilot-instructions.md` | Em toda sessão do workspace                                   | Projeto inteiro              |
| **Condicional por arquivo** | `*.instructions.md`               | Quando os arquivos trabalhados correspondem ao glob `applyTo` | Por tipo de arquivo ou pasta |
| **AGENTS.md**               | `AGENTS.md`                       | Em toda sessão — compatível com múltiplos agentes de IA       | Projeto inteiro              |
| **CLAUDE.md**               | `CLAUDE.md`                       | Compatibilidade com Claude Code e ferramentas Claude          | Workspace                    |

Para o contexto do banco, trabalhamos com **`.instructions.md`** (plural, condicional) em uma pasta local — esse é o workaround aprovado.

---

## 🔧 3. O workaround oficial do banco

### O problema

O arquivo padrão do Copilot (`.github/copilot-instructions.md`) fica dentro da pasta `.github/`, que é monitorada pelo pipeline. Qualquer arquivo nesse caminho com o nome `copilot-instructions.md` é bloqueado no push.

### A solução

O VS Code suporta um local alternativo: uma pasta chamada `.github/instructions/` (ou qualquer pasta configurada em `chat.instructionsFilesLocations`) contendo arquivos com a extensão `.instructions.md`. Esse padrão foi adotado pelo time como alternativa oficial.

**Estrutura local (fora do git):**

```
[raiz do projeto]/
└── .github/
    └── instructions/               ← esta pasta não entra no repo
        ├── stack.instructions.md
        ├── angular.instructions.md
        ├── seguranca.instructions.md
        └── testes.instructions.md
```

> O pipeline bloqueia o commit de arquivos de configuração do Copilot. Se você tentar dar `git push` com esses arquivos, receberá um erro no terminal. Eles existem apenas na sua máquina.

### Configurando o VS Code para encontrar a pasta

Abra as configurações do VS Code (`Ctrl+,`) e adicione:

```json
{
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  }
}
```

Após salvar, o VS Code passa a carregar automaticamente os arquivos `.instructions.md` encontrados nessa pasta.

---

## 📄 4. Formato do arquivo `.instructions.md`

```markdown
---
name: "Nome descritivo"
description: "O que este arquivo de instructions cobre"
applyTo: "**"
---

# Título

[Conteúdo das instructions em Markdown]
```

### O campo `applyTo`

O `applyTo` aceita glob patterns e determina quando as instructions são aplicadas automaticamente:

| **Valor**               | **Quando aplica**                                          |
| ----------------------- | ---------------------------------------------------------- |
| `"**"`                  | Sempre — em qualquer arquivo                               |
| `"**/*.ts"`             | Apenas quando arquivos TypeScript estão no contexto        |
| `"**/*.spec.ts"`        | Apenas quando arquivos de teste estão no contexto          |
| `"src/app/features/**"` | Apenas quando arquivos da pasta features estão no contexto |

Se `applyTo` não for especificado, a instruction não é aplicada automaticamente — só se invocada manualmente.

---

## 🧰 5. Instructions completas para o recr-fed-agc-posvenda

### Arquivo 1 — Stack e Convenções Gerais

`.github/instructions/stack.instructions.md`

```markdown
---
name: "Stack e Convenções — recr-fed-agc-posvenda"
description: "Stack técnica, padrões de nomenclatura e arquitetura do projeto"
applyTo: "**"
---

# Stack Técnica — recr-fed-agc-posvenda

## Descrição do projeto

Aplicação de acompanhamento pós-venda para gerentes bancários acompanharem
renegociações de dívidas de clientes em sua carteira.

## Stack principal

- Angular 21 com TypeScript 5.x em strict mode
- Gerenciamento de estado: NgRx Signals Store
- Estilização: SCSS com design tokens do DS Bradesco
- Testes: Jest + Angular Testing Library
- Build: Node 22 + Angular CLI
- Exposição: Native Federation via Web Component

## Convenções de nomenclatura

- Componentes: PascalCase (ex: HistoricoRenegociacoesComponent)
- Seletores: prefixo app- obrigatório (ex: app-historico-renegociacoes)
- Services: PascalCase + sufixo Service (ex: RenegociacaoService)
- Stores: PascalCase + sufixo Store (ex: RenegociacaoStore)
- Interfaces/Types: PascalCase sem prefixo I (ex: Renegociacao, não IRenegociacao)
- Arquivos: kebab-case (ex: historico-renegociacoes.component.ts)
- Métodos: camelCase (ex: loadRenegociacoes)
- Constantes: UPPER_SNAKE_CASE

## Padrões de código Angular 21

- Componentes sempre standalone: true — NUNCA usar NgModule
- Injeção de dependência via inject() function — NUNCA via construtor
- Inputs via input() signal — NUNCA @Input() decorator
- Outputs via output() — NUNCA @Output() EventEmitter
- ChangeDetectionStrategy.OnPush em todos os componentes
- Estado de negócio sempre via NgRx Signals Store — NUNCA estado local no componente

## Estrutura de pastas do projeto

src/app/
core/ → services globais, interceptors, guards
shared/ → componentes, pipes e directives reutilizáveis
features/
posvenda/ → feature principal
components/ → componentes da feature
stores/ → NgRx Signals Stores
services/ → services da feature
models/ → interfaces e types
pages/ → componentes de página (rotas)
```

---

### Arquivo 2 — Padrões de API e HTTP

`.github/instructions/angular.instructions.md`

````markdown
---
name: "Padrões Angular e HTTP — recr-fed-agc-posvenda"
description: "Padrões de chamada HTTP, tratamento de erro e contratos de API"
applyTo: "**/*.ts"
---

# Padrões Angular e HTTP

## Chamadas HTTP

- NUNCA fazer chamadas HTTP diretamente no componente — sempre via service
- SEMPRE usar catchError no pipe de observables HTTP
- SEMPRE tipar os retornos (nunca usar `any`)
- Services de API ficam em src/app/features/[feature]/services/

## Padrão de response da API

```typescript
// Sucesso
{ data: T, meta: { total: number, page: number } }

// Erro de validação
{ errors: [{ field: string, message: string }] }

// Erro interno
{ error: string, traceId: string }
```
````

## Template de service

```typescript
@Injectable({ providedIn: 'root' })
export class [Nome]Service {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/[recurso]';

  get[Itens](): Observable<[Tipo][]> {
    return this.http.get<{ data: [Tipo][] }>(this.baseUrl).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.error?.error ?? 'Erro inesperado';
    return throwError(() => new Error(message));
  }
}
```

## Web Component (Native Federation)

- O projeto expõe features via Web Component
- Use customElements.define() apenas no bootstrap da feature
- Comunicação com o host via eventos customizados (CustomEvent)
- Nunca acesse o DOM diretamente — use ViewChild e ElementRef com inject()

````

---

### Arquivo 3 — Segurança

`.github/instructions/seguranca.instructions.md`

```markdown
---
name: "Regras de Segurança — recr-fed-agc-posvenda"
description: "Regras de segurança obrigatórias do banco para geração de código"
applyTo: "**"
---

# Regras de Segurança — Obrigatórias

## Proibições absolutas
- NUNCA gere código com tokens, senhas, chaves de API ou credenciais hardcoded
- NUNCA use eval() ou Function() com strings dinâmicas
- NUNCA acesse localStorage ou sessionStorage diretamente em componentes
- NUNCA exponha dados de clientes em logs ou console.log em produção

## Validação de entradas
- SEMPRE valide entradas do usuário antes de enviar ao backend
- Use Reactive Forms com validators — nunca Template-driven Forms
- Sanitize inputs que serão exibidos como HTML (use DomSanitizer)

## Autenticação e autorização
- NUNCA implemente lógica de autenticação no frontend — use os guards existentes
- Guards ficam em src/app/core/guards/
- Interceptors de autenticação ficam em src/app/core/interceptors/

## Tratamento de dados sensíveis
- CPF, dados bancários e informações de cliente NUNCA devem aparecer em URLs
- Use POST para operações que enviam dados sensíveis
- Dados de resposta de API com informações do cliente não devem ser logados
````

---

### Arquivo 4 — Testes Jest

`.github/instructions/testes.instructions.md`

```markdown
---
name: "Padrões de Testes Jest — recr-fed-agc-posvenda"
description: "Padrões de testes unitários com Jest para o projeto"
applyTo: "**/*.spec.ts"
---

# Padrões de Testes Jest

## Estrutura

- describe('[NomeDoSujeito]') — sem 'should' no describe
- it('should [comportamento esperado]') — afirmação clara do que deve acontecer
- Arquivo de teste no mesmo diretório do arquivo testado

## Cobertura mínima esperada

- Services: 80%
- Stores (NgRx Signals): 80% — testar cada action e computed separadamente
- Components: 60% — foco em comportamento, não em template

## Mocks

- Use jest.fn() para mockar métodos
- Use jest.spyOn() para espiionar chamadas reais
- Nunca mocke o HttpClient diretamente — use HttpClientTestingModule
- Para stores, use TestBed com providedIn: 'root'

## O que testar em stores

- Estado inicial
- Cada método/action individualmente
- Cada computed signal
- Comportamento em caso de erro de API

## O que NÃO testar

- Implementações internas do Angular (lifecycle hooks, detectChanges)
- O DOM diretamente (foque no comportamento, não no HTML gerado)
- Código de terceiros (Angular, NgRx, etc.)
```

---

## ✅ 6. Verificando se as instructions estão ativas

Para confirmar que o VS Code está carregando suas instructions:

1. Abra o chat do Copilot
2. Clique no ícone de engrenagem (Configure Chat)
3. Selecione a aba **Instructions**
4. Seus arquivos `.instructions.md` devem aparecer listados e ativos

Se não aparecerem:

- Confirme que `chat.instructionsFilesLocations` aponta para o caminho correto
- Verifique se os arquivos têm a extensão `.instructions.md` (com ponto antes de `instructions`)
- Verifique se o YAML frontmatter está válido (sem erros de sintaxe)

---

## 💡 7. Dicas para escrever instructions eficazes

> 💡 **Seja específico, não genérico.** "Use boas práticas Angular" não ajuda. "Use standalone: true, inject(), input() signals e ChangeDetectionStrategy.OnPush" ajuda.
>
> 💡 **Use proibições explícitas.** O modelo precisa saber o que NÃO fazer. "NUNCA usar NgModule", "NUNCA usar construtor para injeção" são mais eficazes do que "prefira standalone".
>
> 💡 **Inclua exemplos curtos.** Um template de 10 linhas de código no `.instructions.md` vale mais do que um parágrafo descritivo.
>
> 💡 **Separe por contexto com `applyTo`.** Regras que só valem para arquivos de teste não precisam poluir o contexto de arquivos de produção.
>
> 💡 **Mantenha curto e direto.** Instructions longas demais consomem tokens e diluem a atenção do modelo. Se passar de 200 linhas, considere dividir em múltiplos arquivos por contexto.

---

## 🔗 Referências

- [Use Custom Instructions in VS Code — VS Code Docs](https://code.visualstudio.com/docs/agent-customization/custom-instructions)

---

_Documento: 07 — Custom Instructions | Junho 2026_
_Anterior: [06 — Custom Skills](./06-custom-skills.md) | Próximo: [08 — Hooks](./08-hooks.md)_
