---
name: depuracao-sistematica
description: Use ao encontrar qualquer bug, teste falhando, erro de build ou comportamento inesperado — antes de propor qualquer correção.
---

# Depuração sistemática

**Princípio central:** achar a causa raiz ANTES de qualquer correção. Corrigir sintoma é falha.

Violar a letra deste processo é violar o espírito da depuração.

## Lei de Ferro

```
NENHUMA CORREÇÃO SEM INVESTIGAÇÃO DE CAUSA RAIZ ANTES
```

Se a Fase 1 não foi concluída, você não pode propor correção.

## Quando usar

Qualquer problema técnico: teste falhando, bug em produção, comportamento inesperado, problema de performance, falha de build, erro de integração.

**Especialmente quando:**

- há pressão de prazo (urgência torna o chute tentador)
- "é só uma correção rápida" parece óbvio
- você já tentou várias correções
- a correção anterior não funcionou
- você não entende o problema por completo

**Não pule quando:**

- o problema parece simples — bug simples também tem causa raiz
- você está com pressa — pressa garante retrabalho
- pediram para resolver AGORA — sistemático é mais rápido que tentativa e erro

## As quatro fases

Conclua cada fase antes de passar para a próxima.

### Fase 1 — Investigação da causa raiz

**ANTES de tentar QUALQUER correção:**

1. **Leia a mensagem de erro inteira.** Não pule erros nem warnings — frequentemente contêm a solução exata. Leia o stack trace completo. Anote número de linha, caminho de arquivo e código do erro.

2. **Reproduza de forma consistente.** Você consegue disparar o bug de forma confiável? Quais são os passos exatos? Acontece toda vez? Se não reproduz, colete mais dados — não chute.

3. **Verifique o que mudou.** `git diff`, commits recentes, dependência nova, mudança de config, diferença de ambiente.

4. **Colete evidência em sistemas multi-componente.**

   **QUANDO o sistema tem múltiplos componentes** (shell → remote → BFF → downstream; pipeline → build → publicação):

   **ANTES de propor correção, adicione instrumentação de diagnóstico:**

   ```
   Para CADA fronteira entre componentes:
     - registre o que ENTRA no componente
     - registre o que SAI do componente
     - confirme a propagação de config/ambiente
     - inspecione o estado em cada camada

   Rode UMA vez para produzir evidência de ONDE quebra
   ENTÃO analise a evidência para identificar o componente que falha
   ENTÃO investigue aquele componente específico
   ```

   **Exemplo (integração federada):**

   ```
   # Camada 1 — shell: o manifest resolveu para qual URL neste ambiente?
   # Camada 2 — remote: o custom element montou? qual versão do bundle?
   # Camada 3 — fronteira de atributos: quais valores o shell entregou, e quando?
   # Camada 4 — chamada HTTP: URL final, status, correlation-id
   # Camada 5 — BFF: o request chegou? com quais headers? o downstream respondeu o quê?
   ```

   **Isso revela:** qual camada falha (shell → remote ✓, remote → BFF ✗). Sem isso, você adivinha entre cinco suspeitos.

5. **Rastreie o fluxo de dados.**

   **QUANDO o erro está fundo na pilha de chamadas:** veja [`references/rastreio-causa-raiz.md`](references/rastreio-causa-raiz.md) para a técnica completa de rastreio para trás.

   **Versão curta:** onde o valor ruim se origina? Quem chamou isto com o valor ruim? Continue subindo até achar a origem. Corrija na origem, não no sintoma.

### Fase 2 — Análise de padrão

**Ache o padrão antes de corrigir:**

1. **Ache exemplos que funcionam.** Localize código similar e funcionando no mesmo repositório. O que funciona que é parecido com o que está quebrado?

2. **Compare contra a referência.** Se está implementando um padrão, leia a implementação de referência POR COMPLETO. Não passe o olho — leia cada linha. Entenda o padrão inteiro antes de aplicar.

3. **Identifique as diferenças.** O que difere entre o que funciona e o que quebra? Liste toda diferença, por menor que seja. Não assuma "isso não pode importar".

4. **Entenda as dependências.** De que outros componentes isto precisa? Quais configs, settings, variáveis de ambiente? Que premissas assume?

> Se o repositório tiver um catálogo de modos de falha da arquitetura (por exemplo a skill `federation-triage`), consulte-o aqui: ele encurta a Fase 2, não substitui a Fase 1.

### Fase 3 — Hipótese e teste

**Método científico:**

1. **Formule UMA hipótese.** Enuncie claramente: "acho que X é a causa raiz porque Y". Escreva. Seja específico, não vago.

2. **Teste de forma mínima.** Faça a MENOR mudança possível para testar a hipótese. Uma variável por vez. Não corrija várias coisas ao mesmo tempo.

3. **Verifique antes de continuar.** Funcionou? Sim → Fase 4. Não funcionou? Formule uma hipótese NOVA. NÃO empilhe mais correções por cima.

4. **Quando você não sabe.** Diga "eu não entendo X". Não finja que sabe. Peça ajuda. Pesquise mais.

### Fase 4 — Implementação

**Corrija a causa raiz, não o sintoma:**

