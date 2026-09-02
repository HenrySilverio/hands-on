# Carga inicial da base — do `recr-fed-agc-reneg` para o `recr-cmn-tribo-knowledge`

Manual da primeira fase, feito para rodar na máquina Windows do trabalho. Nada aqui depende de
pipeline: é você, dois repositórios clonados e o Copilot app.

---

## 0. Antes de começar (15 minutos)

**Renomeie a pasta da squad para o nome do repositório de produto.** O pacote veio com
`squads/cockpit-renegociacao/`. Trocar agora, com a base vazia, custa um minuto; depois de 40
arquivos, custa um pull request grande e quebra os caminhos citados nas stories.

```powershell
cd C:\dev\recr-cmn-tribo-knowledge
git mv squads\cockpit-renegociacao squads\recr-fed-agc-reneg

# ajusta o campo produto: nos arquivos semeados
Get-ChildItem -Recurse squads\recr-fed-agc-reneg -Filter *.md |
  ForEach-Object {
    (Get-Content $_.FullName -Raw) -replace 'produto: cockpit-renegociacao','produto: recr-fed-agc-reneg' |
      Set-Content $_.FullName -NoNewline
  }

node ferramentas\gera-index.mjs
node ferramentas\valida-frontmatter.mjs
```

Confira também:

- [ ] `node --version` responde (o validador precisa de Node 18+).
- [ ] Os dois repositórios clonados lado a lado, por exemplo em `C:\dev\`.
- [ ] Se a política proíbe `.github/` **neste** repositório, renomeie `.github\agents` e
      `.github\skills` para `.agents\agents` e `.agents\skills` antes de qualquer coisa.

---

## 1. Como a carga manual funciona

Uma sessão do Copilot app enxerga **um** repositório. Os agentes moram no repositório de
conhecimento; o código mora no `recr-fed-agc-reneg`. Então a carga inicial tem três movimentos:

1. **Sessão no `recr-fed-agc-reneg`** — você roda os prompts de extração. O agente lê o código e
   devolve markdown pronto.
2. **Você copia** o markdown para o arquivo correspondente em `recr-cmn-tribo-knowledge`.
3. **Valida e commita** no repositório de conhecimento.

Isso é deliberado, não uma limitação a contornar: a cópia manual é o ponto onde **você lê o que
vai ser publicado**. Na Onda 0 esse é o controle de qualidade inteiro. Automatizar antes de
existir julgamento humano só enche a base mais rápido.

> **Não commite nada no `recr-fed-agc-reneg`.** A extração é leitura. Nenhum arquivo novo entra
> no repositório de produto nesta fase.

---

## 2. Ordem de extração, e por que essa ordem

Nem todo arquivo carrega a mesma densidade de negócio. Siga de cima para baixo e pare quando a
base já responder às perguntas que o PO faz — não busque cobertura.

| # | Fonte no seu Angular | O que entrega | Destino |
|---|---|---|---|
| 1 | grafo do Graphify + estrutura de pastas | inventário: o que existe | `squads/recr-fed-agc-reneg/_INVENTARIO.md` |
| 2 | arquivos de i18n, labels, mensagens | vocabulário real do gerente | `tribo/glossario.md` |
| 3 | `app.routes.ts` + `renegociacaoStore` (NgRx Signals) | jornadas, estados e transições | `squads/recr-fed-agc-reneg/publicado/jornadas.md` |
| 4 | validators de formulário + guards + mensagens de erro | **as regras de negócio** | `squads/recr-fed-agc-reneg/publicado/regras-negocio.md` |
| 5 | services, interfaces e tratamento de erro HTTP | contratos, em linguagem de negócio | `squads/recr-fed-agc-reneg/publicado/contratos.md` |

O item 4 é o mais valioso e é onde você deve gastar mais tempo. Validador é onde a regra vive de
verdade: ele diz o que o sistema **impede**, e é isso que o PO precisa saber antes de pedir algo
que o sistema já proíbe.

---

## 3. Os cinco prompts

Abra a sessão do Copilot app apontando para `recr-fed-agc-reneg` e cole um prompt de cada vez.
Rode um, revise, só então rode o próximo. Rodar os cinco de uma vez produz um volume que ninguém
revisa — e conteúdo não revisado é exatamente o que a base não pode ter.

### Prompt 1 — Inventário

```text
Você vai montar um INVENTÁRIO deste projeto Angular. Inventário é uma LISTA do que existe,
não uma descrição do que significa.

Leia a estrutura do projeto e o grafo gerado pelo Graphify (procure a pasta graphify-out ou
equivalente; se não encontrar, me diga e use apenas a estrutura de pastas).

