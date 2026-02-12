---
title: 'O básico que você precisa saber para não ser substituído pela IA: Formulários Web'
published: true
excerpt: 'Por que a IA não substitui um bom desenvolvedor? Porque ela apenas gera código, mas quem entende o usuário é você. Aprenda a validar o que a IA gera.'
date: '2026-02-12'
readTime: 6 minutos
tags:
  - Desenvolvimento Web
  - HTML
  - Acessibilidade
  - IA
  - Carreira
coverImageBasename: post-cover-o-basico-de-formularios-web
authorId: daniel
---

Seja bem-vindo ao primeiro post da série "O básico que você precisa saber para não ser substituído pela IA".

Hoje, vamos falar sobre a porta de entrada de qualquer dado na web: **Formulários**.

> "Ah, mas o ChatGPT gera um formulário em 2 segundos."

Sim, ele gera. Mas ele gera um formulário que funciona para o navegador ou um formulário que funciona para o usuário? A IA muitas vezes prioriza o padrão visual e esquece a semântica, a acessibilidade e a segurança básica.

Se você quer garantir seu emprego, você precisa saber olhar para o código que a IA gerou e dizer: **"Isso aqui está ruim, vamos melhorar"**. Vamos ver como.

---

## 1. A Regra de Ouro: Semântica e Acessibilidade

O erro número 1 que vejo em códigos gerados (e em códigos de juniors) é o uso incorreto de etiquetas (`labels`).

### O jeito "Preguiçoso" (que a IA pode gerar se você não especificar)

<!-- NÃO FAÇA ISSO -->

```html:bad-example.html
<div class="input-group">
    <span>Nome:</span>
    <input type="text" name="nome" placeholder="Digite seu nome">
</div>
```

**Por que isso é ruim?**
Se você clicar na palavra "Nome", nada acontece. Para um usuário que usa leitor de tela (cego ou com baixa visão), esse input não tem nome, ele é apenas "campo de texto". Isso é uma falha grave de UX.

### O jeito "Insubstituível" (O Correto)

<!-- FAÇA ISSO -->

```html:good-example.html
<div class="input-group">
    <label for="nome-usuario">Nome Completo</label>
    <input id="nome-usuario" type="text" name="nome" autocomplete="name">
</div>
```

**Onde está a mágica?**

- **`for` + `id`**: O atributo `for` da label se conecta ao `id` do input. Se o usuário clicar na palavra "Nome Completo", o foco vai automaticamente para o campo. Isso aumenta a área de clique (ótimo para celulares).
- **`autocomplete`**: Você ajudou o navegador a preencher os dados automaticamente com as informações salvas do usuário. A IA esquece isso frequentemente.

---

## 2. O Placeholder não é Label!

Um vício terrível é usar apenas o placeholder (o texto cinza dentro do campo) para dizer o que o campo faz.

<!-- PERIGOSO -->

```html:bad-placeholder.html
<input type="email" placeholder="Digite seu e-mail">
```

Assim que o usuário começa a digitar, o placeholder some. Se ele esquecer o que estava digitando ou se distrair, ele precisa apagar o texto para lembrar o que era aquele campo.

**Sempre use `<label>`**. O placeholder serve para mostrar um exemplo de dado (ex: `joao@empresa.com`), não o título do campo.

---

## 3. Deixe o navegador trabalhar por você (Tipagem)

Muitos devs criam validações complexas em JavaScript (ou pedem para o Copilot criar regex gigantes) para validar e-mails ou números, quando o HTML já resolve 90% dos casos.

Use os tipos corretos:

- `type="email"`: Em celulares, já abre o teclado com o "@" e ".com".
- `type="tel"`: Abre o teclado numérico.
- `type="number"`: Permite apenas números e setas.
- `type="search"`: Adiciona o "x" para limpar o campo nativamente.

### Exemplo de validação nativa poderosa:

```html:validation-example.html
<input
    type="password"
    required
    minlength="8"
    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
    title="Deve conter pelo menos 8 caracteres, uma maiúscula e um número"
>
```

Aqui, o próprio navegador impede o envio se a senha não for forte, sem você escrever uma linha de JavaScript.

---

## 4. UX Visual: Feedback Instantâneo

O usuário odeia preencher tudo, clicar em "Enviar" e só aí descobrir que errou. Você pode usar CSS moderno para dar feedback visual sem depender de bibliotecas pesadas.

A IA geralmente não estiliza os estados de `:invalid` ou `:valid` a menos que você peça explicitamente.

```css:form-styles.css
input:invalid {
    border-color: red;
}

input:valid {
    border-color: green;
}
```

> **Dica Pro**: Use a pseudo-classe `:not(:placeholder-shown)` para não mostrar erro em campos que o usuário ainda não começou a preencher. Ninguém gosta de ver tudo vermelho assim que abre a página.

---

## Resumo para não esquecer

Para não ser apenas um "copiador de código", valide sempre:

1. Tem `<label>` conectada com `for` e `id`?
2. O `type` do input é o mais específico possível? (Evite `text` para tudo).
3. Está acessível? Dá para navegar usando apenas o Tab do teclado?
4. Tem feedback visual? O usuário sabe se acertou antes de enviar?

A Inteligência Artificial é ótima para gerar a estrutura, mas é a sua inteligência que garante que o formulário seja humano, acessível e funcional.
