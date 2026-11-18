<!--
	The default template: a kicker, then the document, centred on the slide's height.
	Made for one thing per slide: a fence and its caption, a short list, a table.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Kicker from '#lib/components/Kicker.svelte';

	let { kicker, tone, children }: { kicker?: string; tone?: string; children?: Snippet } = $props();
</script>

<section class="slide">
	{#if kicker}<Kicker text={kicker} {tone} />{/if}
	<div class="body">
		{@render children?.()}
	</div>
</section>

<style>
	.slide {
		position: absolute;
		inset: 0;
		padding: 120px 160px 160px;
		display: flex;
		flex-direction: column;
		gap: 64px;
	}

	.body {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 56px;
	}
</style>
