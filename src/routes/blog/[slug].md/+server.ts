import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Remove o frontmatter YAML do conteúdo markdown
 * Frontmatter é delimitado por --- no início do arquivo
 */
function stripFrontmatter(content: string): string {
    return content.replace(/^---[\s\S]*?---\n*/, '');
}

export const GET: RequestHandler = async ({ params }) => {
    const slug = params.slug;

    try {
        // Import dinâmico do arquivo markdown como texto raw
        // Usando ?raw para obter o conteúdo como string
        const post = await import(`../../../lib/content/posts/${slug}.md?raw`);
        const cleanContent = stripFrontmatter(post.default);

        return new Response(cleanContent, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch {
        error(404, 'Post not found');
    }
};
