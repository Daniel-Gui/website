<script lang="ts">
	import { animate } from 'motion';

	interface Props {
		items?: {
			id: string;
			name: string;
			src?: any; // strict type is difficult with enhanced-img, using any
		}[];
		speed?: number; // Duration in seconds for one full loop
		direction?: 'left' | 'right';
		pauseOnHover?: boolean;
		class?: string;
	}

	let {
		items = [],
		speed = 30,
		direction = 'left',
		pauseOnHover = true,
		class: className = ''
	}: Props = $props();

	let container: HTMLElement | undefined = $state();
	let isHovered = $state(false);

	let controls: ReturnType<typeof animate> | undefined;

	$effect(() => {
		if (!container) return;

		const scrollDistance = container.scrollWidth / 4;
		const startX = direction === 'left' ? 0 : -scrollDistance;
		const endX = direction === 'left' ? -scrollDistance : 0;

		controls = animate(
			container,
			{ transform: [`translateX(${startX}px)`, `translateX(${endX}px)`] },
			{
				duration: speed,
				ease: 'linear',
				repeat: Infinity
			}
		);

		return () => controls?.stop();
	});

	$effect(() => {
		if (!controls) return;

		if (pauseOnHover && isHovered) {
			controls.pause();
		} else {
			controls.play();
		}
	});
</script>

<div
	class="container-page relative flex overflow-hidden {className}"
	role="region"
	aria-label="Partner Companies"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	style="mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);"
>
	<!-- Marquee Track -->
	<div
		class="flex min-w-full shrink-0 items-center gap-16 py-8 will-change-transform"
		bind:this={container}
	>
		{#each [...items, ...items, ...items, ...items] as item, i (item.id + '-' + i)}
			<div
				class="group relative flex shrink-0 items-center justify-center grayscale transition-all duration-300 hover:grayscale-0"
				aria-hidden={i >= items.length ? 'true' : undefined}
			>
				{#if item.src}
					<enhanced:img
						src={item.src}
						alt={item.name}
						class="h-8 w-auto max-w-[150px] object-contain opacity-60 transition-opacity group-hover:opacity-100 dark:invert"
						loading="lazy"
					/>
				{:else}
					<span
						class="font-mono text-lg font-medium tracking-wider text-[rgb(var(--muted))] uppercase transition-colors group-hover:text-[rgb(var(--fg))]"
					>
						{item.name}
					</span>
				{/if}
			</div>
		{/each}
	</div>
</div>
