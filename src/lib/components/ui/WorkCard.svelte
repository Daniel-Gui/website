<script lang="ts">
	import { resolve } from '$app/paths';
	import IconArrowUpRight from '$lib/components/icons/icon-arrow-up-right.svelte';
	import TechBadge from '$lib/components/ui/TechBadge.svelte';
	import type { WorkItem } from '$lib/types/schemas';

	interface Props {
		work: WorkItem;
		/** When true, card is hidden (for reveal animations) */
		hidden?: boolean;
		image?: any;
	}

	let { work, hidden = false, image = undefined }: Props = $props();
	let loaded = $state(false);
</script>

<a
	href={resolve(`/work/${work.slug}`, {})}
	class="group relative flex flex-col gap-4"
	class:card-hidden={hidden}
	data-work-card
>
	<!-- Card Visual -->
	<div
		class="media-container relative aspect-4/3 overflow-hidden rounded-xl border border-border/10 bg-overlay/5"
		style:view-transition-name="work-image-{work.slug}"
	>
		<!-- Image -->
		{#if image}
			<enhanced:img
				src={image}
				alt={work.title}
				loading="lazy"
				sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
				class="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105 {loaded
					? 'opacity-100'
					: 'opacity-0'}"
				onload={() => (loaded = true)}
			/>
		{:else if work.imageBasename}
			<!-- Fallback for legacy/missing images -->
			<picture class="h-full w-full">
				<source srcset="/images/works-covers/{work.imageBasename}.avif" type="image/avif" />
				<source srcset="/images/works-covers/{work.imageBasename}.webp" type="image/webp" />
				<img
					src="/images/works-covers/{work.imageBasename}.webp"
					alt={work.title}
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105 {loaded
						? 'opacity-100'
						: 'opacity-0'}"
					onload={() => (loaded = true)}
				/>
			</picture>
		{/if}

		<!-- Skeleton Loader -->
		{#if !loaded}
			<div
				class="absolute inset-0 animate-pulse bg-neutral-300 dark:bg-neutral-700"
				aria-hidden="true"
			></div>
		{/if}

		<!-- Overlay Gradient (decorative) -->
		<div
			class="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			aria-hidden="true"
		></div>

		<!-- Corner Icon (decorative) -->
		<div
			class="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-black opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100"
			aria-hidden="true"
		>
			<IconArrowUpRight class="size-4" />
		</div>
	</div>

	<!-- Card Info -->
	<div class="space-y-3">
		<div class="divider-subtle flex items-center justify-between border-b pb-3">
			<div class="flex items-center gap-3">
				<span class="font-mono text-xs text-muted">/{work.slug}</span>
				<h3
					class="text-lg font-medium tracking-tight"
					style:view-transition-name="work-title-{work.slug}"
				>
					{work.title}
				</h3>
			</div>
			<span class="font-mono text-xs text-muted">{work.year}</span>
		</div>

		<p class="text-sm leading-relaxed text-pretty text-muted">
			{work.description}
		</p>

		<div class="flex flex-wrap gap-2 pt-1">
			{#each work.tags as tag (tag)}
				<TechBadge {tag} />
			{/each}
		</div>
	</div>
</a>

<style>
	.card-hidden {
		opacity: 0;
		transform: translateY(24px);
	}
</style>
