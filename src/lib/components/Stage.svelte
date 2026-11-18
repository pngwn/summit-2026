<!--
	Renders children on a fixed 1920×1080 canvas and scales it to fit its container,
	so slides look identical on a laptop, a projector, or the presenter preview.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const WIDTH = 1920;
	const HEIGHT = 1080;

	let w = $state(0);
	let h = $state(0);
	let scale = $derived(Math.min(w / WIDTH, h / HEIGHT) || 0);
</script>

<div class="viewport" bind:clientWidth={w} bind:clientHeight={h}>
	<div
		class="canvas"
		style:width="{WIDTH}px"
		style:height="{HEIGHT}px"
		style:transform="translate(-50%, -50%) scale({scale})"
	>
		{@render children()}
	</div>
</div>

<style>
	.viewport {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	/* centre the full-size canvas, then shrink it around its own centre */
	.canvas {
		position: absolute;
		top: 50%;
		left: 50%;
		background: var(--paper);
		color: var(--ink);
		overflow: hidden;
		box-shadow: 0 2px 40px rgb(18 19 24 / 0.12);
	}
</style>
