import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../lib/content/posts/${params.slug}.md`);
		const { default: content, metadata } = post;

		return {
			content,
			post: { ...metadata, slug: params.slug }
		};
	} catch (e) {
		error(404, `Post not found`);
	}
};
