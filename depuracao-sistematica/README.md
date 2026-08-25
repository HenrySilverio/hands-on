# depuracao-sistematica — pacote para os três repos

Port em português de `obra/superpowers → skills/systematic-debugging`, no formato de harness do Copilot em VS Code. Neutro de stack: o mesmo conteúdo vai igual para `mfe-remote`, `shell` e `bff-java`.

```
.github/
  skills/depuracao-sistematica/
    SKILL.md                          # corpo — carrega por intenção
    references/
      rastreio-causa-raiz.md          # carrega só se o corpo linkar
      defesa-em-profundidade.md
      espera-por-condicao.md
  prompts/
    depurar.prompt.md                 # /depurar — gatilho determinístico, read-only
```

## Instalação

```bash
# em cada repositório
cp -r depuracao-sistematica/.github/. .github/
```

## Roteamento (adicionar à tabela de `copilot-instructions.md`)

Uma linha, na camada sempre-carregada. Sem ela a skill depende só do match da `description`:

```markdown
| bug, teste falhando, build quebrado, comportamento inesperado | `/depurar` (skill `depuracao-sistematica`) — investigar antes de corrigir |
```

## Ajustes antes de usar

- `prompts/depurar.prompt.md` → a lista `tools` usa nomes da superfície atual do VS Code. Confira contra a sua versão. **Não adicione `edit`**: a ausência de ferramenta de edição é o que torna a Lei de Ferro estrutural, e não apenas uma recomendação que compete por atenção no contexto.
- `SKILL.md` cita `federation-triage` e `testing.instructions.md` de forma condicional ("se o repositório tiver"). No `bff-java` isso não existe; a redação condicional já cobre, mas se quiser precisão troque pelo equivalente local (`contract-evolution`).

## O que mudou em relação ao original

| Original | Aqui | Motivo |
|---|---|---|
| Exemplo `codesign`/keychain de macOS na Fase 1.4 | fronteiras shell → remote → BFF → downstream | o exemplo precisa ser reconhecível no código do time |
| `superpowers:test-driven-development` na Fase 4.1 | referência condicional a instruction/skill de testes do repo | a skill citada não existe neste harness |
| `superpowers:verification-before-completion` na Fase 4.3 | checklist explícito de três perguntas + evidência colada | idem |
| Grafos `digraph`/Graphviz | `mermaid` | mesma lógica, renderiza no VS Code |
| `find-polluter.sh` como arquivo externo | script inline de 8 linhas na reference | evita arquivo órfão sem perder a técnica |
| Sem gatilho determinístico | `/depurar` read-only | no Copilot a `description` aciona por probabilidade; a Lei de Ferro não sobrevive a isso |

Preservados sem alteração de lógica: Lei de Ferro, as 4 fases e todos os seus passos numerados, a regra dos 3 fixes → questionar arquitetura, os 11 sinais de alerta, os 5 sinais da pessoa, as 8 racionalizações, a tabela de referência rápida e a cláusula dos 95% em "não há causa raiz".
