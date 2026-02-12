<script lang="ts">
	import { resolve } from '$app/paths';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import type { PostItem } from '$lib/types/schemas';
	import { getBlogCover } from '$lib/data/blog-images';

	type Props = {
		post: PostItem;
		hidden?: boolean;
	};

	let { post, hidden = false }: Props = $props();
	let loaded = $state(false);

	function formatDate(dateString: string) {
		if (typeof window === 'undefined') return dateString;
		return new Intl.DateTimeFormat('pt-BR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(new Date(dateString));
	}

	let coverImage = $derived(getBlogCover(post.coverImageBasename));
</script>

<article
	class="card-interactive group relative flex flex-col gap-6 p-4 sm:p-5"
	class:card-hidden={hidden}
	data-post-card
>
	<!-- Cover Image (Visible) -->
	<div
		class="bg-subtle relative aspect-2/1 w-full overflow-hidden rounded-lg"
		style:view-transition-name={`blog-cover-${post.slug}`}
	>
		{#if coverImage}
			<enhanced:img
				src={coverImage}
				alt=""
				loading="lazy"
				sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
				class="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105 {loaded
					? 'opacity-100'
					: 'opacity-0'}"
				onload={() => (loaded = true)}
			/>
		{/if}

		<!-- Skeleton Loader -->
		{#if !loaded}
			<div
				class="absolute inset-0 animate-pulse bg-neutral-300 dark:bg-neutral-700"
				aria-hidden="true"
			></div>
		{/if}
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

			<p class="line-clamp-2 text-sm leading-relaxed text-muted">
				{post.excerpt}
			</p>

			{#if post.tags.length > 0}
				<div class="flex flex-wrap gap-2 pt-1">
					{#each post.tags as tag (tag)}
						<TechBadge {tag} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</article>

<style>
	.card-hidden {
		opacity: 0;
		transform: translateY(24px);
	}
</style>
