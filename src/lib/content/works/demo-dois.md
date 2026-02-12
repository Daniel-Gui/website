---
title: Demo Components
published: true
description: Este projeto demonstra todos os componentes de conteúdo disponíveis para works e blog posts, incluindo código, imagens, listas e citações.
tags:
  - SvelteKit
  - TypeScript
  - Tailwindcss
year: '2025'
category: 'projeto'
link: '#'
imageBasename: work-cover-placeholder
galleryImages:
  - work-cover-placeholder
  - work-cover-placeholder
  - work-cover-placeholder
  - work-cover-placeholder
  - work-cover-placeholder
  - work-cover-placeholder
  - work-cover-placeholder
  - work-cover-placeholder
---

## [01] O Desafio

Precisávamos criar um sistema de conteúdo flexível que pudesse ser reutilizado tanto em posts de blog quanto em páginas de trabalhos.

O principal problema era:

- Manter consistência visual entre diferentes tipos de conteúdo
- Permitir syntax highlighting para blocos de código
- Suportar imagens com legendas e diferentes fontes

> A flexibilidade não deve vir às custas da consistência.
> — Design Systems Team

---

## [02] A Solução

Desenvolvemos componentes modulares que podem ser usados de duas formas:

1. **Via Markdown**: Em arquivos `.md` processados pelo mdsvex
2. **Via JSON**: Em estruturas de dados para conteúdo dinâmico

### Exemplo de Código TypeScript

```typescript:types.ts
interface ContentBlock {
  type: 'paragraph' | 'heading' | 'code' | 'image' | 'quote' | 'list';
  data: Record<string, unknown>;
}

function renderContent(blocks: ContentBlock[]): void {
  for (const block of blocks) {
    console.log(`Rendering ${block.type}...`);
  }
}
```

### Exemplo de Código Svelte

```svelte:Component.svelte
<script lang="ts">
  let count = $state(0);

  function increment() {
    count++;
  }
</script>

<button onclick={increment}>
  Cliques: {count}
</button>
```

---

## [03] O Resultado

O sistema final oferece:

- **Performance**: Syntax highlighting em build time
- **Flexibilidade**: Componentes reutilizáveis
- **Acessibilidade**: Semântica HTML correta
- **Manutenção**: Código limpo e tipado

### Métricas de Sucesso

| Métrica               | Antes | Depois |
| --------------------- | ----- | ------ |
| Tempo de carregamento | 2.5s  | 0.8s   |
| Bundle size           | 150kb | 45kb   |
| Lighthouse Score      | 75    | 98     |

> Este sistema de componentes transformou a forma como criamos conteúdo. Agora podemos focar no que realmente importa: a mensagem.
> — Product Owner
