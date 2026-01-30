import { getWorks } from '$lib/utils/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const works = await getWorks();
    return { works };
};
