<script lang="ts">
	import { tick, onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import IconArrowLeft from '$lib/components/icons/icon-arrow-left.svelte';
	import WorkFilter from '$lib/components/ui/WorkFilter.svelte';
	import WorkCard from '$lib/components/ui/WorkCard.svelte';
	import type { PageData } from './$types';
	import type { WorkCategory } from '$lib/data/work-categories';
	import type { WorkItem } from '$lib/types/schemas';
	import { animateCardsIn, animateCardsOut, prefersReducedMotion } from '$lib/utils/animate-cards';

	let { data }: { data: PageData } = $props();
	let works = $derived(data.works);

	let gridEl = $state<HTMLElement | null>(null);
	let revealed = $state(false);
	let mounted = $state(false);

	// Filtering State
	let activeFilter = $state<WorkCategory>('todos');
	let isAnimating = $state(false);

	// Separate state for what's actually rendered (controlled by animation)
	let animatedWorks = $state<WorkItem[]>([]);

	// Initialize on mount
	onMount(() => {
		mounted = true;
		animatedWorks =
			activeFilter === 'todos' ? works : works.filter((w) => w.category === activeFilter);
	});

	// Initial reveal animation (page load)
	$effect(() => {
		if (typeof window === 'undefined') return;
		if (revealed || !gridEl || !mounted) return;
		if (animatedWorks.length === 0) return;

		revealed = true;

		if (prefersReducedMotion()) {
			return;
		}

		void (async () => {
			await tick();
			const cards = gridEl!.querySelectorAll<HTMLElement>('[data-work-card]');
			await animateCardsIn(cards, { startDelay: 0.1 });
		})();
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

<svelte:head>
	<title>Trabalhos — Daniel Gui</title>
	<meta name="description" content="Trabalhos selecionados de design e desenvolvimento frontend." />
</svelte:head>

<main class="min-h-dvh bg-bg text-fg selection:bg-fg/10 selection:text-fg">
	<div class="container-page mx-auto py-24 sm:py-32 md:px-6">
		<!-- Breadcrumb -->
		<nav class="mb-12 flex items-center gap-4 text-sm text-muted" aria-label="Breadcrumb">
			<a
				href={resolve('/', {})}
				class="group focus-visible:ring-focus -ml-2 flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-surface hover:text-fg focus-visible:ring-2 focus-visible:outline-none"
			>
				<IconArrowLeft class="size-4 transition-transform group-hover:-translate-x-1" />
				Home
			</a>
			<span class="text-muted/60" aria-hidden="true">/</span>
			<span class="font-medium text-fg" aria-current="page">Trabalhos</span>
		</nav>

		<!-- Header -->
		<header class="mb-16 max-w-2xl space-y-6">
			<h1 class="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
				Trabalhos Selecionados
			</h1>
			<p class="text-lg leading-relaxed text-balance text-muted sm:text-xl">
				Arquitetura de interfaces e sistemas complexos. Projetos que unem design e tecnologia.
			</p>

			<!-- Filter -->
			<div class="mt-8">
				<WorkFilter {activeFilter} onchange={handleFilterChange} />
			</div>
		</header>

		<!-- Grid -->
		<div bind:this={gridEl} class="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
			{#each animatedWorks as work (work.slug)}
				<WorkCard {work} />
			{/each}
		</div>
	</div>
</main>
