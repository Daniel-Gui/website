<script lang="ts">
	import { tick } from 'svelte';

	const EMAIL = 'seuemail@exemplo.com';
	const WHATSAPP_E164 = '5511999999999';

	const emailSubject = 'Projeto / oportunidade';
	const emailBody = 'Olá Daniel! Vi seu portfólio e gostaria de conversar.';
	const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
		emailBody
	)}`;

	const whatsappText = 'Olá Daniel! Vi seu portfólio e gostaria de conversar.';
	const whatsappHref = `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(whatsappText)}`;

	let ctaEl = $state<HTMLDivElement | null>(null);
	let highlightEl = $state<HTMLDivElement | null>(null);
	let emailEl = $state<HTMLAnchorElement | null>(null);
	let whatsappEl = $state<HTMLAnchorElement | null>(null);
	let worksEl = $state<HTMLAnchorElement | null>(null);
	let activeEl = $state<HTMLAnchorElement | null>(null);

	const updateHighlight = (target?: HTMLAnchorElement | null) => {
		if (!ctaEl || !highlightEl) return;
		const el = target ?? activeEl;
		if (!el) return;

		const parentRect = ctaEl.getBoundingClientRect();
		const rect = el.getBoundingClientRect();
		let x = rect.left - parentRect.left;
		let w = rect.width;
		if (x < 0) x = 0;
		if (x + w > parentRect.width) w = Math.max(0, parentRect.width - x);

		ctaEl.style.setProperty('--hl-x', `${x}px`);
		ctaEl.style.setProperty('--hl-w', `${w}px`);
	};

	const setActive = (target: HTMLAnchorElement | null) => {
		activeEl = target;
		updateHighlight(target);
	};

	$effect(() => {
		if (!ctaEl) return;
		if (typeof window === 'undefined') return;

		let ro: ResizeObserver | null = null;

		const onResize = () => updateHighlight();
		window.addEventListener('resize', onResize, { passive: true });

		if ('ResizeObserver' in window) {
			ro = new ResizeObserver(() => updateHighlight());
			ro.observe(ctaEl);
		}

		return () => {
			window.removeEventListener('resize', onResize);
			ro?.disconnect();
		};
	});

	const onEnterItem = (event: PointerEvent | FocusEvent) => {
		const target = event.currentTarget as HTMLAnchorElement | null;
		if (!target) return;
		updateHighlight(target);
	};

	const onLeave = () => {
		updateHighlight(activeEl);
	};

	$effect(() => {
		if (!ctaEl) return;
		void (async () => {
			await tick();
			setActive(worksEl);
		})();
	});
</script>

<section class="container-page pt-20 pb-20 sm:pt-24 sm:pb-24">
	<div class="relative">
		<div
			class="pointer-events-none absolute top-[-56px] left-1/2 h-[220px] w-[min(900px,92vw)] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
			style="background: radial-gradient(closest-side, rgba(24, 24, 28, 0.12), transparent 70%);"
			aria-hidden="true"
		></div>

		<div class="mx-auto max-w-[880px] text-center">
			<div class="mb-7 flex flex-wrap justify-center gap-2">
				<span class="chip">Product Designer</span>
				<span class="chip">UI/UX</span>
				<span class="chip">Frontend</span>
			</div>

			<h1
				class="text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl"
			>
				Design de produto com estética, clareza e entrega.
			</h1>

			<p class="text-muted mx-auto mt-5 max-w-[62ch] text-lg text-pretty sm:text-xl">
				Sou Product Designer (UI/UX) e desenvolvedor Frontend. Eu desenho interfaces e protótipos
				que viram produto — e implemento com cuidado nos detalhes.
			</p>

			<div class="mt-10 flex justify-center">
				<div
					bind:this={ctaEl}
					class="hero-segmented segmented"
					aria-label="Ações principais"
					onpointerleave={onLeave}
				>
					<div bind:this={highlightEl} class="hero-highlight" aria-hidden="true"></div>

					<a
						bind:this={emailEl}
						class="hero-item segmented-item"
						href={mailtoHref}
						onpointerenter={onEnterItem}
						onfocus={onEnterItem}
					>
						<span class="hero-icon" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
						Email
					</a>

					<a
						bind:this={whatsappEl}
						class="hero-item segmented-item"
						href={whatsappHref}
						target="_blank"
						rel="noreferrer"
						onpointerenter={onEnterItem}
						onfocus={onEnterItem}
					>
						<span class="hero-icon" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
						WhatsApp
					</a>

					<a
						bind:this={worksEl}
						class="hero-item hero-item-primary segmented-item"
						href="#trabalhos"
						onpointerenter={onEnterItem}
						onfocus={onEnterItem}
					>
						<span class="hero-icon" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M4.5 6.5C4.5 5.39543 5.39543 4.5 6.5 4.5H10.5C11.6046 4.5 12.5 5.39543 12.5 6.5V10.5C12.5 11.6046 11.6046 12.5 10.5 12.5H6.5C5.39543 12.5 4.5 11.6046 4.5 10.5V6.5Z"
									stroke="currentColor"
									stroke-width="1.8"
								/>
								<path
									d="M11.5 13.5H17.5C18.6046 13.5 19.5 14.3954 19.5 15.5V17.5C19.5 18.6046 18.6046 19.5 17.5 19.5H13.5C12.3954 19.5 11.5 18.6046 11.5 17.5V13.5Z"
									stroke="currentColor"
									stroke-width="1.8"
								/>
								<path
									d="M13.5 4.5H17.5C18.6046 4.5 19.5 5.39543 19.5 6.5V10.5C19.5 11.6046 18.6046 12.5 17.5 12.5H13.5C12.3954 12.5 11.5 11.6046 11.5 10.5V6.5C11.5 5.39543 12.3954 4.5 13.5 4.5Z"
									stroke="currentColor"
									stroke-width="1.8"
								/>
							</svg>
						</span>
						Ver trabalhos
					</a>
				</div>
			</div>

			<p class="text-muted mt-7 text-sm">Disponível para freelas, squads e produtos em evolução.</p>
		</div>
	</div>
</section>

<style>
	.hero-segmented {
		position: relative;
		max-width: 100%;
		--seg-pad: 0.45rem;
		padding: var(--seg-pad);
		gap: 0.35rem;
	}

	.hero-item {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.9rem 1.25rem;
		font-size: 0.95rem;
		color: rgb(var(--fg) / 0.86);
		background: transparent;
		transition:
			transform 180ms ease,
			color 180ms ease;
	}

	.hero-item:hover {
		color: rgb(var(--fg));
		background: transparent;
	}

	.hero-item:active {
		transform: translateY(1px) scale(0.98);
	}

	.hero-icon {
		display: grid;
		place-items: center;
		width: 1.05rem;
		height: 1.05rem;
	}

	.hero-icon svg {
		width: 100%;
		height: 100%;
	}

	.hero-highlight {
		position: absolute;
		z-index: 0;
		pointer-events: none;
		top: var(--seg-pad);
		left: var(--seg-pad);
		height: calc(100% - (var(--seg-pad) * 2));
		width: var(--hl-w, 0px);
		transform: translateX(calc(var(--hl-x, 0px) - var(--seg-pad)));
		border-radius: 9999px;
		background: rgb(var(--surface) / 0.92);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
		transition:
			transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
			width 420ms cubic-bezier(0.16, 1, 0.3, 1),
			opacity 240ms ease;
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-highlight,
		.hero-item {
			transition: none;
		}
	}

	@media (max-width: 639px) {
		.hero-segmented {
			display: grid;
			grid-template-columns: 1fr;
			padding: 0;
			gap: 0.55rem;
			border: 0;
			background: transparent;
			box-shadow: none;
			backdrop-filter: none;
			-webkit-backdrop-filter: none;
		}

		.hero-highlight {
			display: none;
		}

		.hero-item {
			width: min(420px, 100%);
			margin-inline: auto;
			justify-content: center;
			padding: 0.95rem 1.15rem;
			border-radius: 9999px;
			border: 1px solid rgb(var(--border) / 0.12);
			background: rgb(var(--surface) / 0.72);
			box-shadow: var(--shadow-1);
		}

		.hero-item:hover {
			background: rgb(var(--surface) / 0.82);
		}

		.hero-item-primary {
			background: rgb(var(--surface) / 0.92);
			box-shadow: var(--shadow-2);
		}
	}
</style>
