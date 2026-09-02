---
name: precedencia-tribo-squad
description: Regra de precedência entre o conhecimento geral da tribo ReabilitAI e o conhecimento
  específico de cada squad, e o que fazer diante de contradição. Use sempre que uma resposta
  envolver arquivos de tribo/ e de squads/ ao mesmo tempo.
---

# Precedência entre tribo e squad

## A regra

Regra de squad **especializa** regra de tribo. Nunca a contradiz.

Especializar é restringir ou detalhar dentro do que a tribo permite. Exemplo legítimo: a tribo
permite parcelamento até 72 meses; o cockpit limita a 60 no perfil X. O específico cabe dentro do
geral.

## Contradição real

Contradição é quando o específico **não cabe** no geral: a squad permite o que a tribo proíbe, ou
os dois afirmam valores incompatíveis para a mesma situação.

Diante de contradição real:

1. Apresente **as duas regras**, cada uma com o caminho do arquivo.
2. Diga que há contradição e que ela precisa de decisão de negócio.
3. **Pare.**

## O que você não faz

- Não escolhe a mais específica.
- Não escolhe a mais recente.
- Não concilia ("provavelmente o que valeu foi...").
- Não deduz que a regra da tribo foi revogada porque um produto faz diferente.

O motivo: sem esta trava, o comportamento natural do modelo é pegar a mais específica e seguir.
Aí uma regra de tribo revogada continua valendo em silêncio num produto, e ninguém descobre até a
auditoria. Contradição entre camadas é achado de governança, não ambiguidade a resolver na hora.
