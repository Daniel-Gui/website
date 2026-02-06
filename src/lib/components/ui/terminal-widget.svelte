<script lang="ts">
	import { cn } from '$lib/utils';
	import { animate, stagger } from 'motion';
	import { SOCIAL_LINKS, WHATSAPP_URL, MAILTO_URL } from '$lib/data/links';

	interface HistoryEntry {
		type: 'command' | 'output' | 'error' | 'html';
		content: string;
		id: number;
	}

	interface Props {
		class?: string;
		/** Initial greeting message */
		greeting?: string;
		/** Maximum height class (e.g., 'max-h-80', 'max-h-96') */
		maxHeightClass?: string;
	}

	let {
		class: className = '',
		greeting = 'Bem-vindo! Digite "help" para ver os comandos.',
		maxHeightClass = 'max-h-80'
	}: Props = $props();

	let inputValue = $state('');
	let history = $state<HistoryEntry[]>([]);
	let inputRef = $state<HTMLInputElement | null>(null);
	let scrollRef = $state<HTMLDivElement | null>(null);
	let entryIdCounter = $state(0);

	// Initialize history with greeting on mount
	$effect(() => {
		if (history.length === 0) {
			history = [{ type: 'output', content: greeting, id: entryIdCounter++ }];
		}
	});

	const commands: Record<string, () => string | string[] | { type: 'html'; content: string }> = {
		help: () => [
			'Comandos disponíveis:',
			'  about    - Quem sou eu?',
			'  setup    - Meu hardware',
			'  contact  - Contato e redes',
			'  clear    - Limpar terminal',
			'  help     - Mostra esta mensagem'
		],
		about: () => [
			'╭─────────────────────────────────────╮',
			'│  👤 Daniel Gui',
			'│  📅 27 anos',
			'│  💼 Desenvolvedor Web, UX & Brand Designer',
			'│  ⏱️  5 anos de experiência',
			'│  📍 Belém do Pará, Brasil',
			'│  🎮 Hobbies: Video Games & Produção Musical',
			'╰─────────────────────────────────────╯'
		],
		setup: () => [
			'🖥️ Windows PC:',
			'   • MSI Gaming Wifi Motherboard',
			'   • AMD Ryzen 5 7600X',
			'   • RAM 16GB Team Group Elite Plus 5600MHz',
			'   • RTX 5060',
			'   • Water Cooler Black Rainbow Rise Mode',
			'   • 1TB SSD',
			'   • Monitor Ultrawide LG 29WK600',
			'   • Mouse Logitech G502 Hero',
			'   • Teclado Mecânico AtackShark K86 + Screen',
			'',
			'🍎 Apple:',
			'   • MacBook Air M1',
			'   • iPhone 14',
			'',
			'📱 Samsung:',
			'   • Galaxy Tab S8 Grafite',
			'   • S Pen'
		],
		contact: () => [
			'📬 Entre em contato:',
			`   📧 Email: ${SOCIAL_LINKS.EMAIL}`,
			`   💼 LinkedIn: ${SOCIAL_LINKS.LINKEDIN}`,
			`   📱 WhatsApp: +55 91 99310-5821`,
			'',
			'📄 Currículo:',
			`   🇧🇷 PT-BR: ${SOCIAL_LINKS.RESUME_PTBR}`,
			`   🇺🇸 English: ${SOCIAL_LINKS.RESUME_EN}`
		],
		clear: () => {
			history = [{ type: 'output', content: greeting, id: entryIdCounter++ }];
			return '';
		},
		// Easter egg 🥚
		alanzoka: () => {
			// Load Tenor embed script dynamically
			requestAnimationFrame(() => {
				if (!document.querySelector('script[src="https://tenor.com/embed.js"]')) {
					const script = document.createElement('script');
					script.src = 'https://tenor.com/embed.js';
					script.async = true;
					document.body.appendChild(script);
				} else {
					// Re-trigger Tenor embed processing
					(window as any).TENOR?.init?.();
				}
			});
			return {
				type: 'html' as const,
				content: `<div class="tenor-gif-embed my-2" data-postid="27194744" data-share-method="host" data-aspect-ratio="1.61616" data-width="100%" style="max-width: 200px;"><a href="https://tenor.com/view/alanzoka-gif-27194744">Alanzoka GIF</a></div>`
			};
		}
	};

	/**
	 * Animate new entries with staggered spring animation
	 */
	function animateNewEntries(count: number): void {
		requestAnimationFrame(() => {
			const entries = scrollRef?.querySelectorAll('.terminal-entry');
			if (!entries) return;

			// Get only the new entries
			const newEntries = Array.from(entries).slice(-count);
			if (newEntries.length === 0) return;

			animate(
				newEntries,
				{ opacity: [0, 1], y: [8, 0] },
				{
					type: 'spring',
					stiffness: 400,
					damping: 30,
					delay: stagger(0.05)
				}
			);
		});
	}

	function processCommand(cmd: string): void {
		const trimmed = cmd.trim().toLowerCase();

		// Add command to history
		history = [...history, { type: 'command', content: cmd, id: entryIdCounter++ }];

		if (!trimmed) return;

		const commandFn = commands[trimmed];
		let newEntriesCount = 1; // command itself

		if (commandFn) {
			const result = commandFn();
			if (result) {
				// Check if it's an HTML result (easter egg)
				if (typeof result === 'object' && 'type' in result && result.type === 'html') {
					history = [...history, { type: 'html', content: result.content, id: entryIdCounter++ }];
					newEntriesCount++;
				} else {
					const lines = Array.isArray(result) ? result : [result as string];
					lines.forEach((line) => {
						history = [...history, { type: 'output', content: line, id: entryIdCounter++ }];
						newEntriesCount++;
					});
				}
			}
		} else {
			history = [
				...history,
				{
					type: 'error',
					content: `Comando não encontrado: ${trimmed}. Digite "help" para ver os comandos.`,
					id: entryIdCounter++
				}
			];
			newEntriesCount++;
		}

		// Animate and scroll
		animateNewEntries(newEntriesCount);
		requestAnimationFrame(() => {
			scrollRef?.scrollTo({ top: scrollRef.scrollHeight, behavior: 'smooth' });
		});
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			processCommand(inputValue);
			inputValue = '';
		}
	}

	function focusInput(): void {
		inputRef?.focus();
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class={cn(
		'flex w-full flex-col overflow-hidden rounded-3xl border border-border/10 bg-surface/50 text-fg backdrop-blur-md',
		maxHeightClass,
		className
	)}
	onclick={focusInput}
	onkeydown={(e) => e.key === 'Enter' && focusInput()}
	tabindex="-1"
	role="application"
	aria-label="Interactive Terminal"
>
	<!-- Terminal Header -->
	<div class="flex shrink-0 items-center gap-2 border-b border-border/10 px-4 py-3">
		<!-- Window Controls -->
		<div class="flex gap-1.5">
			<div
				class="h-3 w-3 rounded-full bg-error/80 transition-transform duration-150 hover:scale-110"
			></div>
			<div
				class="h-3 w-3 rounded-full bg-warning/80 transition-transform duration-150 hover:scale-110"
			></div>
			<div
				class="h-3 w-3 rounded-full bg-success/80 transition-transform duration-150 hover:scale-110"
			></div>
		</div>
		<span class="ml-2 font-mono text-[10px] font-medium tracking-[0.2em] text-muted uppercase">
			Terminal
		</span>
	</div>

	<!-- Terminal Body with scroll -->
	<div
		bind:this={scrollRef}
		class="flex-1 touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain p-4 font-mono text-xs leading-relaxed md:text-sm"
	>
		{#each history as entry (entry.id)}
			<div class="terminal-entry mb-1">
				{#if entry.type === 'command'}
					<div class="flex gap-2">
						<span class="shrink-0 text-accent">❯</span>
						<span class="wrap-break-word text-fg">{entry.content}</span>
					</div>
				{:else if entry.type === 'error'}
					<span class="wrap-break-word text-error">{entry.content}</span>
				{:else if entry.type === 'html'}
					{@html entry.content}
				{:else}
					<span class="wrap-break-word whitespace-pre-wrap text-muted">{entry.content}</span>
				{/if}
			</div>
		{/each}

		<!-- Input Line -->
		<div class="mt-2 flex items-center gap-2">
			<span class="text-accent">❯</span>
			<input
				bind:this={inputRef}
				bind:value={inputValue}
				onkeydown={handleKeydown}
				type="text"
				class="flex-1 border-none bg-transparent p-0 text-fg caret-accent shadow-none ring-0 outline-none placeholder:text-muted/50 focus:border-none focus:ring-0 focus:outline-none"
				placeholder="Type a command..."
				spellcheck="false"
				autocomplete="off"
				autocapitalize="off"
				aria-label="Terminal input"
			/>
		</div>
	</div>
</div>
