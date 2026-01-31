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
		// Check refs synchronously so $effect tracks them as dependencies
		if (!overlayEl || !imageWrapEl || !imageEl) return;

		// Capture refs for TypeScript narrowing inside async function
		const overlay = overlayEl;
		const imageWrap = imageWrapEl;
		const image = imageEl;

		let cancelled = false;
		const controls: Array<{ stop?: () => void }> = [];

		const stopAll = () => {
			for (const c of controls) c.stop?.();
			controls.length = 0;
		};

		const run = async () => {
			const { animate } = await import('motion');

			stopAll();
			showText = false;

			overlay.style.opacity = '1';
			overlay.style.transform = 'translateY(0)';

			const prefersReducedMotion =
				typeof window !== 'undefined' &&
				window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

			image.style.opacity = '1';
			image.style.transform = 'none';

			const imageRevealMs = prefersReducedMotion ? 0 : 1200;

			if (!prefersReducedMotion) {
				imageWrap.style.opacity = '0';
				imageWrap.style.transform = 'scale(0.92)';
				imageWrap.style.willChange = 'transform, opacity';

				const revealControls = animate(
					imageWrap,
					{
						opacity: [0, 1],
						transform: ['scale(0.92)', 'scale(1.02)', 'scale(1)']
					},
					{ duration: imageRevealMs / 1000, ease: [0.16, 1, 0.3, 1] }
				);

				controls.push(revealControls);

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

				await waitFor(revealControls, imageRevealMs);
			} else {
				imageWrap.style.opacity = '1';
				imageWrap.style.transform = 'none';
				imageWrap.style.filter = 'none';
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
				textEl.style.transform = 'translateY(8px)';
				textEl.style.filter = 'blur(4px)';

				controls.push(
					animate(
						textEl,
						{ opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
						{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }
					)
				);
				await sleep(switchDelayMs);
				if (cancelled) return;

				controls.push(
					animate(
						textEl,
						{ opacity: 0, transform: 'translateY(-8px)', filter: 'blur(4px)' },
						{ duration: 0.35, ease: [0.7, 0, 0.84, 0] }
					)
				);
				await sleep(280);
				if (cancelled) return;
			}

			const revealDuration = Math.max(0.1, revealDurationMs / 1000);

			if (!prefersReducedMotion) {
				overlay.style.clipPath = 'inset(0% 0% 0% 0%)';
				overlay.style.willChange = 'clip-path';
			}

			controls.push(
				prefersReducedMotion
					? animate(overlay, { opacity: 0 }, { duration: revealDuration, ease: 'easeInOut' })
					: animate(
							overlay,
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
		class="fixed inset-0 z-(--z-max) grid place-items-center bg-black text-white"
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
