<script lang="ts">
	import Hero from '$lib/sections/headers/hero.svelte';
	import GalleryWorks from '$lib/sections/mains/gallery-works.svelte';
	import GalleryPosts from '$lib/sections/mains/gallery-posts.svelte';
	import ogImageAsset from '$lib/assets/ogimage.webp';
	import { page } from '$app/state';
	import { lenis } from '$lib/utils/lenis.svelte';
	import type Lenis from 'lenis';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { works, posts } = $derived(data);

	const title = 'Daniel Gui — Product Design (UI/UX) & Frontend Developer';
	const description =
		'Portfólio de Daniel: projetos, experiência e contato como Frontend Developer e UI/UX Designer.';
	const siteName = 'Daniel Gui';
	const ogImage = ogImageAsset;

	$effect(() => {
		if (typeof window === 'undefined') return;

		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
		const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
		if (reduce || coarse) return;

		let rafId = 0;
		let instance: Lenis | null = null;

		void (async () => {
			const { default: LenisImpl } = await import('lenis');
			instance = new LenisImpl({ lerp: 0.12, smoothWheel: true });
			lenis.set(instance);

			const raf = (time: number) => {
				instance?.raf(time);
				rafId = window.requestAnimationFrame(raf);
			};
			rafId = window.requestAnimationFrame(raf);
		})();

		return () => {
			if (rafId) window.cancelAnimationFrame(rafId);
			instance?.destroy();
			lenis.set(null);
		};
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="index,follow" />
	<meta name="author" content="Daniel" />
	<link rel="canonical" href={page.url.origin + page.url.pathname} />

	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={page.url.origin + page.url.pathname} />
	<meta property="og:image" content={page.url.origin + ogImage} />
	<meta property="og:locale" content="pt_BR" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={page.url.origin + ogImage} />

	<meta name="theme-color" content="#05010a" />
</svelte:head>

<main>
	<Hero />
	<GalleryWorks {works} />
	<GalleryPosts {posts} />
</main>
