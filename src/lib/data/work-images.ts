// This file maps image basenames (from markdown frontmatter) to imported enhanced images
// It uses Vite's glob import to get all images in the work-covers directory

// Load work covers
const coverImages = import.meta.glob('$lib/assets/images/work/work-covers/*.{jpg,jpeg,png,webp,avif}', {
	eager: true,
	query: { enhanced: true, w: '340;500;750;1000' }
});

// Load work content images (for gallery)
const contentImages = import.meta.glob('$lib/assets/images/work/work-content/*.{jpg,jpeg,png,webp,avif}', {
	eager: true,
	query: { enhanced: true, w: '500;800;1200' }
});

export function getWorkImage(basename: string) {
	// Iterate through the paths to find a match for the basename
	// Path example: /src/lib/assets/images/work/work-covers/work-cover-placeholder.jpg
	// Check covers first
	for (const path in coverImages) {
		if (path.includes(`/${basename}.`)) {
			return (coverImages[path] as { default: string }).default;
		}
	}
    // Check content images
    for (const path in contentImages) {
        if (path.includes(`/${basename}.`)) {
            return (contentImages[path] as { default: string }).default;
        }
    }
	return null;
}
