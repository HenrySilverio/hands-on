# Guia de uso dos assistentes de discovery

Para PO, PM e PMO da tribo ReabilitAI. Nenhum conhecimento técnico é necessário.

---

## O que são esses assistentes

São quatro assistentes que conhecem as regras do nosso produto porque leem uma base mantida pelo
time. Eles ajudam a transformar uma necessidade de negócio em uma user story bem fundamentada.

Eles têm uma característica que parece um defeito e é o principal recurso: **eles não completam o
que não sabem.** Quando falta informação, param e perguntam. Um assistente comum inventaria um
critério de aceite que parece certo — e você só descobriria o erro na sprint seguinte.

---

## Antes de começar

Você precisa de:

- Licença do GitHub Copilot (se não tem, solicite pelo caminho normal).
- O **GitHub Copilot app** instalado, se você vai conduzir o discovery de ponta a ponta.
- Só quer tirar dúvida sobre uma regra? Não precisa instalar nada: use o Space pelo navegador.

Abra o app e inicie uma sessão apontando para o repositório **recr-cmn-tribo-knowledge**. Os
quatro assistentes aparecem sozinhos.

---

## Os quatro assistentes

### 1. `po-iniciar-discovery` — da necessidade ao briefing

**Quando usar:** a demanda ainda é uma ideia, um pedido do gerente, um chamado ou uma ata. Não
existe nada escrito ainda.

**Como funciona:** ele entrevista você em rodadas curtas, no máximo três perguntas por vez, e a
cada rodada devolve o que entendeu para você corrigir cedo.

**O que você recebe:** um briefing com problema, resultado esperado, quem é afetado, restrições,
fora de escopo e exceções.

**Ele não lê o código nem a base — de propósito.** Quem lê a solução existente antes de entender o
problema acaba entrevistando em direção ao que já existe. Comparar com o que já está documentado é
trabalho do assistente seguinte.

**Quando ele te trava:** se faltar o problema ou o resultado esperado, ele não grava nada e
devolve as perguntas. Isso é o certo — um briefing sem problema definido gera uma story sobre
nada.

---

### 2. `po-refinar-negocio` — do briefing à conferência

**Quando usar:** logo depois do briefing, sempre. É a etapa que mais evita retrabalho.

**Como funciona:** ele confronta o seu briefing com o que já está documentado do produto e da
tribo.

**O que você recebe:** as regras existentes que tocam a demanda (cada uma com o arquivo de
origem), os conflitos com regra vigente, se a demanda já foi resolvida em outro lugar, o impacto
em jornadas existentes e o que muda no contrato.

**Quando ele te trava:** se a demanda contrariar uma regra que está valendo, ele descreve o
conflito, transforma em pergunta e para. Ele **não escolhe** qual regra vale — isso é decisão de
negócio, e é sua.

---

### 3. `po-gerar-user-story` — do refinamento à story

**Quando usar:** só depois do refinamento estar sem conflito e sem lacuna bloqueante.

**Como funciona:** ele apenas formata o que já foi decidido. Nesta etapa nada novo é decidido.

**O que você recebe:** duas coisas. A story pronta para colar no Jira, com cada critério de aceite
ligado à sua origem; e uma cópia guardada no histórico, registrando contra qual versão das regras
a story foi escrita.

**Quando ele te trava:** se o refinamento tiver conflito em aberto ou lacuna bloqueante, ele se
recusa a escrever. Story bem formatada em cima de decisão que não existe é o erro mais caro que
tudo isso existe para evitar.

---

### 4. `po-curar-fonte` — do documento à base

**Quando usar:** você tem uma norma do Bacen, uma política interna, um contrato, uma ata ou um
resumo de conversa do Teams que carrega regra de negócio.

**Como funciona:** você larga o arquivo na pasta `inbox/` e pede para ele processar.

**O que você recebe:** uma ficha organizada, com o trecho literal do documento de um lado e a
interpretação de negócio do outro — nunca misturados. Mais o link da fonte e um nível de confiança.

**Sobre o nível de confiança:** resolução do Bacen é `alta`; ata de reunião é `media`; resumo de
conversa é `baixa`. Os outros assistentes repetem esse nível ao citar. É a diferença entre
"segundo a Resolução 4.966" e "segundo uma ata de reunião".

---

## O fluxo completo, passo a passo

