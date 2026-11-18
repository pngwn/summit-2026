<!-- One slide, full screen, on the site's paper. -->
<script lang="ts">
	import Stage from './Stage.svelte';
	import type { Slide } from '#lib/deck.ts';

	let { slide, step = 0 }: { slide: Slide; step?: number } = $props();
</script>

<Stage>
	<div class="page paper">
		<!-- both reach the slide's template as props: the section's numeral, and the step it is on -->
		<slide.component numeral={slide.section?.numeral} {step} />
	</div>
</Stage>

<style>
	.page {
		position: absolute;
		inset: 0;
	}
</style>
