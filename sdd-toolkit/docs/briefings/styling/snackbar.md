# Briefing — Componente Snackbar

## Necessidade

Componente Angular standalone para exibir mensagens de feedback ao usuário, com duas
variantes semânticas (sucesso e erro), usando as classes do Liquid Design System 3.1.0.

O caso de uso principal é o alerta de erro: mensagens disparadas por falha de operação
(rejeição do backend, erro de validação de negócio, falha de rede), não colocadas
estaticamente no template de uma tela específica.

## Markup de referência do Liquid

Variante de sucesso:

```html
<div id="snackbar-123" class="brad-snackbar brad-snackbar--success brad-snackbar--right">
  <em class="brad-snackbar__close" data-sb-close="snackbar-123" role="button"></em>
  <em class="brad-snackbar__icon"></em>
  <div class="brad-snackbar__content">Text goes here.</div>
</div>
```

Variante de erro: idêntica, trocando `brad-snackbar--success` por `brad-snackbar--error`.

## Comportamento visual esperado

Posicionado na região inferior da viewport, horizontalmente centralizado, permanecendo
visível durante o scroll da página.

O padrão do Liquid posiciona à direita, via `brad-snackbar--right`. A centralização é um
desvio deliberado do padrão do design system para este projeto.

DECISÃO PENDENTE: confirmar via `query-liquid-classes.mjs snackbar` se existe modificador
de centralização no catálogo. Se existir, usar o modificador e não escrever CSS de
posicionamento. Se não existir, o SCSS do componente sobrescreve o posicionamento
horizontal, e essa é a única responsabilidade do SCSS neste componente.

## Restrições

Não reimplementar em SCSS nada que já exista como classe Liquid. O SCSS do componente
cobre exclusivamente o posicionamento na viewport.

Não depender do atributo `data-sb-close` nem do JS do Liquid para o comportamento de
fechar. O fechamento é responsabilidade do Angular, via handler próprio. Motivo: o JS do
Liquid varre o DOM em busca desse atributo, e um snackbar renderizado dinamicamente pelo
Angular após o carregamento inicial pode nunca ser visto por essa varredura. Além disso,
o `id` referenciado pelo atributo quebra com múltiplas instâncias.

DECISÃO PENDENTE: verificar na story do Storybook se o JS do Liquid aplica alguma animação
de entrada ou saída que se perca ao ignorar o `data-sb-close`. Se aplicar, decidir entre
replicar a animação em CSS puro ou aceitar a perda.

Não usar `::ng-deep` nem `!important`. Se o ajuste de posicionamento exigir um dos dois,
isso indica que o seletor está errado ou que falta uma custom property no design system —
documentar como gap em vez de forçar.

Compatível com a arquitetura de micro-frontend do projeto: o componente não pode assumir
que existe apenas uma instância da aplicação na página.

## Escopo em aberto que o plano precisa fechar

Onde vive o host do snackbar na arquitetura de micro-frontends: no shell, compartilhado
entre remotes, ou um por remote. A escolha determina se dois remotes com erro simultâneo
empilham snackbars ou disputam o mesmo host.

Se o `MessageService` existente do data layer passa a renderizar através deste componente,
ou se o componente é independente dele.

Comportamento com múltiplas mensagens simultâneas: fila, empilhamento ou substituição.

Se a mensagem fecha sozinha após um tempo, e qual tempo, ou se exige ação do usuário.

## Acessibilidade

O markup de referência usa `role="button"` num elemento `em`, sem `tabindex` e sem rótulo
acessível — o botão de fechar não é alcançável por teclado nem anunciado por leitor de tela.

O container não declara região de status, então a mensagem não é anunciada quando aparece.
Para alerta de erro isso é relevante: a mensagem precisa ser percebida por quem não está
olhando para aquela região da tela.

O plano deve decidir explicitamente se corrige esses pontos no wrapper Angular ou se
mantém paridade estrita com o markup do design system. Manter paridade é uma decisão
válida, mas precisa ser consciente e registrada, não acidental.