1. **Crie um caso de teste que falha.** A reprodução mais simples possível. Teste automatizado se houver framework; script descartável se não houver. É OBRIGATÓRIO ter antes de corrigir. Se o repositório tiver instrução ou skill de testes (por exemplo `testing.instructions.md`), siga-a ao escrever esse teste.

2. **Implemente UMA correção.** Ataque a causa raiz identificada. UMA mudança por vez. Nada de melhoria "já que estou aqui". Nada de refatoração no mesmo pacote.

3. **Verifique.** O teste passa agora? Nenhum outro teste quebrou? O sintoma original desapareceu no cenário real, não só no teste? Só declare resolvido com as três respostas afirmativas e a evidência colada.

4. **Se a correção não funcionar.** PARE. Conte: quantas correções você já tentou?
   - Se < 3 → volte à Fase 1 e reanalise com a informação nova.
   - **Se ≥ 3 → PARE e questione a arquitetura (item 5).**
   - NÃO tente a correção nº 4 sem discussão arquitetural.

5. **Se 3 ou mais correções falharam: questione a arquitetura.**

   **Padrão que indica problema arquitetural:**
   - cada correção revela novo estado compartilhado / acoplamento / problema em outro lugar
   - as correções exigem "refatoração massiva" para serem implementadas
   - cada correção cria sintomas novos em outro ponto

   **PARE e questione os fundamentos:**
   - este padrão é fundamentalmente sólido?
   - estamos mantendo isso por pura inércia?
   - deveríamos refatorar a arquitetura em vez de continuar corrigindo sintomas?

   **Discuta com a pessoa responsável antes de tentar mais correções.**

   Isto NÃO é uma hipótese falha — é arquitetura errada.

## Sinais de alerta — PARE e volte ao processo

Se você se pegar pensando:

- "correção rápida agora, investigo depois"
- "vou só mudar X e ver se resolve"
- "adiciono várias mudanças e rodo os testes"
- "pulo o teste, valido na mão"
- "provavelmente é X, deixa eu corrigir"
- "não entendi por completo, mas isso talvez funcione"
- "o padrão diz X, mas vou adaptar diferente"
- "os principais problemas são: [lista correções sem ter investigado]"
- propor solução antes de rastrear o fluxo de dados
- **"só mais uma tentativa" (com 2 ou mais já tentadas)**
- **cada correção revela um problema novo em outro lugar**

**Todos significam: PARE. Volte à Fase 1.**

**Se 3 ou mais correções falharam:** questione a arquitetura (Fase 4.5).

## Sinais da pessoa de que você está errando

- "isso não está acontecendo?" — você assumiu sem verificar
- "isso vai nos mostrar...?" — você deveria ter coletado evidência
- "para de chutar" — você está propondo correção sem entender
- "pensa a fundo nisso" — questione fundamentos, não sintomas
- "a gente travou?" (frustração) — sua abordagem não está funcionando

**Ao ver qualquer um destes:** PARE. Volte à Fase 1.

## Racionalizações comuns

| Desculpa | Realidade |
|---|---|
| "É simples, não precisa de processo" | Bug simples também tem causa raiz. Para bug simples o processo é rápido. |
| "É emergência, não dá tempo" | Depuração sistemática é MAIS RÁPIDA que tentativa e erro. |
| "Tento isso primeiro, investigo depois" | A primeira correção define o padrão. Faça certo desde o início. |
| "Escrevo o teste depois de confirmar a correção" | Correção sem teste não se sustenta. O teste antes é o que prova. |
| "Várias correções de uma vez economiza tempo" | Você não consegue isolar o que funcionou. E cria bugs novos. |
| "A referência é longa, adapto o padrão" | Entendimento parcial garante bug. Leia por completo. |
| "Já vi o problema, deixa eu corrigir" | Ver o sintoma ≠ entender a causa raiz. |
| "Só mais uma tentativa" (após 2 falhas) | 3 falhas = problema arquitetural. Questione o padrão, não corrija de novo. |

## Referência rápida

| Fase | Atividades | Critério de conclusão |
|---|---|---|
| **1. Causa raiz** | ler erros, reproduzir, ver o que mudou, coletar evidência | entender O QUÊ e POR QUÊ |
| **2. Padrão** | achar exemplo que funciona, comparar | diferenças identificadas |
| **3. Hipótese** | formular teoria, testar minimamente | confirmada ou nova hipótese |
| **4. Implementação** | criar teste, corrigir, verificar | bug resolvido, testes passando |

## Quando o processo revela "não há causa raiz"

Se a investigação sistemática mostrar que o problema é de fato ambiental, dependente de temporização ou externo:

1. você concluiu o processo
2. documente o que investigou
3. implemente o tratamento adequado (retry, timeout, mensagem de erro)
4. adicione monitoramento/log para a investigação futura

**Mas:** 95% dos casos de "não há causa raiz" são investigação incompleta.

## Técnicas de apoio

Carregam sob demanda, só quando o corpo acima apontar para elas:

- [`references/rastreio-causa-raiz.md`](references/rastreio-causa-raiz.md) — rastrear o bug para trás na pilha até o gatilho original
- [`references/defesa-em-profundidade.md`](references/defesa-em-profundidade.md) — validar em todas as camadas depois de achar a causa raiz
- [`references/espera-por-condicao.md`](references/espera-por-condicao.md) — trocar timeout arbitrário por polling de condição em teste instável
