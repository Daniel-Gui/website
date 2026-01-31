<script lang="ts">
	import { resolve } from '$app/paths';
	import IconArrowUpRight from '$lib/components/icons/icon-arrow-up-right.svelte';
	import IconArrowLeft from '$lib/components/icons/icon-arrow-left.svelte';
	import IconArrowUp from '$lib/components/icons/icon-arrow-up.svelte';
	import type { PageData } from './$types';
	import type { Component } from 'svelte';
	import type { WorkItem } from '$lib/types/schemas';

	let { data }: { data: PageData & { Content: Component; work: WorkItem } } = $props();
	let work = $derived(data.work);
	let Content = $derived(data.Content);

	function scrollToTop() {
		if (typeof window === 'undefined') return;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>{work.title} — Daniel Gui</title>
	<meta name="description" content={work.description} />
</svelte:head>

<main class="relative min-h-dvh pt-24 pb-12 sm:pt-32">
	<!-- Decorative Grid Background -->
	<div class="pointer-events-none absolute inset-0 z-0 opacity-[0.03]" aria-hidden="true">
		<svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="work-grid" width="40" height="40" patternUnits="userSpaceOnUse">
					<path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#work-grid)" />
		</svg>
	</div>

	<div class="container-page relative z-10">
		<div class="flex flex-col lg:flex-row lg:gap-16">
			<!-- Header Mobile (Aparece primeiro em telas pequenas) -->
			<div class="mb-8 block lg:hidden">
				<header class="space-y-6">
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="font-mono text-sm tracking-widest text-blue-600 uppercase">
								// {work.year}
							</span>
							{#if work.link}
								<a
									href={resolve(work.link, {})}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 font-mono text-xs font-medium uppercase transition-colors hover:text-blue-600"
								>
									Ver Projeto <IconArrowUpRight class="size-3" />
								</a>
							{/if}
						</div>
						<h1
							class="text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
							style:view-transition-name="work-title-{work.slug}"
						>
							{work.title}
						</h1>
					</div>

					<div class="flex flex-wrap gap-2">
						{#each work.tags as tag (tag)}
							<span
								class="inline-flex items-center rounded-md border border-black/5 bg-black/5 px-2.5 py-1 font-mono text-xs tracking-wide text-muted uppercase dark:border-white/10 dark:bg-white/5"
							>
								{tag}
							</span>
						{/each}
					</div>
				</header>
			</div>

			<!-- Esquerda: Galeria de Imagens -->
			<div class="flex-1 lg:space-y-12">
				<div
					class="scrollbar-hide ml-[calc(50%-50vw)] flex w-screen snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-8 lg:ml-0 lg:block lg:w-full lg:space-y-12 lg:overflow-visible lg:px-0 lg:pb-0"
				>
					{#each work.galleryImages as imageBasename, i (`${imageBasename}-${i}`)}
						<div
							class="w-[85vw] shrink-0 snap-center overflow-hidden rounded-xl border border-black/5 bg-black/5 shadow-sm lg:w-full dark:border-white/10 dark:bg-white/5"
							style:view-transition-name={i === 0 ? `work-image-${work.slug}` : undefined}
						>
							<picture class="block w-full">
								<source srcset="/images/works-covers/{imageBasename}.avif" type="image/avif" />
								<source srcset="/images/works-covers/{imageBasename}.webp" type="image/webp" />
								<img
									src="/images/works-covers/{imageBasename}.webp"
									alt={`${work.title} - Imagem ${i + 1}`}
									loading={i === 0 ? 'eager' : 'lazy'}
									class="h-auto w-full object-cover"
								/>
							</picture>
						</div>
					{/each}
				</div>
			</div>

			<!-- Direita: Informações (Sticky - Desktop / Abaixo - Mobile) -->
			<div class="mt-12 lg:mt-0 lg:w-[480px] lg:shrink-0">
				<div class="lg:sticky lg:top-32 lg:space-y-12">
					<!-- Header do Projeto (Desktop Only) -->
					<header class="hidden space-y-6 lg:block">
						<div class="space-y-2">
							<div class="flex items-center justify-between">
								<span class="font-mono text-sm tracking-widest text-blue-600 uppercase">
									// {work.year}
								</span>
								{#if work.link}
									<a
										href={resolve(work.link, {})}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 font-mono text-xs font-medium uppercase transition-colors hover:text-blue-600"
									>
										Ver Projeto <IconArrowUpRight class="size-3" />
									</a>
								{/if}
							</div>
							<h1
								class="text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
								style:view-transition-name="work-title-{work.slug}"
							>
								{work.title}
							</h1>
						</div>

						<div class="flex flex-wrap gap-2">
							{#each work.tags as tag (tag)}
								<span
									class="inline-flex items-center rounded-md border border-black/5 bg-black/5 px-2.5 py-1 font-mono text-xs tracking-wide text-muted uppercase dark:border-white/10 dark:bg-white/5"
								>
									{tag}
								</span>
							{/each}
						</div>
					</header>

					<!-- Conteúdo do Markdown -->
					<div class="prose max-w-none prose-neutral dark:prose-invert">
						<Content />
					</div>

					<!-- Navegação Voltar -->
					<div
						class="flex justify-between gap-2 border-t border-black/5 pt-8 sm:items-center dark:border-white/10"
					>
						<a
							href={resolve('/#trabalhos', {})}
							class="group -ml-2 flex w-fit items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-fg focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
							aria-label="Voltar para trabalhos"
						>
							<IconArrowLeft class="size-4 transition-transform group-hover:-translate-x-1" />
							Trabalhos selecionados
						</a>

						<button
							onclick={scrollToTop}
							class="group flex w-fit cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
							aria-label="Voltar ao topo"
						>
							Voltar ao topo
							<span
								class="grid size-6 place-items-center rounded-full border border-border/10 bg-surface/50 transition-colors group-hover:border-border/20 group-hover:bg-surface"
							>
								<IconArrowUp class="size-3.5" />
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
