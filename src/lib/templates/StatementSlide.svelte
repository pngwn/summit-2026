<!--
	`template: statement` — one sentence, as large as it goes, in Playfair with linen.
	The first paragraph is the statement; a second is a quiet italic line under it.
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
		gap: 48px;
	}

	.body :global(> p:first-child) {
		font-family: var(--face-display);
		font-size: 150px;
		font-weight: 500;
		line-height: 1.02;
		letter-spacing: -0.01em;
		text-wrap: balance;
		filter: url(#design-rag);
		mask-image: var(--linen-image, none);
		mask-size: var(--linen-size, auto);
		mask-composite: var(--linen-composite, add);
	}

	.body :global(> p:not(:first-child)) {
		font-family: var(--face-display);
		font-style: italic;
		font-size: 64px;
		color: var(--quiet);
	}
</style>
