import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, data }) => {
	try {
		const post = await import(`../../../lib/content/posts/${params.slug}.md`);
		const { default: content, metadata } = post;

		// Use server provided metadata if available, or fallback to file metadata
		return {
			content,
			post: { ...data.metadata, ...metadata, slug: params.slug }
		};
	} catch (e) {
		error(404, `Post not found`);
	}
};
