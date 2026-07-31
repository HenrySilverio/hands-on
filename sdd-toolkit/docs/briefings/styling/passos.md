Todos os caminhos funcionam. Faço o mesmo no `query-liquid-components.mjs` — você vai precisar dos links das stories no briefing pelo mesmo motivo:Ambos funcionando. Atualizo a skill e empacoto:Substitui `query-liquid-classes.mjs` e `query-liquid-components.mjs` (os dois mudaram) e roda:

```
node .github/skills/angular-liquid-styling/scripts/query-liquid-classes.mjs snackbar --dir=.github/liquid-catalog --out=docs/briefings/new-component-shared

node .github/skills/angular-liquid-styling/scripts/query-liquid-components.mjs snackbar --dir=.github/liquid-catalog --out=docs/briefings/new-component-shared
```

Gera `snackbar-classes.md` e `snackbar-componente.md` dentro de `docs/briefings/new-component-shared/`. O diretório é criado sozinho.

Aí a invocação passa a ser:

```
/sdd-plan
Componente snackbar de apresentação na camada shared, com variantes de sucesso e erro,
usando as classes Liquid e sem SCSS de posicionamento.

#readFile docs/briefings/new-component-shared/briefing-snackbar.md
#readFile docs/briefings/new-component-shared/snackbar-classes.md
#readFile docs/briefings/new-component-shared/snackbar-componente.md
```

**Notas de implementação:**

- O `--out` aceita diretório ou arquivo `.md`. Passei o diretório, então o nome sai padronizado (`<termo>-classes.md`). Se preferir nomear você mesmo, é só terminar o caminho com `.md`.
- Cada recorte carimba **versão do Liquid e data de extração do catálogo**. É isso que deixa detectável depois que um plano foi escrito contra uma versão anterior do DS — sem o carimbo, o recorte é indistinguível de um chute.
- O comportamento sem `--out` está intacto: continua imprimindo no stdout pra consulta rápida no chat. Não quebrei o uso que você já tem.
- Recorte vazio avisa no stderr em vez de gerar arquivo silenciosamente — evita você referenciar um `.md` sem nada dentro e o plano assumir que o componente não tem classes.

**O que ainda falta no briefing:** aquela verificação do `data-sb-close` (se o ícone de fechar renderiza sem o atributo) não é dado de catálogo — é inspeção visual no navegador. Ou você confirma antes e escreve a conclusão no briefing, ou ela precisa virar tarefa explícita com passo humano. Se ficar como prosa solta nas restrições, ninguém faz.

--------

Fiz a triagem. Cinco coisas, e duas mudam o briefing de verdade.

## 1. A pergunta 2 foi respondida sobre outra coisa — culpa minha

Perguntei "alinhamento horizontal é centralizado ou à direita?" pensando na **posição do snackbar na viewport** (`--center` vs `--right`). O MCP respondeu sobre o **layout interno** (como ícone/texto/close se distribuem dentro da caixa). Ambiguidade minha na pergunta.

Isso precisa de cuidado: se "não é centralizado" entrar no briefing sem qualificação, o `/sdd-plan` vai ler como contradição da decisão de usar `brad-snackbar--center`. São eixos diferentes — o Figma não diz nada sobre posição na tela, provavelmente porque o frame é o componente isolado, não a tela.

## 2. A tipografia revelou diferença estrutural — isso muda a API

O achado mais importante: **erro tem duas linhas** (`Title Sm` semibold como título + `Paragraph Sm` como descrição), **sucesso tem uma só** (`Paragraph Sm`, sem título).

O briefing atual assume mensagem única. Não é. E o markup de referência que você me passou só tem `brad-snackbar__content` — não sei como o Liquid representa título. O recorte de classes responde: se existir `brad-snackbar__title`, usa; se não, é decisão.

## 3. Os tokens de padding/radius/elevation NÃO vão como requisito

Aqui é onde a armadilha que eu avisei quase pegou. `brad-padding-xl`, `brad-border-radius-md`, `brad-elevation-30` — se entrarem no briefing como "aplicar", o implement em modelo barato escreve SCSS com esses valores. Mas eles quase certamente **já estão dentro da classe `brad-snackbar`**.

Inverti o sentido do dado no briefing: em vez de "aplique estes tokens", virou "o design usa exclusivamente tokens do DS, o que confirma que o CSS do Liquid cobre o visual e nenhum SCSS é necessário".

## 4. A divergência da sombra é ruído

8px vs 16px de blur: se o estilo vem da classe `brad-snackbar`, isso não é decisão de quem implementa. Descartei.

## 5. Auto-dismiss e animação continuam em aberto

O Figma não tem anotação. Mas apontou algo útil: existe documentação no **Zeroheight**. Essa fonte a gente nunca explorou — pode ter a prosa que faltou no Storybook. Vale checar antes do plan.Salva os dois em `docs/briefings/new-component-shared/` (o briefing como `briefing-snackbar.md`) e preenche os placeholders de node-id e URL no topo do `figma-snackbar.md` — sem eles o carimbo não serve pra nada.

**Antes de chamar o plan, gera os recortes:**

```
node .github/skills/angular-liquid-styling/scripts/query-liquid-classes.mjs snackbar --dir=.github/liquid-catalog --out=docs/briefings/new-component-shared
```

Esse recorte responde a pergunta do título: se aparecer algo como `brad-snackbar__title`, a decisão de marcação está fechada antes do plano rodar. Se não aparecer, permanece aberta — e aí é decisão sua, não do `/sdd-plan`.

**Invocação:**

```
/sdd-plan
Componente snackbar de apresentação na camada shared, com variantes de sucesso e erro,
usando as classes Liquid e sem SCSS próprio.

#readFile docs/briefings/new-component-shared/briefing-snackbar.md
#readFile docs/briefings/new-component-shared/snackbar-classes.md
#readFile docs/briefings/new-component-shared/figma-snackbar.md
```

Deixei o `snackbar-componente.md` de fora — ele traz links de story, que servem pra você inspecionar no navegador, não pro plano raciocinar. Contexto que não muda decisão é token gasto à toa.

**Duas coisas que valem 5 minutos antes:**

O **Zeroheight** apareceu na análise do Figma como destino da documentação do componente. É a fonte de prosa que faltou no Storybook, e pode responder duração e animação — as duas decisões que continuam abertas. Se responder, você elimina duas idas e vindas com o plano.

A verificação do `data-sb-close` continua sendo inspeção visual. Coloquei numa seção própria de "verificações a fazer" e escrevi explicitamente que precisa virar tarefa no `tasks.md`. Se o plano não gerar essa tarefa, cobra — descrição em prosa no briefing não vira ação.