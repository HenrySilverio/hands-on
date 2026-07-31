# Roteiro de Fala — Hands-on: IA com Eficiência

## Menos token. Mais valor.

**Duração:** 60 minutos | **Formato:** conceito (35 min) + prática ao vivo na IDE (20 min) + fechamento (5 min)
**Projeto de demonstração:** `recr-fed-agc-posvenda`

---

## ⏱️ Mapa de tempo (cole isso num post-it e deixe do lado do teclado)

| Bloco | Tempo | Acumulado | Título |
|---|---|---|---|
| 0 | 5 min | 05:00 | Abertura — por que essa hora importa |
| 1 | 7 min | 12:00 | O preço de cada palavra: cobrança, token, idioma e contexto |
| 2 | 7 min | 19:00 | Harness Engineering — a analogia do carro |
| 3 | 7 min | 26:00 | O mapa dos recursos: qual problema cada um resolve |
| 4 | 8 min | 34:00 | SDD — de onde veio, o que é, os 4 artefatos, o fluxo |
| 5 | 3 min | 37:00 | Por que juntos: Agent + Prompt File + Skill |
| 6 | 18 min | 55:00 | **Hands-on ao vivo — do requisito ao código** |
| 7 | 5 min | 60:00 | Fechamento e o que fazer amanhã |

> ⚠️ **Regra de disciplina do apresentador:** se aos 37 minutos você ainda estiver falando de conceito, **corte o bloco 3 pela metade e vá para a IDE**. A parte prática é o que fixa. Ao final deste documento há uma seção de cortes de emergência.

---

# 🎬 BLOCO 0 — ABERTURA (5 min)

**Slide:** título grande — `IA com eficiência. Menos token. Mais valor.`

## Roteiro de fala

### Passo 1 — Abra com uma pergunta, não com uma agenda (60s)

> "Antes de eu falar qualquer coisa, quero uma resposta honesta e por levantar a mão.
>
> Quem aqui já pediu um componente pro Copilot e recebeu de volta um componente com `NgModule`, `@Input()` e estado local — num projeto que é 100% standalone, signals e NgRx Signals Store?
>
> [espere as mãos]
>
> Beleza. Agora a segunda: quem, depois disso, corrigiu o modelo três, quatro, cinco vezes até sair o que você queria?
>
> [espere]
>
> Guardem essa cena. Ela é o assunto desta hora inteira. Porque cada uma dessas correções, a partir de junho, **tem preço**."

### Passo 2 — Coloque o número na mesa (60s)

> "Mudou o jogo. O Copilot saiu da mensalidade fixa e entrou em cobrança por uso: **GitHub AI Credits**. A cota do nosso plano Business é de **7.500 créditos por mês**, por usuário.
>
> Dividam por 20 dias úteis. Dá **375 créditos por dia**. E quando acaba, acaba — o serviço para pra você até a renovação.
>
> Aquela cena das cinco correções? Ela custava tempo. Agora ela custa tempo **e** cota."

### Passo 3 — Faça o reframe (essa é a frase da apresentação) (60s)

> "Agora eu preciso ser muito claro sobre uma coisa, porque é fácil entender errado o que eu vim fazer aqui.
>
> **Eu não vim pedir pra vocês usarem menos IA. Eu vim mostrar como usar IA com pontaria.**
>
> A diferença entre um dev que queima 15.000 tokens numa tarefa e um dev que resolve a mesma tarefa com 3.000 não é talento. Não é o modelo — os dois têm acesso aos mesmos modelos. Não é senioridade.
>
> A diferença é **o que está configurado em volta do modelo**. E isso tem nome, tem técnica e dá pra montar em vinte minutos. É isso que vocês vão levar daqui."

### Passo 4 — A promessa concreta (60s)

> "Em uma hora, vocês saem com três coisas:
>
> **Um:** uma tabela de decisão de modelo por tarefa — pra parar de usar canhão em mosquito.
> **Dois:** um harness configurado — instructions, agents, skills, hooks e prompt files. Vou montar na frente de vocês.
> **Três:** um fluxo de Spec-Driven Development que vocês conseguem rodar amanhã, na sua demanda real, sem framework nenhum.
>
> E vou fazer isso num projeto de verdade, o `recr-fed-agc-posvenda`. Não é exemplo de tutorial. É o nosso código."

### Passo 5 — Contrato com a plateia (60s)

> "Duas regras pra essa hora funcionar:
>
> Primeira: **interrompam**. Se eu falar algo que não fez sentido, corta na hora. É mais barato pra todos do que vocês descobrirem sozinhos depois.
>
> Segunda: esse conteúdo todo está documentado no Confluence — vou passar o link no fim. Então **não anotem tudo**. Anotem só o que você vai aplicar na sua demanda desta semana.
>
> Vamos começar pela parte que ninguém gosta de falar: dinheiro."

**🔗 Transição:** *"Pra falar de custo, eu preciso primeiro que vocês entendam o que exatamente está sendo cobrado. E não é 'pergunta'. É token."*

---

# 💳 BLOCO 1 — O PREÇO DE CADA PALAVRA (7 min)

**Slide único:** novo padrão de cobrança · token como unidade · português vs. inglês · janela de contexto

## 1.1 — O novo padrão de cobrança (60s)

**No slide:** `Assinatura fixa ➜ GitHub AI Credits (jun/2026)`

> "Antes: mensalidade fixa. Você usava muito ou pouco, pagava igual. O incentivo era usar o máximo possível.
>
> Agora: **consumo medido e debitado**. Cada chamada ao modelo, cada linha de contexto que você manda, cada linha que ele gera — tudo entra na conta.
>
> Isso muda o comportamento certo de duas formas. Primeira: prompt vago virou caro, porque gera round de correção. Segunda: modelo premium em tarefa boba virou desperdício mensurável — antes era invisível.
>
> E tem um detalhe que quase ninguém percebe: você paga **duas vezes** por interação. Paga pra ele **ler** o que você mandou, o input. E paga pra ele **gerar** a resposta, o output. Nos modelos premium, o output custa cerca de **3× mais** que o input."

## 1.2 — O que é um token (90s)

**No slide:** tabela de referência

> "Token é a unidade com que o modelo processa texto. Não é palavra. Não é caractere. É um pedaço de texto que o modelo aprendeu a reconhecer como uma unidade.
>
> Pra vocês terem régua mental:
>
> - Uma palavra em inglês: **~1,3 token**
> - Uma palavra em português: **~1,5 a 2 tokens**
> - Uma linha de TypeScript: **~10 a 20 tokens**
> - Um store NgRx Signals completo: **~800 a 1.500 tokens**
> - Uma página de texto corrido: **~500 a 800 tokens**
>
> Então quando você joga cinco arquivos no contexto 'só pra garantir', você acabou de mandar entre 4.000 e 7.000 tokens antes de digitar a sua pergunta. E vai mandar de novo na próxima mensagem. E na próxima."

**💡 Se alguém perguntar "por que não é palavra?":**
> "Porque o modelo trabalha com um vocabulário fixo de fragmentos. `renegociacao` não está nesse vocabulário — então ele quebra em `reneg` + `ocia` + `cao`, três tokens pra uma palavra. Já `service` está inteiro no vocabulário: um token."

