<script lang="ts">
	type Props = {
		data: {
			text: string;
			author?: string;
			role?: string;
		};
	};
	let { data }: Props = $props();
</script>

<blockquote
	class="my-8 border-l-4 border-black/20 pl-6 text-xl text-gray-700 italic dark:border-white/20 dark:text-neutral-300"
>
	<p>"{data.text}"</p>
	{#if data.author}
		<footer class="mt-4 text-base text-gray-600 not-italic dark:text-neutral-400">
			— <span class="font-semibold text-black dark:text-white">{data.author}</span>
			{#if data.role}
				<span class="opacity-75">, {data.role}</span>
			{/if}
		</footer>
	{/if}
</blockquote>
