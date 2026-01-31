---
title: Showcase de Componentes de Conteúdo
published: true
excerpt: Uma demonstração completa de todos os componentes visuais disponíveis para uso em artigos e estudos de caso.
date: '2025-01-30'
readTime: 5 minutos
tags:
  - Design System
  - Componentes
  - Demo
coverImageBasename: blog-cover-placeholder-01
authorId: daniel
---

Este artigo serve como um guia visual e técnico dos componentes de conteúdo disponíveis no nosso sistema. Aqui você verá exemplos de tipografia, listas, citações, imagens e blocos de código.

## [01] Tipografia e Texto

O sistema utiliza uma escala tipográfica fluida. Parágrafos suportam **negrito** para ênfase, _itálico_ para destaque sutil e [links inline](/blog) para navegação.

### Subtítulos

Utilize subtítulos (H3) para dividir seções longas dentro de um tópico principal. A hierarquia visual ajuda na escaneabilidade do conteúdo.

---

## [02] Listas e Estrutura

Listas são essenciais para organizar informações. O sistema suporta listas não ordenadas e ordenadas:

- **Flexibilidade**: Itens podem conter formatação rica.
- **Hierarquia**: Ótimo para destacar características ou passos.
- **Clareza**: Melhora a leitura de itens relacionados.

Para processos sequenciais, use listas ordenadas:

1. Configuração do ambiente
2. Instalação de dependências
3. Build e Deploy

---

## [03] Citações (Blockquotes)

Citações são úteis para destacar pensamentos importantes ou referências externas.

> "A simplicidade é o último grau de sofisticação. É a clareza de propósito e a pureza de execução."
>
> — **Leonardo da Vinci**

---

## [04] Imagens Otimizadas

O componente de imagem suporta _lazy loading_, formatos modernos (AVIF/WebP) e legendas automáticas.

![Espaço de trabalho minimalista com equipamentos de design](/images/blog-covers/blog-cover-placeholder-02.webp)
_Exemplo de imagem com legenda: Setup minimalista para desenvolvimento_

---

## [05] Blocos de Código (Shiki)

O destaque do nosso sistema é a renderização de código com **Shiki**, suportando temas claro e escuro automaticamente.

### TypeScript

```typescript:lib/utils/math.ts
/**
 * Calculates the factorial of a number.
 * @param n - The input number
 */
export function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Usage example
console.log(factorial(5)); // Output: 120
```

### Svelte Component

```svelte:components/Button.svelte
<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary';
    children: import('svelte').Snippet;
  }

  let { variant = 'primary', children }: Props = $props();
</script>

<button class="btn btn-{variant}">
  {@render children()}
</button>

<style>
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
  }
</style>
```

### CSS / Styles

```css:styles/main.css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}
```

---

## Conclusão

Estes componentes formam a base do nosso Design System para conteúdo, garantindo consistência e uma excelente experiência de leitura em qualquer dispositivo.