## 1.3 — Português vs. inglês: o número e a nuance (2 min)

**No slide:**
```
"Implement the customer balance service"    →  ~6 tokens
"Implemente o serviço de saldo do cliente"  →  ~9 tokens
```

> "O vocabulário desses modelos foi treinado majoritariamente em inglês. Palavra em português que não está no vocabulário é quebrada em fragmentos. Resultado: **cerca de 50% mais tokens pra dizer exatamente a mesma coisa.**
>
> Numa sessão longa, com 50 prompts, isso é centenas de tokens jogados fora só na tradução.
>
> **Mas agora eu preciso ser honesto com vocês, porque essa é a parte que costuma ser mal contada.**"

**No slide (segunda linha, destaque):** `Prompt ruim em inglês > Prompt ruim em português. Em custo.`

> "O erro que eu quero evitar que vocês cometam é sair desta sala escrevendo tudo em inglês ruim.
>
> Se você escreve um prompt **mal estruturado** em inglês — inglês travado, ambíguo, com a regra de negócio pela metade — você economizou 3 tokens no prompt e comprou **três rounds de correção**. Cada round reenvia o contexto inteiro. Você economizou 3 e gastou 4.000.
>
> A regra prática, e escrevam essa:
>
> - **Inglês** para o que é técnico e curto: nomes de método, comandos, caminhos de arquivo, instruções imperativas de padrão. `Create a standalone component using inject() and input() signals.`
> - **Português** para regra de negócio complexa, onde precisão semântica vale mais que economia. Explicar como funciona uma renegociação de dívida em inglês macarrônico é o caminho mais caro que existe.
>
> **O idioma é uma otimização de segunda ordem. Clareza é de primeira ordem.** Nunca troque clareza por idioma."

## 1.4 — Controle da janela de contexto (2 min 30s)

**No slide:** `A janela de contexto é o tanque. Tudo que está na conversa é reenviado a cada mensagem.`

> "Aqui está o custo que ninguém vê no extrato.
>
> Toda vez que você aperta Enter, **não vai só a sua mensagem**. Vai a conversa inteira: todo o histórico, todos os arquivos que você referenciou, todas as respostas anteriores. Tudo. De novo.
>
> Uma sessão longa, com vários arquivos abertos, chega tranquilamente a **50.000 a 100.000 tokens de contexto antes de você digitar a primeira letra** da sua nova pergunta.
>
> Quatro coisas inflam o contexto e vocês fazem todas sem perceber:"

**No slide — os quatro vilões:**

> "**Um: `@workspace`.** Ele lê o projeto inteiro. Uma única chamada pode consumir a sua cota do dia. **Não use. Nunca.** Não é 'evite' — é não use.
>
> **Dois: continuar sessão antiga por conveniência.** Aquela aba de chat de anteontem que você não fechou. Todo o histórico dela é reenviado. Tarefa nova, sessão nova.
>
> **Três: referenciar arquivo por precaução.** Cada `#readFile` cola o arquivo inteiro no contexto. 'Ah, vou mandar o store também porque vai que...' — esse 'vai que' custa 1.500 tokens por mensagem.
>
> **Quatro: arquivo grande aberto no editor.** O VS Code manda o arquivo ativo automaticamente. Fecha o que não é da tarefa."

**No slide — os substitutos:**

> "E o que fazer no lugar. Três coisas:
>
> **`#readFile` cirúrgico** — o arquivo exato, o caminho exato. `#readFile src/app/features/posvenda/stores/renegociacao.store.ts`. Não a pasta. O arquivo.
>
> **`#fileSearch` antes de ler** — quando você não sabe o caminho, busca primeiro, lê depois. Buscar é barato; ler o projeto inteiro pra achar é o `@workspace` disfarçado.
>
> **E o contra-intuitivo: cache de sessão.** Eu acabei de dizer 'tarefa nova, sessão nova'. Agora eu digo: **uma sessão por feature, não uma sessão por arquivo.**
>
> Parece contradição, mas não é. O Copilot faz cache do prefixo de contexto: se o começo da conversa é o mesmo, ele não reprocessa — e você não paga de novo. Então:
>
> - Quatro sessões separadas pra fazer proposal, design, tasks e T01: você reprocessa o contexto base quatro vezes. **~12.000 tokens.**
> - Uma sessão só, do plano até a última task: contexto base processado **uma vez**. ~3.000 tokens, e depois incrementos de 300 a 500 por mensagem.
>
> Economia de 9.000 tokens por feature, sem mudar uma linha de código. Só não fechando a aba.
>
> **A regra:** sessão nova quando muda a *feature*. Sessão mantida enquanto é a *mesma* feature."

**🔗 Transição:** *"Tudo isso que eu falei — modelo, contexto, arquivo, sessão — parece uma lista de dicas soltas. Não é. Tudo isso é uma coisa só, e essa coisa tem nome. E pra explicar o nome, eu vou falar de carro."*

---

# 🏎️ BLOCO 2 — HARNESS ENGINEERING: A ANALOGIA DO CARRO (7 min)

**Slide:** um carro esquematizado, com as peças nomeadas

## 2.1 — Construa a analogia peça por peça (3 min)

> "O termo **harness** vem da engenharia de testes. Um *test harness* é o conjunto de fixtures, ferramentas e configuração que cria o ambiente controlado onde o teste roda. O conceito foi levado pra IA: um **AI harness** é tudo que você configura em volta do modelo pra que ele se comporte como você quer — sem você precisar repetir isso em cada prompt.
>
> Vamos por carro, que é mais fácil.

> **O modelo é o motor.**
>
> Você não constrói o motor. Você não treina o Claude. Você **escolhe** o motor: Haiku, Sonnet, Opus. É a única peça que vem pronta e que você só seleciona.
>
> **O harness é literalmente todo o resto do carro.**
>
> E aqui está o ponto que eu quero que vocês levem: **motor de Fórmula 1 em chassi de kart não anda.** Você tem potência que não consegue colocar no chão. Faz barulho, queima combustível, e sai da pista na primeira curva.
>
> É exatamente o que acontece quando alguém pega o Opus, o modelo mais caro que temos, e manda 'cria um componente de listagem' sem nenhum contexto. Potência máxima, chassi zero. Custou caro e saiu errado."

**Agora mapeie peça por peça — vá apontando no slide:**

| Peça do carro | Peça do harness | A frase pra falar |
|---|---|---|
| **Motor** | Modelo (Haiku/Sonnet/Opus) | "Você escolhe, não constrói." |
| **Combustível** | Tokens | "Acaba. E tem preço." |
| **Tanque** | Janela de contexto | "Tem limite. E você reabastece a cada mensagem." |
| **Câmbio / marchas** | Escolha de modelo por tarefa | "Ninguém sai da garagem em quinta marcha. Nem usa Opus pra criar uma interface." |
| **Direção alinhada** | Custom Instructions | "Carro alinhado anda reto sozinho. Desalinhado você corrige o volante a cada 3 segundos." |
| **GPS / rota traçada** | SDD — proposal, design, tasks, spec | "Saber pra onde vai antes de dar a partida." |
| **Manual da montadora / peça original** | Skills | "Como *esta* peça é feita *neste* carro." |
| **Perfil de motorista salvo** | Prompt Files | "Um clique e o assento, o espelho e o rádio já estão no seu ponto." |
| **Freio ABS e cinto** | Hooks | "Atuam quer o motorista queira ou não. Não é pedido — é garantia." |
| **Quem senta na cadeira** | Custom Agents | "Piloto de rally, piloto de teste, inspetor. Cada um com a habilitação e as ferramentas do seu serviço." |
| **O piloto** | **Você, o desenvolvedor** | "Não existe autônomo nível 5 aqui. Quem responde pelo código no banco é o piloto." |

