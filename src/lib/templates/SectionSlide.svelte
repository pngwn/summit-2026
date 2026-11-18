<!--
	`template: section` — a part of the talk, numbered like the site's contents:
	the numeral in quiet Playfair, the title large with linen and a ragged edge.
	`numeral` comes from the deck (lib/deck.ts), the title from frontmatter;
	the body, if any, is a line under it.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, numeral, children }: { title?: string; numeral?: string; children?: Snippet } =
		$props();
</script>

<section class="slide">
	{#if numeral}<p class="numeral linen">{numeral}</p>{/if}
	{#if title}<h1 class="title">{title}</h1>{/if}
	<div class="body">{@render children?.()}</div>
</section>

<style>
	.slide {
		position: absolute;
		inset: 0;
		padding: 160px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 40px;
		border-bottom: 24px solid var(--ink);
	}

	.numeral {
		font-family: var(--face-display);
		font-size: 64px;
		color: var(--quiet);
	}

	.title {
		font-size: 200px;
		font-weight: 500;
		line-height: 0.98;
	}

	.body {
		font-family: var(--face-display);
		font-style: italic;
		font-size: 64px;
		color: var(--quiet);
	}
</style>
