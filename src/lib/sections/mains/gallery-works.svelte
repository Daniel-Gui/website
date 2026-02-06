<script lang="ts">
	import { tick, onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import IconArrowUpRight from '$lib/components/icons/icon-arrow-up-right.svelte';
	import WorkCard from '$lib/components/ui/WorkCard.svelte';
	import type { WorkItem } from '../../types/schemas';
	import { type WorkCategory } from '$lib/data/work-categories';
	import WorkFilter from '$lib/components/ui/WorkFilter.svelte';
	import { animateCardsIn, animateCardsOut, prefersReducedMotion } from '$lib/utils/animate-cards';

	let { works }: { works: WorkItem[] } = $props();

	let sectionEl = $state<HTMLElement | null>(null);
	let gridEl = $state<HTMLElement | null>(null);
	let revealed = $state(false);
	let mounted = $state(false);

	// Filtering State
	let activeFilter = $state<WorkCategory>('todos');
	let isAnimating = $state(false);

	// Use $derived for displayedWorks - simpler and no loops
	let displayedWorks = $derived.by(() => {
		// Only compute after mount to avoid hydration issues
		if (!mounted) return works;
		return activeFilter === 'todos'
			? works
			: works.filter((work) => work.category === activeFilter);
	});

	// Track displayed works for animation (separate from derived)
	let animatedWorks = $state<WorkItem[]>([]);

	// Initialize on mount
	onMount(() => {
		mounted = true;
		animatedWorks = displayedWorks;
	});

	// Reveal animation on scroll into view
	$effect(() => {
		if (typeof window === 'undefined') return;
		if (!sectionEl) return;
		if (revealed) return;
		if (!mounted) return;

		if (prefersReducedMotion()) {
			revealed = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting) {
					void (async () => {
						const { animate, stagger } = await import('motion');
						revealed = true;
						await tick();

						const headerItems = sectionEl!.querySelectorAll<HTMLElement>('[data-gallery-header]');
						const cards = sectionEl!.querySelectorAll<HTMLElement>('[data-work-card]');

						// Set will-change for header items (layer promotion)
						for (const el of headerItems) {
							el.style.willChange = 'opacity, transform';
						}

						// Animate Header - uses transform+opacity only (compositor)
						const headerAnim = animate(
							headerItems,
							{ opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] },
							{ duration: 0.5, delay: stagger(0.08), ease: [0.16, 1, 0.3, 1] }
						);

						// Animate cards using shared utility
						await animateCardsIn(cards, { startDelay: 0.15 });

						// Clean up header styles (remove will-change)
						await headerAnim.finished;
						for (const el of headerItems) {
							el.style.opacity = '';
							el.style.transform = '';
							el.style.willChange = '';
						}
					})();
					observer.disconnect();
				}
			},
			{ threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
		);

		observer.observe(sectionEl);

		return () => observer.disconnect();
	});

	// Handle filter change with animation - called imperatively from WorkFilter
	async function handleFilterChange(newFilter: WorkCategory) {
		if (isAnimating || !revealed || !gridEl || newFilter === activeFilter) {
			return;
		}

		isAnimating = true;

		// 1. Animate OUT current cards
		const currentCards = gridEl.querySelectorAll<HTMLElement>('[data-work-card]');
		await animateCardsOut(currentCards);

		// 2. Update filter and animated works AFTER exit animation
		activeFilter = newFilter;
		const newWorks = newFilter === 'todos' ? works : works.filter((w) => w.category === newFilter);
		animatedWorks = newWorks;

		// 3. Wait for Svelte to render new cards
		await tick();

		// 4. Animate IN new cards
		const newCards = gridEl.querySelectorAll<HTMLElement>('[data-work-card]');
		await animateCardsIn(newCards);

		isAnimating = false;
	}
</script>

<section
	bind:this={sectionEl}
	id="trabalhos"
	class="relative overflow-hidden py-24 sm:py-32"
	aria-label="Trabalhos selecionados"
>
	<div class="container-page relative z-10">
		<!-- Header -->
		<div class="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
			<div class="max-w-2xl space-y-4">
				<h2
					class="font-mono text-sm tracking-widest text-accent uppercase"
					class:gallery-hidden={!revealed}
					data-gallery-header
				>
					// Trabalhos_Selecionados
				</h2>
				<p
					class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
					class:gallery-hidden={!revealed}
					data-gallery-header
				>
					Arquitetura de interfaces <br /> & sistemas complexos.
				</p>

				<!-- Filter -->
				<div class="mt-6" class:gallery-hidden={!revealed} data-gallery-header>
					<WorkFilter {activeFilter} onchange={handleFilterChange} />
				</div>
			</div>

			<div class="hidden md:block" class:gallery-hidden={!revealed} data-gallery-header>
				<a
					href={resolve('/work', {})}
					class="group inline-flex items-center gap-2 font-mono text-xs transition-colors hover:text-accent"
				>
					[VER_TODOS] <IconArrowUpRight class="size-3" />
				</a>
			</div>
		</div>

		<!-- Grid -->
		<div bind:this={gridEl} class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
			{#each animatedWorks as work (work.slug)}
				<WorkCard {work} hidden={!revealed} />
			{/each}
		</div>
	</div>
</section>

<style>
	.gallery-hidden {
		opacity: 0;
		transform: translateY(16px);
	}
</style>
