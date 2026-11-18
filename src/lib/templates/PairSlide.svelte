<!--
	`template: pair` — what you write beside what you get, as the site's docs pair them.
	The document's first fence is the source, on the left; everything after it is the same
	markdown written out live, rendered by this deck's own mdsvex, on the right.
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

	/* the fence spans every row of the left column, the output stacks down the right */
	.body {
		flex: 1;
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
		grid-auto-rows: auto;
		align-content: center;
		column-gap: 120px;
	}

	.body :global(> pre:first-child) {
		grid-column: 1;
		grid-row: 1 / span 12;
		align-self: center;
		font-size: 44px;
	}

	.body :global(> :not(pre:first-child)) {
		grid-column: 2;
		margin-block: 0 32px;
	}
</style>
