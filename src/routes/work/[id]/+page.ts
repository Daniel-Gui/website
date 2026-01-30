import { error } from '@sveltejs/kit';
import { WORKS } from '$lib/data/works';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const work = WORKS.find((w) => w.id === params.id);

	if (!work) {
		throw error(404, 'Projeto não encontrado');
	}

	return {
		work
	};
};
