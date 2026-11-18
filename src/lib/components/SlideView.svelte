<!--
	One scene on a screen. The screen is a size container: the scene takes its units from
	it, so the same scene fills the projector or a presenter preview.
-->
<script lang="ts">
	import type { Slide } from '#lib/deck.ts';

	let { slide, step = 0 }: { slide: Slide; step?: number } = $props();
</script>

<div class="screen">
	<slide.component {step} />
</div>

<style>
	.screen {
		position: absolute;
		inset: 0;
	}
</style>
