import IconTailwindcss from '$lib/components/icons/icon-tailwindcss.svelte';
import IconSvelte from '$lib/components/icons/icon-svelte.svelte';
import IconReact from '$lib/components/icons/icon-react.svelte';
import IconBun from '$lib/components/icons/icon-bun.svelte';
import IconCloudflare from '$lib/components/icons/icon-cloudflare.svelte';
import IconJavascript from '$lib/components/icons/icon-javascript.svelte';
import IconTypescript from '$lib/components/icons/icon-typescript.svelte';

type TechIconComponent =
	| typeof IconSvelte
	| typeof IconReact
	| typeof IconBun
	| typeof IconCloudflare
	| typeof IconJavascript
	| typeof IconTypescript
	| typeof IconTailwindcss;

export const TECH_ICONS: Record<string, TechIconComponent> = {
	SvelteKit: IconSvelte,
	Svelte: IconSvelte,
	React: IconReact,
	Bun: IconBun,
	Cloudflare: IconCloudflare,
	JavaScript: IconJavascript,
	TypeScript: IconTypescript,
	Tailwindcss: IconTailwindcss
};

export type WorkItem = {
	id: string;
	title: string;
	description: string;
	tags: string[];
	link?: string;
	imageBasename?: string;
	year: string;
	details: {
		challenge: string;
		solution: string;
		result: string;
	};
	galleryImages: string[];
};

export const WORKS: WorkItem[] = [
	{
		id: '01',
		title: 'Nexus Dashboard',
		description:
			'Uma plataforma de análise de dados em tempo real projetada para simplificar a visualização de métricas complexas e facilitar a tomada de decisão.',
		tags: ['SvelteKit', 'Tailwindcss', 'D3.js'],
		year: '2025',
		link: '#',
		imageBasename: 'cover-placeholder-01',
		details: {
			challenge:
				'O principal desafio foi lidar com grandes volumes de dados em tempo real sem comprometer a performance da aplicação. A interface precisava ser intuitiva para usuários não-técnicos, mas poderosa o suficiente para analistas de dados.',
			solution:
				'Desenvolvemos uma arquitetura baseada em WebSockets para atualizações instantâneas e utilizamos D3.js para renderização eficiente de gráficos. A interface foi construída com componentes modulares e acessíveis.',
			result:
				'O resultado foi uma redução de 40% no tempo de carregamento das métricas e um aumento significativo na satisfação dos usuários, que agora podem personalizar seus dashboards de acordo com suas necessidades.'
		},
		galleryImages: ['cover-placeholder-01', 'cover-placeholder-02', 'cover-placeholder-03']
	}
];
