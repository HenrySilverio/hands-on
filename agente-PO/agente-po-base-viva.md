# Agente de PO + base de conhecimento viva — arquitetura proposta

Proposta para a iniciativa de IA da tribo: dar ao PO/PM/PMO um agente de discovery que conhece
regra de negócio e decisão técnica do produto, sem MCP de Confluence/Jira e sem o PO manter o
repositório clonado. Artifact de apresentação:
https://claude.ai/code/artifact/cb24c9c4-075c-4e1a-a8eb-4cf3796b3fcd

## Contexto e restrições dadas

- Fluxo alvo: `po-iniciar-discovery` → `po-refinar-negocio` → `po-gerar-user-story`.
- Hoje o pessoal de negócio usa a IA interna do banco (Bia Tech); a tribo quer trazer para o
  Copilot do GitHub.
- POs têm licença Copilot; quem não tem, solicita.
- Sem MCP de Confluence/Jira. Projeto instalado na máquina do PO foi descartado (exige
  maturidade de manter atualizado).
- Não é permitido commitar em `.github/` dos repos de produto do banco.

## Premissa desmontada

O gargalo não é escrever a user story — é a ambiguidade de negócio. Agente sem base produz
critério de aceite plausível e inventado, que é mais caro que story mal escrita. Daí a trava
anti-inferência (`[NÃO RESPONDIDO]`) ser o coração do desenho, não a formatação.

Segunda premissa: o Confluence não falhou por ser Confluence, falhou porque atualizá-lo é ato
voluntário desacoplado do merge. **Base viva é problema de gatilho, não de ferramenta.**

## Arquitetura — quatro camadas

| Camada | O quê | Dono | Artefato |
| --- | --- | --- | --- |
| 1. Produção | conhecimento nasce como subproduto do fluxo SDD do dev | squad | `specs/`, `.sdd/decisoes/`, `docs/negocio/` |
| 2. Publicação | Action no merge publica o recorte no repo de conhecimento | tooling | `publish-knowledge.yml` |
| 3. Distribuição | Copilot Space da org com o repo de conhecimento anexado (fontes do GitHub se auto-atualizam) | tribo, 2 admins | Space org-owned |
| 4. Consumo | 3 Spaces-agente, um por etapa | comunidade de PO | instruções em `agentes/*.md` |

**Decisão de baixo acoplamento:** o PO nunca recebe acesso ao repo de produto. Consome um
artefato publicado (curado, sem código, com allowlist explícita). O contrato entre camadas é o
formato do arquivo publicado — o produto reorganiza pastas sem quebrar o agente.

Recorte publicado por produto: `INDEX.md` + `glossario.md`, `regras-negocio.md`, `jornadas.md`,
`decisoes-tecnicas.md`, `contratos.md`, `CHANGELOG.md`.

## Mecanismo que mantém viva

1. Publicação automática no merge (job não-bloqueante).
2. Portão de coerência no PR: mudou `specs/**` sem mudar `docs/negocio/**` → bot comenta.
   **Não bloqueia** — portão bloqueante em documentação gera lorem no CI e exceção permanente.
3. Ritual humano de curadoria, 30 min por sprint, dono nomeado. CI não valida semântica.

## Três agentes — por que Spaces separados

A instrução do Space entra em toda requisição. Juntar as três etapas num Space triplica o custo
por pergunta e contamina o comportamento (discovery começando a escrever critério de aceite).
Estado do fluxo vive no artefato de handoff, não na ferramenta — front-matter com `etapa`,
`produto`, `origem`, `base_consultada: arquivo@SHA`, `lacunas`. O SHA é o que torna a story
auditável meses depois.

Roteamento de modelo: entrevista e confronto com a base no modelo mais capaz; formatação da
story no mais barato (nada é decidido nessa etapa).

## Alternativas descartadas

- **Repo de produto direto no Space** — exige dar leitura de código a negócio, ruído de
  recuperação, acopla o PO à estrutura de pastas do time.
- **Confluence como fonte** — sem MCP o agente não lê; atualização segue voluntária.
- **SharePoint/Teams** — fora do Git: perde gatilho de merge, versionamento e SHA de auditoria.
- **MCP de conhecimento próprio** — correto a médio prazo (desacopla superfície de base, serve
  Copilot/Claude/Bia com uma fonte só), caro demais para validar hipótese. Onda 3.
- **MCP oficial da Atlassian (GA)** — solicitar em paralelo; resolve escrita no Jira, não
  substitui a base viva.

Bia Tech não é substituída: ela cobre conhecimento corporativo, o Space cobre conhecimento vivo
de produto.

## Riscos assumidos

- **Bloqueante a verificar antes de tudo:** a política gerenciada da org pode bloquear Spaces /
  chat em github.com, como já bloqueia marketplace e `copilot-instructions.md`.
- Instrução do Space é editada na UI, sem code review → fonte canônica em `agentes/*.md`, UI é
  cópia; divergência é débito real.
- Sem escrita no Jira: último passo é copiar e colar.
- Recuperação degrada com o tamanho da base → `INDEX.md`, arquivos curtos, um Space por produto
  quando passar de dois.
- Space pessoal como SPOF → org-owned com dois admins desde o dia 1.
- Restrição de `.github/`: se for org-wide, inverter para *pull* agendado no repo de
  conhecimento.

## Ondas

- **Onda 0 (1 semana):** base semeada à mão, 1 produto, ~6 arquivos; Space org + 3 agentes;
  piloto fechado com 2 POs e 3 demandas reais. Critério: citou regra correta em 2 de 3.
- **Onda 1 (2–4 semanas):** migrar a base da Onda 0 para `docs/negocio/` **antes** de ligar o CI
  (senão a primeira publicação sobrescreve a curadoria); workflow + portão de PR; INDEX e
  CHANGELOG gerados; ritual de curadoria; segundo produto.
- **Onda 2+:** MCP da Atlassian; MCP de conhecimento próprio.

Métricas: retrabalho de refinamento, defasagem da base (dias entre merge e publicação),
marcadores `[NÃO RESPONDIDO]` sobreviventes. **Não medir número de stories geradas.**