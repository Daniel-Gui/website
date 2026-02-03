<script>
	let { class: className } = $props();
</script>

<svg
	class={className}
	width="40"
	height="40"
	viewBox="0 0 40 40"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<defs>
		<linearGradient
			id="glass-base-gradient-li"
			x1="20"
			y1="0"
			x2="20"
			y2="40"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="rgba(87, 87, 87, 1)" />
			<stop offset="1" stop-color="rgba(21, 21, 21, 1)" />
		</linearGradient>
		<linearGradient
			id="glass-border-gradient-li"
			x1="20"
			y1="0"
			x2="20"
			y2="40"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="rgba(227, 227, 229, 0.6)" />
			<stop offset="1" stop-color="rgba(187, 187, 192, 0.2)" />
		</linearGradient>
		<linearGradient
			id="glass-gloss-gradient-li"
			x1="20"
			y1="0"
			x2="20"
			y2="20"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="rgba(255, 255, 255, 0.15)" />
			<stop offset="1" stop-color="rgba(255, 255, 255, 0)" />
		</linearGradient>
	</defs>

	<!-- Glow/Shadow -->
	<rect
		x="4"
		y="4"
		width="32"
		height="32"
		rx="8"
		fill="#000"
		fill-opacity="0.5"
		filter="url(#glass-glow)"
	/>

	<!-- Base Shape -->
	<rect x="2" y="2" width="36" height="36" rx="8" fill="url(#glass-base-gradient-li)" />

	<!-- Gloss Overlay -->
	<rect x="2" y="2" width="36" height="36" rx="8" fill="url(#glass-gloss-gradient-li)" />

	<!-- Border (Inner Stroke) -->
	<rect
		x="2.5"
		y="2.5"
		width="35"
		height="35"
		rx="7.5"
		stroke="url(#glass-border-gradient-li)"
		stroke-width="1"
		fill="none"
	/>

	<!-- LinkedIn Logo -->
	<g transform="translate(8, 8) scale(0.75)">
		<path
			d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z"
			fill="#e5e5e5"
			fill-rule="evenodd"
		/>
	</g>
</svg>
