<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Introduction from '$lib/components/introduction/introduction.svelte';

	let { children } = $props();
	let introDone = $state(false);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

{#if !introDone}
	<Introduction
		imageSrc="https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		texts={['Olá, eu sou Daniel.', 'Frontend Developer + UI/UX Designer']}
		switchDelayMs={2000}
		onFinished={() => (introDone = true)}
	/>
{/if}