## 2.2 — Bem configurado vs. mal configurado (3 min)

**Slide:** duas colunas — mesmo pedido, mesmo modelo, mesmo projeto

> "Agora o que eu prometi: a diferença. **Mesma estrada, mesmo motor, mesmo destino.** Um carro alinhado e um desalinhado.

> **Carro desalinhado — sem harness.**
>
> Dev digita: *'Crie um componente de listagem de renegociações.'*
>
> O que o modelo recebe: instrução genérica padrão do Copilot. Contexto: **nenhum**.
>
> O que volta:
> - Componente com `NgModule` — e o projeto é standalone
> - `@Input()` e `@Output()` decorators — e o projeto usa signals
> - Estado local no componente — e o projeto usa NgRx Signals Store
> - Zero teste
>
> **Rounds de correção: 3 a 5. Custo: 8.000 a 15.000 tokens.**
>
> E repare no que aconteceu: o dev corrigiu o volante cinco vezes pra manter o carro na faixa. Cada correção é combustível queimado pra ficar no mesmo lugar.

> **Carro alinhado — com harness.**
>
> Dev digita **exatamente a mesma frase**: *'Crie um componente de listagem de renegociações.'*
>
> O que o modelo recebe agora:
> - **System:** instructions com stack Angular 21, padrões do projeto, convenções de nomenclatura, regras de segurança do banco
> - **Contexto:** o `spec.md` da feature + um componente similar via `#readFile`
> - **Agent:** modo de implementação, com as ferramentas certas — e só elas
>
> O que volta:
> - Standalone correto
> - `inject()`, `input()`, `output()`
> - Integrado ao store
> - Estrutura de teste Jest já incluída
>
> **Rounds de correção: 0 a 1. Custo: 2.000 a 4.000 tokens.**

> **A frase pra vocês levarem:**
>
> **A diferença entre os dois casos não é o modelo. É o contexto certo, no momento certo. E isso não é mágica — é configuração que você faz uma vez e usa todo dia.**
>
> De 3 a 5× mais barato. Com o mesmo prompt e o mesmo modelo."

## 2.3 — O diagnóstico (60s)

> "E um bônus prático, porque isso vai te salvar: quando o resultado vier ruim, **o sintoma te diz qual peça ajustar.**
>
> - Código **fora da stack** (NgModule, @Input) → as **instructions** não estão carregadas. Vá conferir o caminho.
> - Código no padrão, mas **ignora a regra de negócio** → falta **contexto**. Falta o `spec.md` no `#readFile`.
> - Agente **editando o que não devia** → falta **restringir ferramentas**. Crie um custom agent.
> - **Muitos rounds** de correção → prompt vago, spec incompleta, ou modelo subdimensionado. Nessa ordem de investigação.
> - **Consumo alto** por feature → modelo premium em tarefa simples, `@workspace`, ou sessão fragmentada.
>
> Parem de trocar o motor quando o problema é o alinhamento. Trocar de modelo é a solução mais cara e quase nunca é a certa."

**🔗 Transição:** *"Então o harness tem peças. Agora vamos ver cada peça de perto: o que é, e principalmente — qual problema específico ela resolve. Porque se você não sabe o problema, você vai configurar tudo e não usar nada."*

---

# 🧩 BLOCO 3 — O MAPA DOS RECURSOS: QUAL PROBLEMA CADA UM RESOLVE (7 min)

**Slide:** tabela `Recurso · O que é · Problema que resolve`

> "Sete peças. Pra cada uma eu vou dizer duas coisas: o que é, em uma frase; e qual dor ela mata. Se você só levar a coluna da dor, já foi suficiente."

## 3.1 — Custom Instructions (60s)

> "**O que é:** arquivos Markdown com as regras, padrões e contexto do projeto, que o Copilot carrega **automaticamente em toda sessão**. É o onboarding técnico do Copilot no seu projeto.
>
> **A dor que mata:** repetição. Você para de escrever 'use standalone', 'use inject()', 'segue o padrão do projeto' em cada prompt. Escreveu uma vez, valeu pra sempre.
>
> **Como escrever bem — três coisas:** seja específico ('use `standalone: true`, `inject()` e `OnPush`', não 'use boas práticas'); use **proibição explícita** — `NUNCA usar NgModule` funciona muito melhor que `prefira standalone`; e use o campo `applyTo` pra separar por contexto — regra de teste só carrega quando tem `.spec.ts` no contexto, e não polui o resto.
>
> ⚠️ **Governança:** no nosso ambiente o `copilot-instructions.md` na raiz **é bloqueado no push**. A alternativa oficial é a pasta `.github/instructions/` com arquivos `.instructions.md`, e você aponta o setting `chat.instructionsFilesLocations` pra ela. Tudo local, nada commitado."

## 3.2 — Prompt Files (45s)

> "**O que é:** um template de prompt que você invoca como slash command. `/criar-componente`, `/revisar-pr`, `/debug`. Vive em `.github/prompts/*.prompt.md`.
>
> **A dor que mata:** **inconsistência entre devs.** Hoje, cinco pessoas pedem 'cria um store' de cinco formas diferentes e recebem cinco resultados de qualidade diferente. Com prompt file, o time compartilha o mesmo prompt já testado e refinado.
>
> **O bônus que quase ninguém usa:** o prompt file define o **modelo** e o **modo**. O dev não precisa lembrar de trocar no dropdown — `/revisar-pr` já vem em modo `ask` sem permissão de editar; `/criar-componente` já vem em `agent` com `createFile`. Você embutiu a disciplina de custo dentro da ferramenta.
>
> **Quando criar:** quando a tarefa repete mais de 2× por semana no time."

## 3.3 — Custom Agents (75s)

> "**O que é:** uma persona pré-configurada com ferramentas, modelo e comportamento fixos. Você seleciona no dropdown e ele já sabe o que pode e o que não pode.
>
> **A dor que mata — e essa é a mais importante da apresentação:** o agente genérico tem **todas as ferramentas o tempo todo**. Ele pode editar código durante o planejamento. Pode 'ajudar além do pedido'. Pode antecipar três tasks que você não pediu.
>
> E aqui está o pulo do gato: **restrição estrutural, não comportamental.**
>
> Pedir 'não edite nada ainda' num prompt é um pedido — o modelo pode ignorar. Já se o agent `sdd-planner` **não tem a ferramenta `editFile` na lista**, ele fisicamente não consegue editar. Não é disciplina, é impossibilidade.
>
> Os três do nosso fluxo:
> - 🧭 **`sdd-planner`** — `readFile`, `search`, `createFile`. Sem `editFile`. Só planeja.
> - 🛠️ **`feature-implementer`** — implementa uma task e **para**, esperando validação.
> - 🔍 **`code-reviewer`** — `readFile` e `search`. Sem edição. Só reporta, nunca corrige sozinho.
>
> E tem os **handoffs**: botão no fim da resposta que passa pro próximo agent com o prompt pré-preenchido. Você não copia contexto na mão.
>
> **Ganho secundário e enorme: previsibilidade de custo.** Cada agent já vem com o modelo certo configurado. O teto de gasto de cada fase deixa de depender de o dev lembrar de trocar o modelo."

