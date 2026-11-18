<!--
	::site[Label](src=/sites/travel) — a live page of this app in a frame, drawn at a
	laptop's width and scaled to fit, so it can be scrolled and used on stage. The label
	links to it, to open it whole.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';

	let { src, label }: { src: string; label?: Snippet } = $props();

	// the page is laid out at this size, then scaled into the slide
	const W = 1280;
	const H = 780;

	let width = $state(0);
	const scale = $derived(width ? width / W : 0.5);
	// a path inside this app; anything else is shown as given
	const url = $derived(src.startsWith('/') ? resolve(src as '/') : src);
</script>

<div class="site">
	<div class="frame" bind:clientWidth={width} style:height="{H * scale}px">
		<iframe
			src={url}
			title="A live example site"
			loading="lazy"
			style:width="{W}px"
			style:height="{H}px"
			style:transform="scale({scale})"
		></iframe>
	</div>
	<a class="open" href={url} target="_blank" rel="noopener">
		{#if label}{@render label()}{:else}{src}{/if} ↗
	</a>
</div>

<style>
	.frame {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--hairline);
		box-shadow: 0 0.6em 1.6em rgb(18 19 24 / 0.08);
		background: var(--paper);
	}

	iframe {
		position: absolute;
		top: 0;
		left: 0;
		border: 0;
		transform-origin: 0 0;
	}

	.open {
		display: inline-block;
		margin-top: calc(1 * var(--unit));
		font: calc(1.3 * var(--unit)) var(--face-mono);
		color: var(--quiet);
		text-decoration: none;
	}
</style>