Produza um markdown com quatro listas, cada item numa linha, marcado como [ ] sem descrição:

## Rotas e telas
## Estados do renegociacaoStore
## Chamadas de backend
## Validações e guards

Regras:
- Cada item traz o caminho do arquivo onde foi encontrado.
- NÃO descreva o que cada item faz. Só liste.
- Se não conseguir determinar algo, escreva [NÃO RESPONDIDO] em vez de supor.

Devolva o markdown completo na resposta.
```

### Prompt 2 — Glossário

```text
Leia TODOS os arquivos de internacionalização, labels e mensagens deste projeto
(procure por i18n, assets/i18n, *.json de tradução, e constantes de texto).

Extraia o VOCABULÁRIO que aparece na tela para o usuário — os termos de negócio, não os
técnicos. Para cada termo:

- o termo exatamente como aparece na tela;
- em que contexto aparece (tela, campo, mensagem);
- o caminho do arquivo e a chave onde está.

Regras:
- NÃO invente a definição do termo. Você está listando o que existe, e a definição será
  escrita por uma pessoa depois. Deixe a linha de definição como <a preencher>.
- Ignore termos puramente técnicos (loading, erro genérico, botão voltar).
- Se dois termos parecerem sinônimos, liste os dois e marque a suspeita.

Formato de saída: markdown, uma seção "## <termo>" por termo.
```

### Prompt 3 — Jornadas e estados

```text
Leia o arquivo de rotas (app.routes.ts e arquivos de rota de features) e o store
renegociacaoStore (NgRx Signals).

Produza, em linguagem de NEGÓCIO, não técnica:

## Jornadas
Para cada fluxo que um gerente percorre: os passos na ordem, do ponto de vista dele.

## Estados
A lista de estados que uma renegociação pode assumir, com o nome exato usado no código.

## Transições permitidas
De qual estado para qual estado é possível ir, e o que dispara a transição.

## Transições proibidas
O que o código explicitamente impede.

Regras:
- Cada afirmação carrega o caminho do arquivo e, quando possível, a linha.
- NÃO descreva implementação (service, effect, signal). Descreva o que o usuário vive.
- Onde o código não deixar claro, escreva [NÃO RESPONDIDO]. Não deduza a intenção.
```

### Prompt 4 — Regras de negócio (o mais importante)

```text
Leia os validadores de formulário, os guards de rota e o mapeamento de mensagens de erro
deste projeto.

Para CADA validação encontrada, escreva uma regra de negócio no formato:

## <nome da regra, em linguagem de negócio>
- **Regra:** <o que o sistema impede ou exige, do ponto de vista do gerente>
- **Gatilho:** <quando a validação acontece>
- **Exceção:** <quando não se aplica, se houver>
- **Mensagem ao usuário:** <o texto exato que aparece na tela>
- **Origem:** `<caminho/do/arquivo.ts>` linha <n>
- **Trecho:**
  ```ts
  <as 1 a 5 linhas de código que sustentam a regra>
  ```

Regras que você deve seguir:
- O campo Trecho é OBRIGATÓRIO. Sem trecho citado, não escreva a regra.
- NÃO agregue nem generalize duas validações numa regra só.
- NÃO explique o porquê da regra. Você não sabe o porquê — isso é conhecimento de negócio
  e será preenchido por uma pessoa.
- Valor numérico (limite, prazo, percentual) só entra se estiver literalmente no código.
- Se a validação vier de configuração externa ou feature flag, diga isso e marque
  [NÃO RESPONDIDO] no valor.
```

### Prompt 5 — Contratos

```text
Leia os services HTTP, as interfaces de request/response e o tratamento de erro deste projeto.

Produza, para cada operação que o frontend chama, uma ficha em linguagem de negócio:

## <o que a operação faz, do ponto de vista do gerente>
| Informação | Obrigatória | Observação |
| --- | --- | --- |
| <campo, com o nome de negócio se existir> | sim/não | <regra> |

**Erros que o gerente vê:** <código> → <o que aconteceu, em português>
**Origem:** `<caminho do service e da interface>`

Regras:
- NÃO inclua path, verbo HTTP, header ou payload bruto. Isso é detalhe técnico e polui a base.
- Obrigatoriedade só a partir do que está no código (tipo, validação, `?` no TypeScript).
- Mensagem de erro: use o texto exato exibido, não a descrição técnica do status.
- O que não estiver no código do frontend fica [NÃO RESPONDIDO] — o frontend não conhece a
  regra inteira do backend, e fingir que conhece é o pior erro possível aqui.