## 3.4 — Skills (45s)

> "**O que é:** uma capacidade especializada carregada **sob demanda**, quando a tarefa combina. E — diferente de todo o resto — ela pode conter **scripts, templates e exemplos reais de código**, não só texto.
>
> **A dor que mata:** código que segue o padrão do *Angular* mas não segue o padrão **do nosso projeto**. A skill é o que faz o código gerado parecer escrito por alguém do time, e não por quem leu a documentação oficial ontem.
>
> **Instructions vs. Skill, em uma linha:** instructions estão **sempre** ativas; skills entram **quando são relevantes**. Instructions são o manual de conduta do time; skills são os playbooks específicos.
>
> ⚠️ **A pegadinha que faz skill falhar em silêncio:** o campo `name` tem que ser **exatamente** igual ao nome da pasta. Errou, ela simplesmente não carrega — e não avisa. E o `description` precisa citar os termos que o dev vai digitar, porque é por ele que o Copilot decide carregar a skill."

## 3.5 — Hooks (45s)

> "**O que é:** scripts shell disparados automaticamente em eventos do ciclo de vida do agente. JSON em `.github/hooks/`.
>
> **A dor que mata:** 'o modelo esqueceu'. E aqui está a frase que resume hooks:
>
> **Instructions influenciam. Hooks executam.**
>
> Instruction é um pedido — o modelo tenta e pode falhar. Hook é código: **roda, independente do que o modelo decidiu.** É a diferença entre o guia de estilo que o dev lê e tenta seguir, e o pipeline de CI que barra o merge.
>
> Os dois eventos que resolvem 90% do dia a dia:
> - **`PostToolUse`** → depois de cada edição, roda lint e o teste daquele arquivo. Quality gate automático.
> - **`PreToolUse`** → antes de executar, bloqueia comando perigoso. `rm -rf`, `DROP TABLE`, `git push --force`. Exit code diferente de zero **cancela a operação**.
>
> ⚠️ **Cuidado real:** hook roda com a **sua** permissão de usuário. Teste o script isolado antes de plugar. E hook lento trava o fluxo — rode o teste do arquivo editado, não a suíte inteira."

## 3.6 — SDD (45s — aqui é só o teaser)

> "**O que é:** a metodologia que organiza a decisão técnica **antes** de abrir o agente. Especificação primeiro, código depois.
>
> **A dor que mata:** a IA não tem contexto de negócio. Descrição vaga gera código vago; descrição precisa gera código preciso. O SDD força a precisão **antes** da execução — e é aí que os rounds de correção, que são os maiores consumidores de token, desaparecem.
>
> Esse é o próximo bloco inteiro, então guardo o resto."

## 3.7 — O desenvolvedor (60s — **não corra aqui, é o coração da apresentação**)

**Slide:** só uma frase, grande — `Você é uma peça do harness. A que não dá para configurar.`

> "E a sétima peça é **você**. E eu deixei pro final de propósito.
>
> Repara na lista: instructions, prompt files, agents, skills, hooks, SDD. Tudo isso é configuração. Você monta uma vez e roda. Mas nada disso decide **o que vale a pena construir**, se a spec faz sentido, se a regra de negócio está certa, ou se aquele código pode ir pra produção de um banco.
>
> Voltando ao carro: o harness é o chassi, o câmbio, o freio ABS, o GPS. Nada disso dirige. **Não existe autônomo nível 5 aqui.**
>
> E tem um detalhe que eu quero que vocês guardem, porque ele é bonito:
>
> **A Fase 2 do SDD — a validação humana — é a única fase do fluxo inteiro que não consome um único token. E é a mais valiosa de todas.**
>
> Ela é grátis e é o que protege o banco de código gerado a partir de uma spec errada. Toda essa engenharia de harness existe pra te dar mais tempo pra fazer **exatamente essa** parte — a parte que é sua.
>
> A IA não te substituiu. Ela mudou onde o seu tempo vale mais: saiu de digitar boilerplate e foi pra decidir e validar."

**🔗 Transição:** *"Falei de SDD três vezes e enrolei três vezes. Vamos lá, porque é a peça que amarra todas as outras."*

---

# 📐 BLOCO 4 — SPEC-DRIVEN DEVELOPMENT (8 min)

## 4.1 — De onde veio (90s)

**Slide:** linha do tempo — `Design Docs / RFC / ADR ➜ Spec-Kit · OpenSpec · Kiro (2025) ➜ SDD`

> "SDD não caiu do céu em 2025 e não foi inventado por causa de IA. A ideia de 'especificação antes da implementação' é antiga na engenharia de software: design doc, RFC, ADR. Todo mundo aqui já escreveu ou leu um.
>
> **O que mudou foi o consumidor da spec.**
>
> Antes, quem lia o design doc era outro humano. Humano interpreta, preenche lacuna, pergunta no corredor, usa bom senso. Então uma spec 80% completa funcionava.
>
> Agora existe um consumidor que **lê a spec literalmente e não pergunta no corredor**: o modelo. Ele não sabe que 'status' na verdade só tem quatro valores possíveis. Ele não sabe que aquele campo vem nulo quando o contrato foi quitado. Ele preenche a lacuna **chutando** — e chute vira código.
>
> Foi isso que fez a prática antiga voltar com nome novo e ferramental próprio: **GitHub Spec-Kit**, **OpenSpec**, **Kiro**. Todas em 2025, todas resolvendo o mesmo problema: dar ao agente uma especificação boa o suficiente pra ele não precisar chutar."

## 4.2 — O conceito e a regra de ouro (60s)

**Slide:** `A especificação precede e guia a implementação. A spec é o artefato de primeira classe. O código é derivado.`

> "Definição: **Spec-Driven Development é a metodologia em que a especificação precede e guia a implementação.** Antes de uma linha de código, você cria um conjunto de artefatos que descrevem o que será construído, quais decisões técnicas foram tomadas, e quais tarefas executar — nessa ordem.
>
> **No banco, isso não é burocracia. É proteção.** Código que vai pra produção financeira precisa ser rastreável, revisado e previsível. A spec é o contrato entre o que foi pedido e o que foi entregue.
>
> E a regra de ouro, essa vocês anotam:
>
> **🔐 Spec errada gera código errado. E corrigir código custa 5× mais tokens do que corrigir a spec.**
>
> Uma linha errada no `spec.md` você conserta em 30 segundos e 50 tokens. A mesma linha errada, depois de virar dto, mapper, service, store e três arquivos de teste, custa uma sessão inteira."

## 4.3 — SDD não compete com TDD, BDD e DDD (90s)

**Slide:** tabela das quatro metodologias

