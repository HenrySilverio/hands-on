---
agent: agent
model: Claude Opus 5 (copilot)
tools: ["read/readFile", "edit/createFile", "edit/editFiles"]
description: Discovery - entrevista uma necessidade crua até virar briefing pronto para o SDD.
---

# /discovery-grill

Transformar uma dor em briefing, perguntando. Nada é inferido.

## Entradas

O que você quer resolver: ${input:necessidade:Descreva em uma ou duas frases, sem se preocupar com formato}

## Passo 0 - Contrato

Leia `.github/skills/discovery-workflow/SKILL.md`.

Se a necessidade vier vazia, pergunte o que está incomodando hoje e pare. Não invente o
pedido e não ofereça exemplos de necessidade: exemplo oferecido vira a resposta.

Este comando não tem `search` entre as ferramentas, de propósito. Não leia código em nenhum
passo. Grilling que varre o repositório vira arqueologia, queima contexto e enviesa a
entrevista para o que já existe.

## Passo 1 - Preparar

Leia `.github/skills/discovery-workflow/references/tecnica-grilling.md`.

Monte a fronteira: as perguntas cujos pré-requisitos já estão respondidos. Descarte o que a
própria necessidade já respondeu.

## Passo 2 - Conduzir

Aplique os limites de rodada da seção 4 do SKILL.md. O limite deste comando é de quatro
rodadas.

Resposta vaga é lacuna, não resposta. Se vier vaga de novo, classifique pela seção 5 do
SKILL.md.

Encerre antes do limite nos casos da seção 6 do SKILL.md.

## Passo 3 - Gravar

Leia `.github/skills/discovery-workflow/references/molde-briefing.md` e siga o molde, a
convenção de lacuna e o formato de saída definidos lá.

Antes de gravar, confira os portões de qualidade da seção 7 do SKILL.md, com atenção a dois:
toda linha tem rastro numa resposta desta conversa, e nenhuma seção contém critério de aceite.
