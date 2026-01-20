import type { PostItem } from '$lib/types/content';

export const POSTS: PostItem[] = [
	{
		id: 'demo-01',
		title: 'Demonstração de Componentes de Conteúdo',
		excerpt:
			'Um guia completo demonstrando todos os componentes de conteúdo disponíveis no sistema de blog: tipografia, listas, imagens, código e mais.',
		date: '2025-01-20',
		readTime: '3 min read',
		tags: ['Demo', 'Design System', 'Componentes'],
		slug: 'demo-componentes-conteudo',
		coverImageBasename: 'blog-cover-placeholder-01',
		authorId: 'daniel',
		content: [
			{
				type: 'paragraph',
				data: {
					text: 'Este é um parágrafo introdutório para demonstrar a renderização de texto padrão. O sistema suporta <strong>negrito</strong>, <em>itálico</em> e links inline através de HTML seguro.'
				}
			},
			{
				type: 'heading',
				data: { level: 2, text: 'Estrutura e Listas' }
			},
			{
				type: 'paragraph',
				data: {
					text: 'Abaixo, apresentamos os diferentes tipos de listas suportados pelo sistema:'
				}
			},
			{
				type: 'list',
				data: {
					style: 'unordered',
					items: [
						'Item de lista não ordenada 1',
						'Item de lista não ordenada 2 com <em>texto formatado</em>',
						'Item de lista não ordenada 3'
					]
				}
			},
			{
				type: 'list',
				data: {
					style: 'ordered',
					items: [
						'Primeiro passo importante',
						'Segundo passo do processo',
						'Terceiro e último passo'
					]
				}
			},
			{
				type: 'divider',
				data: {}
			},
			{
				type: 'heading',
				data: { level: 2, text: 'Citações e Destaques' }
			},
			{
				type: 'quote',
				data: {
					text: 'O design não é apenas o que parece e o que se sente. O design é como funciona.',
					author: 'Steve Jobs',
					role: 'Co-fundador da Apple'
				}
			},
			{
				type: 'heading',
				data: { level: 3, text: 'Subtítulo de Nível 3' }
			},
			{
				type: 'paragraph',
				data: {
					text: 'Parágrafos podem ser usados para separar seções e fornecer contexto adicional entre os elementos visuais.'
				}
			},
			{
				type: 'divider',
				data: {}
			},
			{
				type: 'heading',
				data: { level: 2, text: 'Imagens e Código' }
			},
			{
				type: 'image',
				data: {
					src: '/images/blog-covers/blog-cover-placeholder-02.webp',
					alt: 'Exemplo de imagem renderizada no conteúdo',
					caption: 'Legenda opcional para a imagem demonstrativa'
				}
			},
			{
				type: 'paragraph',
				data: {
					text: 'Para desenvolvedores, é essencial poder compartilhar trechos de código com syntax highlighting adequado:'
				}
			},
			{
				type: 'code',
				data: {
					language: 'typescript',
					filename: 'example.ts',
					code: `interface User {
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
}`
				}
			},
			{
				type: 'paragraph',
				data: {
					text: 'E aqui encerramos nossa demonstração de componentes. O sistema é flexível e permite combinar estes blocos de diversas formas.'
				}
			}
		]
	}
];
