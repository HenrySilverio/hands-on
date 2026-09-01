---
name: formato-refinamento
description: Formato canônico do refinamento de negócio da tribo ReabilitAI, que confronta o
  briefing com as regras publicadas. Use ao gravar o resultado da segunda etapa do fluxo.
---

# Formato do refinamento

Caminho: `squads/<produto>/discovery/<TICKET>/refinamento.md`

````markdown
---
tipo: refinamento
ticket: RNG-1234
produto: cockpit-renegociacao
etapa: refinar-negocio
origem: briefing.md
data: AAAA-MM-DD
base_consultada:
  - squads/cockpit-renegociacao/publicado/regras-negocio.md@a3f21c9
  - tribo/politicas-credito.md@7e40b12
conflitos: 1
lacunas_bloqueantes: 0
veredito: precisa-decisao      # pronto-para-story | precisa-decisao
---

## Entendimento
<o problema em uma frase, com origem>

## Regras existentes que tocam a demanda
- <regra> — `caminho/do/arquivo.md`

## Conflitos com regra vigente
- **Conflito:** <o que a demanda pede> contraria <regra> em `caminho/arquivo.md`.
  **Pergunta para o PO:** <a decisão que precisa ser tomada>

## Duplicidade
<a demanda já está resolvida em outro lugar? onde?>

## Impacto em jornada existente
<o que muda ou quebra>

## Mudança de contrato
<campo, obrigatoriedade, erro novo — com base em publicado/contratos.md>

## Divergências encontradas na base
<algo publicado parece errado? registre aqui; não corrija o arquivo>

## Em aberto
- **[NÃO RESPONDIDO]** <lacuna>
````

## Regras

- `veredito: precisa-decisao` sempre que houver conflito ou lacuna bloqueante. O
  `po-gerar-user-story` se recusa a trabalhar nesse estado, e isso é intencional.
- Toda linha de "regras existentes" carrega caminho de arquivo. Sem caminho, a linha não entra.
- Conflito é apresentado como **pergunta**, nunca como resolução.
