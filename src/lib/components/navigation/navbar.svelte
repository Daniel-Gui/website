<script lang="ts">
	import { resolve } from '$app/paths';
	import Brand from '$lib/components/branding/brand.svelte';
	import { tick } from 'svelte';
	import { introDone } from '$lib/stores/intro';

	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();

	let headerEl = $state<HTMLElement | null>(null);
	let panelEl = $state<HTMLDivElement | null>(null);
	let cardCvEl = $state<HTMLAnchorElement | null>(null);
	let cardLinkedinEl = $state<HTMLAnchorElement | null>(null);
	let cardEmailEl = $state<HTMLAnchorElement | null>(null);
	let cardWhatsappEl = $state<HTMLAnchorElement | null>(null);

	let menuMounted = $state(false);
	let isAnimating = $state(false);
	let menuOpening = $state(false);
	let navbarRevealed = $state(false);

	const EMAIL = 'seuemail@exemplo.com';
	const WHATSAPP_E164 = '5511999999999';
	const LINKEDIN_URL = 'https://www.linkedin.com/in/seu-usuario/';

	const emailSubject = 'Projeto / oportunidade';
	const emailBody = 'Olá Daniel! Vi seu portfólio e gostaria de conversar.';
	const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
		emailBody
	)}`;

	const whatsappText = 'Olá Daniel! Vi seu portfólio e gostaria de conversar.';
	const whatsappHref = `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(whatsappText)}`;

	const nextFrame = () =>
		new Promise<void>((resolve) => {
			requestAnimationFrame(() => resolve());
		});

	const getCards = () =>
		[cardCvEl, cardLinkedinEl, cardEmailEl, cardWhatsappEl].filter(Boolean) as HTMLAnchorElement[];

	const animateIn = async () => {
		if (!panelEl) return;
		if (typeof window === 'undefined') return;

		const { animate } = await import('motion');

		panelEl.style.opacity = '0';
		panelEl.style.transform = 'translateY(-10px) scale(0.985)';
		panelEl.style.transition = 'none';
		panelEl.style.willChange = 'opacity, transform';

		const cards = getCards();
		for (const el of cards) {
			el.style.opacity = '0';
			el.style.transform = 'translateY(12px) scale(0.985)';
			el.style.transition = 'none';
			el.style.willChange = 'opacity, transform';
		}

		menuOpening = false;
		await nextFrame();

		const panelAnim = animate(
			panelEl,
			{
				opacity: [0, 1],
				transform: ['translateY(-10px) scale(0.985)', 'translateY(0px) scale(1)']
			},
			{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }
		);

		const cardAnims = cards.map((el, index) => {
			return animate(
				el,
				{
					opacity: [0, 1],
					transform: ['translateY(12px) scale(0.985)', 'translateY(0px) scale(1)']
				},
				{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.18 + index * 0.12 }
			);
		});

		await Promise.all([panelAnim.finished, ...cardAnims.map((a) => a.finished)]);

		panelEl.style.transition = 'none';
		panelEl.style.opacity = '';
		panelEl.style.transform = '';
		for (const el of cards) {
			el.style.transition = 'none';
			el.style.opacity = '';
			el.style.transform = '';
		}
		void panelEl.offsetHeight;

		panelEl.style.transition = '';
		panelEl.style.willChange = '';
		for (const el of cards) {
			el.style.transition = '';
			el.style.willChange = '';
		}
	};

	const animateOut = async () => {
		if (!panelEl) return;
		if (typeof window === 'undefined') return;

		const { animate } = await import('motion');

		const cards = getCards();
		panelEl.style.transition = 'none';
		panelEl.style.willChange = 'opacity, transform';
		for (const el of cards) {
			el.style.transition = 'none';
			el.style.willChange = 'opacity, transform';
		}

		const cardAnims = cards.map((el, index) =>
			animate(
				el,
				{
					opacity: [1, 0],
					transform: ['translateY(0px) scale(1)', 'translateY(10px) scale(0.985)']
				},
				{ duration: 0.22, ease: [0.7, 0, 0.84, 0], delay: index * 0.05 }
			)
		);

		const panelAnim = animate(
			panelEl,
			{
				opacity: [1, 0],
				transform: ['translateY(0px) scale(1)', 'translateY(-10px) scale(0.985)']
			},
			{ duration: 0.24, ease: [0.7, 0, 0.84, 0] }
		);

		await Promise.all([panelAnim.finished, ...cardAnims.map((a) => a.finished)]);

		panelEl.style.willChange = '';
		for (const el of cards) el.style.willChange = '';
	};

	const openMenu = async () => {
		if (menuMounted || isAnimating) return;

		isAnimating = true;
		menuOpening = true;
		menuMounted = true;
		await tick();
		await animateIn();
		isAnimating = false;
	};

	const closeMenu = async () => {
		if (!menuMounted || isAnimating) return;

		isAnimating = true;
		await animateOut();
		menuMounted = false;
		isAnimating = false;
	};

	const toggleMenu = () => {
		if (menuMounted) void closeMenu();
		else void openMenu();
	};

	$effect(() => {
		if (!$introDone) return;
		if (navbarRevealed) return;
		if (!headerEl) return;
		if (typeof window === 'undefined') {
			navbarRevealed = true;
			return;
		}

		void (async () => {
			const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
			if (reduce) {
				navbarRevealed = true;
				return;
			}

			const { animate } = await import('motion');

			headerEl.style.opacity = '0';
			headerEl.style.transform = 'translateY(-10px)';
			headerEl.style.pointerEvents = 'none';
			await tick();

			const anim = animate(
				headerEl,
				{ opacity: [0, 1], transform: ['translateY(-10px)', 'translateY(0px)'] },
				{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }
			);

			await anim.finished;
			navbarRevealed = true;
			headerEl.style.opacity = '';
			headerEl.style.transform = '';
			headerEl.style.pointerEvents = '';
		})();
	});

	$effect(() => {
		if (!menuMounted) return;
		if (typeof window === 'undefined') return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') void closeMenu();
		};

		const onPointerDown = (event: PointerEvent) => {
			const target = event.target as Node | null;
			if (!target) return;
			if (headerEl?.contains(target)) return;
			void closeMenu();
		};

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('pointerdown', onPointerDown, true);

		return () => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('pointerdown', onPointerDown, true);
		};
	});
</script>

<header
	class={`relative z-50 ${className}`}
	bind:this={headerEl}
	style={navbarRevealed
		? undefined
		: 'opacity:0; transform: translateY(-10px); pointer-events:none;'}
>
	<div class="container-page relative isolate pt-6">
		<nav
			class="glass relative z-50 flex items-center justify-between gap-4 px-6 py-4"
			aria-label="Principal"
		>
			<a href={resolve('/')} class="inline-flex items-center gap-3 rounded-full">
				<Brand class="h-6 w-auto" />
				<span class="sr-only">Início</span>
			</a>

			<button
				type="button"
				class="btn btn-ghost aspect-square h-11 w-11 p-0 transition-transform duration-200 ease-out active:scale-95"
				aria-label="Abrir menu"
				aria-expanded={menuMounted}
				aria-controls="navbar-menu"
				onclick={toggleMenu}
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

			{#if menuMounted}
				<div
					id="navbar-menu"
					bind:this={panelEl}
					class={`glass-strong absolute top-full right-0 left-0 z-50 mt-3 overflow-hidden px-4 py-4 shadow-[0_18px_48px_rgba(0,0,0,0.12)] ${menuOpening ? 'opacity-0' : ''}`}
					role="dialog"
					aria-label="Menu"
				>
					<div
						class="pointer-events-none absolute inset-0 bg-white/35 backdrop-blur-2xl"
						aria-hidden="true"
					></div>
					<div class="relative grid grid-cols-2 gap-3 sm:grid-cols-4">
						<a
							bind:this={cardCvEl}
							href={resolve('/curriculo.pdf' as unknown as '/')}
							download
							class={`card group grid place-items-center gap-2 px-4 py-6 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_18px_48px_rgba(0,0,0,0.12)] focus-visible:ring-4 focus-visible:ring-black/10 focus-visible:outline-none active:-translate-y-[1px] active:scale-[0.98] ${menuOpening ? 'translate-y-3 scale-[0.985] opacity-0' : ''}`}
							onclick={() => void closeMenu()}
						>
							<span
								class="shadow-soft grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white/70 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-active:scale-95"
							>
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
								>
									<path
										d="M12 3V14M12 14L8 10M12 14L16 10"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
									/>
								</svg>
							</span>
							<span class="text-sm font-medium">Baixar currículo</span>
							<span class="text-muted text-xs">PDF</span>
						</a>

						<a
							bind:this={cardLinkedinEl}
							href={LINKEDIN_URL}
							target="_blank"
							rel="noreferrer"
							class={`card group grid place-items-center gap-2 px-4 py-6 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_18px_48px_rgba(0,0,0,0.12)] focus-visible:ring-4 focus-visible:ring-black/10 focus-visible:outline-none active:-translate-y-[1px] active:scale-[0.98] ${menuOpening ? 'translate-y-3 scale-[0.985] opacity-0' : ''}`}
							onclick={() => void closeMenu()}
						>
							<span
								class="shadow-soft grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white/70 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-active:scale-95"
							>
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
								>
									<path
										d="M7 10V17"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
									/>
									<path
										d="M7 7.5V7.4"
										stroke="currentColor"
										stroke-width="2.4"
										stroke-linecap="round"
									/>
									<path
										d="M11 17V12.8C11 11.2536 12.2536 10 13.8 10C15.3464 10 16.6 11.2536 16.6 12.8V17"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
									/>
									<path
										d="M11 12.2C11.4 10.9 12.6 10 14 10"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
									/>
								</svg>
							</span>
							<span class="text-sm font-medium">LinkedIn</span>
							<span class="text-muted text-xs">Perfil</span>
						</a>

						<a
							bind:this={cardEmailEl}
							href={mailtoHref}
							class={`card group grid place-items-center gap-2 px-4 py-6 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_18px_48px_rgba(0,0,0,0.12)] focus-visible:ring-4 focus-visible:ring-black/10 focus-visible:outline-none active:-translate-y-[1px] active:scale-[0.98] ${menuOpening ? 'translate-y-3 scale-[0.985] opacity-0' : ''}`}
							onclick={() => void closeMenu()}
						>
							<span
								class="shadow-soft grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white/70 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-active:scale-95"
							>
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
								>
									<path
										d="M4.5 7.5H19.5V16.5C19.5 17.6046 18.6046 18.5 17.5 18.5H6.5C5.39543 18.5 4.5 17.6046 4.5 16.5V7.5Z"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linejoin="round"
									/>
									<path
										d="M5.5 8.5L12 13.2L18.5 8.5"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
							<span class="text-sm font-medium">Email</span>
							<span class="text-muted text-xs">Contato</span>
						</a>

						<a
							bind:this={cardWhatsappEl}
							href={whatsappHref}
							target="_blank"
							rel="noreferrer"
							class={`card group grid place-items-center gap-2 px-4 py-6 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_18px_48px_rgba(0,0,0,0.12)] focus-visible:ring-4 focus-visible:ring-black/10 focus-visible:outline-none active:-translate-y-[1px] active:scale-[0.98] ${menuOpening ? 'translate-y-3 scale-[0.985] opacity-0' : ''}`}
							onclick={() => void closeMenu()}
						>
							<span
								class="shadow-soft grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white/70 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-active:scale-95"
							>
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
								>
									<path
										d="M7.5 19.5L8.2 16.8C7.2 15.6 6.6 14.1 6.6 12.5C6.6 8.9 9.5 6 13.1 6C16.7 6 19.6 8.9 19.6 12.5C19.6 16.1 16.7 19 13.1 19C11.6 19 10.2 18.5 9.1 17.6L7.5 19.5Z"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M11 11.2C11.2 10.6 11.6 10.4 12.2 10.4C12.5 10.4 12.8 10.5 13.1 10.8L14.1 11.8C14.4 12.1 14.4 12.6 14.1 12.9L13.6 13.4C14.2 14.4 15 15.2 16 15.8L16.5 15.3C16.8 15 17.3 15 17.6 15.3L18.6 16.3C18.9 16.6 19 16.9 19 17.2C19 17.8 18.7 18.2 18.1 18.4"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
							<span class="text-sm font-medium">WhatsApp</span>
							<span class="text-muted text-xs">Mensagem</span>
						</a>
					</div>
				</div>
			{/if}
		</nav>
	</div>
</header>
