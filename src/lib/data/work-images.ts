// This file maps image basenames (from markdown frontmatter) to imported enhanced images
// It uses Vite's glob import to get all images in the work-covers directory

const images = import.meta.glob('$lib/assets/images/work/work-covers/*.{jpg,jpeg,png,webp,avif}', {
	eager: true,
	query: { enhanced: true }
});

export function getWorkImage(basename: string) {
	// Iterate through the paths to find a match for the basename
	// Path example: /src/lib/assets/images/work/work-covers/work-cover-placeholder.jpg
	for (const path in images) {
		if (path.includes(`/${basename}.`)) {
			return (images[path] as { default: string }).default;
		}
	}
	return null;
}
