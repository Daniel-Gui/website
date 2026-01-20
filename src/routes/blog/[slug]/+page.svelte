<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { animate, stagger } from 'motion';
	import IconArrowLeft from '$lib/components/icons/icon-arrow-left.svelte';
	import IconClock from '$lib/components/icons/icon-clock.svelte';
	import IconCopy from '$lib/components/icons/icon-copy.svelte';
	import IconCheck from '$lib/components/icons/icon-check.svelte';
	import IconSparkle from '$lib/components/icons/icon-sparkle.svelte';
	import IconShield from '$lib/components/icons/icon-shield.svelte';
	import IconArrowUp from '$lib/components/icons/icon-arrow-up.svelte';

	let { data }: { data: PageData } = $props();
	let post = $derived(data.post);

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
	<div class="container-page mx-auto max-w-4xl px-6 py-24 sm:py-32">
		<!-- Breadcrumb & Navigation -->
		<nav class="mb-12 flex items-center gap-4 text-sm text-muted" data-animate>
			<a
				href="/#blog"
				class="group -ml-2 flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-surface hover:text-fg focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
				aria-label="Voltar para o blog"
			>
				<IconArrowLeft class="size-4 transition-transform group-hover:-translate-x-1" />
				Knowledge Base
			</a>
			<span class="text-muted/60">/</span>
			<span class="font-medium text-fg">{post.tags[0] || 'Article'}</span>
		</nav>

		<!-- Header -->
		<header class="space-y-8" data-animate>
			<div class="space-y-6">
				<h1
					class="font-sans text-5xl font-bold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl"
					style:view-transition-name={`blog-title-${post.slug}`}
				>
					{post.title}
				</h1>
				<p class="max-w-2xl text-xl leading-relaxed text-balance text-muted">
					{post.excerpt}
				</p>
			</div>

			<!-- Author / Team -->
			<div class="flex items-center gap-3">
				<div
					class="flex items-center gap-2 rounded-full border border-border/10 bg-surface/50 px-3 py-1.5 pr-4 text-sm font-medium text-fg backdrop-blur-md"
				>
					<IconShield class="size-4" />
					<span>Daniel Gui</span>
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
						<span class="text-green-500">Copied</span>
					{:else}
						<IconCopy class="size-4" />
						<span>Copy page</span>
					{/if}
				</button>

				<button
					class="flex cursor-not-allowed items-center gap-2 rounded-md px-2 py-1 opacity-50 transition-colors hover:bg-surface focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
				>
					<IconSparkle class="size-4" />
					<span>Ask AI about this page</span>
				</button>

				<div class="ml-auto flex items-center gap-2 text-xs opacity-60">
					Last updated {formatDate(post.date)}
				</div>
			</div>
		</header>

		<!-- Content -->
		<article
			class="prose prose-lg mt-16 max-w-none dark:prose-invert
            prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-black dark:prose-headings:text-white
            prose-p:leading-relaxed prose-p:text-gray-800 dark:prose-p:text-neutral-300
            prose-a:text-black prose-a:decoration-black/30
            prose-a:underline-offset-4 hover:prose-a:decoration-black dark:prose-a:text-white dark:prose-a:decoration-white/30 dark:hover:prose-a:decoration-white prose-blockquote:border-l-black/20 prose-blockquote:text-gray-700
            dark:prose-blockquote:border-l-white/20 dark:prose-blockquote:text-neutral-400 prose-code:rounded-md prose-code:bg-black/5
            prose-code:px-1.5 prose-code:py-0.5 prose-code:text-gray-900 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-white/10 dark:prose-code:text-neutral-200 prose-li:text-gray-800 dark:prose-li:text-neutral-300
            prose-hr:border-black/10 dark:prose-hr:border-white/10"
			data-animate
		>
			<!-- Simulated Content based on the old one but stripped of "Lorem Ipsum" if possible or just reused -->
			<p class="lead mb-12 text-2xl font-medium text-black dark:text-white">
				{post.excerpt}
			</p>

			<p>
				Este artigo explora as nuances de {post.title} e como isso impacta o desenvolvimento moderno.
				Abaixo, detalhamos os principais desafios e soluções encontradas.
			</p>

			<h2>O Desafio</h2>
			<p>
				Ao lidar com sistemas complexos, frequentemente encontramos gargalos de performance que não
				são óbvios à primeira vista. A necessidade de otimização deve ser balanceada com a
				legibilidade e manutenção do código.
			</p>

			<blockquote>
				"A simplicidade é o último grau de sofisticação."
				<footer>— Leonardo da Vinci</footer>
			</blockquote>

			<h3>Required action</h3>
			<p>
				Para implementar as correções sugeridas, verifique as configurações do seu ambiente e
				certifique-se de que todas as dependências estão atualizadas.
			</p>
			<ul>
				<li>Audite suas dependências regularmente.</li>
				<li>Utilize ferramentas de análise estática.</li>
				<li>Monitore as métricas de Core Web Vitals.</li>
			</ul>

			<hr class="my-12 border-dashed border-white/20" />

			<h2>Conclusão</h2>
			<p>
				A evolução contínua das ferramentas de desenvolvimento web nos permite criar experiências
				cada vez mais ricas e performáticas. Mantenha-se atualizado e sempre questione as "melhores
				práticas" estabelecidas.
			</p>
		</article>

		<div class="mt-12 flex justify-end" data-animate>
			<button
				onclick={scrollToTop}
				class="group flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
				aria-label="Voltar ao topo"
			>
				Back to top
				<span
					class="grid size-6 place-items-center rounded-full border border-border/10 bg-surface/50 transition-colors group-hover:border-border/20 group-hover:bg-surface"
				>
					<IconArrowUp class="size-3.5" />
				</span>
			</button>
		</div>
	</div>
</main>
