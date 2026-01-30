<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { animate, stagger } from 'motion';
	import { resolve } from '$app/paths';
	import IconArrowLeft from '$lib/components/icons/icon-arrow-left.svelte';
	import IconClock from '$lib/components/icons/icon-clock.svelte';
	import IconCopy from '$lib/components/icons/icon-copy.svelte';
	import IconCheck from '$lib/components/icons/icon-check.svelte';
	import IconArrowUp from '$lib/components/icons/icon-arrow-up.svelte';
	import { getBlogAuthor } from '$lib/data/blog-authors';
	import ContentRenderer from '$lib/components/content/ContentRenderer.svelte';

	let { data }: { data: PageData } = $props();
	let post = $derived(data.post);
	let author = $derived(getBlogAuthor(post.authorId));

	let copied = $state(false);
	let pageUrl = $state('');

	function formatDate(dateString: string) {
		if (typeof window === 'undefined') return dateString;
		return new Intl.DateTimeFormat('pt-BR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(dateString));
	}

	function copyToClipboard() {
		if (!pageUrl) return;
		navigator.clipboard.writeText(pageUrl);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function scrollToTop() {
		if (typeof window === 'undefined') return;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => {
		pageUrl = window.location.href;

		const elements = document.querySelectorAll('[data-animate]');
		animate(
			elements,
			{ opacity: [0, 1], y: [20, 0] },
			{ delay: stagger(0.1), duration: 0.6, ease: [0.16, 1, 0.3, 1] }
		);
	});
</script>

<svelte:head>
	<title>{post.title} — Blog</title>
	<meta name="description" content={post.excerpt} />
</svelte:head>

<main class="min-h-dvh bg-bg text-fg selection:bg-fg/10 selection:text-fg">
	<div class="container-page mx-auto max-w-4xl py-24 sm:py-32 md:px-6">
		<!-- Breadcrumb & Navigation -->
		<nav class="mb-12 flex items-center gap-4 text-sm text-muted" data-animate>
			<a
				href={resolve('/#blog', {})}
				class="group -ml-2 flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-surface hover:text-fg focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
				aria-label="Voltar para o blog"
			>
				<IconArrowLeft class="size-4 transition-transform group-hover:-translate-x-1" />
				Base de conhecimento
			</a>
			<span class="text-muted/60">/</span>
			<span class="font-medium text-fg">{post.tags[0] || 'Artigo'}</span>
		</nav>

		<!-- Header -->
		<header class="space-y-8" data-animate>
			<div class="space-y-6">
				<h1
					class="font-sans text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
					style:view-transition-name={`blog-title-${post.slug}`}
				>
					{post.title}
				</h1>
				<p class="max-w-2xl text-lg leading-relaxed text-balance text-muted sm:text-xl">
					{post.excerpt}
				</p>
			</div>

			<!-- Author / Team -->
			<div class="flex items-center gap-3">
				<div
					class="flex items-center gap-2 rounded-full border border-border/10 bg-surface/50 px-3 py-1.5 pr-4 text-sm font-medium text-fg backdrop-blur-md"
				>
					<picture
						class="relative size-7 overflow-hidden rounded-full border border-border/10 bg-surface/70"
					>
						<source
							srcset={`/images/blog-authors/${author.avatarBasename}.avif`}
							type="image/avif"
						/>
						<source
							srcset={`/images/blog-authors/${author.avatarBasename}.webp`}
							type="image/webp"
						/>
						<img
							src={`/images/blog-authors/${author.avatarBasename}.webp`}
							alt={`Foto de ${author.name}`}
							loading="lazy"
							decoding="async"
							class="h-full w-full object-cover"
						/>
					</picture>
					<span>{author.name}</span>
				</div>
			</div>

			<!-- Meta Info Row -->
			<div
				class="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border/10 py-4 font-mono text-sm text-muted"
			>
				<div class="flex items-center gap-2">
					<IconClock class="size-4" />
					<span>{post.readTime}</span>
				</div>

				<button
					onclick={copyToClipboard}
					class="-ml-2 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-surface hover:text-fg focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
					aria-label="Copiar link da página"
				>
					{#if copied}
						<IconCheck class="size-4 text-green-500" />
						<span class="text-green-500">Copiado</span>
					{:else}
						<IconCopy class="size-4" />
						<span>Copiar página</span>
					{/if}
				</button>

				<div class="ml-auto flex items-center gap-2 text-xs opacity-60">
					Última atualização {formatDate(post.date)}
				</div>
			</div>
		</header>

		<!-- Content -->
		<article class="prose prose-lg mt-16 max-w-none dark:prose-invert" data-animate>
			{#if post.content}
				<ContentRenderer blocks={post.content} />
			{:else}
				<p class="text-muted">Conteúdo em construção...</p>
			{/if}
		</article>

		<div class="mt-12 flex justify-end" data-animate>
			<button
				onclick={scrollToTop}
				class="group flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
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
</main>
