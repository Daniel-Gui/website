<script lang="ts">
	type Props = {
		data: {
			style: 'ordered' | 'unordered';
			items: string[];
		};
	};
	let { data }: Props = $props();
</script>

{#if data.style === 'ordered'}
	<ol class="list-decimal space-y-2 pl-6 text-gray-800 marker:text-gray-500 dark:text-neutral-300">
		{#each data.items as item (item)}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<li>{@html item}</li>
		{/each}
	</ol>
{:else}
	<ul class="list-disc space-y-2 pl-6 text-gray-800 marker:text-gray-500 dark:text-neutral-300">
		{#each data.items as item (item)}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<li>{@html item}</li>
		{/each}
	</ul>
{/if}
