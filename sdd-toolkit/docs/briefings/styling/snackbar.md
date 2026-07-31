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
posicionamento centralizado. O padrão `brad-snackbar--right` não é usado neste projeto.

O markup original do design system inclui `id` e `data-sb-close`, ambos omitidos aqui — ver
restrições.

## Comportamento visual

Posicionado na região inferior da viewport, centralizado horizontalmente, permanecendo
visível durante o scroll. Esse comportamento vem inteiramente das classes Liquid.

## Restrições

Nenhum SCSS de posicionamento. O modificador `--center` já resolve, e reimplementar
posicionamento em SCSS quebraria na próxima major do design system. Se ao final o componente
não precisar de nenhuma regra própria, ele não deve ter arquivo de estilo.

Não usar `::ng-deep` nem `!important`.

Não depender do atributo `data-sb-close` nem do JS do Liquid para fechar. O JS do Liquid
varre o DOM procurando esse atributo, e um snackbar renderizado dinamicamente pelo Angular
pode nunca ser visto por essa varredura. O `id` que o atributo referencia também quebra com
múltiplas instâncias. O fechamento é handler do Angular.

VERIFICAR antes de implementar: confirmar na story do Storybook que o ícone de fechar
continua renderizando sem o atributo `data-sb-close`. Se o CSS do Liquid usar esse atributo
como seletor, e não apenas a classe `brad-snackbar__close`, o markup precisa mantê-lo e a
estratégia de fechamento precisa ser revista.

O componente não pode assumir instância única na página. A aplicação é micro-frontend.

## Decisões que o plano precisa fechar

Se a mensagem fecha sozinha após um tempo. Se sim, se o tempo é fixo no componente ou vem
por input, e se erro e sucesso têm tempos diferentes. Recomendação: input opcional de
duração, componente emite o output de fechamento ao expirar, sem duração significa que só
fecha por ação do usuário.

Se existe animação de saída. Isso determina quem controla a visibilidade: sem animação, o
consumidor usa bloco condicional no template e o componente nunca conhece o estado oculto;
com animação, o componente precisa permanecer montado durante a saída e portanto precisa de
um input de visibilidade. A opção sem animação é mais simples e mais testável.

Se o wrapper Angular corrige os problemas de acessibilidade do markup do design system, ou
mantém paridade estrita. Os problemas: o botão de fechar é um elemento `em` com
`role="button"`, sem `tabindex` e sem rótulo acessível, portanto inalcançável por teclado e
não anunciado por leitor de tela; e o container não declara região de status, então a
mensagem não é anunciada ao aparecer. Para alerta de erro em aplicação bancária isso é
relevante. Recomendação: corrigir no wrapper, documentando como gap do design system.

## Fora de escopo

Onde o host do snackbar vive na arquitetura de micro-frontends.

Política para múltiplas mensagens simultâneas: fila, empilhamento ou substituição.

Refatoração do `MessageService` para renderizar através deste componente.

Consequência aceita: com posicionamento fixo e sem camada de orquestração, dois snackbars
simultâneos renderizam sobrepostos. Isso é esperado enquanto o host único não existir.