> "Essa dúvida vai aparecer, então eu mato agora: **SDD não substitui nada. SDD orquestra.**
>
> | Metodologia | O que guia o desenvolvimento |
> |---|---|
> | **TDD** | Testes escritos antes do código |
> | **BDD** | Cenários em linguagem natural (Dado/Quando/Então) |
> | **DDD** | Domínio: linguagem ubíqua e bounded contexts |
> | **SDD** | Artefatos de especificação antes da implementação |
>
> Repara que eles nem competem no mesmo nível. TDD, BDD e DDD são disciplinas de **como construir**. SDD é **o envelope que organiza a decisão antes de você abrir o agente**.
>
> Na prática eles convivem, e convivem bem:
> - Os testes do **TDD** você escreve **dentro das tasks** do SDD — task T05 é 'criar os testes'
> - Os cenários do **BDD**, Dado/Quando/Então, vão **dentro do `spec.md`**, na seção de comportamento esperado
> - A linguagem ubíqua do **DDD** é o que faz o `proposal.md` e o `model` do domínio fazerem sentido — inclusive é ela que separa `dto` de `model` na nossa camada de dados
>
> **A analogia:** TDD, BDD e DDD são técnicas de construção — como levantar a parede, como fazer a fundação. SDD é **a planta que você desenha antes de furar a parede**. Ninguém discute se planta compete com alvenaria."

## 4.4 — Os quatro artefatos (90s)

**Slide:** a árvore de arquivos

```
.sdd/changes/[nome-da-feature]/
├── proposal.md              O QUÊ + POR QUÊ
├── design.md                COMO + DECISÕES TÉCNICAS
├── tasks.md                 O QUE FAZER + EM QUAL ORDEM
└── specs/[nome]/spec.md     CONTRATO TÉCNICO
```

> "Quatro arquivos. Cada um responde **uma** pergunta, e é isso que faz funcionar — cada artefato tem um dono de pergunta e não invade a do outro.
>
> **📋 `proposal.md` — o QUÊ e o POR QUÊ.** Linguagem próxima do negócio. Contexto, escopo, critérios de aceite verificáveis, dependências, riscos. E **non-goals** — o que explicitamente **não** será feito. Essa seção é a que impede o agente de 'ajudar além do pedido'.
>
> **🏗️ `design.md` — o COMO e as DECISÕES.** Arquitetura, componentes envolvidos, contratos de API, padrões a seguir, e — importante — **alternativas rejeitadas com o motivo**. É o seu ADR nascendo junto com a feature, de graça.
>
> **✓ `tasks.md` — o QUE FAZER e em QUAL ORDEM.** Tasks atômicas, com arquivo de destino e critério de conclusão. A ordem não é decorativa: ela é **ordem de dependência**. Na nossa camada de dados é sempre dto → model → mapper → service → mock → store → specs. E tem um ganho técnico direto nisso: quando o agente chega no mapper, o dto e o model **já estão no contexto da sessão**. Ele não adivinha campo nenhum.
>
> **📄 `spec.md` — o CONTRATO TÉCNICO.** Interfaces TypeScript, comportamento por cenário, validações, tratamento de erro. É o arquivo que o `code-reviewer` vai usar depois como régua.
>
> ✅ **Governança, e essa é uma exceção importante:** esses quatro arquivos **vivem no repositório** durante o desenvolvimento — são documentação da feature, e isso é permitido e recomendado. O que **nunca** entra no repo são as configs do Copilot: instructions, agents, skills, hooks, prompts."

## 4.5 — O fluxo completo (2 min 30s)

**Slide:** as seis fases em sequência, com o gate destacado

> "Seis fases. Vou dar a fase, o modo do chat e o modelo, porque é assim que vocês vão usar amanhã.

> **Fase 0 — Explorar.** Modo `Ask`, modelo **Haiku**.
> Entender antes de escrever. 'Quais stores existentes eu reaproveito? Existe padrão de listagem já implementado? Tem dependência com outro módulo?' Conversa leve, sem gerar código, no modelo mais barato. Custo: uns 500 tokens.
> **Pule esta fase** se você já tem um arquivo de requisitos completo, com regra, endpoint e critério de aceite.

> **Fase 1 — Propose.** Modo `Plan`, modelo **Sonnet**.
> Aqui nascem os quatro artefatos. É a fase que merece Sonnet, porque envolve decisão técnica e trade-off — não é execução mecânica.
>
> E existem **duas portas de entrada** pra essa fase, prestem atenção porque vocês vão usar as duas:
>
> **Porta A — você já tem o requisito num `.md`.** Aí é direto: `#readFile docs/requisitos/historico-renegociacoes.md`, mais os arquivos que serão afetados, e pede os quatro artefatos.
>
> **Porta B — o requisito é verbal, veio de e-mail ou o card do Jira está vago.** Aí você **não** manda isso pro modelo cru. Você estrutura primeiro, com `/analyse-prompt` ou com o `#code_gera_prompt` do MCP Bia Tech. Transforma a ideia solta num requisito estruturado, e **depois** entra na Fase 1.
>
> Isso é engenharia de prompt no lugar certo: na entrada, não no meio do caos.

> **Fase 2 — Validação humana.** Modo: **você**. Modelo: **nenhum**.
> **Zero token. É trabalho seu. E é o gate crítico.**
>
> O checklist:
> - `proposal.md` — critérios de aceite são **verificáveis**? O escopo está delimitado, com non-goals?
> - `design.md` — as decisões fazem sentido? Os contratos de API estão corretos? Os padrões referenciados **existem** no projeto?
> - `tasks.md` — cada task é atômica? A **ordem respeita as dependências**? Cada task tem arquivo de destino?
> - `spec.md` — as interfaces estão corretas? Os cenários cobrem **caso de erro**? As validações refletem a regra de negócio real?
>
> **⚠️ A regra inegociável desta apresentação: nunca pule a Fase 2.** Se você pular, tudo que vem depois é rápido, barato, bem estruturado — e errado. Nada é mais caro que velocidade na direção errada.

> **Fase 3 — Apply.** Modo `Agent`, modelo **Haiku** (ou Sonnet se a task for complexa).
> Implementa **task por task**. Uma. Valida. Marca `[x]`. Próxima.
> Repare no modelo: **Haiku**, não Sonnet. Na Fase 3 a decisão difícil já foi tomada na spec. O que se pede aqui não é raciocínio profundo, é **execução fiel**. Pagar Sonnet ou Opus pra executar uma spec que já está pronta é desperdício puro.

> **Fase 4 — Verify.** Modo `Ask`, modelo **Haiku**.
> Revisa a implementação **contra o `spec.md`**. E o output é estruturado, não é 'tá bom?': ✅ correto, ⚠️ incompleto, ❌ violação, 💡 sugestão.
> Só se você já tentou 3 vezes e o bug não sai, aí sim: **Opus com thinking LOW**. É o **único** cenário que justifica top-tier no nosso contexto.

> **Fase 5 — Archive.** Manual, zero token.
> Conteúdo do `.sdd/changes/` vai pro Confluence como ADR, a pasta sai do repo, e o commit final referencia. `feat: atualiza listagem de contratos renegociados [SDD archived]`.
> Esse passo parece burocracia até a primeira vez que alguém pergunta 'por que isso foi feito assim?' seis meses depois — e você tem a resposta escrita."

