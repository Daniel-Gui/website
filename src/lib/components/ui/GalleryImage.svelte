<script lang="ts">
	interface Props {
		image: any;
		basename?: string;
		alt: string;
		loading?: 'eager' | 'lazy';
		class?: string;
		style?: string;
	}

	let { image, basename, alt, loading = 'lazy', class: className, style }: Props = $props();
	let loaded = $state(false);
</script>

<div class={`bg-surface-2 relative overflow-hidden ${className}`} {style}>
	{#if image}
		<enhanced:img
			src={image}
			{alt}
			{loading}
			sizes="(max-width: 768px) 90vw, (max-width: 1024px) 80vw, 1200px"
			class="h-full w-full object-cover transition-opacity duration-700 {loaded
				? 'opacity-100'
				: 'opacity-0'}"
			onload={() => (loaded = true)}
		/>
	{:else if basename}
		<picture class="h-full w-full">
			<source srcset="/images/works-covers/{basename}.avif" type="image/avif" />
			<source srcset="/images/works-covers/{basename}.webp" type="image/webp" />
			<img
				src="/images/works-covers/{basename}.webp"
				{alt}
				{loading}
				class="h-full w-full object-cover transition-opacity duration-700 {loaded
					? 'opacity-100'
					: 'opacity-0'}"
				onload={() => (loaded = true)}
			/>
		</picture>
	{/if}

	{#if !loaded}
		<div
			class="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-800"
			aria-hidden="true"
		></div>
	{/if}
</div>
