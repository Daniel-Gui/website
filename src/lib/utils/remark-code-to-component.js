import visit from 'unist-util-visit';
import { createHighlighter } from 'shiki';

// Cache the highlighter to avoid recreating it for each file
let highlighterPromise = null;

async function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ['github-dark', 'github-light'],
			langs: [
				'javascript',
				'typescript',
				'svelte',
				'html',
				'css',
				'json',
				'bash',
				'shell',
				'markdown',
				'tsx',
				'jsx',
				'python',
				'sql',
				'yaml',
				'diff'
			]
		});
	}
	return highlighterPromise;
}

function escapeSvelte(str) {
	return str
		.replace(/\\/g, '\\\\')
		.replace(/{/g, '&#123;')
		.replace(/}/g, '&#125;')
		.replace(/`/g, '\\`')
		.replace(/\$/g, '\\$');
}

export function remarkCodeToComponent() {
	return async (tree) => {
		const codeNodes = [];

		// Collect all code blocks
		visit(tree, 'code', (node) => {
			codeNodes.push(node);
		});

		if (codeNodes.length === 0) return;

		// Get highlighter once for all code blocks
		const highlighter = await getHighlighter();

		for (const node of codeNodes) {
			const code = node.value;
			const lang = node.lang || 'text';
			const meta = node.meta || '';

			let language = lang;
			let filename = undefined;

			if (lang && lang.includes(':')) {
				const parts = lang.split(':');
				language = parts[0];
				filename = parts.slice(1).join(':');
			} else if (meta) {
				filename = meta;
			}

			// Check if language is supported, fallback to 'text' if not
			const supportedLang = highlighter.getLoadedLanguages().includes(language) ? language : 'text';

			// Generate highlighted HTML at build time
			const highlightedHtml = highlighter.codeToHtml(code, {
				lang: supportedLang,
				themes: {
					light: 'github-light',
					dark: 'github-dark'
				}
			});

			const escapedCode = escapeSvelte(code);
			const escapedHtml = escapeSvelte(highlightedHtml);

			// Transform node to HTML (Svelte Component)
			node.type = 'html';
			node.value = `
				<ContentCode data={{
					code: \`${escapedCode}\`,
					highlightedHtml: \`${escapedHtml}\`,
					language: '${language}',
					filename: ${filename ? `'${filename}'` : 'undefined'}
				}} />
			`;
		}

		// Inject import
		const scriptNode = {
			type: 'html',
			value: `<script>import ContentCode from '$lib/components/content/ContentCode.svelte';</script>`
		};

		const yamlParamsIndex = tree.children.findIndex((node) => node.type === 'yaml' || node.type === 'toml');
		if (yamlParamsIndex !== -1) {
			tree.children.splice(yamlParamsIndex + 1, 0, scriptNode);
		} else {
			tree.children.unshift(scriptNode);
		}
	};
}
