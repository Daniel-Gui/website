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
		imageSrc="https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		texts={['Olá, eu sou Daniel.', 'Frontend Developer', '&', 'UI/UX Designer']}
		switchDelayMs={1000}
		onFinished={() => introDone.set(true)}
	/>
{/if}
