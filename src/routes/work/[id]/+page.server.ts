import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { WorkItem } from '../../../lib/types/schemas';

export const load: PageServerLoad = async ({ params }) => {
    try {
        // Import specific work markdown
        const workFile = await import(`../../../lib/content/works/${params.id}.md`);
        const { metadata } = workFile;

        // Construct the WorkItem object
        const work = {
            ...metadata,
            id: params.id
        } as WorkItem;

        return {
            work
        };
    } catch (e) {
        error(404, `Work not found`);
    }
};
