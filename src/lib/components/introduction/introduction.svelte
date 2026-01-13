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
		imageSrc = 'https://images.unsplash.com/photo-1520975958225-44b5481a3c5f?auto=format&fit=crop&w=1200&q=80',
		imageAlt = 'Placeholder portrait',
		onFinished
	}: Props = $props();

	let overlayEl = $state<HTMLDivElement | null>(null);
	let imageWrapEl = $state<HTMLDivElement | null>(null);
	let imageEl = $state<HTMLImageElement | null>(null);
	let textEl = $state<HTMLDivElement | null>(null);

	let isVisible = $state(true);
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

			overlayEl.style.opacity = '1';
			overlayEl.style.transform = 'translateY(0)';

			imageEl.style.opacity = '1';
			imageEl.style.transform = 'none';

			const prefersReducedMotion =
				typeof window !== 'undefined' &&
				window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

			const imageRevealMs = prefersReducedMotion ? 0 : 900;
			imageWrapEl.style.clipPath = 'inset(0% 0% 100% 0%)';
			imageWrapEl.style.willChange = 'clip-path';

			if (!prefersReducedMotion) {
				controls.push(
					animate(
						imageWrapEl,
						{ clipPath: 'inset(0% 0% 0% 0%)' },
						{ duration: imageRevealMs / 1000, ease: [0.42, 0, 1, 1] }
					)
				);
			} else {
				imageWrapEl.style.clipPath = 'inset(0% 0% 0% 0%)';
			}

			await sleep(imageRevealMs);
			if (cancelled) return;

			for (let i = 0; i < texts.length; i++) {
				currentIndex = i;
				await tick();
				if (cancelled) return;
				if (!textEl) continue;

				textEl.style.opacity = '0';
				textEl.style.transform = 'translateY(10px)';

				controls.push(animate(textEl, { opacity: 1, y: 0 }, { duration: 0.35, ease: 'easeOut' }));
				await sleep(switchDelayMs);
				if (cancelled) return;

				controls.push(animate(textEl, { opacity: 0, y: -10 }, { duration: 0.25, ease: 'easeIn' }));
				await sleep(250);
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
							{ duration: revealDuration, ease: [0.42, 0, 1, 1] }
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
		class="fixed inset-0 z-50 grid place-items-center bg-black text-white"
		aria-hidden="true"
	>
		<div class="relative grid place-items-center">
			<div
				bind:this={imageWrapEl}
				class="relative aspect-square w-[min(72vw,420px)] overflow-hidden"
			>
				<img
					bind:this={imageEl}
					class="absolute inset-0 h-full w-full object-cover"
					src={imageSrc}
					alt={imageAlt}
					loading="eager"
					decoding="async"
				/>
			</div>

			{#key currentIndex}
				<div
					bind:this={textEl}
					class="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center"
				>
					<div class="text-xl font-medium tracking-tight text-balance sm:text-2xl">
						{texts[currentIndex]}
					</div>
				</div>
			{/key}
		</div>
	</div>
{/if}
