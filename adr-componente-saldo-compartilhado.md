# Componente de saldo compartilhado entre MFEs — análise de decisão

Cenário: shell + N MFEs, todos exibindo o saldo do cliente a partir da mesma API. JFrog disponível para distribuir libs internas.

---

## 1. A pergunta esconde três decisões independentes

"Esse componente" não é uma coisa só. São três, com donos, taxas de mudança e riscos de acoplamento completamente diferentes:

| Parte | O que é | Muda quando | Deve ser igual em todos? |
|---|---|---|---|
| **Apresentação** | layout, formatação de moeda, ocultar/revelar, skeleton, estados de erro, acessibilidade | muda o design system ou a regra de exibição | **sim** — é requisito de marca e consistência |
| **Contrato de dados** | shape do saldo (valor, moeda, timestamp, bloqueios) | muda o contrato do BFF | sim, mas já é versionado |
| **Acesso à API** | endpoint, auth, retry, cache, tratamento de erro, config por ambiente | muda a infra ou o contrato | não necessariamente |

Empacotar as três juntas num `npm install` é o que transforma uma boa ideia em acoplamento de release. Separá-las é o que faz a decisão ficar fácil.

**A intuição da terceira opção que ela levantou — "componente visual compartilhado, implementação de API em cada MFE" — está no caminho certo.** Mas incompleta, porque falta responder de onde vem o dado.

---

## 2. A pergunta que ninguém fez: de onde vem o dado?

Se **todos** os MFEs precisam do saldo, então saldo não é dado de feature. É **dado de contexto do usuário** — mesma categoria do token, do nome do cliente, da agência/conta.

Duas consequências práticas que ninguém percebe até virar chamado:

**a) N chamadas idênticas à mesma API.** Cada MFE fazendo o próprio fetch multiplica a carga no serviço de saldo pelo número de MFEs que o usuário visita na sessão. Em banco, saldo costuma ser um dos endpoints mais caros da stack.

**b) Inconsistência de valor — o problema sério.** Com N fetches independentes em momentos diferentes, dois componentes de saldo na mesma sessão podem exibir **valores diferentes**. Usuário vê R$ 1.000 numa tela, navega, vê R$ 950 na outra, porque houve uma movimentação entre as duas chamadas. Isso não é bug de componente e não vai ser reproduzido em teste — vai virar reclamação de cliente.

Compartilhar o componente não resolve nada disso. **Compartilhar o componente resolve consistência de código; só compartilhar o dado resolve consistência de valor.**

> **Pergunta a fazer antes de decidir:** os MFEs coexistem na mesma página (dois componentes de saldo visíveis ao mesmo tempo), ou o shell monta um por vez via rota? Se coexistem, o item (b) é urgente e muda a prioridade da decisão.

---

## 3. As opções, com os trade-offs reais

### A — Replicar em cada MFE

| Prós | Contras |
|---|---|
| acoplamento zero; cada time no seu ritmo | N implementações divergem com o tempo |
| deploy independente 100% preservado | bug de formatação exige N PRs em N times |
| nenhuma infra de publicação necessária | N times precisam entender a API de saldo |
| | inconsistência visual entre jornadas |

**Quando é a resposta certa:** se o componente for pequeno (< ~150 linhas) e a organização **não tiver** time dono e CI de publicação para a lib. Uma lib compartilhada órfã é pior do que duplicação — vira código que ninguém pode mudar porque ninguém sabe quem quebra.

Vale lembrar o princípio: *duplicação é bem mais barata que a abstração errada*. O custo da duplicação é linear e visível; o da abstração errada é composto e invisível até ser tarde.

### B — Pacote npm único, com visual + API dentro

| Prós | Contras |
|---|---|
| uma implementação, uma correção | **acoplamento de release** |
| consistência garantida por construção | **N versões em produção ao mesmo tempo** |
| | **peer dependency de Angular vira gargalo de migração** |
| | pacote carrega config de ambiente |
| | precisa de dono, senão apodrece |

Os três primeiros contras merecem detalhe, porque são exatamente o que a arquitetura de ilha isolada (`shared: {}`) existe para evitar:

**Acoplamento de release.** Com `shared: {}`, a lib é bundlada **dentro** de cada remote. Não há hot-swap. Corrigir um bug crítico de exibição de saldo significa: publicar a lib → N times bumparem → N builds → N deploys. O tempo de propagação do fix é o tempo do MFE mais lento. Se um time está em freeze, o bug fica em produção nele.

