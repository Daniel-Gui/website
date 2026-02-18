// Types for vite-imagetools / @sveltejs/enhanced-img with query parameters
// Each unique `?enhanced&w=...` pattern needs a module declaration

// Hero images
declare module '*?enhanced&w=250;500' {
	import type { Picture } from 'vite-imagetools';
	const value: Picture;
	export default value;
}

// CameraRoll images
declare module '*?enhanced&w=340;650' {
	import type { Picture } from 'vite-imagetools';
	const value: Picture;
	export default value;
}

// Introduction / preloading images
declare module '*?enhanced&w=160;320' {
	import type { Picture } from 'vite-imagetools';
	const value: Picture;
	export default value;
}

// Small avatars (hero badges)
declare module '*?enhanced&w=64' {
	import type { Picture } from 'vite-imagetools';
	const value: Picture;
	export default value;
}

// Institution / training thumbnails
declare module '*?enhanced&w=150' {
	import type { Picture } from 'vite-imagetools';
	const value: Picture;
	export default value;
}

// Work / blog cover images (glob import uses query object, not this pattern)
// These are kept for any direct imports that might use this pattern
declare module '*?enhanced&w=340;500;750' {
	import type { Picture } from 'vite-imagetools';
	const value: Picture;
	export default value;
}

// Work content images
declare module '*?enhanced&w=500;800;1200' {
	import type { Picture } from 'vite-imagetools';
	const value: Picture;
	export default value;
}

// Blog author images
declare module '*?enhanced&w=100;200;400' {
	import type { Picture } from 'vite-imagetools';
	const value: Picture;
	export default value;
}

// Blog content images
declare module '*?enhanced&w=600;800;1200' {
	import type { Picture } from 'vite-imagetools';
	const value: Picture;
	export default value;
}

// Catch-all for ?enhanced without width params (e.g. brand logos)
declare module '*?enhanced' {
	import type { Picture } from 'vite-imagetools';
	const value: Picture;
	export default value;
}
