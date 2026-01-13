<script lang="ts">
	import { resolve } from '$app/paths';
	import Brand from '$lib/components/branding/brand.svelte';

	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();
</script>

<header class={className}>
	<div class="container-page pt-6">
		<nav class="glass flex items-center justify-between gap-4 px-6 py-4" aria-label="Principal">
			<a href={resolve('/')} class="inline-flex items-center gap-3 rounded-full">
				<Brand class="h-6 w-auto" />
				<span class="sr-only">Início</span>
			</a>

			<button
				type="button"
				class="btn btn-ghost aspect-square h-11 w-11 p-0"
				aria-label="Abrir menu"
			>
				<span class="sr-only">Menu</span>
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
				>
					<path
						d="M4 7H20M4 12H20M4 17H20"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</nav>
	</div>
</header>
