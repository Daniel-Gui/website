<script lang="ts">
	interface Props {
		class?: string;
	}
	let { class: className }: Props = $props();
</script>

<svg
	class={className}
	xmlns="http://www.w3.org/2000/svg"
	width="24"
	height="24"
	fill="none"
	viewBox="0 0 24 24"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<circle cx="12" cy="12" r="10" />
	<polyline points="12 6 12 12 16 14" />
</svg>
