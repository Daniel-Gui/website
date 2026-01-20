import type { PostItem } from '$lib/types/content';

export const POSTS: PostItem[] = [
	{
		id: '01',
		title: 'Otimizando Performance em Aplicações SvelteKit',
		excerpt:
			'Estratégias avançadas de code-splitting, pré-carregamento de dados e otimização de imagens para Core Web Vitals.',
		date: '2025-01-15',
		readTime: '5 min read',
		tags: ['Performance', 'SvelteKit', 'Web Vitals'],
		slug: 'otimizando-performance-sveltekit',
		coverImageBasename: 'blog-cover-placeholder-01',
		authorId: 'daniel',
		content: [
			{
				type: 'paragraph',
				data: {
					text: 'Este artigo explora as nuances de Otimizando Performance em Aplicações SvelteKit e como isso impacta o desenvolvimento moderno. Abaixo, detalhamos os principais desafios e soluções encontradas.'
				}
			},
			{
				type: 'heading',
				data: { level: 2, text: 'O Desafio' }
			},
			{
				type: 'paragraph',
				data: {
					text: 'Ao lidar com sistemas complexos, frequentemente encontramos gargalos de performance que não são óbvios à primeira vista. A necessidade de otimização deve ser balanceada com a legibilidade e manutenção do código.'
				}
			},
			{
				type: 'quote',
				data: {
					text: 'A simplicidade é o último grau de sofisticação.',
					author: 'Leonardo da Vinci'
				}
			},
			{
				type: 'heading',
				data: { level: 3, text: 'Required action' }
			},
			{
				type: 'paragraph',
				data: {
					text: 'Para implementar as correções sugeridas, verifique as configurações do seu ambiente e certifique-se de que todas as dependências estão atualizadas.'
				}
			},
			{
				type: 'list',
				data: {
					style: 'unordered',
					items: [
						'Audite suas dependências regularmente.',
						'Utilize ferramentas de análise estática.',
						'Monitore as métricas de Core Web Vitals.'
					]
				}
			},
			{
				type: 'divider',
				data: {}
			},
			{
				type: 'heading',
				data: { level: 2, text: 'Conclusão' }
			},
			{
				type: 'paragraph',
				data: {
					text: 'A evolução contínua das ferramentas de desenvolvimento web nos permite criar experiências cada vez mais ricas e performáticas. Mantenha-se atualizado e sempre questione as "melhores práticas" estabelecidas.'
				}
			}
		]
	},
	{
		id: '02',
		title: 'Design Systems com Tailwind CSS v4',
		excerpt:
			'Como estruturar tokens de design, variáveis CSS nativas e temas dinâmicos utilizando a nova engine do Tailwind.',
		date: '2024-12-10',
		readTime: '8 min read',
		tags: ['CSS', 'Tailwind', 'Design Systems'],
		slug: 'design-systems-tailwind-v4',
		coverImageBasename: 'blog-cover-placeholder-02',
		authorId: 'daniel',
		content: [
			{
				type: 'paragraph',
				data: {
					text: 'Explorando as novidades do Tailwind CSS v4 e como ele revoluciona a criação de Design Systems modernos.'
				}
			}
		]
	},
	{
		id: '03',
		title: 'Micro-interações e Acessibilidade',
		excerpt:
			'Criando experiências deliciosas sem sacrificar a usabilidade. O papel do reduced-motion e aria-labels em animações.',
		date: '2024-11-05',
		readTime: '6 min read',
		tags: ['A11y', 'Motion', 'UX'],
		slug: 'micro-interacoes-acessibilidade',
		coverImageBasename: 'blog-cover-placeholder-03',
		authorId: 'daniel',
		content: [
			{
				type: 'paragraph',
				data: {
					text: 'Animações não são apenas enfeites. Elas comunicam estado, direção e feedback. Mas como garantir que todos possam navegar?'
				}
			}
		]
	},
	{
		id: '04',
		title: 'Arquitetura Serverless com Cloudflare Workers',
		excerpt:
			'Construindo APIs globais de baixa latência. Gerenciamento de estado, KV storage e Durable Objects na prática.',
		date: '2024-10-20',
		readTime: '10 min read',
		tags: ['Backend', 'Serverless', 'Cloudflare'],
		slug: 'arquitetura-serverless-cloudflare',
		coverImageBasename: 'blog-cover-placeholder-01',
		authorId: 'daniel',
		content: [
			{
				type: 'paragraph',
				data: {
					text: 'A borda (edge) é o novo backend. Vamos explorar como distribuir lógica globalmente com Cloudflare Workers.'
				}
			}
		]
	}
];
