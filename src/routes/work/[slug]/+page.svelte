<script lang="ts">
	import { resolve } from '$app/paths';
	import IconArrowUpRight from '$lib/components/icons/icon-arrow-up-right.svelte';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import BackLink from '$lib/components/ui/BackLink.svelte';
	import BackToTop from '$lib/components/ui/BackToTop.svelte';
	import SEO from '$lib/components/seo/SEO.svelte';
	import type { PageData } from './$types';
	import type { Component } from 'svelte';
	import type { WorkItem } from '$lib/types/schemas';

	let { data }: { data: PageData & { Content: Component; work: WorkItem } } = $props();
	let work = $derived(data.work);
	let Content = $derived(data.Content);
</script>

<SEO
	title="{work.title} — Portfólio | Daniel Guimarães"
	description={work.description}
	type="creative_work"
	url="/work/{work.slug}"
	image={work.imageBasename ? `/images/works-covers/${work.imageBasename}.webp` : undefined}
	tags={work.tags}
	year={work.year}
/>

<main class="relative min-h-dvh pt-24 pb-12 sm:pt-32">
	<div class="container-page relative z-10">
		<div class="flex flex-col lg:flex-row lg:gap-16">
			<!-- Header Mobile (Aparece primeiro em telas pequenas) -->
			<div class="mb-8 block lg:hidden">
				<header class="space-y-6">
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<span class="font-mono text-sm tracking-widest text-accent uppercase">
									// {work.year}
								</span>
								{#if work.category}
									<span class="chip text-xs capitalize">
										{work.category}
									</span>
								{/if}
							</div>
							{#if work.link}
								<a
									href={resolve(work.link, {})}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 font-mono text-xs font-medium uppercase transition-colors hover:text-accent"
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
							<TechBadge {tag} class="px-2.5 py-1 text-xs" />
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
							class="media-container w-[85vw] shrink-0 snap-center lg:w-full"
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
								<div class="flex items-center gap-3">
									<span class="font-mono text-sm tracking-widest text-accent uppercase">
										// {work.year}
									</span>
									{#if work.category}
										<span class="chip text-xs capitalize">
											{work.category}
										</span>
									{/if}
								</div>
								{#if work.link}
									<a
										href={resolve(work.link, {})}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 font-mono text-xs font-medium uppercase transition-colors hover:text-accent"
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
								<TechBadge {tag} class="px-2.5 py-1 text-xs" />
							{/each}
						</div>
					</header>

					<!-- Conteúdo do Markdown -->
					<div class="prose max-w-none prose-neutral dark:prose-invert">
						<Content />
					</div>

					<!-- Navegação Voltar -->
					<div class="divider flex justify-between gap-2 border-t pt-8 sm:items-center">
						<BackLink href="/#trabalhos" label="Trabalhos selecionados" />
						<BackToTop />
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
