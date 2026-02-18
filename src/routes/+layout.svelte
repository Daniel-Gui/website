<script lang="ts">
	import './layout.css';
	import favicon1 from '$lib/assets/favicon@1x.webp';
	import favicon2 from '$lib/assets/favicon@2x.webp';
	import favicon3 from '$lib/assets/favicon@3x.webp';
	//import Cursor from '$lib/components/cursor/cursor.svelte';
	import Introduction from '$lib/components/introduction/introduction.svelte';
	import Navbar from '$lib/components/navigation/navbar.svelte';
	import { introDone } from '$lib/stores/intro';
	import { onNavigate } from '$app/navigation';
	import { ModeWatcher } from 'mode-watcher';

	// Preloading images
	import introImg01 from '$lib/assets/images/preloading/Intro-website-03.jpg?enhanced&w=160;320';
	import introImg02 from '$lib/assets/images/preloading/Intro-website-02.jpg?enhanced&w=160;320';
	import introImg03 from '$lib/assets/images/preloading/Intro-website-01.jpg?enhanced&w=160;320';
	import introImg04 from '$lib/assets/images/preloading/Intro-website-04.jpg?enhanced&w=160;320';

	const introSteps = [
		{
			src: introImg01,
			alt: 'Xícara de café vista de cima',
			label: 'Tudo começa com uma boa ideia...'
		},
		{
			src: introImg02,
			alt: 'Wireframe desenhado em tablet',
			label: '...que ganha forma no papel...'
		},
		{ src: introImg03, alt: 'Código sendo escrito na tela', label: '...e vida no código...' },
		{ src: introImg04, alt: 'Retrato de Daniel', label: 'Prazer, Daniel.' }
	];

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		// Impede que a intro apareça novamente ao navegar
		introDone.set(true);

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" type="image/webp" href={favicon1} sizes="16x16" />
	<link rel="icon" type="image/webp" href={favicon2} sizes="32x32" />
	<link rel="icon" type="image/webp" href={favicon3} sizes="48x48" />
</svelte:head>
<ModeWatcher />
<!--
<Cursor color="#fff" />
-->
<Navbar />
{@render children()}

{#if !$introDone}
	<Introduction steps={introSteps} onFinished={() => introDone.set(true)} />
{/if}
