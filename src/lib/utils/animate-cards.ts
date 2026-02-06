/**
 * Animation utilities for work cards using Motion.js
 * 
 * Performance guidelines followed (fixing-motion-performance):
 * - Uses only transform and opacity (compositor-only animations)
 * - Uses will-change temporarily and surgically
 * - Respects prefers-reduced-motion
 * - Batches DOM reads before writes
 * 
 * Animation principles (12 principles):
 * - Follow-through (overshoot-settle)
 * - Slow-in/slow-out (easing curves)
 * - Timing under 300ms for interactions
 */

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

/**
 * Timing constants for consistent animations across the app
 * Timing principle: keep interactions under 300ms
 */
export const CARD_ANIMATION = {
    /** Base duration for card transitions */
    duration: 0.35, // Slightly faster for snappier feel
    /** Stagger delay between cards */
    stagger: 0.05, // Reduced for faster perceived completion
    /** Easing curve: fast start, gentle settle (ease-out for entrances) */
    easeOut: [0.16, 1, 0.3, 1] as const,
    /** Easing curve: build momentum (ease-in for exits) */
    easeIn: [0.4, 0, 1, 1] as const
} as const;

export type AnimateCardsOptions = {
    /** Additional delay before animation starts */
    startDelay?: number;
    /** Override duration */
    duration?: number;
};

/**
 * Animates cards in with stagger, overshoot-settle effect
 * Uses transform + opacity only (compositor animations)
 * 
 * Performance: 
 * - Batches all style reads/writes
 * - Uses will-change temporarily for layer promotion
 * - Cleans up all inline styles after animation
 */
export async function animateCardsIn(
    cards: NodeListOf<HTMLElement> | HTMLElement[],
    options: AnimateCardsOptions = {}
): Promise<void> {
    if (cards.length === 0) return;

    // BATCH WRITE: Hide cards immediately BEFORE async import to prevent flash
    // This is a synchronous batch write - no interleaving with reads
    for (const card of cards) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.97)';
    }

    if (prefersReducedMotion()) {
        // Immediately show cards without animation
        for (const card of cards) {
            card.style.opacity = '1';
            card.style.transform = '';
        }
        return;
    }

    const { animate, stagger } = await import('motion');

    // BATCH WRITE: Set will-change before animation for layer promotion
    for (const card of cards) {
        card.style.willChange = 'opacity, transform';
    }

    const anim = animate(
        cards,
        {
            opacity: [0, 1],
            // Overshoot-settle (follow-through principle) - subtle for professional feel
            transform: [
                'translateY(20px) scale(0.97)',
                'translateY(-2px) scale(1.005)', // Reduced overshoot
                'translateY(0px) scale(1)'
            ]
        },
        {
            duration: options.duration ?? CARD_ANIMATION.duration,
            delay: stagger(CARD_ANIMATION.stagger, { startDelay: options.startDelay ?? 0 }),
            ease: CARD_ANIMATION.easeOut
        }
    );

    await anim.finished;

    // BATCH WRITE: Clean up all inline styles after animation
    for (const card of cards) {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.willChange = '';
    }
}

/**
 * Animates cards out with stagger effect
 * Uses transform + opacity only (compositor animations)
 * 
 * Performance:
 * - Exit animations are faster (70% of entrance duration)
 * - Uses will-change temporarily
 * - Leaves opacity at 0 for DOM removal
 */
export async function animateCardsOut(
    cards: NodeListOf<HTMLElement> | HTMLElement[],
    options: AnimateCardsOptions = {}
): Promise<void> {
    if (prefersReducedMotion() || cards.length === 0) {
        // Immediately hide cards without animation
        for (const card of cards) {
            card.style.opacity = '0';
        }
        return;
    }

    const { animate, stagger } = await import('motion');

    // BATCH WRITE: Set will-change before animation
    for (const card of cards) {
        card.style.willChange = 'opacity, transform';
    }

    // Exit is faster and more subtle (ease-in: build momentum before departure)
    const anim = animate(
        cards,
        {
            opacity: [1, 0],
            transform: ['translateY(0px) scale(1)', 'translateY(8px) scale(0.98)'] // Reduced distance
        },
        {
            duration: options.duration ?? CARD_ANIMATION.duration * 0.6, // Even faster exits
            delay: stagger(CARD_ANIMATION.stagger * 0.5, { startDelay: options.startDelay ?? 0 }),
            ease: CARD_ANIMATION.easeIn
        }
    );

    await anim.finished;

    // BATCH WRITE: Clean up will-change but keep opacity at 0
    for (const card of cards) {
        card.style.willChange = '';
        // Note: opacity stays at 0, transform stays to prevent flash on DOM removal
    }
}
