import { error } from '@sveltejs/kit';
import { POSTS } from '$lib/data/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const post = POSTS.find((p) => p.slug === params.slug);

	if (!post) {
		throw error(404, 'Post não encontrado');
	}

	return {
		post
	};
};
