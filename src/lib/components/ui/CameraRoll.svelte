<script lang="ts">
	import { cn } from '$lib/utils';

	interface ImageItem {
		src: string;
		alt: string;
		id: string;
	}

	interface Props {
		images: ImageItem[];
		class?: string;
		/** Enable auto-play slideshow */
		autoPlay?: boolean;
		/** Auto-play interval in milliseconds (default: 2000) */
		interval?: number;
	}

	let { images, class: className = '', autoPlay = true, interval = 2000 }: Props = $props();

	let activeIndex = $state(0);
	let isPaused = $state(false);

	/**
	 * Navigate to the specified image index
	 */
	function goTo(index: number) {
		activeIndex = Math.max(0, Math.min(index, images.length - 1));
	}

	/**
	 * Navigate to next image (wraps around)
	 */
	function next() {
		activeIndex = (activeIndex + 1) % images.length;
	}

	/**
	 * Navigate to previous image (wraps around)
	 */
	function prev() {
		activeIndex = (activeIndex - 1 + images.length) % images.length;
	}

	// Auto-play effect
	$effect(() => {
		if (!autoPlay || isPaused || images.length <= 1) return;

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
	aria-label="Image Carousel"
	aria-roledescription="carousel"
	tabindex="0"
>
	<!-- Header -->
	<div class="flex items-center justify-between px-2">
		<span class="font-mono text-[10px] font-medium tracking-[0.2em] text-muted uppercase"
			>Camera Roll</span
		>
		<div class="flex gap-1.5" role="tablist" aria-label="Slide indicators">
			{#each images as item, i (item.id)}
				<button
					onclick={() => goTo(i)}
					class={cn(
						'h-1.5 w-1.5 rounded-full transition-all duration-300 md:h-2 md:w-2',
						i === activeIndex ? 'scale-110 bg-fg' : 'cursor-pointer bg-muted/30 hover:bg-muted/50'
					)}
					aria-label={`Go to image ${i + 1} of ${images.length}`}
					aria-selected={i === activeIndex}
					role="tab"
					type="button"
				></button>
			{/each}
		</div>
	</div>

	<!-- Single Image Display -->
	<div class="relative flex-1 overflow-hidden rounded-xl">
		{#each images as img, i (img.id)}
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
					<img
						src={img.src}
						alt={img.alt}
						class="h-full w-full object-cover"
						loading={i === 0 ? 'eager' : 'lazy'}
						draggable="false"
					/>
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
