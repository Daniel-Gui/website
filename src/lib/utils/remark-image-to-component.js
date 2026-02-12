import visit from 'unist-util-visit';

function escapeSvelte(str) {
	return str
		.replace(/\\/g, '\\\\')
		.replace(/{/g, '&#123;')
		.replace(/}/g, '&#125;')
		.replace(/`/g, '\\`')
		.replace(/\$/g, '\\$');
}

export function remarkImageToComponent() {
	return (tree) => {
		let hasImages = false;

		visit(tree, 'image', (node) => {
			hasImages = true;
			const { url, alt, title } = node;
			const caption = title ? escapeSvelte(title) : '';
			const escapedUrl = escapeSvelte(url);
			const escapedAlt = escapeSvelte(alt || '');

			node.type = 'html';
			node.value = `
				<ContentImage data={{
					src: \`${escapedUrl}\`,
					alt: \`${escapedAlt}\`,
					caption: \`${caption}\`
				}} />
			`;
		});

		if (hasImages) {
			const importStatement = `import ContentImage from '$lib/components/content/ContentImage.svelte';`;

			// Find existing <script> node
			const existingScriptIndex = tree.children.findIndex(
				(node) =>
					node.type === 'html' &&
					node.value.includes('<script>') &&
					!node.value.includes('context="module"')
			);

			if (existingScriptIndex !== -1) {
				const scriptNode = tree.children[existingScriptIndex];
				// Avoid duplicate imports
				if (!scriptNode.value.includes('ContentImage.svelte')) {
					scriptNode.value = scriptNode.value.replace('</script>', `${importStatement}</script>`);
				}
			} else {
				const scriptNode = {
					type: 'html',
					value: `<script>${importStatement}</script>`
				};

				const yamlParamsIndex = tree.children.findIndex(
					(node) => node.type === 'yaml' || node.type === 'toml'
				);

				// Inject after frontmatter or at the top
				if (yamlParamsIndex !== -1) {
					tree.children.splice(yamlParamsIndex + 1, 0, scriptNode);
				} else {
					tree.children.unshift(scriptNode);
				}
			}
		}
	};
}
