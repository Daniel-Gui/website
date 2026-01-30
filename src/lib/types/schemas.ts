import type { BlogAuthorId } from '../data/blog-authors';

export type ContentBlock =
	| { type: 'paragraph'; data: { text: string } }
	| { type: 'heading'; data: { level: 1 | 2 | 3 | 4 | 5 | 6; text: string; id?: string } }
	| { type: 'list'; data: { style: 'ordered' | 'unordered'; items: string[] } }
	| {
		type: 'image';
		data: {
			src: string;
			alt: string;
			caption?: string;
			sourceType?: 'local' | 'external';
		};
	}
	| { type: 'quote'; data: { text: string; author?: string; role?: string } }
	| { type: 'code'; data: { code: string; language?: string; filename?: string } }
	| { type: 'divider'; data: Record<string, never> };

export type PostItem = {
	title: string;
	excerpt: string;
	date: string; // ISO 8601 format: YYYY-MM-DD
	readTime: string;
	tags: string[];
	slug: string;
	coverImageBasename: string;
	authorId: BlogAuthorId;
	// Allow for other metadata
	[key: string]: any;
};

export type WorkItem = {
	id: string;
	title: string;
	description: string;
	year: string;
	tags: string[];
	imageBasename?: string;
	link?: string;
	// Allow for other metadata like details, galleryImages
	[key: string]: any;
};
