import visit from 'unist-util-visit';

function escapeSvelte(str) {
	return str
		.replace(/\\/g, '\\\\')
		.replace(/{/g, '&#123;')
		.replace(/}/g, '&#125;')
		.replace(/`/g, '\\`')
		.replace(/\$/g, '\\$');
}

export function remarkCodeToComponent() {
	return (tree) => {
		let hasCodeBlock = false;

		visit(tree, 'code', (node) => {
			hasCodeBlock = true;
			const code = node.value;
			const lang = node.lang || 'text';
			const meta = node.meta || '';

			// Extract filename from meta if present (e.g., ```js:example.js)
			// mdsvex/remark often passes the "js:example.js" as lang if not parsed,
			// or meta. Let's handle simple cases manually or rely on standard parsing.
			// Usually: lang="js" meta="title=example.js" or similar.
			// But user wants "filename".
			// Let's assume standard behavior: lang might contain colon.

			let language = lang;
			let filename = undefined;

			if (lang && lang.includes(':')) {
				const parts = lang.split(':');
				language = parts[0];
				filename = parts.slice(1).join(':');
			} else if (meta) {
				// Naive check for filename in meta
				filename = meta;
			}

			const escapedCode = escapeSvelte(code);

			// Transform node to HTML (Svelte Component)
			node.type = 'html';
			node.value = `
				<ContentCode data={{
					code: \`${escapedCode}\`,
					language: '${language}',
					filename: ${filename ? `'${filename}'` : 'undefined'}
				}} />
			`;
		});

		if (hasCodeBlock) {
			// Inject import at the top
			tree.children.unshift({
				type: 'html',
				value: `<script>import ContentCode from '$lib/components/content/ContentCode.svelte';</script>`
			});
		}
	};
}
