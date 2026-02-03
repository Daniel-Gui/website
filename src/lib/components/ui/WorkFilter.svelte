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

<div class="segmented max-w-full">
	<div class="scroll-mask scrollbar-hide flex w-full items-center gap-1 overflow-x-auto">
		{#each WORK_CATEGORIES as category}
			{@const isActive = activeFilter === category}
			<button
				class="segmented-item relative z-10 shrink-0 text-xs font-medium capitalize transition-colors duration-200"
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
