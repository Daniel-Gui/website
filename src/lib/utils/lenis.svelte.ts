import { browser } from '$app/environment';
import type Lenis from 'lenis';

/**
 * Svelte 5 reactive state for Lenis smooth scroll instance.
 * Replaces legacy Svelte 4 writable store.
 */
class LenisState {
	current = $state<Lenis | null>(null);

	set(instance: Lenis | null) {
		this.current = instance;
	}

	destroy() {
		this.current?.destroy();
		this.current = null;
	}
}

export const lenis = new LenisState();
