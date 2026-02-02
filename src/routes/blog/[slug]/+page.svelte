<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import IconClock from '$lib/components/icons/icon-clock.svelte';
	import IconCopy from '$lib/components/icons/icon-copy.svelte';
	import IconCheck from '$lib/components/icons/icon-check.svelte';
	import BackLink from '$lib/components/ui/BackLink.svelte';
	import BackToTop from '$lib/components/ui/BackToTop.svelte';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ContentBlurFade from '$lib/components/ui/ContentBlurFade.svelte';
	import SEO from '$lib/components/seo/SEO.svelte';
	import { getBlogAuthor } from '$lib/data/blog-authors';

	let { data }: { data: PageData } = $props();
	let post = $derived(data.post);
	let author = $derived(getBlogAuthor(post.authorId));

	let copied = $state(false);
	let pageUrl = $state('');
	let aiModalOpen = $state(false);
	let aiPromptCopied = $state(false);

	let markdownUrl = $derived(browser ? `${window.location.origin}/blog/${post.slug}.txt` : '');
	let aiPrompt = $derived(
		`Analise esta publicação e em seguida vamos debater sobre o conteúdo: ${markdownUrl}`
	);

	function formatDate(dateString: string) {
		if (!browser) return dateString;
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

	function copyAiPrompt() {
		navigator.clipboard.writeText(aiPrompt);
		aiPromptCopied = true;
		setTimeout(() => (aiPromptCopied = false), 2000);
	}

	$effect(() => {
		if (!browser) return;

		pageUrl = window.location.href;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		void (async () => {
			const { animate, stagger } = await import('motion');
			const elements = document.querySelectorAll('[data-animate]');
			animate(
				elements,
				{ opacity: [0, 1], y: [20, 0] },
				{ delay: stagger(0.1), duration: 0.6, ease: [0.16, 1, 0.3, 1] }
			);
		})();
	});
</script>

<SEO
	title="{post.title} — Blog | Daniel Guimarães"
	description={post.excerpt}
	type="article"
	url="/blog/{post.slug}"
	image="/images/blog-covers/{post.coverImageBasename}.webp"
	author={author.name}
	publishedDate={post.date}
	tags={post.tags}
/>

<main class="min-h-dvh bg-bg text-fg selection:bg-fg/10 selection:text-fg">
	<div class="container-page mx-auto max-w-4xl py-24 sm:py-32 md:px-6">
		<!-- Breadcrumb & Navigation -->
		<nav class="mb-12 flex items-center gap-4 text-sm text-muted" data-animate>
			<BackLink href="/#blog" label="Base de conhecimento" />
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
			<div class="flex flex-wrap items-center gap-3">
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

			{#if post.tags.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each post.tags as tag (tag)}
						<TechBadge {tag} />
					{/each}
				</div>
			{/if}

			<!-- Meta Info Row - funcionalidades -->
			<div
				class="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border/10 py-4 font-mono text-sm text-muted"
			>
				<div class="flex items-center gap-2">
					<IconClock class="size-4" />
					<span>{post.readTime}</span>
				</div>

				<button
					onclick={copyToClipboard}
					class="focus-visible:ring-focus -ml-2 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-surface hover:text-fg focus-visible:ring-2 focus-visible:outline-none"
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

				<button
					onclick={() => (aiModalOpen = true)}
					class="focus-visible:ring-focus flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-surface hover:text-fg focus-visible:ring-2 focus-visible:outline-none"
					aria-label="Conversar com IA sobre este post"
				>
					<svg
						class="size-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
						/>
					</svg>
					<span>Conversar com IA</span>
				</button>

				<div class="gap-2 text-xs opacity-60">
					Última atualização {formatDate(post.date)}
				</div>
			</div>
		</header>

		<!-- Content -->
		<article class="prose prose-lg mt-16 max-w-none dark:prose-invert" data-animate>
			<data.content />
		</article>

		<div class="mt-12 flex justify-end" data-animate>
			<BackToTop />
		</div>
	</div>
</main>

<ContentBlurFade />

<Modal bind:open={aiModalOpen} title="Conversar com IA">
	<div class="space-y-4">
		<p class="text-sm text-muted">
			Copie o prompt abaixo e cole no seu assistente de IA favorito (ChatGPT, Claude, etc.) para
			debater sobre este artigo.
		</p>

		<div class="bg-subtle rounded-lg border border-border/10 p-3">
			<p class="font-mono text-sm break-all text-fg">{aiPrompt}</p>
		</div>

		<button onclick={copyAiPrompt} class="btn w-full justify-center">
			{#if aiPromptCopied}
				<IconCheck class="size-4 text-green-500" />
				<span class="text-green-500">Prompt copiado!</span>
			{:else}
				<IconCopy class="size-4" />
				<span>Copiar prompt</span>
			{/if}
		</button>
	</div>
</Modal>
