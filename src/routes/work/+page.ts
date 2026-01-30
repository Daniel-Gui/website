import { getWorks } from '$lib/utils/content';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const works = await getWorks();
    return { works };
};
