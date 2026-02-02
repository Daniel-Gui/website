<script lang="ts">
	import { toggleMode } from 'mode-watcher';

	let mounted = $state(false);

	$effect(() => {
		mounted = true;
	});
</script>

<button
	onclick={toggleMode}
	class="btn aspect-square size-11 p-0 transition-transform duration-200 ease-out active:scale-95"
	aria-label="Alternar tema"
>
	{#if mounted}
		<div class="relative size-4">
			<span
				class="absolute inset-0 scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0"
			>
				<!-- Moon icon representation -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
				</svg>
			</span>
			<span
				class="absolute inset-0 scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90"
			>
				<!-- Sun icon representation -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2" />
					<path d="M12 20v2" />
					<path d="m4.93 4.93 1.41 1.41" />
					<path d="m17.66 17.66 1.41 1.41" />
					<path d="M2 12h2" />
					<path d="M20 12h2" />
					<path d="m6.34 17.66-1.41 1.41" />
					<path d="m19.07 4.93-1.41 1.41" />
				</svg>
			</span>
		</div>
	{:else}
		<div class="size-4 opacity-50"></div>
	{/if}
</button>
