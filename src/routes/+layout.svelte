<script lang="ts">
	// the mdsvex site's design (lib/design): the inks, the faces and the texture masks,
	// then the talk's stage (app.css, from the handoff's talk.css)
	import '#lib/design/tokens.css';
	import '#lib/design/type.css';
	import '#lib/design/texture.css';
	import '@twinkleplop/theme-ayu/light';
	import '#lib/design/code.css';
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import symbols from '#lib/art/symbols.svg?raw';
	import { RAG, RAG_SCALE, texture_style } from '#lib/design/texture.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#fbfbf8" />
</svelte:head>

<div class="deck" style={texture_style}>
	{@render children()}
</div>

<!-- the drawings: the penguin, the specimen lens, the relief map and the globe -->
<div class="art" aria-hidden="true">{@html symbols}</div>

<!-- the site's ragged edge for display Playfair, which the mdsvex 1.0 wordmark takes -->
<svg class="art" aria-hidden="true">
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

	.art {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
	}
</style>
