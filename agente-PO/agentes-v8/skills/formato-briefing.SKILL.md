---
name: formato-briefing
description: Formato canônico do briefing de discovery da tribo ReabilitAI. Use ao gravar o
  resultado de uma entrevista inicial com o PO.
---

# Formato do briefing

Caminho: `squads/<produto>/discovery/<TICKET>/briefing.md`

````markdown
---
tipo: briefing
ticket: RNG-1234
produto: cockpit-renegociacao
etapa: iniciar-discovery
autor: <quem operou a sessão>
entrevistado: <nome do PO>
data: AAAA-MM-DD
lacunas_borda: 2
lacunas_bloqueantes: 0
---

## Problema
<o que está ruim hoje, para quem, com que frequência — nas palavras do PO>

## Resultado esperado
<como saberemos que melhorou; que número muda>

## Quem é afetado
<perfil de cliente, perfil de usuário interno, volume>

## Restrições
<prazo, norma, política, dependência de área>

## Fora de escopo
<o que explicitamente não entra>

## Exceções mencionadas
<casos estranhos que o PO já viu>

## Solução sugerida pelo PO
<se ele propôs algo — registrado como sugestão, não como requisito>

## Em aberto
- **[NÃO RESPONDIDO]** <pergunta que ficou sem resposta>
````

## Regras

- Seção sem resposta recebe `**[NÃO RESPONDIDO]**`, não fica vazia e não é omitida.
- Nada aqui é escrito por dedução. Se não foi dito, não está no briefing.
- `lacunas_bloqueantes` maior que zero significa que o arquivo **não deveria ter sido gravado**.
