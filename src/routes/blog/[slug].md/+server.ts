import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';

export const GET: RequestHandler = async ({ params }) => {
    const slug = params.slug;

    try {
        // Caminho para o arquivo markdown
        const filePath = path.resolve('src/lib/content/posts', `${slug}.md`);
        const content = await fs.readFile(filePath, 'utf-8');

        return new Response(content, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (e) {
        error(404, 'Post not found');
    }
};
