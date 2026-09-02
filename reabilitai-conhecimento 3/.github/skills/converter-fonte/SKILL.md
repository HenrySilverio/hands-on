---
name: converter-fonte
description: Como converter PDF, docx, texto de conversa do Teams e páginas de norma em markdown
  para curadoria na base. Use ao processar arquivos de inbox/.
---

# Converter fonte para markdown

## Antes, verifique a ferramenta

Nunca assuma que um conversor está instalado. Cheque, e se não houver, diga — não invente o
conteúdo do arquivo.

```
which pdftotext pandoc  ||  echo "conversor ausente"
```

## Por tipo

| Tipo | Caminho | Cuidado |
| --- | --- | --- |
| PDF de texto | `pdftotext -layout arquivo.pdf -` | `-layout` preserva tabela; sem ele a tabela vira sopa |
| PDF escaneado | não converte | peça o texto ou a fonte oficial. **Não tente adivinhar** |
| docx | `pandoc -t markdown arquivo.docx` | numeração e nota de rodapé costumam se perder |
| Conversa do Teams | já vem colada em `.md` | preserve quem disse o quê e a data |
| Link de norma | leia a página | guarde a URL e a data de acesso; norma muda |

## Verificação obrigatória depois de converter

1. O texto convertido tem começo, meio e fim? Truncamento silencioso é comum em PDF grande.
2. Tabela virou texto ilegível? Se sim, transcreva a tabela à mão ou cite só a parte usada.
3. O número de páginas ou seções bate com o original?

Se qualquer resposta for negativa, **diga que a conversão foi parcial** e trate como fonte
incompleta. Fonte incompleta apresentada como completa é pior que fonte ausente.

## Ata de reunião

Nunca vire "regra". Ata vira **decisão** (`formato-decisao-negocio`) com `confianca: media`,
sempre nomeando quem decidiu e a data. Se a ata não diz quem decidiu, isso é uma lacuna.