**💬 Se perguntarem sobre OpenSpec:**
> "O OpenSpec automatiza esse fluxo com comandos: `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, `/opsx:verify`, `/opsx:archive`. Ele cria a estrutura de pastas e os prompts prontos. **O que ele não muda:** a Fase 2 continua sendo sua, a escolha de modelo continua manual, e a estrutura de arquivos é a mesma. Minha recomendação: **aprenda o fluxo manual primeiro.** Quando você entende o que cada fase faz, o framework é conveniência. Se você começa pelo framework, ele é caixa preta."

**🔗 Transição:** *"Agora eu tenho as peças e tenho o fluxo. Falta a pergunta que vocês devem estar fazendo: se agent, prompt file e skill fazem coisas parecidas, por que eu preciso dos três?"*

---

# 🥇 BLOCO 5 — POR QUE JUNTOS: AGENT + PROMPT FILE + SKILL (3 min)

**Slide:** três engrenagens + a tabela de resultado

> "Eles não competem. Cada um responde uma pergunta **diferente**:
>
> - **Prompt File** define **o QUÊ fazer** — o roteiro, a ordem, o formato de saída
> - **Custom Agent** define **QUEM executa** — quais ferramentas, qual modelo, quais restrições
> - **Skill** define **COMO fazer bem** — o padrão real deste projeto, com template e exemplo
>
> E o que acontece quando falta um:

> | Configuração | Resultado |
> |---|---|
> | Prompt File sozinho | **7/10** — roteiro bom, execução sem controle de ferramentas |
> | Custom Agent sozinho | **7/10** — execução controlada, roteiro varia entre devs |
> | Agent + Prompt File | **9/10** — roteiro fixo + execução controlada |
> | **Agent + Prompt File + Skill** | **10/10** — roteiro + controle + padrão real do projeto |

> **A analogia da oficina, que é a que cola melhor:**
>
> - O **prompt file** é a **ordem de serviço**: o que fazer, em que ordem, o que entregar.
> - O **agent** é o **mecânico habilitado, com a bancada montada pra aquele serviço** — e sem as ferramentas dos outros serviços em cima da mesa, justamente pra ele não mexer no que não foi pedido.
> - A **skill** é o **manual da montadora com a peça original**. Sem ela, você recebe uma peça que serve em qualquer carro. Com ela, você recebe a peça deste carro.
>
> Prompt file sozinho: ordem de serviço perfeita entregue pra um mecânico que tem uma marreta e a chave do carro. Agent sozinho: mecânico excelente esperando alguém explicar o serviço — e cada dev explica diferente.
>
> **E um detalhe que faz diferença na prática:** a skill ativa sozinha, pela descrição, quando a tarefa combina. Mas se você **cita a skill dentro do prompt file** — 'use a skill data-layer para todo arquivo desta camada' — o comportamento deixa de ser probabilístico e passa a ser **determinístico**. Você não depende do modelo decidir. Em código de banco, isso importa."

**🔗 Transição:** *"Chega de slide. Vamos abrir a IDE e fazer isso acontecer no `recr-fed-agc-posvenda`."*

---

# 💻 BLOCO 6 — HANDS-ON AO VIVO: DO REQUISITO AO CÓDIGO (18 min)

**Slide de contexto (deixe aberto num monitor, se possível):** as 6 fases, pra você apontar onde está

> "O que eu vou fazer aqui é o ciclo completo, do requisito ao código revisado, no `recr-fed-agc-posvenda`. Vou narrar cada decisão de custo em voz alta — porque a decisão é o que vocês precisam levar, não o resultado."

## Checklist de preparação (faça ANTES de entrar na sala)

- [ ] VS Code aberto no `recr-fed-agc-posvenda`, terminal limpo, zoom da fonte aumentado
- [ ] `.github/instructions/`, `.github/agents/`, `.github/skills/`, `.github/prompts/`, `.github/hooks/` **já criados e já reconhecidos** — confira no Configure Chat antes
- [ ] `.sdd/changes/` criado e vazio
- [ ] Arquivo de requisito/spec do BFF pronto em `docs/specs/`
- [ ] **Todas as abas de chat antigas fechadas** (você vai falar de cache de sessão; comece limpo)
- [ ] Um plano B: os artefatos SDD já gerados numa branch separada, caso a rede ou a cota falhem ao vivo

## Etapa 1 — Mostre o harness montado (2 min)

**O que fazer:** abra o Configure Chat (ícone de engrenagem no chat) e passeie pelas abas Agents e Instructions. Depois digite `/` e mostre o menu de slash commands.

**O que falar:**
> "Antes de qualquer prompt: isso aqui é o harness. Aba Instructions — meus quatro arquivos: stack, angular, segurança, testes. Aba Agents — os três: planner, implementer, reviewer. E o menu `/` — os prompts e as skills.
>
> **Isso levou vinte minutos pra montar e não vou montar de novo nunca.** Está tudo local, nada disso é commitado, e os modelos de todos esses arquivos estão no Confluence pra vocês copiarem.
>
> Repara no dropdown de agent: além de Ask, Plan e Agent, tem os três meus. É essa lista que muda o jogo."

## Etapa 2 — Fase 1, Propose: dispare o fluxo (4 min)

**O que fazer:** digite `/sdd-plan` (ou `/atualizar-camada-dados`, se for o cenário de camada de dados) e mostre o agent sendo selecionado automaticamente.

**O que falar:**
> "Digitei `/sdd-plan`. Duas coisas aconteceram sem eu fazer nada: o VS Code **já selecionou o `sdd-planner`** no dropdown, e **já colocou o Sonnet** como modelo. Eu não precisei lembrar de nada. É o prompt file embutindo a disciplina de custo.
>
> Agora eu complemento com a demanda."

**Cole o prompt (leia em voz alta enquanto cola):**
```
A feature é a atualização do serviço de listagem de contratos renegociados.

A spec do BFF está em:
#readFile docs/specs/listagem-contratos-renegociados.md

Arquivos que serão atualizados:
#readFile src/app/features/posvenda/dtos/contrato-renegociado.dto.ts
#readFile src/app/features/posvenda/models/contrato-renegociado.model.ts
#readFile src/app/features/posvenda/mappers/contrato-renegociado.mapper.ts
#readFile src/app/features/posvenda/services/contrato-renegociado.service.ts
#readFile src/app/features/posvenda/mocks/contrato-renegociado.mock.ts
#readFile src/app/features/posvenda/stores/contrato-renegociado.store.ts

Considere a skill data-layer para o padrão da camada.
Crie os artefatos SDD para esta atualização.
```

> "Olhem o que eu **não** fiz: eu **não** usei `@workspace`. Eu listei os arquivos que a tarefa precisa, um por um, com caminho completo. Seis `#readFile` cirúrgicos. Isso é a diferença entre 4.000 tokens e a cota do dia."

**👉 O momento de ouro — se o agent fizer perguntas de esclarecimento, PARE e destaque:**
> "**Presta atenção nisso.** Ele não saiu criando arquivo. Ele **perguntou**. Isso está na instrução dele: 'se o requisito não estiver claro, pergunte antes de criar qualquer arquivo'.
>
> Cinco perguntas agora custam 200 tokens. Quatro artefatos errados custam a sessão inteira mais o retrabalho. Deixa ele perguntar."

