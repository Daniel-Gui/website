<script lang="ts">
	import { resolve } from '$app/paths';
	import Brand from '$lib/components/branding/brand.svelte';
	import { tick } from 'svelte';
	import { introDone } from '$lib/stores/intro';
	import IconClose from '$lib/components/icons/icon-close.svelte';
	import IconFileArrowDown from '$lib/components/icons/icon-file-arrow-down.svelte';
	import IconLinkedin from '$lib/components/icons/icon-linkedin.svelte';
	import IconMail from '$lib/components/icons/icon-mail.svelte';
	import IconMenu from '$lib/components/icons/icon-menu.svelte';
	import IconWhatsapp from '$lib/components/icons/icon-whatsapp.svelte';
	import ThemeToggle from '$lib/components/theme-toggle/theme-toggle.svelte';
	import { cn } from '$lib/utils';

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
	let navbarAtTop = $state(true);

	const EMAIL = 'dandanielofc@gmail.com';
	const WHATSAPP_E164 = '5591993105821';
	const LINKEDIN_URL = 'https://www.linkedin.com/in/danielguii';

	const RESUME_PTBR = resolve('/resume/resume-daniel-guimaraes-ptbr.pdf', {});
	const RESUME_EN = resolve('/resume/resume-daniel-guimaraes-english.pdf', {});

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
		if (typeof window === 'undefined') return;

		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
		let raf = 0;

		const update = () => {
			navbarAtTop = window.scrollY <= 4;
		};

		const onScroll = () => {
			if (reduce) return update();
			if (raf) return;
			raf = window.requestAnimationFrame(() => {
				raf = 0;
				update();
			});
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', onScroll);
			if (raf) window.cancelAnimationFrame(raf);
		};
	});

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
	class={cn('sticky top-0 z-[var(--z-sticky)]', className)}
	bind:this={headerEl}
	style={navbarRevealed
		? undefined
		: 'opacity:0; transform: translateY(-10px); pointer-events:none;'}
