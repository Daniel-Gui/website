<script lang="ts">
	import { tick } from 'svelte';

	type Props = {
		texts: string[];
		switchDelayMs?: number;
		revealDurationMs?: number;
		imageSrc?: string;
		imageAlt?: string;
		onFinished?: () => void;
	};

	let {
		texts,
		switchDelayMs = 2000,
		revealDurationMs = 700,
		imageSrc = '/images/website-introduction/website-introduction.webp',
		imageAlt = 'Imagem de introdução do portfólio',
		onFinished
	}: Props = $props();

	let overlayEl = $state<HTMLDivElement | null>(null);
	let imageWrapEl = $state<HTMLDivElement | null>(null);
	let imageEl = $state<HTMLImageElement | null>(null);
	let textEl = $state<HTMLDivElement | null>(null);

	let isVisible = $state(true);
	let showText = $state(false);
	let currentIndex = $state(0);

	function sleep(ms: number) {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}

	$effect(() => {
		if (!isVisible) return;
		if (!texts?.length) return;

		let cancelled = false;
		const controls: Array<{ stop?: () => void }> = [];

		const stopAll = () => {
			for (const c of controls) c.stop?.();
			controls.length = 0;
		};

		const run = async () => {
			if (!overlayEl || !imageWrapEl || !imageEl) return;
			const { animate } = await import('motion');

			stopAll();
			showText = false;

			overlayEl.style.opacity = '1';
			overlayEl.style.transform = 'translateY(0)';

			const prefersReducedMotion =
				typeof window !== 'undefined' &&
				window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

			imageEl.style.opacity = '1';
			imageEl.style.transform = prefersReducedMotion ? 'none' : 'scale(0.92)';
			imageEl.style.willChange = prefersReducedMotion ? '' : 'transform';

			const imageRevealMs = prefersReducedMotion ? 0 : 900;
			imageWrapEl.style.clipPath = 'inset(0% 0% 100% 0%)';
			imageWrapEl.style.willChange = 'clip-path';

			if (!prefersReducedMotion) {
				const wipeControls = animate(
					imageWrapEl,
					{ clipPath: 'inset(0% 0% 0% 0%)' },
					{ duration: imageRevealMs / 1000, ease: [0.42, 0, 1, 1] }
				);
				const zoomControls = animate(
					imageEl,
					{ scale: 1 },
					{ type: 'spring', stiffness: 260, damping: 18, delay: 0.12 }
				);
				controls.push(wipeControls, zoomControls);

				const waitFor = async (c: unknown, fallbackMs: number) => {
					if (
						typeof c === 'object' &&
						c !== null &&
						'finished' in c &&
						(c as { finished?: Promise<unknown> }).finished
					) {
						try {
							await (c as { finished: Promise<unknown> }).finished;
						} catch {
							return;
						}
						return;
					}
					await sleep(fallbackMs);
				};

				await Promise.all([
					waitFor(wipeControls, imageRevealMs),
					waitFor(zoomControls, imageRevealMs)
				]);
			} else {
				imageWrapEl.style.clipPath = 'inset(0% 0% 0% 0%)';
				await tick();
			}

			if (cancelled) return;

			showText = true;
			await tick();
			if (cancelled) return;

			for (let i = 0; i < texts.length; i++) {
				currentIndex = i;
				await tick();
				if (cancelled) return;
				if (!textEl) continue;

				textEl.style.opacity = '0';
				textEl.style.transform = 'translateY(10px)';
				textEl.style.filter = 'blur(10px)';

				controls.push(
					animate(
						textEl,
						{ opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
						{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }
					)
				);
				await sleep(switchDelayMs);
				if (cancelled) return;

				controls.push(
					animate(
						textEl,
						{ opacity: 0, transform: 'translateY(-10px)', filter: 'blur(10px)' },
						{ duration: 0.45, ease: [0.7, 0, 0.84, 0] }
					)
				);
				await sleep(350);
				if (cancelled) return;
			}

			const revealDuration = Math.max(0.1, revealDurationMs / 1000);

			if (!prefersReducedMotion) {
				overlayEl.style.clipPath = 'inset(0% 0% 0% 0%)';
				overlayEl.style.willChange = 'clip-path';
			}

			controls.push(
				prefersReducedMotion
					? animate(overlayEl, { opacity: 0 }, { duration: revealDuration, ease: 'easeInOut' })
					: animate(
							overlayEl,
							{ clipPath: 'inset(100% 0% 0% 0%)' },
							{ duration: revealDuration, ease: [0.8, 0, 0.1, 1] }
						)
			);
			await sleep(revealDurationMs);

			if (cancelled) return;
			isVisible = false;
			onFinished?.();
		};

		run();

		return () => {
			cancelled = true;
			stopAll();
		};
	});
</script>

{#if isVisible}
	<div
		bind:this={overlayEl}
		class="fixed inset-0 z-[var(--z-max)] grid place-items-center bg-black text-white"
		aria-hidden="true"
	>
		<div class="relative grid place-items-center">
			<div
				bind:this={imageWrapEl}
				class="relative aspect-square w-[min(72vw,420px)] overflow-hidden rounded-full border border-white/10"
			>
				<picture class="absolute inset-0 block h-full w-full">
					<source
						srcset="/images/website-introduction/website-introduction.avif"
						type="image/avif"
					/>
					<source
						srcset="/images/website-introduction/website-introduction.webp"
						type="image/webp"
					/>
					<img
						bind:this={imageEl}
						class="h-full w-full object-cover"
						src={imageSrc}
						alt={imageAlt}
						loading="eager"
						fetchpriority="high"
						decoding="async"
					/>
				</picture>
			</div>

			{#if showText}
				{#key currentIndex}
					<div
						class="pointer-events-none absolute top-1/2 left-1/2 w-[min(92vw,900px)] -translate-x-1/2 -translate-y-1/2 px-6 text-center"
					>
						<div
							bind:this={textEl}
							class="text-4xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl"
						>
							{texts[currentIndex]}
						</div>
					</div>
				{/key}
			{/if}
		</div>
	</div>
{/if}
