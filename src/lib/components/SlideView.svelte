<!--
	One slide on its canvas: the paper, the slide's document, and a running foot
	(section and slide number) like the site's footer: a rule, then meta in riso mono.
-->
<script lang="ts">
	import Stage from './Stage.svelte';
	import { total, type Slide } from '#lib/deck.ts';

	let { slide }: { slide: Slide } = $props();

	// title and section slides stand on their own
	let foot = $derived(!['title', 'section'].includes(slide.meta.template ?? ''));
</script>

<Stage>
	<div class="page paper">
		<!-- the section's numeral reaches a section template as a prop -->
		<slide.component numeral={slide.section?.numeral} />

		{#if foot}
			<footer class="riso">
				<span>
					{#if slide.section}{slide.section.numeral}&ensp;{slide.section.title}{/if}
				</span>
				<span>{slide.n} / {total}</span>
			</footer>
		{/if}
	</div>
</Stage>

<style>
	.page {
		position: absolute;
		inset: 0;
	}

	footer {
		position: absolute;
		left: 120px;
		right: 120px;
		bottom: 56px;
		display: flex;
		justify-content: space-between;
		padding-top: 20px;
		border-top: var(--rule) solid var(--ink);
		font: 400 26px / 1 var(--face-mono);
		font-variant-ligatures: none;
		color: var(--quiet);
	}
</style>
