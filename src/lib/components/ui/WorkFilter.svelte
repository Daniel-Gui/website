<script lang="ts">
	import { WORK_CATEGORIES, type WorkCategory } from '$lib/data/work-categories';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	interface Props {
		activeFilter: WorkCategory;
		onchange?: (newFilter: WorkCategory) => void;
	}

	let { activeFilter, onchange }: Props = $props();

	// Animation for the sliding pill
	const [send, receive] = crossfade({
		duration: 300,
		easing: cubicInOut
	});

	function handleClick(category: WorkCategory) {
		if (category !== activeFilter && onchange) {
			onchange(category);
		}
	}
</script>

<div
	class="segmented max-w-full overflow-hidden p-0!"
	role="tablist"
	aria-label="Filtrar trabalhos por categoria"
>
	<div class="scroll-mask scrollbar-hide flex w-full items-center gap-1 overflow-x-auto p-1">
		{#each WORK_CATEGORIES as category}
			{@const isActive = activeFilter === category}
			<button
				class="segmented-item relative z-10 shrink-0 cursor-pointer text-xs font-medium capitalize transition-colors duration-200"
				class:text-fg={isActive}
				class:text-muted={!isActive}
				onclick={() => handleClick(category)}
				role="tab"
				aria-selected={isActive}
				tabindex={isActive ? 0 : -1}
			>
				<span class="relative z-20">{category}</span>
				{#if isActive}
					<div
						in:receive={{ key: 'active-pill' }}
						out:send={{ key: 'active-pill' }}
						class="shadow-subtle absolute inset-0 z-10 rounded-full border border-border/5 bg-surface"
					></div>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	/* Overlay default styles from layout.css where needed */
	.segmented-item {
		background: transparent !important; /* Managed by the pill */
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	@media (max-width: 640px) {
		.scroll-mask {
			mask-image: linear-gradient(to right, black 75%, transparent 100%);
			-webkit-mask-image: linear-gradient(to right, black 75%, transparent 100%);
		}
	}
</style>
