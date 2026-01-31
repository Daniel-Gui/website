<script lang="ts">
	import IconArrowUp from '$lib/components/icons/icon-arrow-up.svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	function scrollToTop() {
		if (typeof window === 'undefined') return;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<button
	onclick={scrollToTop}
	class="group focus-visible:ring-focus flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:ring-2 focus-visible:outline-none {className}"
	aria-label="Voltar ao topo"
>
	Voltar ao topo
	<span
		class="border-subtle shadow-subtle group-hover:border-default group-hover:shadow-elevated grid size-6 place-items-center rounded-full border bg-surface/50 transition-all group-hover:bg-surface"
	>
		<IconArrowUp class="size-3.5" />
	</span>
</button>
