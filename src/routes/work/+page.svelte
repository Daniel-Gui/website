<script lang="ts">
	import { resolve } from '$app/paths';
	import IconArrowLeft from '$lib/components/icons/icon-arrow-left.svelte';
	import IconArrowUpRight from '$lib/components/icons/icon-arrow-up-right.svelte';
	import WorkFilter from '$lib/components/ui/WorkFilter.svelte';
	import { TECH_ICONS } from '$lib/utils/icons';
	import type { PageData } from './$types';
	import type { WorkCategory } from '$lib/data/work-categories';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { data }: { data: PageData } = $props();
	let works = $derived(data.works);

	// Filtering State
	let activeFilter = $state<WorkCategory>('todos');

	let filteredWorks = $derived(
		activeFilter === 'todos' ? works : works.filter((work) => work.category === activeFilter)
	);
</script>

<svelte:head>
	<title>Trabalhos — Daniel Gui</title>
	<meta name="description" content="Trabalhos selecionados de design e desenvolvimento frontend." />
</svelte:head>

<main class="min-h-dvh bg-bg text-fg selection:bg-fg/10 selection:text-fg">
	<div class="container-page mx-auto max-w-5xl py-24 sm:py-32 md:px-6">
		<!-- Breadcrumb -->
		<nav class="mb-12 flex items-center gap-4 text-sm text-muted">
			<a
				href={resolve('/', {})}
				class="group focus-visible:ring-focus -ml-2 flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-surface hover:text-fg focus-visible:ring-2 focus-visible:outline-none"
				aria-label="Voltar para home"
			>
				<IconArrowLeft class="size-4 transition-transform group-hover:-translate-x-1" />
				Home
			</a>
			<span class="text-muted/60">/</span>
			<span class="font-medium text-fg">Trabalhos</span>
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
				<WorkFilter bind:activeFilter />
			</div>
		</header>

		<!-- Grid -->
		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
			{#each filteredWorks as work (work.slug)}
				<div animate:flip={{ duration: 400, easing: cubicOut }} in:fly={{ y: 20, duration: 400 }}>
					<a href={resolve(`/work/${work.slug}`, {})} class="group relative flex flex-col gap-4">
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
									{@const Icon = (TECH_ICONS as any)[tag]}
									<span class="tag">
										{#if Icon}
											<Icon class="mr-1.5 size-3" />
										{/if}
										{tag}
									</span>
								{/each}
							</div>
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
</main>
