# Defesa em profundidade

## Visão geral

Quando você corrige um bug causado por dado inválido, adicionar validação em um único ponto parece suficiente. Mas esse único ponto é contornado por outro caminho de código, por uma refatoração ou por um mock.

**Princípio central:** valide em TODA camada por onde o dado passa. Torne o bug estruturalmente impossível.

## Por que várias camadas

Validação única: "corrigimos o bug".
Várias camadas: "tornamos o bug impossível".

Cada camada pega um caso diferente:

- validação na entrada pega a maioria dos bugs
- regra de negócio pega os casos de borda
- guarda de ambiente evita perigos específicos de contexto
- log de diagnóstico ajuda quando as outras camadas falham

## As quatro camadas

### Camada 1 — Validação no ponto de entrada

**Objetivo:** rejeitar entrada obviamente inválida na fronteira pública.

```typescript
set apiBaseUrl(valor: string) {
  if (!valor || valor.trim() === '') {
    throw new Error('apiBaseUrl é obrigatório e não pode ser vazio');
  }
  if (!/^https?:\/\//.test(valor)) {
    throw new Error(`apiBaseUrl deve ser absoluto: ${valor}`);
  }
  this._apiBaseUrl = valor;
}
```

Em um BFF Java, a mesma camada é a validação declarativa no contrato: `@NotBlank`, `@Valid` no controller, restrição no schema OpenAPI. Se a regra cabe no spec, ela pertence ao spec — não ao service.

### Camada 2 — Validação de regra de negócio

**Objetivo:** garantir que o dado faz sentido para esta operação.

```typescript
function montarRequisicao(baseUrl: string, path: string) {
  if (!baseUrl) {
    throw new Error('baseUrl obrigatório para montar requisição');
  }
  // ... segue
}
```

### Camada 3 — Guardas de ambiente

**Objetivo:** impedir operação perigosa em contexto específico.

```typescript
// interceptor: em ambiente não-local, recusa request que resolveu para a origem do documento
if (ambiente !== 'local' && new URL(req.url, location.origin).origin === location.origin) {
  throw new Error(`Requisição de API resolvida para a origem do shell: ${req.url}`);
}
```

### Camada 4 — Instrumentação de diagnóstico

**Objetivo:** capturar contexto para a perícia.

```typescript
logger.debug('antes da primeira chamada de API', {
  baseUrl,
  origem: location.origin,
  stack: new Error().stack,
});
```

## Aplicando o padrão

Ao encontrar um bug:

1. **Rastreie o fluxo de dados** — onde o valor ruim se origina? onde é usado?
2. **Mapeie todos os checkpoints** — liste cada ponto por onde o dado passa
3. **Adicione validação em cada camada** — entrada, negócio, ambiente, diagnóstico
4. **Teste cada camada** — tente burlar a camada 1 e confirme que a 2 pega

## Exemplo

Bug: `baseUrl` vazio fazia a chamada de API cair na origem do shell.

**Fluxo de dados:**

1. shell monta o remote sem o atributo
2. `connectedCallback` lê o atributo ausente e cai para `''`
3. service monta URL relativa
4. request resolve contra a origem do documento

**Quatro camadas adicionadas:**

- Camada 1: setter rejeita vazio e não-absoluto
- Camada 2: service recusa montar URL com `baseUrl` falsy
- Camada 3: interceptor recusa origem do documento fora de ambiente local
- Camada 4: log com stack trace antes da primeira chamada

**Resultado:** suíte inteira verde e bug impossível de reproduzir.

## Insight principal

As quatro camadas foram todas necessárias. Durante o teste, cada uma pegou bug que as outras deixaram passar:

- caminhos de código diferentes contornaram a validação de entrada
- mocks contornaram a checagem de regra de negócio
- casos de borda em ambientes diferentes exigiram a guarda de ambiente
- o log de diagnóstico revelou uso estruturalmente errado

**Não pare em um único ponto de validação.** Adicione checagem em cada camada.

## Limite

Defesa em profundidade é o que se faz **depois** de achar a causa raiz — nunca no lugar dela. Camadas de validação empilhadas sobre uma causa raiz desconhecida só movem o sintoma para uma mensagem de erro mais bonita.
