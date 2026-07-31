# Fatos do Figma — Componente Snackbar

## Procedência

| Campo | Valor |
|---|---|
| Fonte | MCP do Figma (`com.figma.mcp`), ferramenta Get Design Context |
| Frames inspecionados | variante erro e variante sucesso — PREENCHER os node-ids |
| Component set completo | nó `13079:10205` — NÃO inspecionado |
| URL do arquivo | PREENCHER |
| Extraído em | 31/07/2026 |

Este arquivo registra apenas o que foi observado no design. Não contém código, não contém
inferência sobre implementação, e não substitui o catálogo de classes do Liquid como fonte
das classes CSS a usar.

## Variantes

Os dois frames inspecionados contêm apenas as variantes erro e sucesso.

Erro usa o ícone `component-circle-error` sobre fundo `alert-error-xlight` (#fce7ec).
Sucesso usa o ícone `feedback-circle-check` sobre fundo `alert-success-xlight` (#e6faee).

Não é possível afirmar se existem variantes de informação ou alerta sem inspecionar o
component set completo, que não foi consultado. Como o escopo atual cobre apenas erro e
sucesso, isso não bloqueia — mas convém saber antes de fechar o tipo do input de variante.

## Estrutura de conteúdo — diferença entre as variantes

A variante erro apresenta duas linhas de texto: um título em `Title Sm` semibold 14px/20px
e uma descrição em `Paragraph Sm` medium 14px/16px, separadas por `brad-padding-sm`.

A variante sucesso apresenta apenas uma linha, em `Paragraph Sm` medium 14px/16px, sem
título separado.

Esta é uma diferença estrutural entre as variantes, não apenas de estilo, e afeta a API do
componente.

## Layout interno

Distribuição horizontal dentro da caixa: ícone à esquerda, bloco de conteúdo ocupando o
espaço flexível central, ícone de fechar à direita. O texto é alinhado à esquerda dentro do
bloco central.

Este fato descreve o arranjo dos elementos DENTRO do componente. Ele não diz nada sobre
onde o componente se posiciona na viewport — o frame inspecionado é o componente isolado,
não uma tela. O posicionamento na tela permanece definido pelo modificador de
posicionamento do catálogo Liquid, e não há conflito entre as duas coisas.

## Ícone de fechar

Presente nas duas variantes, sempre como último elemento à direita, tamanho 16x16, usando
o ícone `component-close-delete`.

## Largura e texto longo

O nó raiz não define largura fixa nem máxima: o componente preenche a largura do container
pai. Consequência: quem determina a largura é quem posiciona o componente, não o
componente.

Texto longo quebra em nova linha. Não há truncamento com reticências no design.

## Comportamento temporal

Não há nenhuma anotação sobre tempo de exibição, animação de entrada ou saída, ou gatilho
de fechamento automático nos nós inspecionados.

A única descrição de documentação encontrada é genérica: descreve o snackbar como
componente flutuante e interativo que fornece feedback breve, com link para o Zeroheight.

Consequência: o design não fecha as decisões de duração e animação. O Zeroheight é uma
fonte de documentação ainda não consultada e pode conter essa definição.

## Conformidade com o design system

Todos os valores de espaçamento, raio, elevação, cor de fundo e cor de texto observados
correspondem a tokens nomeados do Liquid. Nenhum valor solto ou hardcoded foi identificado
fora dos tokens.

Interpretação: o visual do componente é integralmente coberto pelo CSS do design system.
Este fato é registrado como confirmação de que nenhum estilo próprio é necessário, e não
como lista de valores a aplicar. Reaplicar em SCSS valores que a classe do Liquid já entrega
é exatamente o que a convenção do projeto proíbe.

## Observações descartadas na triagem

O relatório do MCP apontou uma pequena divergência no valor de blur da sombra entre o CSS
extraído e a descrição do efeito no Figma. Como a sombra vem da classe do design system e
não de estilo próprio do componente, isso não é decisão de quem implementa. Não acionável.

Nomes de classe utilitária que apareceram no relatório são tradução do Dev Mode para o
framework de CSS dele, não propriedades do design nem classes do Liquid. Ignorados.