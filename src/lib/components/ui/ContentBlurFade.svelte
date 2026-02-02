<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div
	class="pointer-events-none fixed right-0 bottom-0 left-0 z-10 h-32 w-full {className}"
	style="
    background: linear-gradient(to bottom, transparent, rgb(var(--bg)));
  "
	aria-hidden="true"
></div>
