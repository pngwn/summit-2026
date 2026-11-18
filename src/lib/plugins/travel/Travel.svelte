<!--
	:::travel[Place](coords="lat,lon") — one stop of the journal: its name as a heading,
	its coordinates under it, then what was written there. The template watches these
	sections to move the map as the reader scrolls.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		coords = '',
		label,
		children
	}: { coords?: string; label?: Snippet; children?: Snippet } = $props();

	const [lat, lon] = $derived(coords.split(',').map(Number));
	const fmt = (v: number, pos: string, neg: string) =>
		Number.isFinite(v) ? `${Math.abs(v).toFixed(2)}° ${v < 0 ? neg : pos}` : '';
</script>

<section class="stop" data-stop>
	<h2>{@render label?.()}</h2>
	<p class="coords">{fmt(lat, 'N', 'S')} · {fmt(lon, 'E', 'W')}</p>
	<div class="body">{@render children?.()}</div>
</section>

<style>
	.stop {
		min-height: 85vh;
		padding: 18vh 0 10vh;
		border-top: 1px solid var(--hairline);
	}

	.stop:first-of-type {
		border-top: 0;
	}

	h2 {
		margin: 0;
		font: 560 clamp(2.2rem, 4.2vw, 3.6rem) / 1 var(--face-display);
		letter-spacing: -0.04em;
	}

	.coords {
		margin: 0.6rem 0 2rem;
		font: 0.85rem var(--face-mono);
		letter-spacing: 0.06em;
		color: var(--copper);
	}

	.body :global(p) {
		font-size: 1.2rem;
		line-height: 1.6;
		max-width: 34em;
	}
</style>
