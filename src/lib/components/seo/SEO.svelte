<script lang="ts">
	/**
	 * Componente SEO/GEO unificado
	 * Gera meta tags, Open Graph, Twitter Cards e Schema.org JSON-LD
	 */

	type PageType = 'website' | 'article' | 'profile' | 'creative_work';

	interface Props {
		/** Título da página */
		title: string;
		/** Descrição da página */
		description: string;
		/** Tipo de página para OG e Schema.org */
		type?: PageType;
		/** URL canônica da página */
		url: string;
		/** URL da imagem OG/Twitter */
		image?: string;
		/** Nome do autor */
		author?: string;
		/** URL do autor */
		authorUrl?: string;
		/** Data de publicação (ISO 8601) */
		publishedDate?: string;
		/** Tags/keywords */
		tags?: string[];
		/** Seção do artigo */
		section?: string;
		/** Ano de criação (para works) */
		year?: string;
	}

	const BASE_URL = 'https://heydan.dev';
	const SITE_NAME = 'Daniel Guimarães';
	const DEFAULT_AUTHOR = 'Daniel Guimarães';
	const DEFAULT_AUTHOR_URL = BASE_URL;

	let {
		title,
		description,
		type = 'website',
		url,
		image,
		author = DEFAULT_AUTHOR,
		authorUrl = DEFAULT_AUTHOR_URL,
		publishedDate,
		tags = [],
		section,
		year
	}: Props = $props();

	// URLs absolutas (reactive)
	let canonicalUrl = $derived(url.startsWith('http') ? url : `${BASE_URL}${url}`);
	let imageUrl = $derived(
		image?.startsWith('http') ? image : image ? `${BASE_URL}${image}` : undefined
	);

	// Tipo OG baseado no tipo de página (reactive)
	let ogType = $derived(
		type === 'article' ? 'article' : type === 'creative_work' ? 'article' : type
	);

	// Schema.org baseado no tipo
	function getSchemaType(): string {
		switch (type) {
			case 'article':
				return 'BlogPosting';
			case 'creative_work':
				return 'CreativeWork';
			case 'profile':
				return 'ProfilePage';
			default:
				return 'WebPage';
		}
	}

	function generateSchema() {
		const schemaType = getSchemaType();

		if (schemaType === 'ProfilePage') {
			return {
				'@context': 'https://schema.org',
				'@type': 'ProfilePage',
				mainEntity: {
					'@type': 'Person',
					name: author,
					url: authorUrl,
					image: imageUrl,
					jobTitle: 'Design Engineer',
					description: description,
					knowsAbout: tags
				},
				inLanguage: 'pt-BR'
			};
		}

		if (schemaType === 'BlogPosting') {
			return {
				'@context': 'https://schema.org',
				'@type': 'BlogPosting',
				headline: title,
				description: description,
				image: imageUrl,
				author: {
					'@type': 'Person',
					name: author,
					url: authorUrl
				},
				publisher: {
					'@type': 'Person',
					name: SITE_NAME,
					url: BASE_URL
				},
				datePublished: publishedDate,
				dateModified: publishedDate,
				mainEntityOfPage: {
					'@type': 'WebPage',
					'@id': canonicalUrl
				},
				keywords: tags.join(', '),
				articleSection: section || tags[0] || 'Tecnologia',
				inLanguage: 'pt-BR'
			};
		}

		if (schemaType === 'CreativeWork') {
			return {
				'@context': 'https://schema.org',
				'@type': 'CreativeWork',
				name: title,
				description: description,
				image: imageUrl,
				creator: {
					'@type': 'Person',
					name: author,
					url: authorUrl
				},
				dateCreated: year,
				url: canonicalUrl,
				keywords: tags.join(', '),
				inLanguage: 'pt-BR'
			};
		}

		// WebPage default
		return {
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: title,
			description: description,
			url: canonicalUrl,
			inLanguage: 'pt-BR'
		};
	}
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="author" content={author} />
	{#if tags.length > 0}
		<meta name="keywords" content={tags.join(', ')} />
	{/if}
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
	{/if}
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="pt_BR" />

	{#if type === 'article' && publishedDate}
		<meta property="article:author" content={author} />
		<meta property="article:published_time" content={publishedDate} />
		{#each tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	{#if type === 'profile'}
		<meta property="profile:first_name" content="Daniel" />
		<meta property="profile:last_name" content="Guimarães" />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if imageUrl}
		<meta name="twitter:image" content={imageUrl} />
	{/if}

	<!-- Schema.org JSON-LD for AI/GEO -->
	{@html `<script type="application/ld+json">${JSON.stringify(generateSchema())}</script>`}
</svelte:head>
