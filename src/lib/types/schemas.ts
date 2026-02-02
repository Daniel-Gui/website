import type { BlogAuthorId } from '../data/blog-authors';
import type { WorkCategory } from '../data/work-categories';

export type PostItem = {
	title: string;
	published: boolean;
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
	slug: string;
	published: boolean;
	title: string;
	description: string;
	year: string;
	category: WorkCategory;
	tags: string[];
	imageBasename?: string;
	link?: string;
	// Allow for other metadata like details, galleryImages
	[key: string]: any;
};
