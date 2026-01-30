---
title: Demonstração de Componentes de Conteúdo
excerpt: Um guia completo demonstrando todos os componentes de conteúdo disponíveis no sistema de blog: tipografia, listas, imagens, código e mais.
date: '2025-01-20'
readTime: 3 min read
tags:
  - Demo
  - Design System
  - Componentes
coverImageBasename: blog-cover-placeholder-01
authorId: daniel
---

Este é um parágrafo introdutório para demonstrar a renderização de texto padrão. O sistema suporta **negrito**, *itálico* e links inline através de HTML seguro.

## Estrutura e Listas

Abaixo, apresentamos os diferentes tipos de listas suportados pelo sistema:

- Item de lista não ordenada 1
- Item de lista não ordenada 2 com *texto formatado*
- Item de lista não ordenada 3

1. Primeiro passo importante
2. Segundo passo do processo
3. Terceiro e último passo

---

## Citações e Destaques

> O design não é apenas o que parece e o que se sente. O design é como funciona.
>
> — **Steve Jobs**, Co-fundador da Apple

### Subtítulo de Nível 3

Parágrafos podem ser usados para separar seções e fornecer contexto adicional entre os elementos visuais.

---

## Imagens e Código

![Imagem local renderizada via tag picture com suporte a AVIF/WebP](/images/blog-covers/blog-cover-placeholder-02.webp)
*Imagem local renderizada via tag `<picture>` com suporte a AVIF/WebP*

![Imagem carregada de uma URL externa (Unsplash)](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop)
*Imagem carregada de uma URL externa (Unsplash)*

Para desenvolvedores, é essencial poder compartilhar trechos de código com syntax highlighting adequado:

```typescript
interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
}

function getUser(id: number): User {
  return {
    id,
    name: 'John Doe',
    role: 'user'
  };
}
```

E aqui encerramos nossa demonstração de componentes. O sistema é flexível e permite combinar estes blocos de diversas formas.
