import type { Component } from 'svelte';
import IconSvelte from '$lib/components/icons/icon-svelte.svelte';
import IconTailwindcss from '$lib/components/icons/icon-tailwindcss.svelte';
import IconReact from '$lib/components/icons/icon-react.svelte';
import IconTypescript from '$lib/components/icons/icon-typescript.svelte';
import IconJavascript from '$lib/components/icons/icon-javascript.svelte';
import IconBun from '$lib/components/icons/icon-bun.svelte';
import IconCloudflare from '$lib/components/icons/icon-cloudflare.svelte';
import IconShopify from '$lib/components/icons/icon-shopify.svelte';

export const TECH_ICONS = {
	Svelte: IconSvelte,
	SvelteKit: IconSvelte,
	Tailwindcss: IconTailwindcss,
	React: IconReact,
	'React Native': IconReact,
	'Next.js': IconReact,
	TypeScript: IconTypescript,
	JavaScript: IconJavascript,
	Bun: IconBun,
	Cloudflare: IconCloudflare,
	Shopify: IconShopify
};
