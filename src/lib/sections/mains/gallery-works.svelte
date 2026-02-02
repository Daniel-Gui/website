<script lang="ts">
	import { tick } from 'svelte';
	import { resolve } from '$app/paths';
	import IconArrowUpRight from '$lib/components/icons/icon-arrow-up-right.svelte';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import type { WorkItem } from '../../types/schemas';
	import { WORK_CATEGORIES, type WorkCategory } from '$lib/data/work-categories';
	import WorkFilter from '$lib/components/ui/WorkFilter.svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { works }: { works: WorkItem[] } = $props();

	let sectionEl = $state<HTMLElement | null>(null);
	let revealed = $state(false);

	// Filtering State
	let activeFilter = $state<WorkCategory>('todos');

	let filteredWorks = $derived(
		activeFilter === 'todos' ? works : works.filter((work) => work.category === activeFilter)
	);

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (!sectionEl) return;
		if (revealed) return;

		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
		if (reduce) {
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
						const cards = sectionEl!.querySelectorAll<HTMLElement>('[data-gallery-card]');

						// Animate Header - timing rápido para não atrasar cards
						const headerAnim = animate(
							headerItems,
							{ opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] },
							{ duration: 0.5, delay: stagger(0.08), ease: [0.16, 1, 0.3, 1] }
						);

						// Set will-change before animation
						for (const card of cards) {
							card.style.willChange = 'opacity, transform';
						}

						// Animate Cards - overshoot para follow-through
						const cardAnim = animate(
							cards,
							{
								opacity: [0, 1],
								transform: [
									'translateY(24px) scale(0.97)',
									'translateY(-2px) scale(1.01)',
									'translateY(0px) scale(1)'
								]
							},
							{ duration: 0.65, delay: stagger(0.1, { startDelay: 0.15 }), ease: [0.16, 1, 0.3, 1] }
						);

						// Clean up all inline styles after animation
						await Promise.all([headerAnim.finished, cardAnim.finished]);
						for (const el of headerItems) {
							el.style.opacity = '';
							el.style.transform = '';
						}
						for (const card of cards) {
							card.style.opacity = '';
							card.style.transform = '';
							card.style.willChange = '';
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
					<WorkFilter bind:activeFilter />
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
		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
			{#each filteredWorks as work (work.slug)}
				<div animate:flip={{ duration: 400, easing: cubicOut }} in:fly={{ y: 20, duration: 400 }}>
					<a
						href={resolve(`/work/${work.slug}`, {})}
						class="group relative flex flex-col gap-4"
						class:gallery-hidden={!revealed}
						data-gallery-card
					>
						<!-- Card Visual -->
						<div
							class="media-container relative aspect-4/3"
							style:view-transition-name="work-image-{work.slug}"
						>
							<!-- Image -->
							{#if work.imageBasename}
								<picture class="h-full w-full">
									<source
										srcset="/images/works-covers/{work.imageBasename}.avif"
										type="image/avif"
									/>
									<source
										srcset="/images/works-covers/{work.imageBasename}.webp"
										type="image/webp"
									/>
									<img
										src="/images/works-covers/{work.imageBasename}.webp"
										alt={work.title}
										loading="lazy"
										class="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
									/>
								</picture>
							{/if}

							<!-- Overlay Gradient -->
							<div
								class="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							></div>

							<!-- Corner Accents (Technical) -->
							<div
								class="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-black opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100"
							>
								<IconArrowUpRight class="size-4" />
							</div>
						</div>

						<!-- Card Info -->
						<div class="space-y-3">
							<div class="divider-subtle flex items-center justify-between border-b pb-3">
								<div class="flex items-center gap-3">
									<span class="font-mono text-xs text-muted">/{work.slug}</span>
									<h3
										class="text-lg font-medium tracking-tight"
										style:view-transition-name="work-title-{work.slug}"
									>
										{work.title}
									</h3>
								</div>
								<span class="font-mono text-xs text-muted">{work.year}</span>
							</div>

							<p class="text-sm leading-relaxed text-pretty text-muted">
								{work.description}
							</p>

							<div class="flex flex-wrap gap-2 pt-1">
								{#each work.tags as tag (tag)}
									<TechBadge {tag} />
								{/each}
							</div>
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.gallery-hidden {
		opacity: 0;
		transform: translateY(16px);
	}

	a.gallery-hidden {
		transform: translateY(24px);
	}
</style>
