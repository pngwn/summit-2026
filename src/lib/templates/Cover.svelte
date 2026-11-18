<!--
	`template: cover` — a brief, oversized title beside a drawing with an italic caption.
	The drawing is the document's body: a `::figure` or `::routemap` directive.
	Frontmatter: `imprint`, `title` (lines, PFM inline marks), `variant` (cartography,
	world, closing).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { inline, lines } from '#lib/inline.ts';

	let {
		imprint,
		title,
		variant = '',
		children
	}: {
		imprint?: string;
		title?: string | string[];
		variant?: string;
		children?: Snippet;
	} = $props();
</script>

<section class="scene cover {variant}">
	<div class="sheet">
		<div class="opening">
			{#if imprint}<p class="imprint">{@html inline(imprint)}</p>{/if}
			<h1>{@html lines(title)}</h1>
			{@render children?.()}
		</div>
	</div>
</section>