```

---

## 4. Depois de cada prompt: revise antes de copiar

Três perguntas, sempre, antes de colar no repositório de conhecimento:

1. **Toda afirmação tem origem?** Linha sem caminho de arquivo não entra.
2. **Tem número inventado?** Procure prazos, limites e percentuais e confirme cada um no código.
3. **Tem interpretação disfarçada de fato?** Frases como "provavelmente para evitar" são leitura
   do modelo, não regra. Apague ou mova para uma decisão de negócio.

O que sobreviver às três perguntas é bom o bastante para a Onda 0.

---

## 5. Colar, validar, commitar

```powershell
cd C:\dev\recr-cmn-tribo-knowledge
git checkout -b carga-inicial-recr-fed-agc-reneg

# cole o conteúdo revisado nos arquivos, preservando o frontmatter que já existe neles.
# depois:
node ferramentas\gera-index.mjs
node ferramentas\valida-frontmatter.mjs

git add .
git commit -m "carga inicial: regras, jornadas e glossario do recr-fed-agc-reneg"
git push -u origin carga-inicial-recr-fed-agc-reneg
```

Abra o PR e peça revisão a **um PO**, não a outro dev. O que interessa nesta revisão não é se o
markdown está bonito — é se o PO entende as frases sem precisar perguntar nada.

**Não apague o frontmatter dos arquivos semeados.** O validador reprova sem ele, e os campos
`prateleira`, `gerado_por` e `atualizado_em` são o que faz o agente saber o que pode citar como
regra vigente. Atualize `atualizado_em` e mantenha `gerado_por: humano` — vira `robo` só quando o
workflow assumir, na Onda 1.

---

## 6. Trazer uma norma do Bacen

Este caminho usa o agente `po-curar-fonte`, e a sessão é no repositório de **conhecimento**.

### 6.1 Colocar a fonte na caixa de entrada

O caminho que **sempre funciona**, mesmo com proxy corporativo bloqueando o site: abra a norma no
navegador, copie o texto das seções que interessam e salve num arquivo.

```powershell
cd C:\dev\recr-cmn-tribo-knowledge
notepad inbox\bacen-res-4966.md
```

Estrutura do arquivo — três linhas de cabeçalho e o texto colado:

```markdown
FONTE: BACEN — Resolução 4.966
URL: https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o&numero=4966
OBTIDO_EM: 2026-09-02

<cole aqui o texto das seções relevantes, sem editar>
```

Se o site abrir a partir da máquina e o agente tiver rede, você pode salvar só a URL e pedir para
ele buscar. Mas **confira o que ele trouxe**: página que voltou vazia por bloqueio de proxy vira
ficha vazia com aparência de completa.

### 6.2 Rodar o agente

Na sessão do Copilot app sobre `recr-cmn-tribo-knowledge`:

```text
Use o agente po-curar-fonte.

Processe o arquivo inbox/bacen-res-4966.md.

Contexto: preciso saber o que esta resolução exige que afete renegociação e recuperação de
crédito no cockpit do gerente (recr-fed-agc-reneg).

Gere o arquivo em tribo/externas/ no formato da skill formato-fonte-externa, com:
- a citação literal dos trechos que sustentam cada afirmação;
- a leitura de negócio em seção separada, assinada;
- confianca: alta (documento oficial);
- as divergências, se houver, entre a norma e o que está publicado na base.

Não parafraseie a norma. Se um trecho for longo, cite o trecho e resuma DEPOIS, na seção de
leitura de negócio.
```

### 6.3 O que sai, e onde

- `tribo/externas/bacen-res-4966.md` — a ficha estruturada.
- `tribo/externas/fontes/bacen-res-4966.txt` — o texto original preservado (mova o arquivo da
  `inbox/` para cá; a `inbox/` fica sempre vazia depois do processamento).

Valide e abra o PR do mesmo jeito da seção 5. Se o agente apontar divergência entre a norma e uma
regra publicada, **não resolva no PR**: abra uma decisão de negócio em
`squads/recr-fed-agc-reneg/decisoes/` e leve a divergência para quem decide.

---

## 7. O que não fazer nesta fase

- **Não peça "leia o repositório e gere as regras de negócio".** Sai um documento plausível,
  parcialmente inventado e impossível de auditar. Os prompts acima são estreitos de propósito.
- **Não documente por cobertura.** Meta não é "todas as telas". É "as perguntas que o PO fez no
  último mês têm resposta".
- **Não copie os agentes para `%USERPROFILE%\.copilot\agents\`.** Essa pasta sobrescreve a do
  repositório: um colega com cópia antiga usaria a versão errada sem perceber.
- **Não crie o workflow ainda.** Ele entra quando a base provar que responde. Antes disso, ele só
  enche mais rápido uma base que ninguém consulta.
