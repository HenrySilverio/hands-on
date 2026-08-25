---
mode: agent
description: Depuração sistemática — investiga a causa raiz antes de qualquer correção.
tools: ['search', 'usages', 'problems', 'testFailure', 'changes', 'runCommands', 'fetch']
---

# /depurar

<!-- AJUSTE ANTES DE USAR: a lista `tools` acima é deliberadamente read-only.
     Nenhuma ferramenta de edição está incluída — é isso que torna a Lei de Ferro
     estrutural em vez de apenas recomendada. Se o seu VS Code expõe nomes de
     ferramenta diferentes, corrija a lista, mas NÃO adicione `edit`. -->

Carregue e siga integralmente `.github/skills/depuracao-sistematica/SKILL.md`.

**Problema relatado:** ${input:problema:mensagem de erro literal + como reproduzir + o que mudou recentemente}

**Contexto selecionado:** ${selection}

## Regras desta sessão — acima de qualquer inclinação sua

1. Você **não pode** propor, escrever, esboçar ou sugerir correção antes de concluir a Fase 1 e a Fase 2 da skill. Isto vale inclusive se a causa parecer óbvia na primeira leitura.
2. Você não tem ferramenta de edição. Se sentir vontade de "já deixar o patch pronto", isso é um dos sinais de alerta da skill — volte à Fase 1.
3. Se a informação for insuficiente para reproduzir, **pergunte** em vez de assumir. Assumir sem verificar é o erro que esta skill existe para impedir.
4. Uma hipótese por vez. Nunca liste "as possíveis causas" como se todas fossem investigáveis em paralelo.

## Formato obrigatório da primeira resposta

```markdown
## Fase 1 — Investigação

**Erro literal:** <mensagem e stack trace, copiados, não parafraseados>
**Reprodução:** <passos exatos | NÃO REPRODUZIDO — o que falta>
**Mudanças recentes:** <commits/deps/config suspeitos, ou "nada relevante em <janela>">
**Evidência por camada:** <o que entra e o que sai em cada fronteira; onde quebra>
**Fluxo de dados:** <origem do valor ruim → caminho até o ponto do erro>

## Fase 2 — Padrão

**Exemplo que funciona:** <arquivo:linha>
**Diferenças:** <lista, sem filtrar por "isso não deve importar">

## Fase 3 — Hipótese

**Hipótese única:** acho que <X> é a causa raiz porque <Y>.
**Teste mínimo:** <a menor mudança possível que confirma ou refuta>

## Bastão

Causa raiz confirmada. A Fase 4 (teste que falha → uma correção → verificação)
deve ser executada em modo de edição.
```

Se qualquer campo da Fase 1 não puder ser preenchido com evidência, escreva `**[SEM EVIDÊNCIA]**` nele e pare ali. Não avance para a Fase 2 com campo inferido — briefing inferido parece completo e a lacuna reaparece no código.
