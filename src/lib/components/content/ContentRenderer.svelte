<script lang="ts">
	import ContentParagraph from './ContentParagraph.svelte';
	import ContentHeading from './ContentHeading.svelte';
	import ContentList from './ContentList.svelte';
	import ContentImage from './ContentImage.svelte';
	import ContentQuote from './ContentQuote.svelte';
	import ContentCode from './ContentCode.svelte';
	import ContentDivider from './ContentDivider.svelte';

	// Define ContentBlock inline as it's only used in this component
	type ContentBlock =
		| { type: 'paragraph'; data: { text: string } }
		| { type: 'heading'; data: { level: 1 | 2 | 3 | 4 | 5 | 6; text: string; id?: string } }
		| { type: 'list'; data: { style: 'ordered' | 'unordered'; items: string[] } }
		| {
				type: 'image';
				data: { src: string; alt: string; caption?: string; sourceType?: 'local' | 'external' };
		  }
		| { type: 'quote'; data: { text: string; author?: string; role?: string } }
		| { type: 'code'; data: { code: string; language?: string; filename?: string } }
		| { type: 'divider'; data: Record<string, never> };

	type Props = {
		blocks: ContentBlock[];
	};
	let { blocks }: Props = $props();
</script>

<div class="space-y-6">
	{#each blocks as block, index (index)}
		{#if block.type === 'paragraph'}
			<ContentParagraph data={block.data} />
		{:else if block.type === 'heading'}
			<ContentHeading data={block.data} />
		{:else if block.type === 'list'}
			<ContentList data={block.data} />
		{:else if block.type === 'image'}
			<ContentImage data={block.data} />
		{:else if block.type === 'quote'}
			<ContentQuote data={block.data} />
		{:else if block.type === 'code'}
			<ContentCode data={block.data} />
		{:else if block.type === 'divider'}
			<ContentDivider />
		{/if}
	{/each}
</div>
