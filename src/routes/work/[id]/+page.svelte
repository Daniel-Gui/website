<script lang="ts">
	import IconArrowUpRight from '$lib/components/icons/icon-arrow-up-right.svelte';
	import { cn } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { work } = data;
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
			<!-- Esquerda: Galeria de Imagens -->
			<div class="flex-1 space-y-8 lg:space-y-12">
				{#each work.galleryImages as imageBasename, i}
					<div
						class="overflow-hidden rounded-xl border border-black/5 bg-black/5 shadow-sm dark:border-white/10 dark:bg-white/5"
						style:view-transition-name={i === 0 ? `work-image-${work.id}` : undefined}
					>
						<picture class="block w-full">
							<source srcset="/images/works-covers/{imageBasename}.avif" type="image/avif" />
							<source srcset="/images/works-covers/{imageBasename}.webp" type="image/webp" />
							<img
								src="/images/works-covers/{imageBasename}.webp"
								alt={`${work.title} - View ${i + 1}`}
								loading={i === 0 ? 'eager' : 'lazy'}
								class="h-auto w-full object-cover"
							/>
						</picture>
					</div>
				{/each}
			</div>

			<!-- Direita: Informações (Sticky) -->
			<div class="lg:w-[420px] lg:shrink-0">
				<div class="sticky top-32 space-y-12">
					<!-- Header do Projeto -->
					<header class="space-y-6">
						<div class="space-y-2">
							<div class="flex items-center justify-between">
								<span class="font-mono text-sm tracking-widest text-blue-600 uppercase">
									// {work.year}
								</span>
								<a
									href={work.link}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 font-mono text-xs font-medium uppercase transition-colors hover:text-blue-600"
								>
									Live Preview <IconArrowUpRight class="size-3" />
								</a>
							</div>
							<h1
								class="text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
								style:view-transition-name="work-title-{work.id}"
							>
								{work.title}
							</h1>
						</div>

						<div class="flex flex-wrap gap-2">
							{#each work.tags as tag}
								<span
									class="inline-flex items-center rounded-md border border-black/5 bg-black/5 px-2.5 py-1 font-mono text-xs tracking-wide text-muted uppercase dark:border-white/10 dark:bg-white/5"
								>
									{tag}
								</span>
							{/each}
						</div>
					</header>

					<!-- Conteúdo Detalhado -->
					<div class="space-y-10 text-muted-foreground">
						<section class="space-y-3">
							<h2 class="font-mono text-xs font-semibold tracking-widest text-foreground uppercase">
								[01] Overview
							</h2>
							<p class="text-pretty leading-relaxed">
								{work.description}
							</p>
						</section>

						<section class="space-y-3">
							<h2 class="font-mono text-xs font-semibold tracking-widest text-foreground uppercase">
								[02] The Challenge
							</h2>
							<p class="text-pretty leading-relaxed">
								{work.details.challenge}
							</p>
						</section>

						<section class="space-y-3">
							<h2 class="font-mono text-xs font-semibold tracking-widest text-foreground uppercase">
								[03] Solution & Impact
							</h2>
							<div class="space-y-4">
								<p class="text-pretty leading-relaxed">
									{work.details.solution}
								</p>
								<p class="text-pretty leading-relaxed">
									{work.details.result}
								</p>
							</div>
						</section>
					</div>

					<!-- Navegação Voltar -->
					<div class="pt-8 border-t border-black/5 dark:border-white/10">
						<a
							href="/#trabalhos"
							class="group inline-flex items-center gap-2 font-mono text-sm transition-colors hover:text-blue-600"
						>
							← Back to Selected_Works
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
