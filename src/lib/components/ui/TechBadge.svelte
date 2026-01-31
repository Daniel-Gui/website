<script lang="ts">
	import { TECH_ICONS } from '$lib/utils/icons';

	interface Props {
		tag: string;
		class?: string;
	}

	let { tag, class: className = '' }: Props = $props();
	let Icon = $derived((TECH_ICONS as Record<string, any>)[tag]);
</script>

<span class="tag {className}">
	{#if Icon}
		<Icon class="mr-1.5 size-3" />
	{/if}
	{tag}
</span>
