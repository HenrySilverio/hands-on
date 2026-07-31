# Briefing — Componente Snackbar (shared)

## Necessidade

Componente Angular standalone, na camada shared, para exibir mensagens de feedback com duas
variantes semânticas: sucesso e erro. Usa as classes do Liquid Design System 3.1.0.

Escopo desta mudança: apenas o componente de apresentação. A orquestração de quando e onde
exibir fica fora.

## Consumidores previstos

O componente terá dois tipos de consumidor, e isso define sua API:

O `MessageService` existente, que hoje já é injetado nos serviços do data layer e passará a
renderizar através deste componente.

Componentes de feature chamando diretamente, para erros que não passam pelo serviço — por
exemplo, falha ao excluir um arquivo importado.

Consequência: o componente é de apresentação pura. Não injeta `MessageService` nem nenhum
outro serviço, não decide quando aparece, não conhece origem da mensagem. Recebe estado por
input e comunica interação por output. Um componente que só funcione sendo dirigido por
serviço precisaria de retrabalho no primeiro uso direto por uma feature.

## Estrutura de conteúdo

Confirmado no design: as duas variantes têm estruturas de texto diferentes.

A variante erro apresenta título e descrição, em dois níveis tipográficos distintos.

A variante sucesso apresenta apenas uma linha de mensagem, sem título.

Isso é diferença estrutural, não apenas de estilo, e a API do componente precisa acomodar as
duas formas.

## Markup de referência do Liquid

```html
<div class="brad-snackbar brad-snackbar--success brad-snackbar--center">
  <em class="brad-snackbar__close" role="button"></em>
  <em class="brad-snackbar__icon"></em>
  <div class="brad-snackbar__content">Text goes here.</div>
</div>
```

Variante de erro: trocar `brad-snackbar--success` por `brad-snackbar--error`.

O modificador `brad-snackbar--center` foi confirmado no catálogo de classes e resolve o
posicionamento centralizado na viewport. O padrão `brad-snackbar--right` não é usado neste
projeto.

Atenção: este markup de referência contempla apenas um bloco de conteúdo. Ele não cobre a
estrutura de título mais descrição da variante erro — ver decisões pendentes.

O markup original do design system inclui `id` e `data-sb-close`, ambos omitidos aqui — ver
restrições.

## Comportamento visual

Posicionado na região inferior da viewport, centralizado horizontalmente, permanecendo
visível durante o scroll. Esse comportamento vem inteiramente das classes Liquid.

O componente preenche a largura do container que o hospeda; ele não define largura própria.
Texto longo quebra em nova linha, sem truncamento.

## Restrições

Nenhum SCSS de estilo visual. A análise do design confirmou que espaçamento, raio, elevação
e cores vêm integralmente de tokens do design system, o que significa que o CSS do Liquid
cobre o visual por completo. Se ao final o componente não precisar de nenhuma regra própria,
ele não deve ter arquivo de estilo.

Em particular, não reaplicar em SCSS os valores de padding, raio de borda ou sombra
observados no Figma: eles já são entregues pela classe `brad-snackbar`. Reimplementá-los
quebraria na próxima major do design system.

Não usar `::ng-deep` nem `!important`.

Não depender do atributo `data-sb-close` nem do JS do Liquid para fechar. O JS do Liquid
varre o DOM procurando esse atributo, e um snackbar renderizado dinamicamente pelo Angular
pode nunca ser visto por essa varredura. O `id` que o atributo referencia também quebra com
múltiplas instâncias. O fechamento é handler do Angular.

O componente não pode assumir instância única na página. A aplicação é micro-frontend.

## Verificações a fazer antes de implementar

Confirmar na story do Storybook que o ícone de fechar continua renderizando sem o atributo
`data-sb-close`. Se o CSS do Liquid usar esse atributo como seletor, e não apenas a classe
`brad-snackbar__close`, o markup precisa mantê-lo e a estratégia de fechamento precisa ser
revista. Esta verificação é visual, feita no navegador, e precisa constar como tarefa
explícita — não pode ficar apenas descrita aqui.

Confirmar no recorte de classes se existe classe própria para o título dentro do snackbar.
A resposta determina como a variante erro estrutura seu conteúdo — ver decisões pendentes.

## Decisões que o plano precisa fechar

Como a API acomoda as duas estruturas de conteúdo. Recomendação: um input de título
opcional além do input de mensagem, com a variante erro fornecendo ambos e a sucesso apenas
a mensagem. A alternativa é uma API discriminada por variante, mais rígida e com mais
cerimônia. A escolha precisa considerar que nada impede um consumidor de passar título numa
variante de sucesso, e se isso deve ser permitido ou impedido pelo tipo.

Como o título é marcado no HTML, caso não exista classe própria no catálogo do Liquid para
ele. As opções são usar um elemento semântico dentro do bloco de conteúdo existente, ou
aplicar classes utilitárias de tipografia do design system, se houver.

Se a mensagem fecha sozinha após um tempo. O design não traz essa definição — não há
anotação de duração nos nós inspecionados. A documentação do componente no Zeroheight não
foi consultada e pode conter a regra. Recomendação, caso permaneça indefinido: input
opcional de duração, componente emite o output de fechamento ao expirar, ausência de duração
significa que só fecha por ação do usuário.

Se existe animação de saída. O design também não define. Isso determina quem controla a
visibilidade: sem animação, o consumidor usa bloco condicional no template e o componente
nunca conhece o estado oculto; com animação, o componente precisa permanecer montado durante
a saída e portanto precisa de um input de visibilidade. A opção sem animação é mais simples
e mais testável.

Se o wrapper Angular corrige os problemas de acessibilidade do markup do design system, ou
mantém paridade estrita. Os problemas: o botão de fechar é um elemento `em` com
`role="button"`, sem `tabindex` e sem rótulo acessível, portanto inalcançável por teclado e
não anunciado por leitor de tela; e o container não declara região de status, então a
mensagem não é anunciada ao aparecer. O design não trata de acessibilidade. Para alerta de
erro em aplicação bancária isso é relevante. Recomendação: corrigir no wrapper, documentando
como gap do design system.

## Fora de escopo

Variantes além de sucesso e erro. O component set completo do Figma não foi inspecionado,
então não se sabe se existem variantes de informação ou alerta. Como o tipo do input de
variante é uma união de strings, acrescentar valores depois não quebra consumidores
existentes.

Onde o host do snackbar vive na arquitetura de micro-frontends.

Política para múltiplas mensagens simultâneas: fila, empilhamento ou substituição.

Refatoração do `MessageService` para renderizar através deste componente.

Consequência aceita: com posicionamento fixo e sem camada de orquestração, dois snackbars
simultâneos renderizam sobrepostos. Isso é esperado enquanto o host único não existir.