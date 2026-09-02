# Evidências — onde cada regra é implementada

Um arquivo por repositório. Camada **gerada**, não curada.

Responde uma pergunta só: *"onde isso está implementado?"*. Nunca responde *"qual é a regra?"* —
essa resposta vem de `../publicado/`, que é a camada consolidada por domínio.

## Por que existe

O produto cockpit é entregue por vários repositórios: os fronts e os BFFs. Se a base espelhasse
essa divisão, o PO precisaria saber qual repositório implementa uma regra para encontrá-la — que é
exatamente o acoplamento que a base existe para remover. E a mesma regra costuma ser validada em
duas camadas, o que produziria duas versões dela sem árbitro.

Então: **uma regra, um lugar, em `publicado/`. A evidência é que se multiplica, aqui.**

## O que o agente faz com esta pasta

- **Não cita** arquivo daqui como regra vigente.
- Consulta quando o PO pergunta explicitamente onde algo é implementado.
- Usa na curadoria da sprint, para conferir se `publicado/` continua batendo com o código.

## Divergência entre camadas

Quando o front e o BFF validam a mesma coisa de formas diferentes, isso **não é duplicidade** — é
divergência, e é o achado mais valioso que esta pasta produz. Não conserte no arquivo: registre em
`../decisoes/` e leve para quem decide.
