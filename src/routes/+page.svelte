<script lang="ts">
	import Hero from '$lib/sections/headers/hero.svelte';
	import { onMount } from 'svelte';

	const noiseOpacity = 0.9;
	const noiseFocusY = '35%';
	const noiseFalloff = '70%';

	onMount(() => {
		if (typeof window === 'undefined') return;

		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
		const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
		if (reduce || coarse) return;

		let rafId = 0;
		let cancelled = false;
		let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;

		void (async () => {
			const { default: Lenis } = await import('lenis');
			if (cancelled) return;

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
			cancelled = true;
			if (rafId) window.cancelAnimationFrame(rafId);
			lenis?.destroy();
		};
	});
</script>

<main>
	<div
		class="noise"
		style={`--noise-opacity:${noiseOpacity}; --noise-focus-y:${noiseFocusY}; --noise-falloff:${noiseFalloff};`}
		aria-hidden="true"
	></div>
	<Hero />
</main>

<style>
	.noise {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 100;
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
