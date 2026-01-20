<script lang="ts">
	type Props = {
		data: {
			level: 1 | 2 | 3 | 4 | 5 | 6;
			text: string;
			id?: string;
		};
	};
	let { data }: Props = $props();

	const headingClasses = {
		1: 'text-4xl font-bold tracking-tight mt-12 mb-6',
		2: 'text-3xl font-bold tracking-tight mt-12 mb-6',
		3: 'text-2xl font-bold tracking-tight mt-8 mb-4',
		4: 'text-xl font-bold tracking-tight mt-8 mb-4',
		5: 'text-lg font-bold tracking-tight mt-6 mb-3',
		6: 'text-base font-bold tracking-tight mt-6 mb-3'
	};
</script>

<svelte:element
	this={`h${data.level}`}
	id={data.id}
	class="font-sans text-black dark:text-white {headingClasses[data.level]}"
>
	{data.text}
</svelte:element>
