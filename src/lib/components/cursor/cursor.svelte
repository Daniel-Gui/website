<script lang="ts">
	type Props = {
		size?: number;
		hiddenNativeCursor?: boolean;
		class?: string;
	};

	let { size = 18, hiddenNativeCursor = true, class: className = '' }: Props = $props();

	let x = $state(-100);
	let y = $state(-100);
	let isVisible = $state(false);
	let isCoarse = $state(false);
	let prefersReducedMotion = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;

		isCoarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
		prefersReducedMotion =
			window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

		if (isCoarse) return;

		let rafId = 0;
		let nextX = x;
		let nextY = y;

		const onPointerMove = (event: PointerEvent) => {
			nextX = event.clientX;
			nextY = event.clientY;
			isVisible = true;

			if (rafId) return;
			rafId = window.requestAnimationFrame(() => {
				rafId = 0;
				x = nextX;
				y = nextY;
			});
		};

		const onPointerOut = (event: PointerEvent) => {
			if (event.relatedTarget === null) isVisible = false;
		};

		const onVisibilityChange = () => {
			if (document.visibilityState === 'hidden') isVisible = false;
		};

		window.addEventListener('pointermove', onPointerMove, { passive: true });
		window.addEventListener('pointerout', onPointerOut, { passive: true });
		document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });

		return () => {
			if (rafId) window.cancelAnimationFrame(rafId);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerout', onPointerOut);
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	});

	$effect(() => {
		if (typeof document === 'undefined') return;

		if (hiddenNativeCursor && !isCoarse) {
			document.documentElement.dataset.cursor = 'on';
			return () => {
				delete document.documentElement.dataset.cursor;
			};
		}

		delete document.documentElement.dataset.cursor;
	});
</script>

{#if !isCoarse}
	<div
		class={'cursor ' + className}
		class:is-visible={isVisible}
		class:reduced={prefersReducedMotion}
		aria-hidden="true"
		style={`--cursor-size:${size}px; --cursor-x:${x}px; --cursor-y:${y}px;`}
	>
		<div class="cursor-core"></div>
	</div>
{/if}

<style>
	:global(html[data-cursor='on']),
	:global(html[data-cursor='on'] body) {
		cursor: none;
	}

	:global(html[data-cursor='on'] a),
	:global(html[data-cursor='on'] button),
	:global(html[data-cursor='on'] input),
	:global(html[data-cursor='on'] textarea),
	:global(html[data-cursor='on'] select),
	:global(html[data-cursor='on'] label) {
		cursor: none;
	}

	.cursor {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9999;
		pointer-events: none;
		width: var(--cursor-size);
		height: var(--cursor-size);
		transform: translate3d(
			calc(var(--cursor-x) - (var(--cursor-size) / 2)),
			calc(var(--cursor-y) - (var(--cursor-size) / 2)),
			0
		);
		opacity: 0;
		transition: opacity 160ms ease;
	}

	.cursor.is-visible {
		opacity: 1;
	}

	.cursor-core {
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 9999px;
		background: conic-gradient(from 0deg, #f4f4f5, #d4d4d8, #a1a1aa, #52525b, #e4e4e7, #f4f4f5);
		box-shadow:
			0 0 0 1px rgba(0, 0, 0, 0.08),
			0 18px 40px rgba(0, 0, 0, 0.14);
		filter: blur(0px);
		transform-origin: 50% 50%;
		animation: cursor-spin 1.15s linear infinite;
	}

	.cursor-core::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 9999px;
		background: radial-gradient(
			circle at 30% 30%,
			rgba(255, 255, 255, 0.85),
			rgba(255, 255, 255, 0) 55%
		);
		mix-blend-mode: overlay;
	}

	.cursor.reduced .cursor-core {
		animation: none;
	}

	@keyframes cursor-spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
