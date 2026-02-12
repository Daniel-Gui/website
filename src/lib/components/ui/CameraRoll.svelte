<script lang="ts">
	import { cn } from '$lib/utils';

	interface MediaItem {
		type: 'image' | 'video';
		src: any;
		alt: string;
		id: string;
	}

	interface Props {
		items: MediaItem[];
		class?: string;
		/** Enable auto-play slideshow */
		autoPlay?: boolean;
		/** Auto-play interval in milliseconds (default: 2000) */
		interval?: number;
	}

	let { items, class: className = '', autoPlay = true, interval = 3000 }: Props = $props();

	let activeIndex = $state(0);
	let isPaused = $state(false);

	/**
	 * Navigate to the specified item index
	 */
	function goTo(index: number) {
		activeIndex = Math.max(0, Math.min(index, items.length - 1));
	}

	/**
	 * Navigate to next item (wraps around)
	 */
	function next() {
		activeIndex = (activeIndex + 1) % items.length;
	}

	/**
	 * Navigate to previous item (wraps around)
	 */
	function prev() {
		activeIndex = (activeIndex - 1 + items.length) % items.length;
	}

	// Auto-play effect
	$effect(() => {
		if (!autoPlay || isPaused || items.length <= 1) return;

		const timer = setInterval(() => {
			next();
		}, interval);

		return () => clearInterval(timer);
	});

	// Keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			prev();
		} else if (event.key === 'ArrowRight') {
			next();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class={cn(
		'flex h-full w-full flex-col gap-4 rounded-3xl border border-border/10 bg-surface/50 p-4 text-fg backdrop-blur-md',
		className
	)}
	onmouseenter={() => (isPaused = true)}
	onmouseleave={() => (isPaused = false)}
	onfocus={() => (isPaused = true)}
	onblur={() => (isPaused = false)}
	onkeydown={handleKeydown}
	role="region"
	aria-label="Media Carousel"
	aria-roledescription="carousel"
	tabindex="0"
>
	<!-- Header -->
	<div class="flex items-center justify-between px-2">
		<span class="font-mono text-[10px] font-medium tracking-[0.2em] text-muted uppercase"
			>Camera Roll</span
		>
		<div class="flex gap-1.5" role="tablist" aria-label="Slide indicators">
			{#each items as item, i (item.id)}
				<button
					onclick={() => goTo(i)}
					class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 hover:bg-muted/10 md:h-10 md:w-10"
					aria-label={`Go to item ${i + 1} of ${items.length}`}
					aria-selected={i === activeIndex}
					role="tab"
					type="button"
				>
					<span
						class={cn(
							'h-1.5 w-1.5 rounded-full transition-all duration-300 md:h-2 md:w-2',
							i === activeIndex ? 'scale-110 bg-fg' : 'bg-muted/30 group-hover:bg-muted/50'
						)}
					></span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Single Item Display -->
	<div
		class="relative aspect-4/3 min-h-48 flex-1 overflow-hidden rounded-xl md:aspect-auto md:min-h-0"
	>
		{#each items as item, i (item.id)}
			<div
				class={cn(
					'absolute inset-0 transition-opacity duration-500 ease-out',
					i === activeIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
				)}
				role="tabpanel"
				aria-hidden={i !== activeIndex}
			>
				<div
					class="group relative h-full w-full overflow-hidden rounded-xl border border-border/10 bg-overlay/5"
				>
					{#if item.type === 'video'}
						<video src={item.src} class="h-full w-full object-cover" autoplay loop muted playsinline
						></video>
					{:else}
						<enhanced:img
							src={item.src}
							alt={item.alt}
							class="h-full w-full object-cover"
							loading={i === 0 ? 'eager' : 'lazy'}
							draggable="false"
						/>
					{/if}

					<!-- Vignette/Gloss overlay -->
					<div
						class="pointer-events-none absolute inset-0 rounded-xl mix-blend-overlay ring-1 ring-white/10 ring-inset"
					></div>
					<!-- Shine effect -->
					<div
						class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>
				</div>
			</div>
		{/each}
	</div>
</div>
