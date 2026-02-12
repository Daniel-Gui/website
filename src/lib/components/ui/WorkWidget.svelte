<script lang="ts">
	import IconArrowUpRight from '$lib/components/icons/icon-arrow-up-right.svelte';
	import Marquee from '$lib/components/marquee/marquee.svelte';

	interface WorkExperience {
		role: string;
		company: string;
		period: string;
		current?: boolean;
	}

	interface Props {
		title?: string;
		items: WorkExperience[];
		linkedinUrl: string;
		marqueeItems?: { id: string; name: string; src?: any }[];
		class?: string;
	}

	let {
		title = 'EXPERIÊNCIA',
		items,
		linkedinUrl,
		marqueeItems = [],
		class: className = ''
	}: Props = $props();
</script>

<div
	class="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/10 bg-surface/50 backdrop-blur-md {className}"
>
	<!-- Header -->
	<div class="flex items-center justify-between p-6 pb-4">
		<h2 class="font-mono text-xs font-medium tracking-widest text-muted uppercase">
			{title}
		</h2>
		<h3 class="font-mono text-sm text-muted">5 anos de carreira</h3>
	</div>

	<!-- List -->
	<div class="flex flex-col">
		{#each items as item, i}
			<div class="group relative flex items-start gap-4 px-6 py-4 transition-colors">
				<!-- Bullet Point -->
				<div class="mt-1.5 flex h-3 items-center">
					<div
						class="size-1.5 shrink-0 rounded-full transition-colors duration-300"
						class:bg-fg={item.current}
						class:shadow-[0_0_8px_rgba(0,0,0,0.2)]={item.current && !className.includes('dark')}
						class:dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]={item.current}
						class:bg-muted={!item.current}
						class:opacity-50={!item.current}
					></div>
				</div>

				<!-- Content Container -->
				<div
					class="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
				>
					<!-- Role & Company -->
					<div class="text-sm">
						<span
							class="block font-medium tracking-tight transition-colors sm:inline"
							class:text-fg={item.current}
							class:text-muted={!item.current}
						>
							{item.role}
						</span>
						<span
							class="block transition-colors sm:inline sm:before:text-muted sm:before:content-['at_']"
							class:text-fg={item.current}
							class:text-muted={!item.current}
						>
							<span class="sm:hidden">at</span>
							{item.company}
						</span>
					</div>

					<!-- Period -->
					<div
						class="font-mono text-xs whitespace-nowrap transition-colors"
						class:text-fg={item.current}
						class:text-muted={!item.current}
					>
						{item.period}
					</div>
				</div>

				<!-- Hover Effect Background -->
				<div
					class="absolute inset-0 bg-overlay/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
				></div>
			</div>

			<!-- Divider (except last) -->
			{#if i < items.length}
				<div class="mx-6 border-b border-border/5"></div>
			{/if}
		{/each}
	</div>

	<!-- Footer -->
	<div class="px-6 pt-4 pb-6">
		<a
			href={linkedinUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
		>
			Ver histórico completo
			<IconArrowUpRight
				class="size-3 opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
			/>
		</a>
	</div>

	<!-- Marquee Section -->
	{#if marqueeItems.length > 0}
		<div class="bg-subtle/30 border-t border-border/5 py-4">
			<Marquee items={marqueeItems} speed={40} class="mask-linear-to-r" />
		</div>
	{/if}
</div>