>
	<div class="container-page relative isolate pt-6">
		<nav
			class={cn(
				'navbar-shell relative z-[var(--z-sticky)] flex items-center justify-between gap-4 px-6 py-4',
				navbarAtTop ? 'navbar-top' : 'navbar-stuck'
			)}
			aria-label="Principal"
		>
			<a href={resolve('/', {})} class="navbar-brand inline-flex items-center gap-3 rounded-full">
				<Brand class="h-6 w-auto" />
				<span class="sr-only">Início</span>
			</a>

			<div class="relative z-10 flex items-center gap-2">
				<ThemeToggle />
				<button
					type="button"
					class="btn aspect-square size-11 p-0 transition-transform duration-200 ease-out active:scale-95"
					aria-label={menuMounted ? 'Fechar menu' : 'Abrir menu'}
					aria-expanded={menuMounted}
					aria-controls="navbar-menu"
					onclick={toggleMenu}
				>
					{#if menuMounted}
						<IconClose class="size-5" />
					{:else}
						<IconMenu class="size-5" />
					{/if}
				</button>
			</div>

			{#if menuMounted}
				<div
					id="navbar-menu"
					bind:this={panelEl}
					class={cn(
						'navbar-menu-panel glass-strong absolute top-full right-0 left-0 z-[var(--z-sticky)] mt-3 overflow-hidden px-4 py-4 shadow-[var(--shadow-2)]',
						menuOpening && 'opacity-0'
					)}
					role="dialog"
					aria-label="Menu"
				>
					<div
						class="pointer-events-none absolute inset-0 bg-white/35 backdrop-blur-2xl"
						aria-hidden="true"
					></div>

					<!-- Decorative Grid Background -->
					<div class="pointer-events-none absolute inset-0 z-0 opacity-[0.03]" aria-hidden="true">
						<svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
							<defs>
								<pattern id="nav-grid" width="20" height="20" patternUnits="userSpaceOnUse">
									<path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="1" />
								</pattern>
							</defs>
							<rect width="100%" height="100%" fill="url(#nav-grid)" />
						</svg>
					</div>

					<div class="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
						<a
							bind:this={cardCvEl}
							href={RESUME_PTBR}
							download
							class={cn(
								'card group grid place-items-center gap-2 px-4 py-6 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:border-black/20 hover:bg-white/85 hover:shadow-[var(--shadow-2)] focus-visible:ring-4 focus-visible:ring-black/10 focus-visible:outline-none active:-translate-y-[1px] active:scale-[0.98]',
								menuOpening && 'translate-y-3 scale-[0.985] opacity-0'
							)}
							onclick={(e) => {
								e.preventDefault();
								const a1 = document.createElement('a');
								a1.href = RESUME_PTBR;
								a1.download = '';
								a1.rel = 'noreferrer';
								a1.target = '_blank';
								document.body.appendChild(a1);
								a1.click();
								document.body.removeChild(a1);

								const a2 = document.createElement('a');
								a2.href = RESUME_EN;
								a2.download = '';
								a2.rel = 'noreferrer';
								a2.target = '_blank';
								document.body.appendChild(a2);
								a2.click();
								document.body.removeChild(a2);

								void closeMenu();
							}}
						>
							<span
								class="shadow-soft grid size-12 place-items-center rounded-full border border-black/10 bg-white/70 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-active:scale-95"
							>
								<IconFileArrowDown class="size-6" />
							</span>
							<span class="text-sm font-medium">Baixar currículo</span>
							<span class="font-mono text-[10px] tracking-wider text-muted uppercase">PDF</span>
						</a>

						<a
							bind:this={cardLinkedinEl}
							href={LINKEDIN_URL}
							target="_blank"
							rel="noreferrer"
							class={cn(
								'card group grid place-items-center gap-2 px-4 py-6 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:border-black/20 hover:bg-white/85 hover:shadow-[var(--shadow-2)] focus-visible:ring-4 focus-visible:ring-black/10 focus-visible:outline-none active:-translate-y-[1px] active:scale-[0.98]',
								menuOpening && 'translate-y-3 scale-[0.985] opacity-0'
							)}
							onclick={() => void closeMenu()}
						>
							<span
								class="shadow-soft grid size-12 place-items-center rounded-full border border-black/10 bg-white/70 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-active:scale-95"
							>
								<IconLinkedin class="size-6" />
							</span>
							<span class="text-sm font-medium">LinkedIn</span>
							<span class="font-mono text-[10px] tracking-wider text-muted uppercase">Perfil</span>
						</a>

						<a
							bind:this={cardEmailEl}
							href={mailtoHref}
							class={cn(
								'card group grid place-items-center gap-2 px-4 py-6 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:border-black/20 hover:bg-white/85 hover:shadow-[var(--shadow-2)] focus-visible:ring-4 focus-visible:ring-black/10 focus-visible:outline-none active:-translate-y-[1px] active:scale-[0.98]',
								menuOpening && 'translate-y-3 scale-[0.985] opacity-0'
							)}
							onclick={() => void closeMenu()}
						>
							<span
								class="shadow-soft grid size-12 place-items-center rounded-full border border-black/10 bg-white/70 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-active:scale-95"
							>
								<IconMail class="size-6" />
							</span>
							<span class="text-sm font-medium">Email</span>
							<span class="font-mono text-[10px] tracking-wider text-muted uppercase">Contato</span>
						</a>

						<a
							bind:this={cardWhatsappEl}
							href={whatsappHref}
							target="_blank"
							rel="noreferrer"
							class={cn(
								'card group grid place-items-center gap-2 px-4 py-6 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:border-black/20 hover:bg-white/85 hover:shadow-[var(--shadow-2)] focus-visible:ring-4 focus-visible:ring-black/10 focus-visible:outline-none active:-translate-y-[1px] active:scale-[0.98]',
								menuOpening && 'translate-y-3 scale-[0.985] opacity-0'
							)}
							onclick={() => void closeMenu()}
						>
							<span
								class="shadow-soft grid size-12 place-items-center rounded-full border border-black/10 bg-white/70 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-active:scale-95"
							>
								<IconWhatsapp class="size-6" />
							</span>
							<span class="text-sm font-medium">WhatsApp</span>
							<span class="font-mono text-[10px] tracking-wider text-muted uppercase">Mensagem</span
							>
						</a>
					</div>
				</div>
			{/if}
		</nav>
	</div>
</header>

<style>
	.navbar-shell {
		border-radius: var(--radius-xl);
		transition:
			color 260ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.navbar-shell::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: rgb(var(--surface) / 0.55);
		border: 1px solid rgb(var(--border) / 0.12);
		box-shadow: var(--shadow-1);
		backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
		-webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
		opacity: 0;
		z-index: 0;
		transition: opacity 320ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.navbar-shell > .navbar-brand,
	.navbar-shell > button {
		position: relative;
		z-index: 1;
	}

	.navbar-top {
		color: rgb(255 255 255 / 0.92);
	}

	.navbar-top::before {
		opacity: 0;
	}

	.navbar-stuck {
		color: rgb(var(--fg));
	}

	.navbar-stuck::before {
		opacity: 1;
	}

	.navbar-top .btn {
		background: rgb(255 255 255 / 0.16);
		border-color: rgb(255 255 255 / 0.18);
		color: rgb(255 255 255 / 0.92);
		box-shadow: none;
	}

	.navbar-top .btn:hover {
		background: rgb(255 255 255 / 0.22);
	}

	@media (prefers-reduced-motion: reduce) {
		.navbar-shell,
		.navbar-shell::before {
			transition: none;
		}
	}

	.navbar-menu-panel {
		color: rgb(var(--fg));
	}

	.navbar-menu-panel .text-muted {
		color: rgb(var(--muted));
	}
</style>
