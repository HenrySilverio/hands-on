---
name: formato-historico
description: Formato do registro imutável de user story entregue, com proveniência da base. Use ao
  arquivar uma story em historico/.
---

# Formato do registro histórico

Caminho: `squads/<produto>/historico/<AAAA-MM>/<TICKET>-<slug>.md`

````markdown
---
tipo: historico
ticket: RNG-1234
titulo: <título da story>
produto: cockpit-renegociacao
entregue_em: AAAA-MM-DD
po: <nome>
base_consultada:
  - squads/cockpit-renegociacao/publicado/regras-negocio.md@a3f21c9
  - tribo/politicas-credito.md@7e40b12
decisoes: [2026-08-prazo-maximo-parcelamento]
lacunas_no_encerramento: 1
qualidade: comum          # comum | referencia
revisa: null              # ticket da story que esta substitui
---

<texto final da story, exatamente como foi para o Jira>
````

## Regras

- **Imutável.** Nunca edite um arquivo desta pasta. Story revisada vira arquivo novo com `revisa:`
  apontando para o anterior.
- `base_consultada` com caminho **e SHA** é obrigatório. É o campo que responde, meses depois,
  "contra qual versão da regra isso foi escrito". Sem ele o registro é decorativo.
- `qualidade: referencia` só é marcado por gente, na revisão do PR. O agente sempre grava `comum`.
- Esta pasta **não é fonte de regra vigente** e não deve ser consultada para responder "como
  funciona hoje".
