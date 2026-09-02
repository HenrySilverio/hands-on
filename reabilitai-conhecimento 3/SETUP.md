# Setup

## 1. Antes de qualquer coisa (1 dia)

- [ ] Confirmar com quem administra o GitHub se a política da organização libera **Copilot Spaces**,
      chat em `github.com` e instalação do **Copilot app**.
- [ ] Confirmar se a proibição de commit em `.github/` vale para este repositório novo.
      Se valer, mova `.github/agents/` e `.github/skills/` para `.agents/agents/` e
      `.agents/skills/` — ambos são caminhos reconhecidos.

## 2. Criar o repositório

- [ ] Criar `reabilitai-conhecimento` na organização (nunca em conta pessoal).
- [ ] Dois administradores nomeados.
- [ ] Ajustar `CODEOWNERS` com os times reais.
- [ ] Proteger `main`: PR obrigatório, uma aprovação de code owner.

## 3. Semear a base (1 semana, 1 PO + 1 dev)

- [ ] Preencher `tribo/glossario.md` com os termos que o negócio usa.
- [ ] Preencher `squads/cockpit-renegociacao/publicado/regras-negocio.md` com as respostas das
      **últimas 20 perguntas reais** que o PO fez ao time. Não documente por cobertura.
- [ ] Rodar `node ferramentas/valida-frontmatter.mjs` e corrigir o que apontar.
- [ ] Rodar `node ferramentas/gera-index.mjs` para regenerar o `INDEX.md`.

## 4. Ligar os assistentes

**Copilot app (quem conduz o discovery):**
- [ ] Instalar o app pelo processo de liberação de software.
- [ ] Abrir uma sessão apontando para este repositório — os agentes de `.github/agents/`
      aparecem automaticamente.
- [ ] Rodar `/agent` uma vez e conferir os identificadores de ferramenta (ver README).

**Copilot Space (quem só consulta):**
- [ ] Criar Space da organização, anexar este repositório.
- [ ] Colar no campo de instruções o conteúdo de `.github/agents/po-consulta.instrucao.md`.
- [ ] Compartilhar como *viewer* com PMs, PMOs e negócio.

**Nunca** copie os agentes para `~/.copilot/agents/` para distribuir. Essa pasta sobrescreve a do
repositório e cria versão fantasma na máquina de cada pessoa.

## 5. Piloto (1 sprint)

- [ ] 2 POs, 3 demandas reais, fluxo completo.
- [ ] Critério: o agente citou regra correta em pelo menos 2 das 3.
- [ ] Registrar as perguntas que ele errou — essa lista é o conjunto de avaliação de qualquer
      evolução futura.

## 6. Só depois

- [ ] Automatizar a publicação a partir de PROD (`.github/workflows/exemplo-repo-produto.yml`).
- [ ] Ritual de curadoria de 30 min por sprint, com dono nomeado.
- [ ] Avaliar índice de busca próprio — apenas com a lista de falhas do piloto em mãos.
