<script lang="ts">
	import { tick } from 'svelte';
	import { introDone } from '$lib/stores/intro';
	import IconMail from '$lib/components/icons/icon-mail.svelte';
	import IconSparkle from '$lib/components/icons/icon-sparkle.svelte';
	import IconWhatsapp from '$lib/components/icons/icon-whatsapp.svelte';

	type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

	type Props = {
		availabilityText?: string;
		availabilityStatus?: AvailabilityStatus;
		revealStartDelayMs?: number;
		showcaseRevealDurationMs?: number;
		showcaseRevealStaggerMs?: number;
	};

	let {
		availabilityText = 'Disponível para propostas',
		availabilityStatus = 'available',
		revealStartDelayMs = 220,
		showcaseRevealDurationMs = 350,
		showcaseRevealStaggerMs = 50
	}: Props = $props();

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
	let chipsWrapEl = $state<HTMLDivElement | null>(null);
	let headingEl = $state<HTMLHeadingElement | null>(null);
	let leadEl = $state<HTMLParagraphElement | null>(null);
	let ctaWrapEl = $state<HTMLDivElement | null>(null);
	let availabilityEl = $state<HTMLElement | null>(null);
	let showcaseEl = $state<HTMLDivElement | null>(null);
	let heroRevealed = $state(false);
	let heroDidAnimate = $state(false);

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

	$effect(() => {
		if (!$introDone) return;
		if (heroDidAnimate) return;

		heroDidAnimate = true;

		if (typeof window === 'undefined') {
			heroRevealed = true;
			return;
		}

		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
		if (reduce) {
			heroRevealed = true;
			return;
		}

		void (async () => {
			const { animate } = await import('motion');
			await tick();

			const showcaseCards = showcaseEl
				? Array.from(showcaseEl.querySelectorAll<HTMLElement>('[data-showcase-card]'))
				: [];
			const chips = chipsWrapEl
				? Array.from(chipsWrapEl.querySelectorAll<HTMLSpanElement>('span.chip'))
				: [];

			const items = [showcaseEl, chipsWrapEl, headingEl, leadEl, ctaWrapEl, availabilityEl].filter(
				Boolean
			) as HTMLElement[];

			for (const el of items) {
				el.style.opacity = '0';
				el.style.transform = 'translateY(14px)';
				el.style.filter = '';
				el.style.willChange = 'opacity, transform';
			}
			for (const el of showcaseCards) {
				const base =
					getComputedStyle(el).getPropertyValue('--card-transform').trim() ||
					'translate(-50%, -50%)';
				el.style.transition = 'none';
				el.style.opacity = '0';
				el.style.transform = `${base} translateY(14px) scale(0.92)`;
				el.style.filter = 'blur(14px)';
				el.style.willChange = 'opacity, transform, filter';
			}
			for (const el of chips) {
				el.style.opacity = '0';
				el.style.transform = 'translateY(10px)';
				el.style.willChange = 'opacity, transform';
			}
			if (chipsWrapEl && chips.length) {
				chipsWrapEl.style.opacity = '1';
				chipsWrapEl.style.transform = 'none';
				chipsWrapEl.style.willChange = '';
			}
			if (headingEl) headingEl.style.filter = 'blur(12px)';
			if (leadEl) leadEl.style.filter = 'blur(12px)';

			await new Promise((r) => setTimeout(r, revealStartDelayMs));

			if (showcaseCards.length) {
				if (showcaseEl) {
					await animate(
						showcaseEl,
						{ opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
						{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }
					).finished;
				}

				for (const [index, el] of showcaseCards.entries()) {
					const base =
						getComputedStyle(el).getPropertyValue('--card-transform').trim() ||
						'translate(-50%, -50%)';

					if (index > 0) await new Promise((r) => setTimeout(r, showcaseRevealStaggerMs));

					await animate(
						el,
						{
							opacity: [0, 1],
							transform: [
								`${base} translateY(14px) scale(0.92)`,
								`${base} translateY(-2px) scale(1.03)`,
								`${base} translateY(0px) scale(1)`
							],
							filter: ['blur(14px)', 'blur(0px)']
						} as unknown as Record<string, unknown>,
						{ duration: showcaseRevealDurationMs / 1000, ease: [0.16, 1, 0.3, 1] }
					).finished;
				}
			} else if (showcaseEl) {
				await animate(
					showcaseEl,
					{ opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
					{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }
				).finished;
			}

			if (chips.length) {
				const chipAnims = chips.map(
					(el, index) =>
						animate(
							el,
							{ opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0px)'] },
							{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }
						).finished
				);
				await Promise.all(chipAnims);
			} else if (chipsWrapEl) {
				await animate(
					chipsWrapEl,
					{ opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
					{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }
				).finished;
			}

			if (headingEl) {
				await animate(
					headingEl,
					{
						opacity: [0, 1],
						transform: ['translateY(14px)', 'translateY(0px)'],
						filter: ['blur(12px)', 'blur(0px)']
					} as unknown as Record<string, unknown>,
					{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }
				).finished;
			}

			if (leadEl) {
				await animate(
					leadEl,
					{
						opacity: [0, 1],
						transform: ['translateY(14px)', 'translateY(0px)'],
						filter: ['blur(12px)', 'blur(0px)']
					} as unknown as Record<string, unknown>,
					{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.06 }
				).finished;
			}

			if (ctaWrapEl) {
				await animate(
					ctaWrapEl,
					{ opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
					{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }
				).finished;
			}

			if (availabilityEl) {
				await animate(
					availabilityEl,
					{ opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
					{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }
				).finished;
			}

			heroRevealed = true;

			for (const el of items) {
				el.style.opacity = '';
				el.style.transform = '';
				el.style.filter = '';
				el.style.willChange = '';
			}
			for (const el of showcaseCards) {
				el.style.transition = 'none';
				el.style.opacity = '';
				el.style.transform = '';
				el.style.filter = '';
				el.style.willChange = '';
				void el.offsetHeight;
				el.style.transition = '';
			}
			for (const el of chips) {
				el.style.opacity = '';
				el.style.transform = '';
				el.style.willChange = '';
			}
		})();
	});
</script>

<section
	class={`container-page pt-20 pb-20 sm:pt-24 sm:pb-24 ${heroRevealed ? '' : 'hero-reveal'}`}
>
	<div class="relative">
		<div
			class="pointer-events-none absolute top-[-56px] left-1/2 h-[220px] w-[min(900px,92vw)] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
			style="background: radial-gradient(closest-side, rgba(24, 24, 28, 0.12), transparent 70%);"
			aria-hidden="true"
		></div>

		<div class="mx-auto max-w-[880px] text-center">
			<div class="hero-showcase-bleed">
				<div bind:this={showcaseEl} class="hero-showcase" aria-hidden="true" data-hero-item>
					<div
						class="hero-showcase-card hero-showcase-left"
						style="background-image: url('https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80');"
						data-showcase-card
					></div>
					<div
						class="hero-showcase-card hero-showcase-center"
						style="background-image: url('https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=800&q=80');"
						data-showcase-card
					></div>
					<div
						class="hero-showcase-card hero-showcase-right"
						style="background-image: url('https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80');"
						data-showcase-card
					></div>
				</div>
			</div>

			<div bind:this={chipsWrapEl} class="mb-7 flex flex-wrap justify-center gap-2" data-hero-item>
				<span class="chip">Product Designer</span>
				<span class="chip">UI/UX</span>
				<span class="chip">Frontend</span>
			</div>

			<h1
				class="text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl"
				bind:this={headingEl}
				data-hero-item
			>
				Design de produto com estética, clareza e entrega.
			</h1>

			<p
				class="text-muted mx-auto mt-5 max-w-[62ch] text-lg text-pretty sm:text-xl"
				bind:this={leadEl}
				data-hero-item
			>
				Sou Product Designer (UI/UX) e desenvolvedor Frontend. Eu desenho interfaces e protótipos
				que viram produto — e implemento com cuidado nos detalhes.
			</p>

			<div class="mt-10 flex justify-center" bind:this={ctaWrapEl} data-hero-item>
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
							<IconMail class="h-[1.05rem] w-[1.05rem]" />
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
							<IconWhatsapp class="h-[1.05rem] w-[1.05rem]" />
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
							<IconSparkle class="h-[1.05rem] w-[1.05rem]" />
						</span>
						Ver trabalhos
					</a>
				</div>
			</div>

			<div class="hero-availability text-muted mt-7" bind:this={availabilityEl} data-hero-item>
				<span class="hero-availability-dot" data-status={availabilityStatus} aria-hidden="true"
				></span>
				<span class="hero-availability-text">{availabilityText}</span>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-reveal [data-hero-item] {
		opacity: 0;
		transform: translateY(14px);
	}

	.hero-showcase {
		position: relative;
		margin: 0 auto 1.5rem;
		width: min(560px, 100%);
		height: 220px;
	}

	.hero-showcase-bleed {
		width: 100vw;
		margin-left: calc(50% - 50vw);
		overflow-x: clip;
	}

	@supports not (overflow: clip) {
		.hero-showcase-bleed {
			overflow-x: hidden;
		}
	}

	.hero-showcase-card {
		--card-y: 0px;
		--card-scale: 1;
		--card-transform: translate(-50%, -50%);
		position: absolute;
		top: 50%;
		left: 50%;
		width: 220px;
		height: 180px;
		transform: var(--card-transform) translateY(var(--card-y)) scale(var(--card-scale));
		border-radius: 26px;
		border: 1px solid transparent;
		background-position: center;
		background-size: cover;
		box-shadow: var(--shadow-2);
		overflow: hidden;
		transition:
			transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 260ms cubic-bezier(0.16, 1, 0.3, 1),
			border-color 260ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.hero-showcase-left {
		--card-transform: translate(calc(-50% - 160px), calc(-50% + 14px)) rotate(-10deg);
		filter: grayscale(0.1);
	}

	.hero-showcase-center {
		z-index: 1;
		width: 240px;
		height: 196px;
		--card-transform: translate(-50%, -50%);
	}

	.hero-showcase-right {
		--card-transform: translate(calc(-50% + 160px), calc(-50% + 14px)) rotate(10deg);
		filter: grayscale(0.12);
	}

	.hero-showcase-card:hover {
		z-index: 3;
		border-color: rgba(255, 255, 255, 0.92);
		box-shadow:
			0 0 0 3px rgba(255, 255, 255, 0.9),
			var(--shadow-2);
		transform: var(--card-transform) translateY(calc(var(--card-y) - 8px))
			scale(calc(var(--card-scale) * 1.06));
	}

	.hero-availability {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		font-size: 0.95rem;
	}

	.hero-availability-dot {
		width: 10px;
		height: 10px;
		border-radius: 9999px;
		background: #22c55e;
		box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.16);
		animation: hero-dot-pulse 1.4s ease-in-out infinite;
	}

	.hero-availability-dot[data-status='busy'] {
		background: #f59e0b;
		box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.16);
	}

	.hero-availability-dot[data-status='unavailable'] {
		background: #ef4444;
		box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.16);
	}

	@keyframes hero-dot-pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(0.84);
			opacity: 0.75;
		}
	}

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

		.hero-availability-dot {
			animation: none;
		}

		.hero-showcase-card {
			transition: none;
		}
	}

	@media (max-width: 639px) {
		.hero-showcase {
			height: 200px;
			width: min(520px, 100%);
			margin-bottom: 1.25rem;
		}

		.hero-showcase-card {
			width: 200px;
			height: 170px;
		}

		.hero-showcase-left {
			--card-transform: translate(calc(-50% - 112px), calc(-50% + 14px)) rotate(-9deg);
		}

		.hero-showcase-center {
			width: 220px;
			height: 188px;
		}

		.hero-showcase-right {
			--card-transform: translate(calc(-50% + 112px), calc(-50% + 14px)) rotate(9deg);
		}

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
