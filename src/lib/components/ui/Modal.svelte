<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		title?: string;
		children: Snippet;
		onclose?: () => void;
	}

	let { open = $bindable(false), title, children, onclose }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
		}
	}

	function handleBackdropClick() {
		close();
	}

	function close() {
		open = false;
		onclose?.();
	}

	$effect(() => {
		if (typeof document === 'undefined') return;

		if (open) {
			document.body.style.overflow = 'hidden';
			document.addEventListener('keydown', handleKeydown);
		}

		return () => {
			document.body.style.overflow = '';
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="modal-backdrop" onclick={handleBackdropClick}></div>
	<div
		class="modal-dialog"
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="modal-content glass-strong" onclick={(e) => e.stopPropagation()}>
			{#if title}
				<header class="modal-header">
					<h2 id="modal-title" class="modal-title">{title}</h2>
					<button type="button" class="modal-close" onclick={close} aria-label="Fechar modal">
						<svg
							class="size-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</header>
			{/if}
			<div class="modal-body">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 9998;
		background: rgb(0 0 0 / 0.6);
		backdrop-filter: blur(4px);
		animation: backdrop-enter 0.2s ease-out;
	}

	@keyframes backdrop-enter {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-dialog {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		pointer-events: none;
	}

	.modal-content {
		width: 100%;
		max-width: 480px;
		max-height: calc(100dvh - 2rem);
		overflow-y: auto;
		border-radius: var(--radius-xl);
		animation: modal-enter 0.2s ease-out;
		pointer-events: auto;
	}

	@keyframes modal-enter {
		from {
			opacity: 0;
			transform: scale(0.96) translateY(8px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid rgb(var(--border) / 0.1);
	}

	.modal-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: rgb(var(--fg));
	}

	.modal-close {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		margin: -0.5rem;
		border-radius: var(--radius-md);
		color: rgb(var(--muted));
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.modal-close:hover {
		background: rgb(var(--overlay) / 0.05);
		color: rgb(var(--fg));
	}

	.modal-body {
		padding: 1.5rem;
	}
</style>
