<script lang="ts">
	// the mdsvex site's design, lib/design/Frame.svelte without the page around it:
	// the faces, the inks, the texture masks and the ragged edge filter
	import '#lib/design/tokens.css';
	import '#lib/design/type.css';
	import '#lib/design/texture.css';
	import '@twinkleplop/theme-ayu/light';
	import '#lib/design/code.css';
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import { google_fonts } from '#lib/design/fonts.ts';
	import { RAG, RAG_SCALE, texture_style } from '#lib/design/texture.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link rel="stylesheet" href={google_fonts} />
</svelte:head>

<div class="deck" style={texture_style}>
	{@render children()}
</div>

<!-- the ragged edge for display Playfair; at slide size it rags a little more than on the site -->
<svg class="defs" aria-hidden="true">
	<filter id={RAG} x="-5%" y="-5%" width="110%" height="110%">
		<feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="2" seed="4" result="noise" />
		<feDisplacementMap
			in="SourceAlpha"
			in2="noise"
			scale={RAG_SCALE * 2}
			xChannelSelector="R"
			yChannelSelector="G"
			result="edge"
		/>
		<feComposite in="SourceGraphic" in2="edge" operator="in" />
	</filter>
</svg>

<style>
	.deck {
		display: contents;
	}

	.defs {
		position: absolute;
		width: 0;
		height: 0;
	}
</style>
