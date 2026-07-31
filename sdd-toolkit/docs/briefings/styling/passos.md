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