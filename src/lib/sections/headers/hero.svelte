<script lang="ts">
	import { tick } from 'svelte';
	import { introDone } from '$lib/stores/intro';
	import IconMail from '$lib/components/icons/icon-mail.svelte';
	import IconSparkle from '$lib/components/icons/icon-sparkle.svelte';
	import IconWhatsapp from '$lib/components/icons/icon-whatsapp.svelte';
	import IconArrowUpRight from '$lib/components/icons/icon-arrow-up-right.svelte';
	import { cn } from '$lib/utils';
	import { lenis } from '$lib/utils/lenis.svelte';

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

	const EMAIL = 'dandanielofc@gmail.com';
	const WHATSAPP_E164 = '5591993105821';

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
	let blogEl = $state<HTMLAnchorElement | null>(null);
	let worksEl = $state<HTMLAnchorElement | null>(null);
	let activeEl = $state<HTMLAnchorElement | null>(null);
	let headingEl = $state<HTMLHeadingElement | null>(null);
	let leadTextEl = $state<HTMLParagraphElement | null>(null);
	let badgeEl = $state<HTMLDivElement | null>(null);
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

	const scrollToWorks = (e: MouseEvent) => {
		e.preventDefault();
		if (lenis.current) {
			lenis.current.scrollTo('#trabalhos', {
				duration: 1.2,
				easing: (t: number) => 1 - Math.pow(1 - t, 3)
			});
		} else {
			document.querySelector('#trabalhos')?.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const scrollToBlog = (e: MouseEvent) => {
		e.preventDefault();
		if (lenis.current) {
			lenis.current.scrollTo('#blog', {
				duration: 1.2,
				easing: (t: number) => 1 - Math.pow(1 - t, 3)
			});
		} else {
			document.querySelector('#blog')?.scrollIntoView({ behavior: 'smooth' });
		}
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

			const items = [showcaseEl, headingEl, leadTextEl, badgeEl, ctaWrapEl, availabilityEl].filter(
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
			if (headingEl) headingEl.style.filter = 'blur(12px)';
			if (leadTextEl) leadTextEl.style.filter = 'blur(12px)';
			if (badgeEl) badgeEl.style.filter = 'blur(12px)';

			await new Promise((r) => setTimeout(r, revealStartDelayMs));

			const animations: Promise<unknown>[] = [];

			if (showcaseCards.length) {
				if (showcaseEl) {
					animations.push(
						animate(
							showcaseEl,
							{ opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
							{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }
						).finished
					);
				}

				showcaseCards.forEach((el, index) => {
					const base =
						getComputedStyle(el).getPropertyValue('--card-transform').trim() ||
						'translate(-50%, -50%)';

					animations.push(
						animate(
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
							{
								duration: 1.2,
								ease: [0.16, 1, 0.3, 1],
								delay: index * 0.15
							}
						).finished
					);
				});
			} else if (showcaseEl) {
				animations.push(
					animate(
						showcaseEl,
						{ opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
						{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }
					).finished
				);
			}

			const contentDelay = 0.2;
			const staggerDelay = 0.15;

			if (headingEl) {
				animations.push(
					animate(
						headingEl,
						{
							opacity: [0, 1],
							transform: ['translateY(14px)', 'translateY(0px)'],
							filter: ['blur(12px)', 'blur(0px)']
						} as unknown as Record<string, unknown>,
						{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: contentDelay }
					).finished
				);
			}

			if (leadTextEl) {
				animations.push(
					animate(
						leadTextEl,
						{
							opacity: [0, 1],
							transform: ['translateY(14px)', 'translateY(0px)'],
							filter: ['blur(12px)', 'blur(0px)']
						} as unknown as Record<string, unknown>,
						{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: contentDelay + staggerDelay }
					).finished
				);
			}

			if (badgeEl) {
				animations.push(
					animate(
						badgeEl,
						{
							opacity: [0, 1],
							transform: ['translateY(14px)', 'translateY(0px)'],
							filter: ['blur(12px)', 'blur(0px)']
						} as unknown as Record<string, unknown>,
						{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: contentDelay + staggerDelay * 2 }
					).finished
				);
			}

			if (ctaWrapEl) {
				animations.push(
					animate(
						ctaWrapEl,
						{ opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
						{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: contentDelay + staggerDelay * 3 }
					).finished
				);
			}

			if (availabilityEl) {
				animations.push(
					animate(
						availabilityEl,
						{ opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
						{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: contentDelay + staggerDelay * 4 }
					).finished
				);
			}

			await Promise.all(animations);

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
		})();
	});
</script>

<section class={cn('hero-surface', !heroRevealed && 'hero-reveal')}>
	<!-- Decorative Grid Background -->
	<div class="pointer-events-none absolute inset-0 z-0 opacity-[0.03]" aria-hidden="true">
		<svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
					<path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#hero-grid)" />
		</svg>
	</div>

	<div class="container-page relative z-10 pt-20 pb-20 sm:pt-24 sm:pb-24">
		<div class="relative">
			<div class="mx-auto max-w-[880px] space-y-10 text-center">
				<div class="hero-showcase-bleed">
					<div bind:this={showcaseEl} class="hero-showcase" aria-hidden="true" data-hero-item>
						<div class="hero-showcase-card hero-showcase-left" data-showcase-card>
							<picture class="hero-showcase-media">
								<source srcset="/images/hero/hero-image-01.avif" type="image/avif" />
								<source srcset="/images/hero/hero-image-01.webp" type="image/webp" />
								<img
									src="/images/hero/hero-image-01.webp"
									alt=""
									loading="eager"
									fetchpriority="low"
									decoding="async"
								/>
							</picture>
						</div>
						<div class="hero-showcase-card hero-showcase-center" data-showcase-card>
							<picture class="hero-showcase-media">
								<source srcset="/images/hero/hero-image-02.avif" type="image/avif" />
								<source srcset="/images/hero/hero-image-02.webp" type="image/webp" />
								<img
									src="/images/hero/hero-image-02.webp"
									alt=""
									loading="eager"
									fetchpriority="low"
									decoding="async"
								/>
							</picture>
						</div>
						<div class="hero-showcase-card hero-showcase-right" data-showcase-card>
							<picture class="hero-showcase-media">
								<source srcset="/images/hero/hero-image-03.avif" type="image/avif" />
								<source srcset="/images/hero/hero-image-03.webp" type="image/webp" />
								<img
									src="/images/hero/hero-image-03.webp"
									alt=""
									loading="eager"
									fetchpriority="low"
									decoding="async"
								/>
							</picture>
						</div>
					</div>
				</div>

				<h1
					class="text-foreground text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl"
					bind:this={headingEl}
					data-hero-item
				>
					Olá, eu sou o <span class="font-serif italic">Dan</span>
				</h1>

				<div class="mx-auto mt-6 flex max-w-[62ch] flex-col items-center gap-4">
					<p
						class="text-lg text-pretty text-muted sm:text-xl"
						bind:this={leadTextEl}
						data-hero-item
					>
						Atuo como <span class="font-bold">Product Designer</span> e
						<span class="font-bold">Desenvolvedor Frontend</span>, transformando problemas complexos
						em experiências digitais simples, funcionais e relevantes. Atualmente espalhando beleza
						no grupo
						<span class="font-serif italic">Ei,Beleza?</span>.
					</p>

					<div
						class="flex items-center gap-3 rounded-full border border-border/10 bg-surface/40 px-3 py-1.5 shadow-sm backdrop-blur-md"
						bind:this={badgeEl}
						data-hero-item
					>
						<span class="font-mono text-xs tracking-wider text-muted uppercase"
							>Belém, Pará, Brasil</span
						>
						<div class="h-3 w-px bg-border/20"></div>
						<div class="hero-flags">
							<span class="hero-flag">
								<img
									src="/flags/flag-belem.svg"
									alt="Bandeira de Belém"
									loading="lazy"
									decoding="async"
								/>
							</span>
							<span class="hero-flag">
								<img
									src="/flags/flag-para.svg"
									alt="Bandeira do Pará"
									loading="lazy"
									decoding="async"
								/>
							</span>
							<span class="hero-flag">
								<img
									src="/flags/flag-brasil.svg"
									alt="Bandeira do Brasil"
									loading="lazy"
									decoding="async"
								/>
							</span>
						</div>
					</div>
				</div>

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
								<IconMail class="size-[1.05rem]" />
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
								<IconWhatsapp class="size-[1.05rem]" />
							</span>
							WhatsApp
						</a>

						<a
							bind:this={blogEl}
							class="hero-item segmented-item"
							href="#blog"
							onpointerenter={onEnterItem}
							onfocus={onEnterItem}
							onclick={scrollToBlog}
						>
							<span class="hero-icon" aria-hidden="true">
								<IconArrowUpRight class="size-[1.05rem]" />
							</span>
							Blog
						</a>

						<a
							bind:this={worksEl}
							class="hero-item hero-item-primary segmented-item"
							href="#trabalhos"
							onpointerenter={onEnterItem}
							onfocus={onEnterItem}
							onclick={scrollToWorks}
						>
							<span class="hero-icon" aria-hidden="true">
								<IconSparkle class="size-[1.05rem]" />
							</span>
							Trabalhos
						</a>
					</div>
				</div>

				<div class="mt-7 flex justify-center" bind:this={availabilityEl} data-hero-item>
					<div
						class="flex items-center gap-2 rounded-full border border-border/10 bg-surface/40 px-4 py-2 shadow-sm backdrop-blur-md"
					>
						<span class="hero-availability-dot" data-status={availabilityStatus} aria-hidden="true"
						></span>
						<span class="font-mono text-xs font-medium tracking-wider text-muted uppercase"
							>{availabilityText}</span
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-reveal [data-hero-item] {
		opacity: 0;
		transform: translateY(14px);
	}

	.hero-surface {
		--hero-top: rgb(255 255 255);
		--hero-purple: rgba(91, 33, 182, 0.1);
		--hero-blue: rgba(37, 99, 235, 0.1);
		--hero-bottom: rgb(var(--bg));
		--hero-bleed-top: 120px;
		position: relative;
		isolation: isolate;
		overflow-x: clip;
	}

	:global(html.dark) .hero-surface {
		--hero-top: #05010a;
		--hero-purple: #5b21b6;
		--hero-blue: #2563eb;
	}

	@supports not (overflow: clip) {
		.hero-surface {
			overflow-x: hidden;
		}
	}

	.hero-surface h1 {
		color: rgb(var(--fg));
	}

	.hero-surface p.text-muted {
		color: rgb(var(--muted));
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
		height: 200px;
		transform: var(--card-transform) translateY(var(--card-y)) scale(var(--card-scale));
		border-radius: 20px;
		border: 1px solid rgb(var(--border) / 0.1);
		background: rgb(var(--surface) / 0.05);
		box-shadow: var(--shadow-2);
		overflow: hidden;
		transition:
			transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 260ms cubic-bezier(0.16, 1, 0.3, 1),
			border 260ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.hero-showcase-media {
		position: absolute;
		inset: 2px;
		border-radius: 18px;
		overflow: hidden;
		display: block;
		transition:
			inset 260ms cubic-bezier(0.16, 1, 0.3, 1),
			border-radius 260ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.hero-showcase-card:hover .hero-showcase-media {
		inset: 0;
		border-radius: 16px;
	}

	.hero-showcase-media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.hero-showcase-left {
		--card-transform: translate(calc(-50% - 160px), calc(-50% + 14px)) rotate(-10deg);
		filter: grayscale(0.1);
	}

	.hero-showcase-center {
		z-index: 1;
		width: 240px;
		height: 230px;
		--card-transform: translate(-50%, -50%);
	}

	.hero-showcase-right {
		--card-transform: translate(calc(-50% + 160px), calc(-50% + 14px)) rotate(10deg);
		filter: grayscale(0.12);
	}

	.hero-showcase-card:hover {
		z-index: 3;
		border: 4px solid white;
		box-shadow: var(--shadow-2);
		transform: var(--card-transform) translateY(calc(var(--card-y) - 8px))
			scale(calc(var(--card-scale) * 1.06));
	}

	.hero-location {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.hero-flags {
		--flags-overlap: -0.7rem;
		--flags-gap: 0.4rem;
		display: inline-flex;
		align-items: center;
	}

	.hero-flag {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 1.5rem;
		border-radius: 0.5rem;
		background: rgb(var(--surface) / 0.65);
		box-shadow: var(--shadow-1);
		overflow: hidden;
		transition:
			margin-left 260ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.hero-flag + .hero-flag {
		margin-left: var(--flags-overlap);
	}

	.hero-flags:hover .hero-flag + .hero-flag {
		margin-left: var(--flags-gap);
	}

	.hero-flags:hover .hero-flag {
		transform: translateY(-1px);
	}

	.hero-flag img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.hero-availability {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		font-size: 0.95rem;
		color: rgb(var(--fg) / 0.78);
		border: 1px solid rgb(var(--border) / 0.12);
		background: rgb(var(--surface) / 0.7);
		border-radius: 9999px;
		padding: 0.45rem 0.85rem;
		box-shadow: var(--shadow-1);
		backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
		-webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
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

	:global(html.dark) .hero-highlight {
		background: rgb(255 255 255 / 0.1);
		border: 1px solid rgb(255 255 255 / 0.05);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
			height: 200px;
		}

		.hero-showcase-left {
			--card-transform: translate(calc(-50% - 112px), calc(-50% + 14px)) rotate(-9deg);
		}

		.hero-showcase-center {
			width: 220px;
			height: 230px;
		}

		.hero-showcase-right {
			--card-transform: translate(calc(-50% + 112px), calc(-50% + 14px)) rotate(9deg);
		}

		.hero-segmented {
			display: grid;
			grid-template-columns: 1fr 1fr;
			padding: 0;
			gap: 0.55rem;
			border: 0;
			background: transparent;
			box-shadow: none;
			backdrop-filter: none;
			-webkit-backdrop-filter: none;
			width: min(420px, 100%);
			margin-inline: auto;
		}

		.hero-highlight {
			display: none;
		}

		.hero-item {
			width: 100%;
			margin-inline: 0;
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
