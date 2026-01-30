import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Component } from 'svelte';

export const load: PageLoad = async ({ params, data }) => {
    try {
        // Import specific work markdown - this returns the Svelte component
        const workFile = await import(`../../../lib/content/works/${params.id}.md`);

        return {
            ...data, // Merge server data (work info)
            Content: workFile.default as Component
        };
    } catch (e) {
        error(404, `Work not found`);
    }
};
