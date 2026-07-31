# 08 — Hooks

---

> ⚠️ **AVISO DE GOVERNANÇA**
> Arquivos de hook **não podem ser commitados no repositório**. O push desses arquivos é bloqueado automaticamente pelo pipeline do banco. Os hooks ficam em `.github/hooks/` na máquina local de cada desenvolvedor — fora do git. Modelos de hooks são mantidos neste Confluence.
> **Justificativa:** Estes arquivos de configuração modificam o comportamento do GitHub Copilot no nível da IDE e são específicos do ambiente.
> **Implementação:** Copie os arquivos para a estrutura de diretório **.github/** do seu projeto e adicione as exclusões apropriadas no **.gitignore**.

---

## 📋 O que você vai encontrar neste documento

- O que são hooks e por que são diferentes de instructions e prompts
- Os 8 eventos do ciclo de vida do agente
- Como configurar um hook (formato JSON)
- Hooks práticos prontos para o recr-fed-agc-posvenda
- Como verificar se um hook está executando
- Casos de uso reais: qualidade, auditoria e segurança
- Limitações e cuidados

---

## 🪝 1. O que são Hooks

Hooks são **scripts shell executados automaticamente em eventos específicos do ciclo de vida do agente**. Enquanto instructions dizem ao modelo como se comportar (soft constraint), hooks são código que executa com resultado garantido — independente do que o modelo decidiu fazer.

A diferença é fundamental: instructions influenciam. Hooks executam.

**Analogia:** instructions são como um guia de estilo — o dev lê e tenta seguir. Hooks são como um pipeline de CI — bloqueia o merge se o lint falhar, independentemente da intenção do dev.

No contexto do Copilot:

- Instructions: "sempre formate o código antes de salvar" → o modelo tenta, mas pode esquecer
- Hook PostToolUse + Prettier: executa o Prettier em cada arquivo editado, garantido

---

## 🔄 2. Os 8 eventos do ciclo de vida

| **Evento**         | **Quando dispara**                        | **Usos mais comuns**                              |
| ------------------ | ----------------------------------------- | ------------------------------------------------- |
| `SessionStart`     | Usuário envia o primeiro prompt da sessão | Validar estado do projeto, logar início de sessão |
| `UserPromptSubmit` | Usuário envia qualquer prompt             | Auditar requests, injetar contexto adicional      |
| `PreToolUse`       | Antes do agente invocar uma ferramenta    | Bloquear operações proibidas, exigir aprovação    |
| `PostToolUse`      | Após ferramenta completar com sucesso     | Rodar formatters, testes, linters                 |
| `PreCompact`       | Antes do contexto ser compactado          | Exportar contexto importante antes do truncamento |
| `SubagentStart`    | Subagente é criado                        | Rastrear uso de subagentes                        |
| `SubagentStop`     | Subagente termina                         | Agregar resultados, limpar recursos               |
| `Stop`             | Sessão do agente termina                  | Gerar relatórios, notificações, limpeza           |

Para o dia a dia do desenvolvimento, os eventos mais úteis são **`PostToolUse`** (qualidade após edição) e **`PreToolUse`** (segurança antes de executar).

---

## 📄 3. Formato do arquivo de hook

Hooks são arquivos `.json` em `.github/hooks/`. O VS Code carrega automaticamente todos os `*.json` dessa pasta.

```json
{
  "hooks": {
    "NomeDoEvento": [
      {
        "type": "command",
        "command": "comando-a-executar",
        "timeout": 30
      }
    ]
  }
}
```

### Propriedades do comando

| **Propriedade** | **Obrigatório** | **Descrição**                       |
| --------------- | --------------- | ----------------------------------- |
| `type`          | ✅ Sim          | Sempre `"command"`                  |
| `command`       | ✅ Sim          | Comando a executar (cross-platform) |
| `windows`       | Não             | Override do comando para Windows    |
| `linux`         | Não             | Override do comando para Linux      |
| `osx`           | Não             | Override do comando para macOS      |
| `timeout`       | Não             | Timeout em segundos (padrão: 60)    |

### Variáveis de ambiente disponíveis nos hooks

| **Variável**            | **Disponível em**       | **Descrição**                       |
| ----------------------- | ----------------------- | ----------------------------------- |
| `$TOOL_INPUT_FILE_PATH` | PostToolUse, PreToolUse | Caminho do arquivo editado          |
| `$TOOL_NAME`            | PostToolUse, PreToolUse | Nome da ferramenta invocada         |
| `$TOOL_INPUT`           | PreToolUse              | Input completo da ferramenta (JSON) |
| `$TOOL_OUTPUT`          | PostToolUse             | Output da ferramenta (JSON)         |
| `$SESSION_ID`           | Todos                   | ID único da sessão atual            |

---

## 🧰 4. Hooks práticos para o recr-fed-agc-posvenda

### Hook 1 — Quality Gate (lint + test após edição)

Localização: `.github/hooks/quality-gate.json`

Este hook roda o ESLint e os testes Jest relacionados ao arquivo editado sempre que o agente modifica um arquivo TypeScript ou HTML.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "node -e \"const f = process.env.TOOL_INPUT_FILE_PATH; if (f && (f.endsWith('.ts') || f.endsWith('.html'))) { require('child_process').execSync('npx eslint ' + f + ' --fix', { stdio: 'inherit' }); }\"",
        "timeout": 30
      }
    ]
  }
}
```

**Versão mais legível (salve como script separado):**

Crie `.github/hooks/scripts/quality-check.sh`:

```bash
#!/bin/bash
FILE="$TOOL_INPUT_FILE_PATH"

# Só executa para arquivos TypeScript e HTML
if [[ "$FILE" == *.ts ]] || [[ "$FILE" == *.html ]]; then
  echo "🔍 Executando lint em: $FILE"
  npx eslint "$FILE" --fix

  # Se for arquivo de implementação (não spec), roda o teste relacionado
  if [[ "$FILE" != *.spec.ts ]]; then
    SPEC_FILE="${FILE%.ts}.spec.ts"
    if [ -f "$SPEC_FILE" ]; then
      echo "🧪 Executando testes: $SPEC_FILE"
      npx jest "$SPEC_FILE" --passWithNoTests
    fi
  fi
fi
```

E o arquivo de hook:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "bash .github/hooks/scripts/quality-check.sh",
        "timeout": 60
      }
    ]
  }
}
```

---

### Hook 2 — Security Guard (bloquear operações perigosas)

Localização: `.github/hooks/security-guard.json`

Este hook bloqueia operações que podem causar dano irreversível antes que o agente as execute.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "node -e \"const input = JSON.parse(process.env.TOOL_INPUT || '{}'); const cmd = input.command || ''; const dangerous = ['rm -rf', 'DROP TABLE', 'DELETE FROM', 'truncate', 'format c:']; const found = dangerous.find(d => cmd.toLowerCase().includes(d.toLowerCase())); if (found) { console.error('BLOQUEADO: comando perigoso detectado: ' + found); process.exit(1); }\"",
        "timeout": 5
      }
    ]
  }
}
```

**Versão com script separado:**

`.github/hooks/scripts/security-check.sh`:

```bash
#!/bin/bash
TOOL_INPUT_JSON="$TOOL_INPUT"
COMMAND=$(echo "$TOOL_INPUT_JSON" | node -e "
  const data = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
  console.log(data.command || '');
")

DANGEROUS_PATTERNS=(
  "rm -rf"
  "DROP TABLE"
  "DELETE FROM"
  "TRUNCATE"
  "format c:"
  "git push --force"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "❌ BLOQUEADO pelo Security Guard: padrão perigoso detectado: '$pattern'"
    echo "   Comando: $COMMAND"
    exit 1
  fi
done

echo "✅ Security Guard: comando aprovado"
exit 0
```

---

### Hook 3 — Audit Logger (rastrear edições do agente)

Localização: `.github/hooks/audit-logger.json`

Registra cada arquivo editado pelo agente em um log local. Útil para revisar o que o agente fez ao final de uma sessão.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "node -e \"const f = process.env.TOOL_INPUT_FILE_PATH; const t = process.env.TOOL_NAME; if (f) { const fs = require('fs'); const log = '[' + new Date().toISOString() + '] ' + t + ': ' + f + '\\n'; fs.appendFileSync('.copilot-session.log', log); }\"",
        "timeout": 5
      }
    ],
    "SessionStart": [
      {
        "type": "command",
        "command": "node -e \"const fs = require('fs'); fs.appendFileSync('.copilot-session.log', '\\n=== SESSÃO INICIADA: ' + new Date().toISOString() + ' ===\\n');\"",
        "timeout": 5
      }
    ]
  }
}
```

> O arquivo `.copilot-session.log` gerado deve estar no `.gitignore` do projeto.

---

### Hook 4 — Test Runner (rodar testes ao final da sessão)

Localização: `.github/hooks/session-test-runner.json`

Executa a suíte completa de testes ao final de cada sessão do agente.

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "echo '🧪 Executando suíte de testes ao final da sessão...' && npx jest --passWithNoTests --silent && echo '✅ Todos os testes passaram' || echo '⚠️ Alguns testes falharam — revisar antes de commitar'",
        "timeout": 120
      }
    ]
  }
}
```

---

## ✅ 5. Como verificar se um hook está executando

O VS Code tem um output channel específico para hooks:

1. Abra o menu **View > Output** (ou `Ctrl+Shift+U`)
2. No dropdown à direita, selecione **GitHub Copilot Chat Hooks**
3. Cada execução de hook aparece aqui com status (sucesso/falha) e output

Se o hook não aparecer no output channel:

- Confirme que o arquivo está em `.github/hooks/` com extensão `.json`
- Valide o JSON (use um validador online — um erro de vírgula quebra tudo silenciosamente)
- Confirme que `chat.hookFilesLocations` inclui `.github/hooks` (é o padrão, mas verifique)
- Verifique se a sua organização não bloqueou o uso de hooks via policy

---

## ⚙️ 6. Configuração do VS Code para hooks

O caminho padrão já é carregado automaticamente. Para confirmar ou adicionar caminhos:

```json
{
  "chat.hookFilesLocations": {
    ".github/hooks": true
  }
}
```

Para desativar um caminho específico:

```json
{
  "chat.hookFilesLocations": {
    ".github/hooks": true,
    ".claude/settings.json": false
  }
}
```

---

## ⚠️ 7. Cuidados e limitações

> ⚠️ **Hooks rodam com as permissões do seu usuário.** Um hook mal escrito pode deletar arquivos ou travar o terminal. Sempre teste scripts em um diretório isolado antes de ativar como hook.
>
> ⚠️ **Timeout conservador.** Para scripts que rodam testes, use `"timeout": 60` ou mais. O padrão de 60 segundos pode ser insuficiente para suítes grandes.
>
> ⚠️ **Hooks lentos bloqueiam o fluxo.** Se um hook PostToolUse demora 30s para rodar os testes, o agente fica esperando antes de continuar. Prefira rodar apenas os testes do arquivo editado, não a suíte completa.
>
> ⚠️ **Hooks com saída de erro (exit code ≠ 0) em PreToolUse bloqueiam a operação.** Use isso intencionalmente para o Security Guard, mas evite em hooks de lint que podem falhar por regras cosméticas.
>
> ⚠️ **Hooks são locais.** Cada dev precisa configurar os hooks na própria máquina. Por isso, mantenha os scripts e os JSONs documentados neste Confluence.

---

## 🔗 Referências

- [Agent Hooks in VS Code — VS Code Docs](https://code.visualstudio.com/docs/agent-customization/hooks)
- [Hooks Reference — VS Code Docs](https://code.visualstudio.com/docs/agents/reference/hooks-reference)

---

_Documento: 08 — Hooks | Junho 2026_
_Anterior: [07 — Custom Instructions](./07-custom-instructions.md) | Próximo: [09 — Prompt Files](./09-prompt-files.md)_
