<script lang="ts">
	import { tick } from 'svelte';
	import IconArrowUpRight from '$lib/components/icons/icon-arrow-up-right.svelte';
	import { cn } from '$lib/utils';
	import { WORKS } from '$lib/data/works';

	let sectionEl = $state<HTMLElement | null>(null);
	let revealed = $state(false);

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

						const headerItems = sectionEl!.querySelectorAll('[data-gallery-header]');
						const cards = sectionEl!.querySelectorAll('[data-gallery-card]');

						// Animate Header
						animate(
							headerItems,
							{ opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
							{ duration: 0.6, delay: stagger(0.1), ease: [0.16, 1, 0.3, 1] }
						);

						// Animate Cards
						animate(
							cards,
							{
								opacity: [0, 1],
								transform: ['translateY(40px) scale(0.96)', 'translateY(0px) scale(1)']
							},
							{ duration: 0.8, delay: (i) => 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }
						);
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
	<!-- Decorative Grid Background -->
	<div class="pointer-events-none absolute inset-0 z-0 opacity-[0.03]" aria-hidden="true">
		<svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="gallery-grid" width="40" height="40" patternUnits="userSpaceOnUse">
					<path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#gallery-grid)" />
		</svg>
	</div>

	<div class="container-page relative z-10">
		<!-- Header -->
		<div class="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
			<div class="max-w-2xl space-y-4">
				<h2
					class="font-mono text-sm tracking-widest text-blue-600 uppercase"
					style="opacity: 0; transform: translateY(20px);"
					data-gallery-header
				>
					// Selected_Works
				</h2>
				<p
					class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
					style="opacity: 0; transform: translateY(20px);"
					data-gallery-header
				>
					Arquitetura de interfaces <br /> & sistemas complexos.
				</p>
			</div>
			<div
				class="hidden md:block"
				style="opacity: 0; transform: translateY(20px);"
				data-gallery-header
			>
				<span class="font-mono text-xs text-muted">
					[DISPLAYING: 01-0{WORKS.length}]
				</span>
			</div>
		</div>

		<!-- Grid -->
		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each WORKS as work}
				<a
					href={`/work/${work.id}`}
					class="group relative flex flex-col gap-4"
					style="opacity: 0; transform: translateY(40px);"
					data-gallery-card
				>
					<!-- Card Visual -->
					<div
						class="relative aspect-[4/3] overflow-hidden rounded-xl border border-black/5 bg-black/5 shadow-sm transition-all duration-500 ease-out group-hover:border-black/10 group-hover:shadow-md dark:border-white/10 dark:bg-white/5"
						style:view-transition-name="work-image-{work.id}"
					>
						<!-- Image -->
						{#if work.imageBasename}
							<picture class="h-full w-full">
								<source srcset="/images/works-covers/{work.imageBasename}.avif" type="image/avif" />
								<source srcset="/images/works-covers/{work.imageBasename}.webp" type="image/webp" />
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
							class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
						<div
							class="flex items-center justify-between border-b border-black/5 pb-3 dark:border-white/10"
						>
							<div class="flex items-center gap-3">
								<span class="font-mono text-xs text-muted">/{work.id}</span>
								<h3
									class="text-lg font-medium tracking-tight"
									style:view-transition-name="work-title-{work.id}"
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
							{#each work.tags as tag}
								<span
									class="inline-flex items-center rounded-md border border-black/5 bg-black/5 px-2 py-1 font-mono text-[10px] tracking-wide text-muted uppercase dark:border-white/10 dark:bg-white/5"
								>
									{tag}
								</span>
							{/each}
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
