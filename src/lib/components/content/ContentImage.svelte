<script lang="ts">
	import { getBlogContentImage, getBlogCover } from '$lib/data/blog-images';

	function getBasename(path: string) {
		// Remove query params if any
		const cleanPath = path.split('?')[0];
		const parts = cleanPath.split('/');
		const filename = parts[parts.length - 1];
		// Handle filename with multiple dots if needed, but for now simple split
		return filename.split('.')[0];
	}

	type Props = {
		data: {
			src: string;
			alt: string;
			caption?: string;
			sourceType?: 'local' | 'external';
		};
	};
	let { data }: Props = $props();

	// Check if src has an extension (simple check for . at the end)
	// If it has an extension, we treat it as a direct file path even if local.
	// If it doesn't have an extension and is local, we try to use the picture tag with avif/webp.
	let hasExtension = $derived(data.src.match(/\.[0-9a-z]+$/i));
	let isExternal = $derived(data.sourceType === 'external' || data.src.startsWith('http'));

	// Try to find image in content first, then covers (as fallback)
	// Try to find image in content first, then covers (as fallback)
	let localImage = $derived.by(() => {
		if (isExternal) return null;
		const basename = getBasename(data.src);
		// console.log('ContentImage processing:', { src: data.src, basename });
		const img = getBlogContentImage(basename) || getBlogCover(basename);
		// console.log('ContentImage result:', img);
		return img;
	});
</script>

<figure class="my-10">
	<div class="bg-subtle overflow-hidden rounded-lg">
		{#if localImage}
			<enhanced:img src={localImage} alt={data.alt} loading="lazy" class="w-full object-cover" />
		{:else if isExternal || hasExtension}
			<img src={data.src} alt={data.alt} loading="lazy" class="w-full object-cover" />
		{:else}
			<picture>
				<source srcset="{data.src}.avif" type="image/avif" />
				<source srcset="{data.src}.webp" type="image/webp" />
				<img src="{data.src}.webp" alt={data.alt} loading="lazy" class="w-full object-cover" />
			</picture>
		{/if}
	</div>
	{#if data.caption}
		<figcaption class="mt-3 text-center text-sm text-gray-500 dark:text-neutral-400">
			{data.caption}
		</figcaption>
	{/if}
</figure>
