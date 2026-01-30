import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		// We really just need to know if it exists, but the dynamic import happens in +page.ts usually for mdsvex
		// However, checking existence here is good practice to return 404 from server
		const post = await import(`../../../lib/content/posts/${params.slug}.md`);

		// We can pass the metadata here if we want, but +page.ts will handle the component import
		return {
			metadata: post.metadata
		};
	} catch (e) {
		error(404, `Post not found`);
	}
};
