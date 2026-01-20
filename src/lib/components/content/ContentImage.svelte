<script lang="ts">
	type Props = {
		data: {
			src: string;
			alt: string;
			caption?: string;
		};
	};
	let { data }: Props = $props();

	// Assume src is basename without extension, e.g., 'image-01'
	// and images are in /images/blog-content/
	const basePath = '/images/blog-content';
</script>

<figure class="my-10">
	<div class="overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
		<picture>
			<source srcset="{basePath}/{data.src}.avif" type="image/avif" />
			<source srcset="{basePath}/{data.src}.webp" type="image/webp" />
			<img
				src="{basePath}/{data.src}.webp"
				alt={data.alt}
				loading="lazy"
				class="w-full object-cover"
			/>
		</picture>
	</div>
	{#if data.caption}
		<figcaption class="mt-3 text-center text-sm text-gray-500 dark:text-neutral-400">
			{data.caption}
		</figcaption>
	{/if}
</figure>
