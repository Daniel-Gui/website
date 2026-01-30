
import { POSTS } from '$lib/data/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		posts: POSTS
	};
};
