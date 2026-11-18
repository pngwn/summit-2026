<!--
	Fills its container with a canvas measured in "slide px": at least 1920×1080, grown in
	whichever direction the screen is longer, then scaled down to fit exactly. Slides can
	size everything in px and still fill any screen edge to edge, with no letterbox.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const WIDTH = 1920;
	const HEIGHT = 1080;

	let w = $state(0);
	let h = $state(0);
	let scale = $derived(Math.min(w / WIDTH, h / HEIGHT) || 1);
</script>

<div class="viewport" bind:clientWidth={w} bind:clientHeight={h}>
	<div
		class="canvas"
		style:width="{w / scale}px"
		style:height="{h / scale}px"
		style:transform="scale({scale})"
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

	.canvas {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: 0 0;
		overflow: hidden;
	}
</style>