**1. Abra o assistente de discovery e descreva a necessidade.**
Fale como você falaria com um colega. Não tente escrever bonito.

**2. Responda às perguntas dele.**
Se não souber, diga "não sei". Isso vira uma lacuna registrada — e lacuna registrada é
informação, não fracasso.

**3. Confira o briefing.**
Leia inteiro. É mais fácil corrigir agora do que depois de a story existir.

**4. Rode o refinamento.**
Peça: *"Use o agente po-refinar-negocio com o briefing de RNG-1234."*

**5. Leia os conflitos com atenção.**
Esta é a parte mais valiosa de todo o fluxo. Cada conflito é uma decisão que precisa ser tomada
por alguém — e é muito mais barato tomá-la agora.

**6. Se houver conflito, decida antes de continuar.**
Leve para quem decide. Depois registre: *"Registre a decisão que tomamos sobre o prazo máximo."*

**7. Gere a story.**
Peça: *"Use o agente po-gerar-user-story para RNG-1234."*

**8. Revise e cole no Jira.**
Confira se cada critério de aceite tem origem e leve junto a seção "Em aberto".

---

## Boas práticas

### Faça

- **Uma demanda por vez.** Cada demanda tem sua pasta e seu contexto.
- **Responda com números quando tiver.** "Uns 30% dos casos" vale mais que "muitos casos".
- **Diga "não sei" quando não souber.** É a resposta mais útil que você pode dar.
- **Sempre responda "o que está fora de escopo".** O silêncio nessa pergunta é a maior fonte de
  retrabalho no refinamento técnico.
- **Leve as lacunas para a story.** Elas ficam visíveis na seção "Em aberto" e são discutidas no
  refinamento com o time.
- **Registre a decisão quando ela acontecer.** Uma decisão registrada hoje economiza uma
  arqueologia daqui a seis meses.

### Não faça

- **Não peça para ele "completar o resto".** Ele foi construído para não fazer isso. Insistir só
  gasta seu tempo.
- **Não aceite critério de aceite sem origem.** Se aparecer um sem a linha de origem, é bug —
  avise o time de tooling.
- **Não pule o refinamento.** Ir do briefing direto para a story é onde nasce a story bonita e
  errada.
- **Não use o histórico para saber como o produto funciona hoje.** Ele guarda o que foi pedido um
  dia, não o que vale agora. Para o que vale hoje, pergunte ao assistente.
- **Não corrija a base "no braço" quando discordar dela.** Registre uma decisão. A base espelha o
  que está em produção; se ela estiver errada, o problema é maior que um texto.

---

## Quando algo dá errado

**"Ele disse que a base não cobre o assunto."**
É uma resposta correta, não uma falha. Significa que o conhecimento ainda não foi escrito. Leve o
tema para a conferência de base da sprint.

**"Ele apontou um conflito que eu acho que não existe."**
Pode ser regra desatualizada na base. Confira com um desenvolvedor. Se a base estiver errada,
isso vira uma decisão registrada — e a base melhora.

**"Ele se recusou a gerar a story."**
Falta uma decisão ou uma resposta. A mensagem dele diz exatamente o quê. Resolva e peça de novo.

**"A resposta veio sem citar arquivo nenhum."**
Não confie. Peça: *"De qual arquivo você tirou isso?"* Se ele não souber responder, a informação
não está na base.

**"Ele citou uma regra que não vale mais."**
Confira se ele citou algo de `em-voo` (ainda não chegou ao cliente) ou do histórico. Avise o time
de tooling: pode ser ajuste no assistente.

---

## Palavras que você vai encontrar

| Termo | O que significa |
| --- | --- |
| **[NÃO RESPONDIDO]** | uma lacuna que ninguém respondeu. Fica visível de propósito |
| **base** | o conjunto de arquivos com as regras e decisões do produto |
| **publicado** | o que está valendo em produção agora |
| **em-voo** | já foi desenvolvido, ainda não chegou ao cliente |
| **histórico** | stories entregues, guardadas para consulta e auditoria |
| **decisão** | algo que foi decidido por pessoas, com data e responsável |
| **PR** | a forma como uma mudança na base é revisada antes de valer |

---

## Onde pedir ajuda

Dúvida sobre uma regra do produto: pergunte ao assistente primeiro. Se ele não souber, procure a
squad responsável.

Dúvida sobre o funcionamento dos assistentes, ou algo que parece um defeito: procure o time de
tooling da tribo.
