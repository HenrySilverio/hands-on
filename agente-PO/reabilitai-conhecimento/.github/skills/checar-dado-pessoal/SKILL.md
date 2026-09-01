---
name: checar-dado-pessoal
description: Verificação de dado pessoal antes de gravar qualquer arquivo na base de conhecimento.
  Use imediatamente antes de criar arquivo em historico/, externas/ ou decisoes/.
---

# Checar dado pessoal antes de gravar

A base fica num repositório acessível a toda a tribo e alimenta assistentes. Dado de cliente não
entra, mesmo em exemplo.

## Procure e substitua

| Encontrou | Substitua por |
| --- | --- |
| Nome de cliente | `<NOME DO CLIENTE>` |
| CPF, CNPJ | `<CPF>`, `<CNPJ>` |
| Número de conta, agência, cartão, contrato | `<CONTA>`, `<CONTRATO>` |
| Telefone, e-mail de cliente | `<TELEFONE>`, `<EMAIL>` |
| Endereço | `<ENDEREÇO>` |
| Valor real de dívida de um caso concreto | valor genérico, marcado como exemplo |
| Matrícula de funcionário | nome da área |

Nome de PO, dev ou gestor **pode** ficar: é registro de autoria, não dado de cliente.

## Depois de substituir

Diga ao usuário, em uma linha, o que foi substituído. Ele precisa saber que o arquivo gravado não
é idêntico ao que ele colou.

## Quando parar

Se o documento é majoritariamente composto de dado de cliente (extrato, relatório de carteira,
planilha de casos), ele **não vira arquivo da base**. Diga isso e proponha extrair só a regra, sem
os casos.
