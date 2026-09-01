---
name: formato-fonte-externa
description: Formato da ficha de fonte externa — norma do Bacen, política interna, ata, contrato —
  com separação obrigatória entre citação literal e interpretação. Use ao curar arquivos de inbox/.
---

# Formato da fonte externa

Caminho: `tribo/externas/<slug>.md`

````markdown
---
tipo: fonte-externa
classe: norma-externa     # norma-externa | politica-interna | ata | contrato
fonte: BACEN — Resolução 4.966
url: https://www.bcb.gov.br/...
publicado_em: AAAA-MM-DD  # data do documento, não da leitura
obtido_em: AAAA-MM-DD
curado_por: <usuário>
confianca: alta           # alta | media | baixa
afeta: [tribo]
original: tribo/externas/fontes/<arquivo>
---

## Trecho literal
> <citação exata, sem edição e sem resumo>

## Leitura de negócio
<interpretação, explicitamente marcada como interpretação>

## Impacto declarado
<o que muda na operação, ou "nenhum impacto identificado">

## Divergências com a base
<se contradiz algo publicado: aponte os dois lados e pare>

## Em aberto
- **[NÃO RESPONDIDO]** <o que a fonte não responde>
````

## Regras

- **Literal e interpretação nunca se misturam.** Norma parafraseada sem o texto original é
  indefensável numa auditoria.
- Uma afirmação na leitura de negócio, um trecho literal que a sustente.
- `confianca` na dúvida entre dois níveis: use o menor.
- Conversão parcial de PDF é declarada, não disfarçada.