**N versões simultâneas.** MFE-A na v1.2 e MFE-B na v1.5 significa dois comportamentos de saldo na mesma sessão do mesmo usuário. Se o contrato da API mudou entre as versões, uma delas quebra — e o sintoma aparece só em um MFE, o que torna o diagnóstico caro.

**Peer dependency como gargalo.** Uma lib Angular declara `@angular/core` como `peerDependency`. Se o range for estreito, ela trava a migração de qualquer MFE que queira subir de versão antes dos outros. Numa arquitetura onde cada ilha deveria poder migrar sozinha, isso reintroduz precisamente o acoplamento de versão que o `shared: {}` eliminou.

### C — Pacote de apresentação pura + dados por MFE

O componente vira uma função de estado para pixels. Sem `HttpClient`, sem `inject` de serviço de domínio, sem config de ambiente.

```ts
// @bradesco/fed-ui-saldo
@Component({
  selector: 'brad-saldo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
})
export class SaldoComponent {
  readonly estado = input.required<'carregando' | 'ok' | 'erro' | 'indisponivel'>();
  readonly valor = input<number | null>(null);
  readonly moeda = input<string>('BRL');
  readonly atualizadoEm = input<Date | null>(null);
  readonly oculto = model<boolean>(false);
  readonly tentarNovamente = output<void>();
}
```

| Prós | Contras |
|---|---|
| pacote estável — apresentação muda pouco | cada MFE ainda implementa a chamada |
| sem config de ambiente, sem auth, sem retry | conhecimento da API replicado |
| testável sem `TestBed`, sem mock de HTTP | |
| não trava migração de Angular (só usa API estável) | |
| não acopla ao contrato do BFF | |

O contra praticamente evapora se o client HTTP for **gerado do OpenAPI**: aí a "duplicação" é código gerado, não escrito. O que replica é um comando de geração, não conhecimento.

### D — Publicar o componente como remote federado

Considerada e descartada aqui. Daria hot-swap real (corrige uma vez, todos recebem sem rebuild), mas com `shared: {}` cada remote carrega o próprio runtime Angular. Enviar ~200kb de Angular pela rede para renderizar um widget de saldo é uma troca ruim, e adiciona um round trip antes do primeiro render. Pior: cria dependência de runtime — se o remote de saldo cair, **todos** os MFEs degradam ao mesmo tempo. É exatamente o ponto único de falha que a arquitetura evita.

Faz sentido para um MFE grande e autônomo. Não para um widget.

---

## 4. Recomendação

**Duas decisões, separadas.**

### Decisão 1 — Apresentação: sim, compartilhar. Opção C.

Publicar `@bradesco/fed-ui-saldo` (ou levar para o Liquid DS, se a exibição de saldo for padrão de marca e não específica desta jornada — nesse caso o lugar natural é o design system, não um pacote avulso).

Regras que fazem a diferença entre funcionar e virar dívida:

- **Zero HTTP, zero DI de domínio, zero config de ambiente.** Se o pacote precisar saber uma URL, o desenho está errado.
- **Não publicar já como custom element.** Registrar a tag dentro da lib faz dois MFEs colidirem no `CustomElementRegistry` — o `NotSupportedError` de tag duplicada. Publique como componente Angular; quem decide virar custom element é o remote.
- **`peerDependencies` com range largo** (ex.: `>=21.0.0 <23.0.0`) para não travar migração de nenhuma ilha.
- **Angular Package Format** via `ng-packagr`, compilação parcial.
- **Versão pinada exata** nos consumidores (`"1.4.2"`, sem `^`) + Renovate/Dependabot abrindo o PR de bump. Isso torna o drift **visível e controlado** em vez de invisível e automático.
- **Dono declarado + CHANGELOG + SemVer disciplinado.** Sem isso, não publique.

### Decisão 2 — Dado: provavelmente o shell, não N fetches.

Se saldo é contexto do usuário, o shell busca **uma vez** e distribui por propriedade do custom element — mesmo mecanismo do token. Ganhos: uma chamada por sessão, um valor único (consistência resolvida), cache e refresh centralizados, e o pacote de UI continua limpo.

**Contra-argumento honesto: o risco do shell gordo.** Cada dado novo no shell é um item a mais que times de feature precisam pedir para outro time. O shell vira gargalo. A mitigação é enquadrar isso como **contrato de contexto do usuário** — se o shell já entrega token e dados do cliente, saldo é mais um campo num contrato que existe, não uma responsabilidade nova. Se esse conceito ainda não existe, criá-lo é uma decisão maior e merece discussão própria.

