`--center` confirmado mata a parte mais chata: sem SCSS de posicionamento, sem override, sem risco de quebrar na próxima major. Troca `--right` por `--center` e o componente fica sem arquivo `.scss` nenhum.

## O que não dá pra adiar junto com o resto

Você quer só o shared component agora — escopo válido. Mas o fato de ele ter **dois consumidores** (`MessageService` e componentes de feature chamando direto) não é adiável, porque é isso que define a API. Um componente que só funciona sendo dirigido por um serviço vai precisar de retrabalho quando a feature de exclusão de arquivo tentar usar ele direto.

A consequência prática: o componente é **burro**. Não injeta `MessageService`, não injeta nada. Recebe estado por `input()`, avisa por `output()`. Quem orquestra é o consumidor, seja o serviço ou a feature.

O que fica de fora de verdade: onde o host vive no MFE, política de fila, e refatorar o `MessageService`. Esses são problemas de orquestração e podem esperar.

**Efeito colateral de adiar, pra você saber que existe:** com `position: fixed`, dois snackbars simultâneos (um do serviço, um de uma feature) renderizam exatamente sobrepostos. Não é bug do componente, é a ausência da camada de orquestração. Aceitável agora, vira problema quando os dois caminhos estiverem em produção.

## Uma verificação de 30 segundos

Removendo o `data-sb-close`, confirme que o ícone de fechar continua renderizando. Se o CSS do Liquid usar `[data-sb-close]` como seletor (e não só a classe `brad-snackbar__close`), o ícone some. É rápido de checar na story e muda o markup do componente.Invocação:

```
/sdd-plan
Componente snackbar de apresentação na camada shared, com variantes de sucesso e erro,
usando as classes Liquid e sem SCSS de posicionamento.

#readFile .sdd/briefings/snackbar.md
```

**Correção do que eu disse antes:** falei que seria rigor Full. Com o escopo reduzido ao componente de apresentação — sem host, sem fila, sem `MessageService` — isso é **Lite**. Não tem decisão arquitetural suficiente pra justificar `design.md`. Se o plano classificar como Full, questione o motivo dele.

O plano ainda vai bater nas três decisões que deixei abertas (auto-dismiss, animação de saída, acessibilidade). Cada uma tem recomendação escrita junto, então o Passo 5 deve conseguir fechar sozinho — mas se ele preferir perguntar, responde e segue. São perguntas legítimas, não lacuna de briefing.