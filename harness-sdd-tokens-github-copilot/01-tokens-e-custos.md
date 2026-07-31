# 01 — Tokens, Custos e Escolha de Modelos

---

> ⚠️ **AVISO DE GOVERNANÇA**
> Nenhum arquivo de configuração do GitHub Copilot (instructions, agents, skills, hooks, prompts) deve ser commitado no repositório. O push desses arquivos deve ser bloqueado. Toda configuração vive **localmente na máquina do desenvolvedor** e a documentação oficial fica neste Confluence. Consulte o time de arquitetura em caso de dúvidas sobre o que pode ou não entrar no repositório.
> **Justificativa:** Estes arquivos de configuração modificam o comportamento do GitHub Copilot no nível da IDE e são específicos do ambiente.
> **Implementação:** Copie os arquivos para a estrutura de diretório **.github/** do seu projeto e adicione as exclusões apropriadas no **.gitignore**.

---

## 📋 O que você vai encontrar neste documento

- Como funciona a nova cobrança por uso do GitHub Copilot
- O que é um token e por que isso importa para o seu dia a dia
- Como escolher o modelo certo para cada tarefa
- Impacto de português vs. inglês nos seus créditos
- Estratégias práticas para não estourar a cota mensal
- O que é cache de sessão e como ele economiza créditos sem esforço
- Por que o modo Auto é uma armadilha no nosso contexto
- Quais configurações do VS Code custam caro e devem ser evitadas

---

## 💳 1. O novo modelo de cobrança por uso

Desde **junho de 2026**, o GitHub Copilot migrou do modelo de assinatura por usuário para **GitHub AI Credits** — cobrança baseada em consumo real. Isso significa que cada chamada ao modelo, cada linha de contexto enviada e cada resposta gerada têm um custo mensurável.

Antes, o plano era uma mensalidade fixa independente de quanto você usava. Agora o consumo é medido e debitado em créditos. Ao esgotar a cota antes da renovação, o serviço é interrompido para o usuário.

**Status atual do plano Copilot Business:**

| **Item**            | **Valor**                                   |
| ------------------- | ------------------------------------------- |
| Créditos utilizados | x.xxx,xx de 7.500                           |
| Próxima renovação   | final do mês                                |
| Situação            | ⚠️ Atenção — menos de x dias para renovação |

> Esses números servem como referência de escala. Monitore o consumo do seu usuário no painel do GitHub Copilot.

---

## 🔤 2. O que é um token

Token é a unidade de medida que o modelo usa para processar texto. Não é exatamente uma palavra nem um caractere — é um pedaço de texto que o modelo aprendeu a reconhecer como unidade.

**Referência prática:**

| **Conteúdo**                           | **Tokens aproximados** |
| -------------------------------------- | ---------------------- |
| 1 caractere em inglês                  | ~0,25 tokens           |
| 1 palavra em inglês                    | ~1,3 tokens            |
| 1 palavra em português                 | ~1,5 a 2 tokens        |
| Uma linha de código TypeScript         | ~10–20 tokens          |
| Função Angular de 50 linhas            | ~400–600 tokens        |
| Arquivo de store NgRx Signals completo | ~800–1.500 tokens      |
| Uma página de texto corrido            | ~500–800 tokens        |

O modelo paga tokens duas vezes: uma para **ler** o que você enviou (input) e outra para **gerar** a resposta (output). O custo de output costuma ser 3× maior que o de input nos modelos premium.

### Por que português consome mais tokens

O vocabulário de tokens dos modelos foi treinado majoritariamente em inglês. Palavras em português que não existem no vocabulário são quebradas em fragmentos menores, resultando em mais tokens para o mesmo conteúdo.

**Exemplo direto:**

```
"Implement the customer balance service"  →  ~6 tokens
"Implemente o serviço de saldo do cliente" →  ~9 tokens
```

Isso representa **~50% a mais de tokens** para dizer a mesma coisa. Em uma sessão longa com 50 prompts, a diferença pode chegar a centenas de tokens extras.

**A decisão prática para o time:**

Não existe resposta única. Use inglês quando o prompt for simples e técnico (nomes de métodos, comandos, referências a arquivos). Use português quando a explicação de regra de negócio for complexa e a precisão semântica for mais importante que a economia de tokens. Um prompt mal escrito em inglês que gera código errado custa mais do que um prompt claro em português.

---

## 🎯 3. Escolha de modelos: a decisão de maior impacto

A escolha do modelo é a variável que mais afeta o consumo de créditos. Um modelo premium pode custar 10× mais que um modelo leve para o mesmo resultado.

**Regra fundamental:** use o modelo mais leve que resolve o problema. Suba de nível apenas quando o resultado for insatisfatório.

### Tabela de decisão por tarefa

| **Tarefa**                                         | **Modelo recomendado**                   | **Por quê**                                |
| -------------------------------------------------- | ---------------------------------------- | ------------------------------------------ |
| Autocompletar código inline                        | **Claude Haiku 4.5** ou **GPT-5 mini**   | Tarefa mecânica, sem raciocínio necessário |
| Exploração e perguntas rápidas                     | **Claude Haiku 4.5**                     | Conversa leve, sem geração de código       |
| Criar interface TypeScript com campos definidos    | **Claude Haiku 4.5**                     | Spec clara, output previsível              |
| Escrever testes unitários Jest para função pura    | **Claude Haiku 4.5**                     | Padrão já existe no projeto                |
| Criar componente Angular standalone simples        | **Claude Haiku 4.5** ou **GPT-5.4 mini** | Baseado em componente existente            |
| Criar store NgRx Signals do zero                   | **Claude Sonnet 5**                      | Múltiplos arquivos, lógica de estado       |
| Implementar service com múltiplos métodos e erro   | **Claude Sonnet 5** ou **GPT-5.3 Codex** | Precisa cruzar spec + design               |
| Criar SDD completo (proposal + design + tasks)     | **Claude Sonnet 5**                      | Decisões técnicas e trade-offs             |
| Debugar comportamento inesperado (1–2 tentativas)  | **Claude Sonnet 5**                      | Análise pontual                            |
| Revisão de PR com diff no contexto                 | **Claude Sonnet 5**                      | Análise cruzada de arquivos                |
| Decisão arquitetural que afeta múltiplos módulos   | **Claude Sonnet 5** (thinking LOW)       | Raciocínio profundo controlado             |
| Bug que ninguém consegue isolar após 3+ tentativas | **Claude Opus 4.8** ou **GPT-5.5**       | **Único cenário válido para top-tier**     |
| Análise de segurança em fluxo de pagamento         | **Claude Opus 4.8**                      | Risco alto justifica custo                 |
| Bug de condição de corrida no store                | **Claude Opus 4.8** (thinking LOW)       | Complexidade máxima                        |

### Exemplo real no recr-fed-agc-posvenda

Você precisa implementar a feature de **exibição do histórico de renegociações** de um cliente. Veja como calibrar o modelo em cada etapa:

```
ETAPA 1 — Exploração (Ask mode)
  Pergunta: "Quais stores existentes podem ser reaproveitados para o histórico?"
  Modelo: Claude Haiku 4.5  →  conversa leve, sem código
  Custo estimado: ~500 tokens

ETAPA 2 — Criação do SDD (Plan mode)
  Tarefa: criar proposal.md + design.md + tasks.md
  Modelo: Claude Sonnet 5  →  decisões de design
  Custo estimado: ~3.000–5.000 tokens

ETAPA 3 — Implementação das tasks (Agent mode)
  T01: criar interface RenegociacaoHistorico
  Modelo: Claude Haiku 4.5  →  spec clara, output previsível
  Custo estimado: ~800 tokens

  T02: criar RenegociacaoHistoricoStore (NgRx Signals)
  Modelo: Claude Sonnet 5  →  lógica de estado
  Custo estimado: ~2.000 tokens

  T03: criar RenegociacaoHistoricoComponent (Web Component)
  Modelo: Claude Haiku 4.5  →  baseado em componente existente
  Custo estimado: ~1.200 tokens

TOTAL ESTIMADO DA FEATURE: ~7.500–10.000 tokens
USANDO OPUS EM TUDO: ~40.000–60.000 tokens (4–6× mais caro)
```

---

## 🧠 4. Thinking effort: raciocínio estendido

Modelos como Claude Opus 4.8 e GPT-5.5 suportam **modo de raciocínio estendido**. Quando ativo, o modelo "pensa em voz alta" antes de responder — consumindo tokens extras que não aparecem na resposta, mas são cobrados.

| **Nível de thinking** | **Tokens extras aproximados** |
| --------------------- | ----------------------------- |
| LOW                   | 1.000–3.000                   |
| MEDIUM                | 5.000–10.000                  |
| HIGH                  | 10.000–50.000                 |

**Quando justifica usar thinking:**

- Resolução de bugs que persistem após 3+ tentativas
- Planejamento arquitetural com impacto em múltiplos módulos
- Análise de trade-offs com restrições conflitantes
- Debug de condição de corrida ou comportamento assíncrono complexo

**Quando NÃO usar thinking:**

- Qualquer task com spec clara no `tasks.md`
- Criação de interfaces, models e componentes simples
- Escrita de testes unitários com padrão já definido
- Autocompletar, refatorações pequenas, ajustes de lint

> Para qualquer tarefa do ciclo SDD do dia a dia, **mantenha o thinking desabilitado**. Ative apenas quando puder documentar por que o nível anterior não foi suficiente.

---

## 📦 5. Janela de contexto: o custo invisível

Cada conversa acumula tokens. Tudo que está visível no chat — histórico de mensagens, arquivos referenciados, respostas anteriores — é reenviado ao modelo a cada nova mensagem.

Uma sessão longa com vários arquivos abertos pode chegar a **50.000–100.000 tokens de contexto antes de você digitar uma palavra**.

### O que infla o contexto sem você perceber

> ⛔ **COMPORTAMENTOS QUE INFLAM O CONTEXTO**
>
> → Usar @workspace
> Lê o projeto inteiro. Pode consumir toda a cota em uma única chamada.
> NUNCA use @workspace.
>
> → Continuar uma sessão antiga por conveniência
> O histórico acumulado é reenviado inteiro a cada mensagem.
> Inicie uma nova sessão para cada tarefa distinta.
>
> → Referenciar arquivos sem necessidade
> Cada #readFile adiciona o conteúdo do arquivo ao contexto.
> Referencie apenas o que a tarefa atual precisa.
>
> → Deixar arquivos grandes abertos no editor
> O VS Code pode incluir o arquivo ativo no contexto automaticamente.
> Feche o que não for relevante para a tarefa.

### Boas práticas de gestão de contexto

> 💡 **COMPORTAMENTOS QUE REDUZEM CUSTO**
>
> → Use #readFile com precisão cirúrgica
> Aponte para o arquivo exato que a tarefa precisa.
> Exemplo: #readFile src/app/features/posvenda/stores/renegociacao.store.ts
>
> → Use #fileSearch para localizar antes de ler
> Quando não souber o caminho exato, busque primeiro.
> Exemplo: #fileSearch renegociacao.store
>
> → Inicie nova sessão para cada tarefa
> Custo do contexto começa do zero. Sessão limpa = contexto mínimo.
>
> → Faça perguntas objetivas
> Uma pergunta direta gera resposta direta. Evite conversas exploratórias longas
> com o modelo premium — use Haiku para isso.

---

## 💾 6. Cache de sessão: economia sem esforço

O GitHub Copilot implementa **cache de prompt**: quando o mesmo prefixo de contexto é enviado em chamadas consecutivas dentro da mesma sessão, o modelo não reprocessa esse trecho — e você não paga por ele novamente.

Na prática, isso significa que manter **uma única sessão de chat** para todo o ciclo de uma feature é muito mais econômico do que abrir sessões separadas para cada etapa.

**Comparação direta:**

```
❌ INEFICIENTE — sessões separadas para cada etapa SDD

  [Sessão A] → cria proposal.md    (contexto base reprocessado: 3.000 tokens)
  [Sessão B] → cria design.md      (contexto base reprocessado: 3.000 tokens)
  [Sessão C] → cria tasks.md       (contexto base reprocessado: 3.000 tokens)
  [Sessão D] → implementa T01      (contexto base reprocessado: 3.000 tokens)
  Custo de contexto repetido: ~12.000 tokens

✅ EFICIENTE — mesma sessão para todo o ciclo

  [Sessão única] → proposal → design → tasks → T01 → T02 → T03
  Contexto base processado: 3.000 tokens (apenas na primeira vez)
  Incrementos subsequentes: ~300–500 tokens por mensagem
  Custo de contexto repetido: ~3.000 tokens (economizou ~9.000)
```

**Regra de ouro do cache:** abra uma sessão para cada feature, não para cada arquivo.

---

## ⚠️ 7. Modo Auto: por que evitar no banco

O modo **Auto** delega a escolha do modelo ao sistema, que seleciona automaticamente o que considera mais adequado para cada prompt.

O problema no contexto do banco: o Auto pode escalar para Opus ou GPT-5.5 em prompts simples — sem aviso, sem controle, debitando créditos premium por tarefas que o Haiku resolveria.

| **Cenário**                      | **Auto é vantajoso?**                        |
| -------------------------------- | -------------------------------------------- |
| Time com créditos ilimitados     | ✅ Sim — sempre o melhor modelo              |
| **Banco com 7.500 créditos/mês** | ❌ Não recomendado — perde controle de custo |
| Aprendizado e experimentação     | ⚠️ Com cautela — monitore o gasto            |

**Conclusão:** no nosso contexto, **sempre escolha o modelo manualmente**. Calibre pela complexidade real da tarefa, não pelo hábito.

---

## ⚙️ 8. Configurações de alto custo no VS Code

Algumas configurações aumentam a autonomia da IA, mas têm custo elevado. Conheça-as para entender como o harness funciona — mas **não as recomendamos para uso no banco**.

| **Configuração**                                        | **O que faz**                                              | **Impacto em créditos**                        |
| ------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| `github.copilot.chat.agent.autoFix: true`               | Agente corrige automaticamente erros de build/test         | Alto — múltiplos rounds sem supervisão         |
| `github.copilot.renameSuggestions.triggerAutomatically` | Sugere renomes em tempo real                               | Médio — chamadas constantes ao modelo          |
| Multi-file edits sem `#readFile` explícito              | O agente varre o projeto inteiro para decidir o que editar | **Muito alto** — equivalente a um `@workspace` |
| Thinking automático em modo agent                       | Raciocina extensivamente antes de cada ação                | Alto — cada round consome +5.000 tokens        |

> Conhecer essas configurações é importante para entender o comportamento do harness. Usá-las no banco significa gastar a cota do mês em poucos dias.

---

## ✅ 9. Checklist de economia — consulte antes de abrir o chat

```
Antes de iniciar uma sessão:
  □ Qual a complexidade real desta tarefa? (define o modelo)
  □ Tenho uma sessão recente sobre esta feature? (use o cache)
  □ Quais arquivos vou precisar referenciar? (liste antes de abrir)
  □ Minha pergunta está clara e objetiva? (evita rounds desnecessários)

Durante a sessão:
  □ Estou usando #readFile e #fileSearch em vez de @workspace?
  □ Estou no modelo mais leve que resolve o problema?
  □ Thinking está desabilitado para esta tarefa?
  □ Estou iniciando nova sessão para tarefas não relacionadas?

Se os créditos estiverem baixos:
  □ Prefira Haiku 4.5 ou GPT-5 mini para tudo que não for crítico
  □ Evite modo Agent — use Ask para planejar e execute manualmente
  □ Desative thinking em todos os modelos
  □ Reduza o tamanho dos arquivos referenciados com #readFile seletivo
```

---

## 📊 10. Resumo rápido para consulta diária

| **Situação**                               | **Modelo** | **Modo**  | **Thinking** |
| ------------------------------------------ | ---------- | --------- | ------------ |
| Autocompletar, boilerplate                 | Haiku 4.5  | Inline    | Off          |
| Exploração, perguntas rápidas              | Haiku 4.5  | Ask       | Off          |
| Criar interface, model, componente simples | Haiku 4.5  | Ask/Agent | Off          |
| Escrever testes Jest                       | Haiku 4.5  | Agent     | Off          |
| Store NgRx Signals, service complexo       | Sonnet 5   | Agent     | Off          |
| SDD completo (proposal + design + tasks)   | Sonnet 5   | Plan      | Off          |
| Revisão de PR, análise de diff             | Sonnet 5   | Ask       | Off          |
| Debug difícil (1–2 tentativas)             | Sonnet 5   | Ask       | Off          |
| Decisão arquitetural com impacto amplo     | Sonnet 5   | Plan      | LOW          |
| Bug persistente após 3+ tentativas         | Opus 4.8   | Ask       | LOW          |
| Análise de segurança em fluxo crítico      | Opus 4.8   | Ask       | LOW          |

---

## 🔗 Referências

- [GitHub Copilot is Moving to Usage-Based Billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/)
- [O que são Tokens e Como Contá-los? — OpenAI](https://help.openai.com/pt-br/articles/4936856-what-are-tokens-and-how-to-count-them)
- [Por que Escrevo Meus Prompts em Inglês? — Code Capital](https://codecapital.substack.com/p/por-que-escrevo-meus-prompts-em-ingles)
- [Optimize AI Credit Usage — VS Code Docs](https://code.visualstudio.com/docs/agents/guides/optimize-usage)

---

_Documento: 01 — Tokens, Custos e Escolha de Modelos | Junho 2026_
_Próximo: [02 — Harness Engineering](./02-harness-engineering.md)_
