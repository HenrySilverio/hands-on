---
name: formato-fonte-externa
description: Formato da ficha de fonte externa — norma do Bacen, política interna, ata, contrato —
  com separação obrigatória entre citação literal e interpretação, escopo declarado e ciclo de
  vida. Use ao curar arquivos de inbox/.
---

# Formato da fonte externa

Caminho, definido pela pasta de entrada (nunca deduzido):

- escopo tribo → `tribo/externas/<slug>.md`
- escopo squad → `squads/<produto>/externas/<slug>.md`

````markdown
---
tipo: fonte-externa
classe: norma-externa     # norma-externa | politica-interna | ata | contrato | print-tela | print-conversa
escopo: tribo             # tribo | squad
produto: null             # obrigatório quando escopo: squad
fonte: BACEN — Resolução 4.966
url: https://www.bcb.gov.br/...
fonte_original: "portal BCB (público)"   # onde o documento vive; NUNCA um binário no repo
publicado_em: AAAA-MM-DD  # data do documento, não da leitura
obtido_em: AAAA-MM-DD
curado_por: <usuário>
confianca: alta           # alta | media | baixa
status: vigente           # vigente | revogada | substituida
substituida_por: null     # slug da ficha que substitui esta
transcricao: null         # caminho da transcrição integral, quando houver
divergencias: completa    # completa | parcial | nao-verificada
afeta: [tribo]
---

## Trecho literal
> <citação exata, sem edição e sem resumo>

## Leitura de negócio
<interpretação, explicitamente marcada como tal, com o nome de quem interpretou>

## Obrigações
Uma linha por exigência da fonte, cada uma com o trecho que a sustenta. É desta seção que saem as
regras de negócio depois — se ela estiver vaga, a regra sai vaga.

- **<o que a fonte exige>** — trecho: "<citação curta>"

## Aplicabilidade e prazos
A quem se aplica, a partir de quando, e o que fica de fora. Se a fonte não disser, marque a lacuna
em vez de assumir vigência imediata.

## Termos definidos pela fonte
Termos que a fonte define e que podem entrar no glossário. Só os que ela **define**, não os que ela
usa.

## Impacto declarado
<o que muda na operação, ou "nenhum impacto identificado">

## O que precisa ser decidido
Perguntas que esta fonte abre e que só o negócio responde. Não são lacunas da fonte — são decisões
pendentes. Cada uma vira candidata a registro em `decisoes/`.

## Divergências com a base
Liste **quais arquivos foram consultados** e o resultado. Se houver contradição, os dois lados, e
a afirmação de que precisa de decisão. Se não houver, "nenhuma divergência encontrada em: <lista>".

## Em aberto
- **[NÃO RESPONDIDO]** <o que a fonte não responde>
````

## Regras

- **Nenhum binário na base.** O PDF, o docx e a apresentação continuam onde já estão. O campo
  `fonte_original` diz onde — SharePoint, Teams, portal do órgão, repositório de normas. Ficha sem
  esse campo não é auditável.
- **Literal e interpretação nunca se misturam.** Uma afirmação na leitura de negócio, um trecho
  literal que a sustente.
- **`escopo` vem da pasta de entrada**, não de dedução. `escopo: squad` exige `produto`
  preenchido.
- **Ficha não é apagada.** Norma revogada vira `status: revogada`; substituída vira
  `status: substituida` com `substituida_por`. O histórico é o que permite responder "o que valia
  em março".
- `confianca` na dúvida entre dois níveis: use o menor.
- **`**[NÃO RESPONDIDO]**` é só para lacuna da FONTE** — algo que o documento não diz. Etapa que
  não rodou não é lacuna da fonte: isso vive no campo `divergencias`, com o motivo escrito na
  seção. Misturar os dois esconde a diferença entre "a norma é omissa" e "ninguém conferiu".
- Conversão parcial de um documento é declarada, não disfarçada.
- **Transcrição integral** quando a fonte for interna ou o endereço original for instável: grave o
  texto completo em `<escopo>/externas/transcricoes/<slug>.md` e aponte no campo `transcricao`.
  Documento público com URL estável (Bacen, legislação) dispensa — o portal é o arquivo.
  A transcrição é **texto**, nunca o binário, e passa pela mesma checagem de dado pessoal.
  Ela não substitui o original para efeito formal: serve para consulta e para o conteúdo não se
  perder quando o SharePoint for reorganizado.
- **Print** entra como transcrição: primeira linha do trecho literal marca que é transcrição de
  imagem e a data; o que não se lê vira `[ILEGÍVEL]`, nunca completado pelo contexto. A imagem não
  é gravada — `fonte_original` diz de onde ela veio. Print de tela é `confianca: baixa`: mostra o
  comportamento de um caso, não a regra.
