# Briefing - Telas do MVP não dão retorno de erro nem de sucesso ao usuário

## Problema

Nas telas do MVP da jornada, quando um serviço integrado falha, a tela simplesmente fica
vazia. O usuário não recebe nenhuma indicação de que algo deu errado, e não tem como saber se
deve esperar, tentar de novo ou sair.

O mesmo vale para ações bem-sucedidas executadas na própria tela, como copiar o código de um
boleto ou concluir uma alteração de dados: a ação acontece e nada confirma que aconteceu.

Hoje são 9 telas nessa situação, e o número cresce conforme a jornada evolui.

## O que se espera

O usuário vê uma mensagem sempre que um serviço falha e sempre que uma ação relevante da tela
é concluída com sucesso. O texto da mensagem varia conforme a tela e a ação — "Dados
alterados" numa, confirmação de cópia noutra.

Quando mais de um erro acontece ao mesmo tempo, as mensagens aparecem empilhadas na tela, e
nenhuma delas se perde.

**[NÃO RESPONDIDO]** A mensagem some sozinha depois de alguns segundos, ou fica até o usuário
fechar?

**[NÃO RESPONDIDO]** Ao navegar para outra tela, as mensagens visíveis somem ou permanecem?

## Restrições

- Não alterar o `app.component`. A montagem no shell fica como está.
- Não alterar o contrato público do `messageService`.
- O componente precisa sair idêntico ao Liquid, sem CSS próprio sobrescrevendo o design system.

## Fora do escopo

- Erro de validação de formulário, que continua sendo exibido inline no próprio campo.
- Telas fora do MVP atual, que entram conforme a jornada evoluir.
- Qualquer mudança no visual ou na API do componente `app-messages`.

## Contexto útil

- O componente já existe no shared e já está montado no shell:
  `@if (messageService.isExistMessage()) { <app-messages class="reneg-page" /> }` em
  `app.component.html` / `app.component.ts`.
- O que falta é o outro lado: nenhuma tela empurra mensagem para o `messageService` ainda.
- O componente recebe a mensagem de quem o consome, e não do shared, para dar flexibilidade
  aos cenários. Essa é a escolha atual de quem construiu, não uma decisão fechada desta
  mudança.
- Estamos em MVP: as telas ainda estão sendo construídas.

## Prazo e ticket

<preencher se houver, ou apagar a seção>