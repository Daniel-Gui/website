<script lang="ts">
	import Hero from '$lib/sections/headers/hero.svelte';
	import GalleryWorks from '$lib/sections/mains/gallery-works.svelte';
	import ogImageAsset from '$lib/assets/ogimage.webp';
	import { page } from '$app/stores';

	const title = 'Daniel Gui — Product Design (UI/UX) & Frontend Developer';
	const description =
		'Portfólio de Daniel: projetos, experiência e contato como Frontend Developer e UI/UX Designer.';
	const siteName = 'Daniel Gui';
	const ogImage = ogImageAsset;

	const noiseOpacity = 0.9;
	const noiseFocusY = '35%';
	const noiseFalloff = '70%';

	$effect(() => {
		if (typeof window === 'undefined') return;

		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
		const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
		if (reduce || coarse) return;

		let rafId = 0;
		let destroyed = false;
		let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;

		void (async () => {
			const { default: Lenis } = await import('lenis');
			if (destroyed) return;

			lenis = new Lenis({
				lerp: 0.12,
				smoothWheel: true
			});

			const raf = (time: number) => {
				lenis?.raf(time);
				rafId = window.requestAnimationFrame(raf);
			};
			rafId = window.requestAnimationFrame(raf);
		})();

		return () => {
			destroyed = true;
			if (rafId) window.cancelAnimationFrame(rafId);
			lenis?.destroy();
		};
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="index,follow" />
	<meta name="author" content="Daniel" />
	<link rel="canonical" href={$page.url.origin + $page.url.pathname} />

	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={$page.url.origin + $page.url.pathname} />
	<meta property="og:image" content={$page.url.origin + ogImage} />
	<meta property="og:locale" content="pt_BR" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={$page.url.origin + ogImage} />

	<meta name="theme-color" content="#05010a" />
</svelte:head>

<main>
	<div
		class="noise"
		style={`--noise-opacity:${noiseOpacity}; --noise-focus-y:${noiseFocusY}; --noise-falloff:${noiseFalloff};`}
		aria-hidden="true"
	></div>
	<Hero />
	<GalleryWorks />
</main>

<style>
	.noise {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: var(--z-overlay, 100);
		opacity: var(--noise-opacity, 0.06);
		mix-blend-mode: soft-light;
		filter: contrast(115%) brightness(100%);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
		background-repeat: repeat;
		-webkit-mask-image: radial-gradient(
			120% 70% at 50% var(--noise-focus-y, 35%),
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 1) var(--noise-falloff, 70%),
			rgba(0, 0, 0, 0) 100%
		);
		mask-image: radial-gradient(
			120% 70% at 50% var(--noise-focus-y, 35%),
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 1) var(--noise-falloff, 70%),
			rgba(0, 0, 0, 0) 100%
		);
	}

	@media (prefers-reduced-motion: reduce) {
		.noise {
			display: none;
		}
	}
</style>
