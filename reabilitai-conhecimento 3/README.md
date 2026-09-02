# reabilitai-conhecimento

Base de conhecimento viva da tribo **ReabilitAI**. Alimenta os assistentes de discovery
usados por PO, PM e PMO, e serve como registro auditável de regra de negócio e decisão.

Comece por **[SETUP.md](SETUP.md)**.

## O que é cada pasta

| Pasta | Quem escreve | Natureza |
| --- | --- | --- |
| `tribo/` | tribo | regra geral de recuperação de crédito, glossário, normas externas |
| `squads/<produto>/publicado/` | **robô** | espelho do que está em PRODUÇÃO |
| `squads/<produto>/em-voo/` | **robô** | mergeado em `main`, ainda não publicado |
| `squads/<produto>/decisoes/` | PO | decisão de negócio, permanente |
| `squads/<produto>/discovery/` | agentes | demandas em curso (uma pasta por ticket) |
| `squads/<produto>/historico/` | agentes | stories entregues, imutáveis |
| `inbox/` | qualquer um | caixa de entrada da curadoria |
| `.github/agents/` | tooling | os quatro assistentes |
| `.github/skills/` | tooling | procedimentos reutilizáveis |
| `ferramentas/` | tooling | validador e gerador de índice, sem dependências |

Não existe pasta `templates/` de propósito: os formatos canônicos vivem dentro das skills
`formato-*`, que são o que o agente realmente carrega. Manter um template paralelo criaria duas
versões do mesmo formato para manter em sincronia.

## Cinco regras que sustentam tudo

1. **Ninguém edita a pasta do outro.** O robô escreve `publicado/` e `em-voo/`; o PO escreve
   `decisoes/`. Discordância do que está publicado vira decisão, não correção do espelho.
2. **Nenhum agente altera arquivo existente.** Todos declaram `createFile` e nunca `editFiles`.
   Regra que muda ganha arquivo novo com `supera:`. Isso torna o histórico verdadeiro por
   construção, não por disciplina.
3. **Nada entra sem `origem`.** Toda afirmação carrega de onde veio: arquivo, ticket, documento
   externo, ou `conhecimento-do-time (não verificado)`.
4. **Lacuna vira `[NÃO RESPONDIDO]`.** Nenhum agente completa o que não sabe.
5. **`publicado/` é PRODUÇÃO.** `main` não é produção. Ver `.github/workflows/`.

## Por que a trava anti-inferência está dentro de cada agente, e não numa skill

Skill é carregada quando o runtime julga relevante — é probabilístico. Regra load-bearing não
pode depender de julgamento de relevância. Por isso a trava está escrita, curta, dentro dos
quatro agentes, e as skills carregam apenas procedimento (formato, navegação, conversão).

## Nomes de ferramentas: confirme antes de usar em produção

O campo `tools` dos agentes usa os identificadores `read`, `search`, `shell` e `createFile`.
Rode o fluxo interativo `/agent` uma vez no Copilot app para listar os identificadores exatos
da sua versão e ajuste os quatro arquivos. Se um nome estiver errado, o agente pode silenciosamente
receber **todas** as ferramentas — que é justamente o que estas travas existem para impedir.
