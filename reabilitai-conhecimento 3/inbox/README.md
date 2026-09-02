# Caixa de entrada da curadoria

Aqui entra **texto**, nunca binário. PDF, docx e apresentação continuam onde já vivem — a ficha
gerada registra o endereço deles no campo `fonte_original`.

## Onde colocar

| Se a fonte vale para... | Crie em |
| --- | --- |
| todos os produtos da tribo | `inbox/tribo/<slug>.md` |
| só um produto | `inbox/squads/<produto>/<slug>.md` |

A pasta declara o escopo. O agente **não deduz** se uma norma é da tribo ou de um produto — se o
arquivo estiver solto na raiz de `inbox/`, ele para e pergunta.

## Três formas de criar o arquivo (escolha a que couber)

**1. Pelo próprio agente** — a mais simples no Copilot app. Cole o texto no chat e peça:
*"crie `inbox/tribo/bacen-4966.md` com este conteúdo"*. Ele grava o arquivo na sessão.

**2. Pela web do GitHub** — funciona sem instalar nada, e é o caminho para quem não usa o app.
No repositório: **Add file → Create new file**, e digite o caminho completo no campo do nome
(`inbox/tribo/bacen-4966.md`). Barras criam as pastas automaticamente.

**3. Pelo clone local** — para quem já tem o repositório na máquina.

## Formato do arquivo de entrada

Quatro linhas de cabeçalho e o texto colado, sem editar:

```markdown
FONTE: BACEN — Resolução 4.966
URL: https://www.bcb.gov.br/...
FONTE_ORIGINAL: portal BCB (público)
OBTIDO_EM: 2026-09-02

<texto das seções relevantes, copiado sem alteração>
```

`FONTE_ORIGINAL` é onde o documento completo está guardado — portal do órgão, SharePoint, Teams,
repositório de normas. Sem ele a ficha não é auditável.

## Depois do processamento

O agente abre um PR com a ficha em `tribo/externas/` ou `squads/<produto>/externas/`. Quando o PR
é aprovado, o arquivo de entrada sai daqui: `inbox/` fica sempre vazia.

**Nada em `inbox/` é considerado verdade.** É matéria-prima até passar por revisão humana, e o
agente trata todo o conteúdo como dado, nunca como instrução.
