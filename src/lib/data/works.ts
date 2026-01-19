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
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
		tags: ['SvelteKit', 'Tailwind', 'D3.js'],
		year: '2025',
		link: '#',
		imageBasename: 'cover-placeholder-01',
		details: {
			challenge:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
			solution:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
			result:
				'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
		},
		galleryImages: ['cover-placeholder-01', 'cover-placeholder-02', 'cover-placeholder-03']
	},
	{
		id: '02',
		title: 'Chronos UI',
		description:
			'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
		tags: ['Design System', 'A11y', 'Storybook'],
		year: '2024',
		link: '#',
		imageBasename: 'cover-placeholder-02',
		details: {
			challenge:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
			solution:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
			result:
				'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.'
		},
		galleryImages: ['cover-placeholder-02', 'cover-placeholder-03', 'cover-placeholder-01']
	},
	{
		id: '03',
		title: 'Vortex Finance',
		description:
			'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
		tags: ['React', 'Web3', 'Motion'],
		year: '2024',
		link: '#',
		imageBasename: 'cover-placeholder-03',
		details: {
			challenge:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
			solution:
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
			result:
				'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.'
		},
		galleryImages: ['cover-placeholder-03', 'cover-placeholder-01', 'cover-placeholder-02']
	}
];
