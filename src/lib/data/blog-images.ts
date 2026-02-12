// This file maps blog image basenames to imported enhanced images
// It uses Vite's glob import to get all images in the blog subdirectories

// 1. Blog Covers
const covers = import.meta.glob('../assets/images/blog/blog-covers/*.{jpg,jpeg,png,webp,avif}', {
	eager: true,
	query: { enhanced: true, w: '400;800;1200' }
});

export function getBlogCover(basename: string) {
	for (const path in covers) {
		if (path.includes(`/${basename}.`)) {
			return (covers[path] as { default: string }).default;
		}
	}
	return null;
}

// 2. Blog Authors
const authors = import.meta.glob('../assets/images/blog/blog-authors/*.{jpg,jpeg,png,webp,avif}', {
	eager: true,
	query: { enhanced: true, w: '100;200;400' }
});

export function getBlogAuthorImage(basename: string) {
	for (const path in authors) {
		if (path.includes(`/${basename}.`)) {
			return (authors[path] as { default: string }).default;
		}
	}
	return null;
}

// 3. Blog Content Images
const contentImages = import.meta.glob('../assets/images/blog/blog-content/*.{jpg,jpeg,png,webp,avif}', {
	eager: true,
	query: { enhanced: true, w: '600;800;1200' }
});

export function getBlogContentImage(basename: string) {
	// console.log('Looking for blog content image:', basename);
	for (const path in contentImages) {
		// console.log('Checking path:', path);
		if (path.includes(`/${basename}.`)) {
			// console.log('Found match:', path);
			return (contentImages[path] as { default: string }).default;
		}
	}
	// console.log('No match found for:', basename);
	return null;
}
