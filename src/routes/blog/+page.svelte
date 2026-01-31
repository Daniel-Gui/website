<script lang="ts">
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';
	import IconArrowLeft from '$lib/components/icons/icon-arrow-left.svelte';
	import IconArrowUpRight from '$lib/components/icons/icon-arrow-up-right.svelte';
	import { tick } from 'svelte';

	let { data }: { data: PageData } = $props();
	let posts = $derived(data.posts);

	let containerEl = $state<HTMLElement | null>(null);

	function formatDate(dateString: string) {
		if (typeof window === 'undefined') return dateString;
		return new Intl.DateTimeFormat('pt-BR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(new Date(dateString));
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (!containerEl) return;

		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
		if (reduce) return;

		void (async () => {
			const { animate, stagger } = await import('motion');
			await tick();

			const headerItems = containerEl!.querySelectorAll('[data-blog-header]');
			const cards = containerEl!.querySelectorAll('[data-blog-card]');

			animate(
				headerItems,
				{ opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
				{ duration: 0.6, delay: stagger(0.1), ease: [0.16, 1, 0.3, 1] }
			);

			animate(
				cards,
				{
					opacity: [0, 1],
					transform: ['translateY(40px) scale(0.96)', 'translateY(0px) scale(1)']
				},
				{ duration: 0.8, delay: stagger(0.1, { startDelay: 0.2 }), ease: [0.16, 1, 0.3, 1] }
			);
		})();
	});
</script>

<svelte:head>
	<title>Blog — Daniel Gui</title>
	<meta
		name="description"
		content="Artigos sobre desenvolvimento frontend, design system e engenharia de software."
	/>
</svelte:head>

<main class="min-h-dvh bg-bg text-fg selection:bg-fg/10 selection:text-fg">
	<div class="container-page mx-auto max-w-5xl py-24 sm:py-32 md:px-6" bind:this={containerEl}>
		<!-- Breadcrumb -->
		<nav
			class="mb-12 flex items-center gap-4 text-sm text-muted"
			data-blog-header
			style="opacity: 0"
		>
			<a
				href={resolve('/', {})}
				class="group focus-visible:ring-focus -ml-2 flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-surface hover:text-fg focus-visible:ring-2 focus-visible:outline-none"
				aria-label="Voltar para home"
			>
				<IconArrowLeft class="size-4 transition-transform group-hover:-translate-x-1" />
				Home
			</a>
			<span class="text-muted/60">/</span>
			<span class="font-medium text-fg">Blog</span>
		</nav>

		<!-- Header -->
		<header class="mb-16 max-w-2xl space-y-6" data-blog-header style="opacity: 0">
			<h1 class="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
				Base de Conhecimento
			</h1>
			<p class="text-lg leading-relaxed text-balance text-muted sm:text-xl">
				Explorando tecnologia, design e engenharia através de artigos, tutoriais e estudos de caso.
			</p>
		</header>

		<!-- Posts Grid -->
		<div class="grid gap-6 md:grid-cols-2">
			{#each posts as post (post.slug)}
				<article
					class="card-interactive group relative flex flex-col gap-6 p-4 sm:p-5"
					data-blog-card
				>
					<!-- Cover Image -->
					<div
						class="bg-subtle relative aspect-2/1 w-full overflow-hidden rounded-lg"
						style:view-transition-name={`blog-cover-${post.slug}`}
					>
						<picture class="absolute inset-0 h-full w-full">
							<source
								srcset="/images/blog-covers/{post.coverImageBasename}.avif"
								type="image/avif"
							/>
							<source
								srcset="/images/blog-covers/{post.coverImageBasename}.webp"
								type="image/webp"
							/>
							<img
								src="/images/blog-covers/{post.coverImageBasename}.webp"
								alt=""
								loading="lazy"
								class="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
							/>
						</picture>
					</div>

					<div class="flex flex-1 flex-col justify-between gap-4">
						<div class="space-y-3">
							<div class="text-muted-foreground flex items-center justify-between text-xs">
								<div class="flex items-center gap-2">
									<span class="font-mono uppercase">{post.tags[0]}</span>
									<span class="text-black/20 dark:text-white/20">/</span>
									<time datetime={post.date} class="font-mono">
										{formatDate(post.date)}
									</time>
								</div>
							</div>

							<h3
								class="text-lg font-semibold tracking-tight text-balance transition-colors group-hover:text-accent sm:text-xl"
								style:view-transition-name={`blog-title-${post.slug}`}
							>
								<a
									href={resolve(`/blog/${post.slug}`, {})}
									class="before:absolute before:inset-0 focus:outline-none"
								>
									{post.title}
								</a>
							</h3>

							<p class="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
								{post.excerpt}
							</p>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</main>
