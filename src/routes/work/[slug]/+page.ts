import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Component } from 'svelte';
import type { WorkItem } from '../../../lib/types/schemas';

export const load: PageLoad = async ({ params }) => {
	try {
		// Import specific work markdown
		const workFile = await import(`../../../lib/content/works/${params.slug}.md`);
		const { metadata } = workFile;

		return {
			work: {
				...metadata,
				slug: params.slug
			} as WorkItem,
			Content: workFile.default as Component
		};
	} catch (e) {
		error(404, `Work not found`);
	}
};
