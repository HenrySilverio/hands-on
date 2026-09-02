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
afeta: [tribo]
---

## Trecho literal
> <citação exata, sem edição e sem resumo>

## Leitura de negócio
<interpretação, explicitamente marcada como tal, com o nome de quem interpretou>

## Impacto declarado
<o que muda na operação, ou "nenhum impacto identificado">

## Divergências com a base
<se contradiz algo publicado: aponte os dois lados e pare>

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
- Conversão parcial de um documento é declarada, não disfarçada.
- **Print** entra como transcrição: primeira linha do trecho literal marca que é transcrição de
  imagem e a data; o que não se lê vira `[ILEGÍVEL]`, nunca completado pelo contexto. A imagem não
  é gravada — `fonte_original` diz de onde ela veio. Print de tela é `confianca: baixa`: mostra o
  comportamento de um caso, não a regra.
