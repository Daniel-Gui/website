import { getPosts, getWorks } from '$lib/utils/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [posts, works] = await Promise.all([getPosts(), getWorks()]);

	return {
		posts,
		works
	};
};
