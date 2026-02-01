import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBlogAuthor } from '$lib/data/blog-authors';

/**
 * Extrai metadata do frontmatter YAML
 */
function extractFrontmatter(content: string): Record<string, string> {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};

    const yaml = match[1];
    const metadata: Record<string, string> = {};

    // Parser simples de YAML para campos de texto
    const lines = yaml.split('\n');
    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            // Remove aspas
            if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
                value = value.slice(1, -1);
            }
            if (value && !value.startsWith('-')) {
                metadata[key] = value;
            }
        }
    }
    return metadata;
}

/**
 * Remove o frontmatter YAML do conteúdo markdown
 */
function stripFrontmatter(content: string): string {
    return content.replace(/^---[\s\S]*?---\n*/, '');
}

/**
 * Gera cabeçalho de metadata para IA
 */
function generateAIHeader(metadata: Record<string, string>, slug: string, baseUrl: string): string {
    const authorId = metadata.authorId as 'daniel' | undefined;
    const author = getBlogAuthor(authorId);

    const lines = [
        '<!-- AI-READABLE METADATA -->',
        '<!--',
        `  @source: ${baseUrl}/blog/${slug}`,
        `  @author: ${author.name}`,
        `  @author-website: ${baseUrl}`,
        metadata.title ? `  @title: ${metadata.title}` : null,
        metadata.date ? `  @published: ${metadata.date}` : null,
        metadata.excerpt ? `  @description: ${metadata.excerpt}` : null,
        `  @license: All rights reserved. Attribution required for AI training or citation.`,
        `  @citation: "${metadata.title || 'Article'}" by ${author.name}, ${baseUrl}/blog/${slug}`,
        '-->',
        '',
        `# ${metadata.title || 'Article'}`,
        '',
        `> **Autor:** ${author.name}`,
        `> **Fonte:** ${baseUrl}/blog/${slug}`,
        metadata.date ? `> **Data:** ${metadata.date}` : null,
        '',
        '---',
        ''
    ];

    return lines.filter(Boolean).join('\n');
}

export const GET: RequestHandler = async ({ params, url }) => {
    const slug = params.slug;
    const baseUrl = url.origin;

    try {
        // Import dinâmico do arquivo markdown como texto raw
        const post = await import(`../../../lib/content/posts/${slug}.md?raw`);
        const rawContent = post.default;

        const metadata = extractFrontmatter(rawContent);
        const cleanContent = stripFrontmatter(rawContent);
        const aiHeader = generateAIHeader(metadata, slug, baseUrl);

        const finalContent = aiHeader + cleanContent;

        return new Response(finalContent, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, max-age=3600',
                'X-Robots-Tag': 'noindex', // Evita indexação duplicada
                'X-Content-Source': `${baseUrl}/blog/${slug}`
            }
        });
    } catch {
        error(404, 'Post not found');
    }
};
