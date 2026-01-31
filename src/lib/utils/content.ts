import type { PostItem, WorkItem } from '../types/schemas';

export async function getPosts() {
	const posts: PostItem[] = [];

	const paths = import.meta.glob('/src/lib/content/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Record<string, unknown>;
			const post = { ...metadata, slug } as PostItem;
			posts.push(post);
		}
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getWorks() {
	const works: WorkItem[] = [];

	const paths = import.meta.glob('/src/lib/content/works/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Record<string, unknown>;
			const work = { ...metadata, slug } as WorkItem;
			works.push(work);
		}
	}

	return works.sort((a, b) => b.slug.localeCompare(a.slug));
}
