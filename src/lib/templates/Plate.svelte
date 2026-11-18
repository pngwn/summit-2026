<!--
	`template: plate` — a titled technical page. The body is PFM: `:::pair` of
	`:::sample[Label]`, a `:::ledger` of `::row`, a `:::chronicle`, `:::notation`…
	(src/lib/directives). A paragraph after them is the afterword.
	Frontmatter: `rubric`, `title` (lines), `size` (small, tiny).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { inline, lines } from '#lib/inline.ts';

	let {
		rubric,
		title,
		size,
		children
	}: {
		rubric?: string;
		title?: string | string[];
		/** `small`: code a few sizes down, for a slide with more source; `tiny` further still */
		size?: 'small' | 'tiny';
		children?: Snippet;
	} = $props();
</script>

<section class="scene plate {size ?? ''}">
	<div class="sheet">
		<header>
			{#if rubric}<p class="rubric">{@html inline(rubric)}</p>{/if}
			<h2>{@html lines(title)}</h2>
		</header>
		{@render children?.()}
	</div>
</section>
