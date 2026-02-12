export type BlogAuthor = {
	id: string;
	name: string;
	avatarBasename: string;
};

export const BLOG_AUTHORS = {
	daniel: {
		id: 'daniel',
		name: 'Daniel Guimarães',
		avatarBasename: 'content-author-daniel-guimaraes'
	}
} as const satisfies Record<string, BlogAuthor>;

export type BlogAuthorId = keyof typeof BLOG_AUTHORS;

export const getBlogAuthor = (id?: BlogAuthorId) =>
	BLOG_AUTHORS[id ?? 'daniel'] ?? BLOG_AUTHORS.daniel;
