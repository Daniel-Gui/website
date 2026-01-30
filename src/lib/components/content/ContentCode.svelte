<script lang="ts">
	import IconCopy from '$lib/components/icons/icon-copy.svelte';
	import IconCheck from '$lib/components/icons/icon-check.svelte';

	type Props = {
		data: {
			code: string;
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
	class="not-prose my-8 overflow-hidden rounded-xl border border-white/10 bg-[#171717] shadow-2xl"
>
	<div
		class="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3 text-xs text-neutral-400"
	>
		<div class="flex items-center gap-3">
			{#if data.filename}
				<span class="font-mono text-sm text-neutral-200">{data.filename}</span>
			{/if}
			{#if data.language}
				<span class="tracking-wider uppercase opacity-50">{data.language}</span>
			{/if}
		</div>
		<button
			onclick={copyCode}
			class="flex items-center gap-1.5 transition-colors hover:text-white"
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
	<div class="overflow-x-auto p-5">
		<pre class="font-mono text-sm leading-relaxed text-neutral-300"><code>{data.code}</code></pre>
	</div>
</div>