**Quando os artefatos aparecerem:** abra a árvore de arquivos e mostre `.sdd/changes/listagem-contratos-renegociados/` com os quatro.

> "Quatro artefatos. E olha uma coisa importante: o `sdd-planner` **não tem `editFile`**. Ele leu seis arquivos de produção e não conseguiria alterar nenhum, mesmo que quisesse. Restrição estrutural, não pedido."

## Etapa 3 — Fase 2, o gate humano (3 min — **não corra aqui**)

**O que fazer:** abra o `tasks.md` no editor. Leia a ordem em voz alta.

**O que falar:**
> "Fase 2. **Zero token daqui em diante até eu apertar o próximo Enter.** Essa parte é minha.
>
> Vou olhar principalmente o `tasks.md`, e olhando **uma coisa específica: a ordem.**
>
> T01 dto, T02 model, T03 mapper, T04 service, T05 mock, T06 store, T07 specs.
>
> Isso não é estética. É ordem de dependência. Se o mapper vier antes do dto, quando o agente for implementar o mapper ele **não tem o contrato do dto no contexto** — e vai adivinhar nome de campo. Aí você paga pra corrigir.
>
> Com a ordem certa, quando ele chega no T03 o dto e o model já estão na sessão. Ele mapeia tudo sem chutar nada. **Uma linha na ordem certa aqui economiza uma sessão de debug depois.**"

**Se você encontrar algo errado de verdade nos artefatos: MOSTRE.** É o melhor momento possível da apresentação.
> "Achei um problema. Olha aqui — [o problema]. Consertar isso agora: 15 segundos. Consertar depois de virar código em cinco arquivos: uma sessão. **É literalmente por isso que a Fase 2 existe.** Se eu tivesse clicado direto em 'implementar', vocês teriam visto uma demo linda e errada."

## Etapa 4 — Handoff e Fase 3, Apply (5 min)

**O que fazer:** clique no botão de handoff **"Partir para Implementação"**.

**O que falar:**
> "Handoff. Repara: o prompt vem pré-preenchido mas **não** é enviado automaticamente — `send: false`. É de propósito: garante que eu não pule a Fase 2 sem perceber. Eu tenho que apertar Enter com consciência.
>
> E o agent trocou: agora é o `feature-implementer`, e o modelo caiu de **Sonnet pra Haiku**. Automático. A decisão difícil já foi tomada na spec; aqui é execução fiel."

**Envie:** `Os artefatos SDD foram revisados e aprovados. Inicie a implementação pela T01 do tasks.md.`

**Quando ele terminar a T01 e parar:**
> "Implementou a **T01 e parou**. Não emendou a T02. Isso é o agent, não é sorte.
>
> E olhem o dto que saiu: nome com sufixo `Dto`, campos exatamente como vêm do BFF, sem transformação. É o padrão do nosso projeto, não o padrão genérico. **Isso é a skill `data-layer` agindo** — ela injetou o template e o exemplo real do repositório."

**Valide e siga:** `A T01 está correta. Implemente a T02.` → e vá até a T03.

**Na T03, o mapper, faça o destaque:**
> "Aqui está o ganho da cadeia. O mapper cobriu **todos** os campos entre dto e model — inclusive os opcionais e os nulos. Ele não adivinhou nenhum, porque o dto (T01) e o model (T02) já estão no contexto desta mesma sessão.
>
> **E aqui está o cache de sessão trabalhando pra mim, de graça.** Estou na mesma aba desde o planejamento. O contexto base foi processado **uma vez**. Se eu tivesse aberto uma sessão nova pra cada task, eu teria reprocessado tudo sete vezes."

**Se um hook estiver ativo, mostre:** abra `View > Output > GitHub Copilot Chat Hooks`.
> "E olha aqui: o hook `PostToolUse` rodou o ESLint no arquivo editado, sozinho. Eu não pedi. O modelo não decidiu. **Instruction influencia; hook executa.**"

> ⏱️ **Não implemente as sete tasks ao vivo.** Faça T01 a T03, mostre o padrão se repetindo, e diga: *"As outras quatro seguem exatamente o mesmo ciclo — implementa, valida, marca `[x]`, próxima. Vou pular pro final."*

## Etapa 5 — Fase 4, Verify (3 min)

**O que fazer:** clique no handoff **"Revisar Implementação"**.

**O que falar:**
> "Agora o `code-reviewer`. E a característica dele é o que ele **não** tem: `editFile` e `createFile`. Ele lê e reporta. **Nunca corrige sozinho.**
>
> Isso é intencional e é a parte mais importante do desenho: se o revisor pudesse corrigir, ele corrigiria em silêncio e ninguém revisaria a correção. Qualquer ajuste volta pelo `feature-implementer`, com **eu** decidindo o que muda."

**Quando o relatório sair:** aponte as quatro seções.
> "✅ correto, ⚠️ incompleto, ❌ violação, 💡 sugestão. Com nome de arquivo e linha aproximada em cada apontamento.
>
> E ele revisou contra o `spec.md` — não contra o gosto dele. Existe uma régua escrita. Foi pra isso que a gente escreveu a spec no começo.
>
> Fase 5, o archive, é manual: esse conteúdo vira ADR no Confluence, a pasta sai do repo, e o commit referencia. Não vou fazer ao vivo porque é copiar e colar."

## Etapa 6 — Feche o loop com o número (1 min)

> "Recapitulando o que vocês acabaram de ver, em termos de custo:
>
> - **Fase 0 e 1:** Sonnet, uma vez, no planejamento. Onde a decisão difícil está.
> - **Fase 2:** eu. Zero token.
> - **Fase 3:** Haiku, task por task, com o contexto já em cache.
> - **Fase 4:** Haiku, revisando contra uma régua escrita.
>
> Rodar tudo isso no Opus, do começo ao fim, custaria de **4 a 6× mais** e entregaria pior — porque o problema nunca foi capacidade do modelo. Era contexto.
>
> **Motor não é chassi.**"

---

# 🏁 BLOCO 7 — FECHAMENTO (5 min)

## 7.1 — As cinco frases (2 min)

**Slide:** as cinco linhas, uma por vez

> "Se vocês esquecerem tudo o que eu falei e lembrarem de cinco frases, eu fico satisfeito:
>
> **1. Token é combustível com preço. Prompt vago é o maior desperdício que existe** — porque compra rounds de correção, e cada round reenvia tudo de novo.
>
> **2. Use o modelo mais leve que resolve. Suba de nível só quando o resultado for insatisfatório** — e nunca deixe o Auto decidir isso por você.
>
> **3. `@workspace` nunca. `#readFile` e `#fileSearch` sempre.** Contexto cirúrgico, e uma sessão por feature pra aproveitar o cache.
>
> **4. A diferença de qualidade não é o modelo, é o harness.** Motor de F1 em chassi de kart sai da pista.
>
> **5. Nunca pule a Fase 2.** É a única fase grátis do fluxo e a mais valiosa — porque é a parte que é sua."

## 7.2 — O que fazer amanhã (2 min)

**Slide:** três passos, com tempo estimado

