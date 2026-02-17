<script lang="ts">
	import { tick } from 'svelte';

	type Step = {
		src: string;
		alt: string;
		label: string;
	};

	type Props = {
		steps: Step[];
		onFinished?: () => void;
	};

	let { steps, onFinished }: Props = $props();

	let overlayEl = $state<HTMLDivElement | null>(null);
	let gridEl = $state<HTMLDivElement | null>(null);
	let cellEls = $state<HTMLDivElement[]>([]);
	let labelEls = $state<HTMLDivElement[]>([]);

	let isVisible = $state(true);

	function sleep(ms: number) {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}

	$effect(() => {
		if (!isVisible) return;
		if (!steps?.length) return;
		if (!overlayEl || !gridEl) return;

		const overlay = overlayEl;
		const grid = gridEl;

		let cancelled = false;
		const controls: Array<{ stop?: () => void }> = [];

		const stopAll = () => {
			for (const c of controls) c.stop?.();
			controls.length = 0;
		};

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

		const run = async () => {
			const { animate } = await import('motion');

			stopAll();

			const prefersReducedMotion =
				typeof window !== 'undefined' &&
				window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

			// ── Reduced motion: show last image + label, then fade out ──
			if (prefersReducedMotion) {
				for (const cell of cellEls) {
					cell.style.opacity = '0';
				}
				const lastIdx = steps.length - 1;
				if (cellEls[lastIdx]) {
					cellEls[lastIdx].style.opacity = '1';
					cellEls[lastIdx].style.transform = 'none';
				}
				if (labelEls[lastIdx]) {
					labelEls[lastIdx].style.opacity = '1';
				}
				await sleep(1800);
				if (cancelled) return;
				overlay.style.opacity = '0';
				overlay.style.transition = 'opacity 0.5s ease';
				await sleep(500);
				if (cancelled) return;
				isVisible = false;
				onFinished?.();
				return;
			}

			// ── Phase 0: Initial state ──
			overlay.style.opacity = '1';
			grid.style.opacity = '0';
			grid.style.transform = 'scale(0.92)';

			for (const cell of cellEls) {
				cell.style.opacity = '0';
				cell.style.transform = 'scale(0.88)';
			}
			for (const label of labelEls) {
				label.style.opacity = '0';
				label.style.transform = 'translateY(12px)';
			}

			await sleep(200);
			if (cancelled) return;

			// ── Phase 1: Grid entrance with spring ──
			grid.style.willChange = 'transform, opacity';
			const gridReveal = animate(
				grid,
				{ opacity: [0, 1], transform: ['scale(0.92)', 'scale(1.02)', 'scale(1)'] },
				{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }
			);
			controls.push(gridReveal);

			// Stagger cells in
			for (let i = 0; i < cellEls.length; i++) {
				if (cancelled) return;
				const cell = cellEls[i];
				if (!cell) continue;
				cell.style.willChange = 'transform, opacity';
				const delay = 0.08 * i;
				const ctrl = animate(
					cell,
					{ opacity: [0, 1], transform: ['scale(0.88)', 'scale(1.03)', 'scale(1)'] },
					{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }
				);
				controls.push(ctrl);
			}

			await sleep(700);
			if (cancelled) return;

			// ── Phase 2: Spotlight sequence ──
			for (let i = 0; i < steps.length; i++) {
				if (cancelled) return;

				// Highlight active cell, dim others
				for (let j = 0; j < cellEls.length; j++) {
					const cell = cellEls[j];
					if (!cell) continue;
					cell.style.willChange = 'transform, opacity';

					if (j === i) {
						controls.push(
							animate(
								cell,
								{
									opacity: 1,
									transform: 'scale(1.08)',
									filter: 'brightness(1.1)'
								},
								{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }
							)
						);
					} else {
						controls.push(
							animate(
								cell,
								{
									opacity: 0.3,
									transform: 'scale(0.95)',
									filter: 'brightness(0.6)'
								},
								{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }
							)
						);
					}
				}

				// Show label
				const label = labelEls[i];
				if (label) {
					label.style.willChange = 'transform, opacity';
					controls.push(
						animate(
							label,
							{
								opacity: [0, 1],
								transform: ['translateY(12px)', 'translateY(0px)'],
								filter: ['blur(4px)', 'blur(0px)']
							},
							{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }
						)
					);
				}

				await sleep(1100);
				if (cancelled) return;

				// Hide label before next
				if (label && i < steps.length - 1) {
					controls.push(
						animate(
							label,
							{
								opacity: 0,
								transform: 'translateY(-8px)',
								filter: 'blur(4px)'
							},
							{ duration: 0.25, ease: [0.7, 0, 0.84, 0] }
						)
					);
					await sleep(200);
					if (cancelled) return;
				}
			}

			// ── Phase 3: Convergence — last image grows, others fade ──
			const lastIdx = steps.length - 1;

			for (let j = 0; j < cellEls.length; j++) {
				const cell = cellEls[j];
				if (!cell) continue;
				cell.style.willChange = 'transform, opacity';

				if (j === lastIdx) {
					controls.push(
						animate(
							cell,
							{
								transform: 'scale(1.15)',
								opacity: 1,
								filter: 'brightness(1.15)'
							},
							{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }
						)
					);
				} else {
					controls.push(
						animate(
							cell,
							{ opacity: 0, transform: 'scale(0.8)' },
							{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }
						)
					);
				}
			}

			// Fade last label
			const lastLabel = labelEls[lastIdx];
			if (lastLabel) {
				controls.push(
					animate(
						lastLabel,
						{ opacity: 0, transform: 'translateY(-6px)' },
						{ duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: 0.3 }
					)
				);
			}

			await sleep(800);
			if (cancelled) return;

			// ── Phase 4: Reveal site ──
			grid.style.willChange = 'transform, opacity';
			controls.push(
				animate(
					grid,
					{ opacity: 0, transform: 'scale(0.9)' },
					{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }
				)
			);
			await sleep(300);
			if (cancelled) return;

			overlay.style.willChange = 'clip-path';
			overlay.style.clipPath = 'inset(0% 0% 0% 0%)';
			controls.push(
				animate(
					overlay,
					{ clipPath: 'inset(0% 0% 100% 0%)' },
					{ duration: 0.7, ease: [0.8, 0, 0.1, 1] }
				)
			);
			await sleep(700);

			if (cancelled) return;

			// Clean up will-change
			grid.style.willChange = 'auto';
			for (const cell of cellEls) {
				if (cell) cell.style.willChange = 'auto';
			}

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
		class="fixed inset-0 z-(--z-max) grid place-items-center bg-neutral-950"
		aria-hidden="true"
	>
		<!-- Screen reader status -->
		<div class="sr-only" role="status" aria-live="polite">Carregando portfólio</div>

		<div class="flex flex-col items-center gap-8">
			<!-- 2×2 Grid -->
			<div bind:this={gridEl} class="grid grid-cols-2 gap-3 sm:gap-4">
				{#each steps as step, i (step.src)}
					<div
						bind:this={cellEls[i]}
						class="intro-cell group relative aspect-square w-[min(38vw,180px)] overflow-hidden rounded-2xl border border-white/10 sm:w-[min(38vw,200px)]"
					>
						<img
							class="h-full w-full object-cover"
							src={step.src}
							alt={step.alt}
							loading="eager"
							fetchpriority={i === 0 ? 'high' : 'auto'}
							decoding="async"
						/>
						<!-- Subtle vignette -->
						<div
							class="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]"
						></div>
					</div>
				{/each}
			</div>

			<!-- Labels (positioned below grid) -->
			<div class="relative h-12 w-[min(80vw,420px)]">
				{#each steps as step, i (step.src)}
					<div
						bind:this={labelEls[i]}
						class="absolute inset-0 flex items-center justify-center text-center"
						style="opacity: 0;"
					>
						<span class="text-lg font-medium tracking-tight text-white/90 sm:text-xl">
							{step.label}
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.intro-cell {
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}
</style>
