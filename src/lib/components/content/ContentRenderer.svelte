<script lang="ts">
	import type { ContentBlock } from '$lib/types/content';
	import ContentParagraph from './ContentParagraph.svelte';
	import ContentHeading from './ContentHeading.svelte';
	import ContentList from './ContentList.svelte';
	import ContentImage from './ContentImage.svelte';
	import ContentQuote from './ContentQuote.svelte';
	import ContentCode from './ContentCode.svelte';
	import ContentDivider from './ContentDivider.svelte';

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