**Alternativa pragmática, se mexer no shell for caro agora:** manter o fetch por MFE e resolver a duplicação de rede no backend, com `Cache-Control: private, max-age=30` no endpoint de saldo. Como todos os MFEs rodam no mesmo browser, N chamadas viram 1 requisição real e N−1 cache hits. Resolve o custo de infra sem tocar em arquitetura nenhuma. **Não resolve a inconsistência de valor** entre componentes montados em momentos distintos — mas reduz muito a janela.

---

## 5. Quando não fazer nada disso

Resposta honesta que costuma faltar nessas discussões: **se não houver time dono e pipeline de publicação, não crie a lib.**

Uma lib interna sem dono passa por três fases previsíveis: (1) todo mundo adota, (2) alguém precisa de uma mudança e não sabe quem aprova, (3) o time faz fork local ou copia o código — e agora existe a lib *e* as cópias, que é estritamente pior do que só as cópias.

Isso é problema organizacional, não técnico, e nenhuma qualidade de código o resolve.

---

## 6. Teste de decisão (4 perguntas)

| Pergunta | Se sim | Se não |
|---|---|---|
| A apresentação **precisa** ser idêntica (marca/compliance)? | compartilhe a apresentação | duplique e siga |
| Existe time dono com CI de publicação e changelog? | pode publicar | **não publique** — duplique |
| Os MFEs coexistem na mesma tela? | inconsistência de valor é urgente → dado no shell | menos urgente, cache HTTP já ajuda |
| O componente tem mais de ~150 linhas de lógica de apresentação? | compartilhar compensa | duplicar é mais barato |

---

## 7. Resposta pronta para o chat

> A ideia é boa, mas eu separaria em três coisas antes de decidir, porque elas têm acoplamentos bem diferentes: **apresentação** (layout, formatação, estados de loading/erro), **contrato de dados** e **acesso à API** (endpoint, auth, retry, config de ambiente).
>
> **Compartilhar a apresentação: sim, vale.** Muda pouco, precisa ser consistente entre jornadas, e um pacote de UI pura é estável e barato de manter.
>
> **Compartilhar o acesso à API junto no mesmo pacote: eu evitaria.** Com `shared: {}`, a lib é bundlada dentro de cada remote — não tem hot-swap. Um bug crítico vira: publicar → N times bumparem → N builds → N deploys, e o fix só chega quando o MFE mais lento subir. Some a isso N versões da lib em produção ao mesmo tempo e a `peerDependency` do Angular travando quem quiser migrar antes dos outros. É basicamente reintroduzir o acoplamento de release que a arquitetura de ilha isolada eliminou.
>
> Então sua terceira opção é a certa: **componente visual no pacote, chamada de API em cada MFE**. E o "custo" de replicar a chamada some se o client for gerado do OpenAPI — o que replica é o comando de geração, não conhecimento.
>
> **Um ponto que talvez ainda não esteja no radar:** se todos os MFEs precisam do saldo, ele não é dado de feature — é **contexto do usuário**, mesma categoria do token. Com cada MFE fazendo o próprio fetch, acontecem duas coisas: N chamadas idênticas num endpoint que costuma ser caro, e — mais sério — **dois componentes de saldo podem mostrar valores diferentes** na mesma sessão, se houver movimentação entre as chamadas. Compartilhar o componente não resolve isso; só compartilhar o dado resolve.
>
> Se der, o shell busca uma vez e passa por propriedade do web component, igual ao token. Se mexer no shell for caro agora, uma mitigação barata é `Cache-Control: private, max-age=30` no endpoint — os MFEs rodam no mesmo browser, então N chamadas viram 1 real e o resto cache hit.
>
> Duas perguntas que ajudariam a fechar: **(1)** os MFEs coexistem na mesma tela ou o shell monta um por vez? **(2)** tem time dono para a lib, com pipeline de publicação e changelog? Se não tiver dono, eu honestamente duplicaria por enquanto — lib compartilhada sem dono vira código que ninguém pode mudar, e aí os times forkam e você fica com a lib *e* as cópias.
>
> Se seguirem com o pacote, três detalhes que evitam dor: não registrar o custom element dentro da lib (dois MFEs colidem no `customElements.define`), `peerDependencies` com range largo pra não travar migração de Angular, e versão pinada exata nos consumidores com Renovate abrindo o bump — drift visível é bem melhor que drift automático.
