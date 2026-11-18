<!--
	`template: tundra` — the opening: the lens with the very tiny penguin in it, alone on a
	blizzard of ASCII snow (Blizzard.svelte). No title, no caption, nothing else.
-->
<script lang="ts">
	import Blizzard from '#lib/demos/Blizzard.svelte';
</script>

<section class="scene tundra">
	<Blizzard />
	<svg class="lens" viewBox="0 0 540 490" aria-label="A very tiny penguin, enlarged" role="img">
		<!-- the glass: paper, a little frosted, so the snow shows faintly through it -->
		<circle class="glass" cx="270" cy="243" r="191" />
		<use href="#specimen-bird" />
	</svg>
</section>

<style>
	.tundra {
		position: relative;
		overflow: hidden;
		background: var(--paper);
	}

	.lens {
		position: relative;
		z-index: 1;
		margin-top: var(--top-gap);
		height: 66cqh;
		aspect-ratio: 540 / 490;
		max-width: 86cqw;
		overflow: visible;
		color: var(--ink);
	}

	.glass {
		fill: var(--paper);
		fill-opacity: 0.9;
	}

	@media (prefers-reduced-motion: no-preference) {
		.tundra .lens {
			animation: lens-in 1.2s 0.4s ease-out both;
		}

		@keyframes lens-in {
			from {
				opacity: 0;
				scale: 0.96;
			}
		}
	}
</style>
