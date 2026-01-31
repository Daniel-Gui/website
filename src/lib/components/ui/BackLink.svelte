<script lang="ts">
	import { resolve } from '$app/paths';
	import IconArrowLeft from '$lib/components/icons/icon-arrow-left.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		label?: string;
		children?: Snippet;
		class?: string;
	}

	let { href, label, children, class: className = '' }: Props = $props();
</script>

<a
	href={resolve(href, {})}
	class="group focus-visible:ring-focus -ml-2 flex w-fit items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-fg focus-visible:ring-2 focus-visible:outline-none {className}"
	aria-label={label}
>
	<IconArrowLeft class="size-4 transition-transform group-hover:-translate-x-1" />
	{#if children}
		{@render children()}
	{:else}
		{label}
	{/if}
</a>
