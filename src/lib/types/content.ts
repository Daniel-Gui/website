import type { BlogAuthorId } from '$lib/data/blog-authors';

export type ContentBlock =
	| { type: 'paragraph'; data: { text: string } }
	| { type: 'heading'; data: { level: 1 | 2 | 3 | 4 | 5 | 6; text: string; id?: string } }
	| { type: 'list'; data: { style: 'ordered' | 'unordered'; items: string[] } }
	| { type: 'image'; data: { src: string; alt: string; caption?: string } }
	| { type: 'quote'; data: { text: string; author?: string; role?: string } }
	| { type: 'code'; data: { code: string; language?: string; filename?: string } }
	| { type: 'divider'; data: Record<string, never> };

export type PostItem = {
	id: string;
	title: string;
	excerpt: string;
	date: string; // ISO 8601 format: YYYY-MM-DD
	readTime: string;
	tags: string[];
	slug: string;
	coverImageBasename: string;
	authorId: BlogAuthorId;
	content?: ContentBlock[];
};
