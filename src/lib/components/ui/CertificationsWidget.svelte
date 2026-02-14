<script lang="ts">
	import IconSealCheck from '$lib/components/icons/icon-seal-check.svelte';
	import IconHourglassHigh from '$lib/components/icons/icon-hourglass-high.svelte';
	import { cn } from '$lib/utils';
	import { animate, stagger, inView } from 'motion';

	interface Certification {
		name: string;
		institution: string;
		year: string;
		status: 'completed' | 'in-progress';
	}

	interface Props {
		title?: string;
		items: Certification[];
		class?: string;
		maxHeightClass?: string;
		minHeightClass?: string;
	}

	let {
		title = 'CERTIFICAÇÕES',
		items,
		class: className = '',
		maxHeightClass = '',
		minHeightClass = ''
	}: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let listEl: HTMLDivElement | undefined = $state();
	let activeIndex = $state(0);
	let isAnimating = $state(false);

	// Cycle featured certification
	$effect(() => {
		if (typeof window === 'undefined') return;
		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
		if (reduce) return;

		const interval = setInterval(() => {
			if (items.length <= 1) return;
			isAnimating = true;

			// Short delay for exit, then switch
			setTimeout(() => {
				activeIndex = (activeIndex + 1) % items.length;
				isAnimating = false;
			}, 200);
		}, 4000);

		return () => clearInterval(interval);
	});

	// Auto-scroll list to keep active item visible
	$effect(() => {
		if (!listEl) return;
		const activeItem = listEl.querySelectorAll('.cert-item')[activeIndex] as
			| HTMLElement
			| undefined;
		if (!activeItem) return;

		activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	});

	// InView stagger animation
	$effect(() => {
		if (!containerEl) return;
		if (typeof window === 'undefined') return;
		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
		if (reduce) return;

		const cleanup = inView(containerEl, () => {
			const listItems = containerEl?.querySelectorAll('.cert-item');
			if (!listItems?.length) return;

			animate(
				listItems,
				{ opacity: [0, 1], y: [12, 0] },
				{
					type: 'spring',
					stiffness: 300,
					damping: 25,
					delay: stagger(0.08)
				}
			);
		});

		return cleanup;
	});
</script>

<div
	bind:this={containerEl}
	class={cn(
		'relative flex flex-col overflow-hidden rounded-3xl border border-border/10 bg-surface/50 backdrop-blur-md',
		maxHeightClass,
		minHeightClass,
		className
	)}
>
	<!-- Header -->
	<div class="flex items-center justify-between p-6 pb-4">
		<h2 class="font-mono text-xs font-medium tracking-widest text-muted uppercase">
			{title}
		</h2>
		<span class="font-mono text-sm text-muted">{items.length} formações</span>
	</div>

	<!-- Featured Certification -->
	{#if items.length > 0}
		<div class="mx-6 mb-4 rounded-2xl border border-border/5 bg-overlay/5 p-5">
			<div
				class="featured-cert"
				class:featured-exit={isAnimating}
				class:featured-enter={!isAnimating}
			>
				<div class="mb-3 flex items-center gap-2">
					<div
						class="flex size-8 items-center justify-center rounded-xl {items[activeIndex].status ===
						'completed'
							? 'bg-success/10'
							: 'bg-accent/10'}"
					>
						{#if items[activeIndex].status === 'completed'}
							<IconSealCheck class="size-5 text-success" />
						{:else}
							<IconHourglassHigh class="size-5 text-accent" />
						{/if}
					</div>
					<span
						class="font-mono text-[10px] tracking-widest uppercase {items[activeIndex].status ===
						'completed'
							? 'text-success'
							: 'text-accent'}"
					>
						{items[activeIndex].status === 'completed' ? 'Concluído' : 'Em andamento'}
					</span>
				</div>
				<h3 class="mb-1 text-base font-medium text-fg">
					{items[activeIndex].name}
				</h3>
				<p class="text-sm text-muted">
					{items[activeIndex].institution} · {items[activeIndex].year}
				</p>
			</div>

			<!-- Dots indicator -->
			<div class="mt-4 flex items-center justify-center gap-1.5">
				{#each items as _, i (i)}
					<button
						type="button"
						class="size-1.5 rounded-full transition-all duration-300"
						class:bg-accent={i === activeIndex}
						class:scale-125={i === activeIndex}
						class:bg-muted={i !== activeIndex}
						class:opacity-30={i !== activeIndex}
						onclick={() => {
							activeIndex = i;
							isAnimating = false;
						}}
						aria-label="Ver certificação {i + 1}"
					></button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Certifications List -->
	<div
		bind:this={listEl}
		class="flex flex-1 flex-col overflow-y-auto overscroll-contain"
		data-lenis-prevent
	>
		{#each items as item, i (item.name)}
			<div
				class="cert-item group relative flex items-center gap-3 px-6 py-3 transition-colors"
				style="opacity: 0"
			>
				<!-- Status icon -->
				{#if item.status === 'completed'}
					<IconSealCheck
						class="size-4 shrink-0 transition-colors duration-200 {i === activeIndex
							? 'text-success'
							: 'text-muted'}"
					/>
				{:else}
					<IconHourglassHigh
						class="size-4 shrink-0 transition-colors duration-200 {i === activeIndex
							? 'text-accent'
							: 'text-muted'}"
					/>
				{/if}

				<!-- Content -->
				<div class="flex min-w-0 flex-1 items-baseline justify-between gap-2">
					<span
						class="truncate text-sm transition-colors duration-200"
						class:text-fg={i === activeIndex}
						class:font-medium={i === activeIndex}
						class:text-muted={i !== activeIndex}
					>
						{item.name}
					</span>
					<span class="shrink-0 font-mono text-xs text-muted">
						{item.year}
					</span>
				</div>

				<!-- Hover background -->
				<div
					class="absolute inset-0 bg-overlay/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
				></div>
			</div>

			<!-- Divider -->
			{#if i < items.length - 1}
				<div class="mx-6 border-b border-border/5"></div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.featured-cert {
		transition:
			opacity 200ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.featured-enter {
		opacity: 1;
		transform: translateY(0);
	}

	.featured-exit {
		opacity: 0;
		transform: translateY(-6px);
	}

	@media (prefers-reduced-motion: reduce) {
		.featured-cert {
			transition: none;
		}

		.featured-exit {
			opacity: 1;
			transform: none;
		}
	}
</style>
