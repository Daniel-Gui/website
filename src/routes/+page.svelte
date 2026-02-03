<script lang="ts">
	import Hero from '$lib/sections/headers/hero.svelte';
	import GalleryWorks from '$lib/sections/mains/gallery-works.svelte';
	import GalleryPosts from '$lib/sections/mains/gallery-posts.svelte';
	import SEO from '$lib/components/seo/SEO.svelte';
	import ogImageAsset from '$lib/assets/ogimage.webp';
	import { lenis } from '$lib/utils/lenis.svelte';
	import type Lenis from 'lenis';
	import type { PageData } from './$types';
	import { SOCIAL_LINKS } from '$lib/data/links';
	import WorkWidget from '$lib/components/ui/WorkWidget.svelte';

	let { data }: { data: PageData } = $props();
	let { works, posts } = $derived(data);

	const workExperience = [
		{
			role: 'Front-end developer / UX & UI Designer',
			company: 'Ei, beleza?',
			period: '2022 — o momento',
			current: true
		},
		{
			role: 'Front-end developer / UI Designer',
			company: 'Sartec Sistemas',
			period: '2021 — 2022'
		},
		{
			role: 'Front-end developer (Estágio)',
			company: 'Sartec Sistemas',
			period: '2019 — 2020'
		}
	];

	const title = 'Daniel Gui — Product Design (UI/UX) & Frontend Developer';
	const description =
		'Portfólio de Daniel: projetos, experiência e contato como Frontend Developer e UI/UX Designer.';
	const tags = [
		'UI/UX Design',
		'Frontend Development',
		'Svelte',
		'React',
		'Design Systems',
		'Product Design'
	];

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

<SEO {title} {description} type="profile" url="/" image={ogImageAsset} {tags} />

<svelte:head>
	<meta name="robots" content="index,follow" />
	<meta name="theme-color" content="#05010a" />
</svelte:head>

<main>
	<Hero />
	<GalleryWorks {works} />
	<WorkWidget
		items={workExperience}
		linkedinUrl={SOCIAL_LINKS.LINKEDIN}
		class="mx-auto max-w-2xl"
	/>
	<GalleryPosts {posts} />
</main>
