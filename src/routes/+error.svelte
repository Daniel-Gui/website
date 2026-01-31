<script lang="ts">
	import { resolve } from '$app/paths';
	import IconArrowLeft from '$lib/components/icons/icon-arrow-left.svelte';
	import { onMount } from 'svelte';
	import { animate } from 'motion';

	let containerEl = $state<HTMLElement | null>(null);

	onMount(() => {
		if (!containerEl) return;
		const elements = containerEl.querySelectorAll('[data-animate]');
		animate(
			elements,
			{ opacity: [0, 1], y: [20, 0] },
			{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
		);
	});
</script>

<svelte:head>
	<title>Página não encontrada — Daniel Gui</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="grid min-h-[80vh] place-items-center px-6 py-24 sm:py-32 lg:px-8">
	<div class="text-center" bind:this={containerEl}>
		<p class="text-accent font-mono text-base font-semibold" data-animate style="opacity: 0">404</p>
		<h1
			class="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-5xl"
			data-animate
			style="opacity: 0"
		>
			Página não encontrada
		</h1>
		<p class="text-muted-foreground mt-6 text-base leading-7" data-animate style="opacity: 0">
			Desculpe, não conseguimos encontrar a página que você está procurando.
		</p>
		<div class="mt-10 flex items-center justify-center gap-x-6" data-animate style="opacity: 0">
			<a
				href={resolve('/', {})}
				class="flex items-center gap-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
			>
				<IconArrowLeft class="size-4" />
				Voltar para o início
			</a>
		</div>
	</div>
</main>
