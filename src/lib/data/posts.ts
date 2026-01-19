export type PostItem = {
	id: string;
	title: string;
	excerpt: string;
	date: string; // ISO 8601 format: YYYY-MM-DD
	readTime: string;
	tags: string[];
	slug: string;
	coverImageBasename: string;
};

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
		coverImageBasename: 'blog-cover-placeholder-01'
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
		coverImageBasename: 'blog-cover-placeholder-02'
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
		coverImageBasename: 'blog-cover-placeholder-03'
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
		coverImageBasename: 'blog-cover-placeholder-01'
	}
];
