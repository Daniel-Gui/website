<script lang="ts">
	import IconCopy from '$lib/components/icons/icon-copy.svelte';
	import IconCheck from '$lib/components/icons/icon-check.svelte';

	type Props = {
		data: {
			code: string;
			highlightedHtml?: string;
			language?: string;
			filename?: string;
		};
	};
	let { data }: Props = $props();

	let copied = $state(false);

	function copyCode() {
		navigator.clipboard.writeText(data.code);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div
	class="not-prose border-default my-8 overflow-hidden rounded-xl border bg-[#f8f8f8] shadow-lg dark:bg-[#171717] dark:shadow-2xl"
>
	<div
		class="border-subtle bg-subtle flex items-center justify-between border-b px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400"
	>
		<div class="flex items-center gap-3">
			{#if data.filename}
				<span class="font-mono text-sm text-neutral-700 dark:text-neutral-200">{data.filename}</span
				>
			{/if}
			{#if data.language}
				<span class="tracking-wider uppercase opacity-50">{data.language}</span>
			{/if}
		</div>
		<button
			onclick={copyCode}
			class="flex items-center gap-1.5 transition-colors hover:text-neutral-900 dark:hover:text-white"
			aria-label="Copiar código"
		>
			{#if copied}
				<IconCheck class="size-3.5 text-green-500" />
				<span class="text-green-500">Copiado</span>
			{:else}
				<IconCopy class="size-3.5" />
				<span>Copiar</span>
			{/if}
		</button>
	</div>
	<div class="shiki-container overflow-x-auto p-5">
		{#if data.highlightedHtml}
			<!-- Pre-highlighted HTML from Shiki (build time) -->
			{@html data.highlightedHtml}
		{:else}
			<!-- Fallback: plain code -->
			<pre class="font-mono text-sm leading-relaxed text-neutral-300"><code>{data.code}</code></pre>
		{/if}
	</div>
</div>

<style>
	/* Shiki styling - always use container background */
	.shiki-container :global(pre.shiki) {
		background: transparent !important;
		margin: 0;
		padding: 0;
	}

	.shiki-container :global(.shiki code) {
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.875rem;
		line-height: 1.6;
	}

	/* Force transparent background on all spans */
	.shiki-container :global(.shiki span) {
		background-color: transparent !important;
	}

	/* Dark mode: use --shiki-dark color variables */
	:global(html.dark) .shiki-container :global(.shiki span) {
		color: var(--shiki-dark) !important;
	}

	/* Light mode: uses the inline color attribute (light theme is the default in Shiki output) */
</style>
