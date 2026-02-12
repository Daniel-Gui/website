<script lang="ts">
	import { tick } from 'svelte';
	import { resolve } from '$app/paths';
	import IconArrowUpRight from '$lib/components/icons/icon-arrow-up-right.svelte';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import type { PostItem } from '../../types/schemas';
	import PostCard from '$lib/components/ui/PostCard.svelte';

	let { posts }: { posts: PostItem[] } = $props();

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

						const headerItems = sectionEl!.querySelectorAll<HTMLElement>('[data-posts-header]');
						const cards = sectionEl!.querySelectorAll<HTMLElement>('[data-post-card]');

						// Animate Header - timing rápido para não atrasar cards
						const headerAnim = animate(
							headerItems,
							{ opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] },
							{ duration: 0.5, delay: stagger(0.08), ease: [0.16, 1, 0.3, 1] }
						);

						// Set will-change before animation
						for (const card of cards) {
							card.style.willChange = 'opacity, transform';
						}

						// Animate Cards - overshoot para follow-through
						const cardAnim = animate(
							cards,
							{
								opacity: [0, 1],
								transform: [
									'translateY(24px) scale(0.97)',
									'translateY(-2px) scale(1.01)',
									'translateY(0px) scale(1)'
								]
							},
							{
								duration: 0.65,
								delay: stagger(0.08, { startDelay: 0.12 }),
								ease: [0.16, 1, 0.3, 1]
							}
						);

						// Clean up all inline styles after animation
						await Promise.all([headerAnim.finished, cardAnim.finished]);
						for (const el of headerItems) {
							el.style.opacity = '';
							el.style.transform = '';
						}
						for (const card of cards) {
							card.style.opacity = '';
							card.style.transform = '';
							card.style.willChange = '';
						}
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
	id="blog"
	class="relative overflow-hidden py-24 sm:py-32"
	aria-label="Artigos recentes"
>
	<div class="container-page relative z-10">
		<!-- Header -->
		<div class="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
			<div class="max-w-2xl space-y-4">
				<h2
					class="font-mono text-sm tracking-widest text-accent uppercase"
					class:gallery-hidden={!revealed}
					data-posts-header
				>
					// Artigos_Recentes
				</h2>
				<p
					class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
					class:gallery-hidden={!revealed}
					data-posts-header
				>
					Explorando tecnologia, <br /> design e engenharia.
				</p>
			</div>
			<div class="hidden md:block" class:gallery-hidden={!revealed} data-posts-header>
				<a
					href={resolve('/blog', {})}
					class="group inline-flex items-center gap-2 font-mono text-xs transition-colors hover:text-accent"
				>
					[VER_TODOS] <IconArrowUpRight class="size-3" />
				</a>
			</div>
		</div>

		<!-- Posts List -->
		<div class="grid gap-6 md:grid-cols-2">
			{#each posts.slice(0, 6) as post (post.slug)}
				<PostCard {post} hidden={!revealed} />
			{/each}
		</div>

		<!-- Mobile View All Link -->
		<div class="mt-8 md:hidden" class:gallery-hidden={!revealed} data-posts-header>
			<a
				href={resolve('/blog', {})}
				class="group inline-flex items-center gap-2 font-mono text-xs transition-colors hover:text-accent"
			>
				[VER_TODOS] <IconArrowUpRight class="size-3" />
			</a>
		</div>
	</div>
</section>

<style>
	.gallery-hidden {
		opacity: 0;
		transform: translateY(16px);
	}
</style>