> "Não tentem montar tudo amanhã. Vai dar errado e vocês vão desistir. Façam em três passos, na ordem:
>
> **Passo 1 — amanhã, 20 minutos.** Só as **instructions**. Crie `.github/instructions/` e escreva um `stack.instructions.md` com a stack do seu projeto e as proibições explícitas — `NUNCA usar NgModule`, `NUNCA injeção por construtor`. Aponte o setting `chat.instructionsFilesLocations`. Só isso já resolve a maior parte do 'o Copilot não segue o padrão do projeto'. **Melhor relação esforço/retorno de tudo que eu mostrei.**
>
> **Passo 2 — esta semana.** Rode **um** ciclo SDD numa demanda real e pequena. Não invente feature de treino. Pegue a menor demanda que você tem no board. Manual, sem framework, os quatro arquivos na mão. Você precisa sentir cada fase antes de automatizar.
>
> **Passo 3 — próxima semana.** Aí sim os **três agents** e **uma** skill — a do padrão que você mais repete. Os arquivos prontos estão todos no Confluence, é copiar e ajustar.
>
> ⚠️ E o lembrete de governança, que não é opcional: **nada de configuração do Copilot é commitado.** Instructions, agents, skills, hooks, prompts — tudo local, tudo no `.gitignore`, e o push é bloqueado pelo pipeline se você tentar. A **exceção** é a pasta `.sdd/changes/` — os artefatos SDD **podem e devem** ficar no repo durante o desenvolvimento, e depois vão pro Confluence como ADR."

## 7.3 — Última fala (1 min)

> "Eu abri essa hora com uma cena: o Copilot devolvendo um componente com NgModule, e você corrigindo cinco vezes.
>
> Aquele componente não veio errado porque o modelo é ruim. Veio errado porque **ninguém contou pra ele onde ele estava trabalhando.**
>
> Contar isso uma vez, bem feito, é engenharia. Contar em cada prompt, pra sempre, é desperdício.
>
> E a parte que eu mais quero que vocês levem: nada disso reduz o papel de vocês. **A Fase 2 continua sendo humana. A decisão de arquitetura continua sendo humana. A responsabilidade pelo código em produção de um banco continua sendo humana.** Toda essa engenharia de harness existe pra que vocês tenham mais tempo pra fazer exatamente essa parte — em vez de gastar a manhã corrigindo o volante de um carro desalinhado.
>
> **Menos token. Mais valor. Obrigado.**
>
> Documentação completa no Confluence: [colar link]. Perguntas?"

---

# 🧰 ANEXOS DO APRESENTADOR

## A. Perguntas que vão aparecer — respostas prontas

**"Isso não é muita burocracia pra uma mudança pequena?"**
> "É, e não é pra toda mudança. Correção de typo, ajuste de lint, mudança de uma linha: não use SDD. O SDD paga quando a mudança toca mais de um arquivo, ou quando tem regra de negócio envolvida. Régua prática: se você não consegue explicar a mudança em duas frases, ela merece uma spec."

**"Quanto tempo demora pra montar esse harness todo?"**
> "As instructions: 20 minutos. Os três agents: 30, copiando do Confluence. Uma skill: 20, e você extrai o template do próprio projeto com um prompt no Haiku. Total: menos de duas horas, uma vez, e serve pra todas as features do projeto."

**"E se eu discordar do que o code-reviewer apontou?"**
> "Ótimo — é pra isso que ele não tem `editFile`. Ele reporta, você decide. Ele não é a autoridade; o `spec.md` é. E se a spec estiver errada, o problema é a spec, não o código."

**"Por que não deixar o modo Auto escolher o modelo?"**
> "Porque o Auto pode escalar pra Opus num prompt bobo, sem avisar, debitando crédito premium por algo que o Haiku resolvia. Com cota ilimitada, Auto é ótimo. Com 7.500 créditos por mês, é perda de controle de custo."

**"Vale usar o OpenSpec?"**
> "Se o time já domina o fluxo manual, sim — é conveniência. Se está começando, faça manual primeiro. Você precisa entender o que cada fase faz antes de automatizar, senão o framework é caixa preta e você não sabe diagnosticar quando dá ruim."

**"Se não pode commitar, como o time compartilha as configs?"**
> "Confluence. Os modelos de todos os arquivos ficam lá, e cada dev copia pra `.github/` local e adiciona no `.gitignore`. Não é ideal, é a regra do nosso ambiente — e a justificativa é legítima: são arquivos que mudam o comportamento da IDE e são específicos do ambiente de cada um."

**"Thinking vale a pena?"**
> "Na maior parte do dia a dia, não — e ele custa tokens que você nem vê na resposta. LOW já adiciona 1.000 a 3.000 tokens; HIGH pode passar de 50.000. Mantenha desligado. Ligue só quando você conseguir **documentar por que** o nível anterior não foi suficiente: bug que resistiu a 3 tentativas, decisão arquitetural de impacto amplo, condição de corrida."

## B. Cortes de emergência (se o tempo estourar)

| Se estiver atrasado... | Corte isto | **Nunca corte** |
|---|---|---|
| 5 min atrasado | Bloco 3, itens 3.1 a 3.5 — resuma a tabela em 90s no lugar de detalhar cada peça | O item **3.7 (o desenvolvedor)** — é o coração |
| 10 min atrasado | Também a origem do SDD (4.1) e o paralelo TDD/BDD/DDD (4.3) — diga "está no Confluence" | Os **4 artefatos** e as **6 fases** |
| 15 min atrasado | Também a Etapa 5 do hands-on (code-reviewer) — mostre um print em vez de rodar | A **Etapa 3 (Fase 2, gate humano)** e o **fechamento** |

> Ordem de prioridade absoluta, se sobrar só 20 minutos: **abertura → analogia do carro → Fase 2 e por que ela existe → as 5 frases**. Esses quatro entregam a mensagem sozinhos.

## C. Se a demo falhar ao vivo

Não tente debugar na frente da plateia. Diga:
> "Isso aqui é o motivo de existir a Fase 2 e o motivo de eu ter um plano B. Vou mostrar o resultado já gerado e a gente segue o raciocínio."

Abra a branch com os artefatos prontos e continue narrando as decisões. **A decisão é o conteúdo, não a execução.** Uma demo que falha e é bem narrada ensina mais que uma demo perfeita e muda.

## D. Números para ter na ponta da língua

| Número | O que é |
|---|---|
| **7.500** | Créditos/mês do plano Business (≈375/dia útil) |
| **~50%** | Tokens extras do português vs. inglês |
| **3×** | Custo do output vs. input nos modelos premium |
| **5×** | Custo de corrigir código vs. corrigir a spec |
| **8.000–15.000** | Tokens de uma feature **sem** harness (3–5 rounds) |
| **2.000–4.000** | Tokens da mesma feature **com** harness (0–1 round) |
| **~9.000** | Tokens economizados por feature só mantendo uma sessão (cache) |
| **4–6×** | Custo de rodar todo o ciclo em Opus vs. modelo calibrado por fase |
| **1.000–3.000 / 10.000–50.000** | Tokens extras de thinking LOW / HIGH |

---

_Roteiro de fala — Hands-on: IA com Eficiência | Menos token. Mais valor._
_Base: docs 00 a 09 do guia GitHub Copilot no VS Code | `recr-fed-agc-posvenda`_
