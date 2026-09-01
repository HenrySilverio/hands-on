---
name: formato-decisao-negocio
description: Formato do registro de decisão de negócio da tribo ReabilitAI, com ciclo de vida
  vigente/superada. Use ao registrar algo decidido em reunião, comitê ou alinhamento.
---

# Formato da decisão de negócio

Caminho: `squads/<produto>/decisoes/<AAAA-MM>-<slug>.md` ou `tribo/decisoes/<AAAA-MM>-<slug>.md`

````markdown
---
tipo: decisao
titulo: <o que foi decidido, em uma linha>
status: vigente           # proposta | vigente | superada
decidido_em: AAAA-MM-DD
decidido_por: [PO cockpit, jurídico, risco]
origem: <reunião, comitê, norma — com data>
confianca: alta           # alta | media | baixa
supera: null              # slug da decisão que esta substitui
afeta: [cockpit-renegociacao]
---

## Decisão
<o que ficou decidido, sem rodeio>

## Por quê
<o raciocínio, incluindo a alternativa descartada e o motivo>

## O que muda no produto
<impacto observável — se não houver, isto não é decisão, é opinião>

## Em aberto
- **[NÃO RESPONDIDO]** <o que ficou por decidir>
````

## Regras

- Decisão **nunca é apagada nem editada**. Quando muda, crie a nova com `supera:` e peça ao revisor
  humano que marque a antiga como `status: superada`.
- Sem "o que muda no produto", não grave: opinião registrada como decisão polui a base.
- `decidido_por` vazio é lacuna. Decisão sem dono não é decisão.
