<script lang="ts">
	import './layout.css';
	import favicon1 from '$lib/assets/favicon@1x.webp';
	import favicon2 from '$lib/assets/favicon@2x.webp';
	import favicon3 from '$lib/assets/favicon@3x.webp';
	import Cursor from '$lib/components/cursor/cursor.svelte';
	import Introduction from '$lib/components/introduction/introduction.svelte';
	import Navbar from '$lib/components/navigation/navbar.svelte';
	import { introDone } from '$lib/stores/intro';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/webp" href={favicon1} sizes="16x16" />
	<link rel="icon" type="image/webp" href={favicon2} sizes="32x32" />
	<link rel="icon" type="image/webp" href={favicon3} sizes="48x48" />
</svelte:head>
<Cursor color="#fff" />
<Navbar />
{@render children()}

{#if !$introDone}
	<Introduction
		texts={['Olá, eu sou Daniel.', 'Frontend Developer', '&', 'UI/UX Designer']}
		switchDelayMs={1000}
		onFinished={() => introDone.set(true)}
	/>
{/if}
