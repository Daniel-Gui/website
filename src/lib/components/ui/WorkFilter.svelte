<script lang="ts">
	import { WORK_CATEGORIES, type WorkCategory } from '$lib/data/work-categories';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let { activeFilter = $bindable() }: { activeFilter: WorkCategory } = $props();

	// Animation for the sliding pill
	const [send, receive] = crossfade({
		duration: 300,
		easing: cubicInOut
	});
</script>

<div class="segmented">
	{#each WORK_CATEGORIES as category}
		{@const isActive = activeFilter === category}
		<button
			class="segmented-item relative z-10 text-xs font-medium capitalize transition-colors duration-200"
			class:text-fg={isActive}
			class:text-muted={!isActive}
			onclick={() => (activeFilter = category)}
			aria-current={isActive}
		>
			<span class="relative z-20">{category}</span>
			{#if isActive}
				<div
					in:receive={{ key: 'active-pill' }}
					out:send={{ key: 'active-pill' }}
					class="absolute inset-0 z-10 rounded-full bg-surface shadow-sm"
				></div>
			{/if}
		</button>
	{/each}
</div>

<style>
	/* Overlay default styles from layout.css where needed */
	.segmented-item {
		background: transparent !important; /* Managed by the pill */
	}
</style>
