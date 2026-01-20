<script lang="ts">
	type Props = {
		data: { text: string };
	};
	let { data }: Props = $props();
</script>

<p class="leading-relaxed text-gray-800 dark:text-neutral-300">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html data.text}
</p>
