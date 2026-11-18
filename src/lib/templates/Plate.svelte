<!--
	`template: plate` — a titled technical page. The body is PFM: `:::pair` of
	`:::sample[Label]`, a `:::ledger` of `::row`, a `:::chronicle`, `:::notation`…
	(src/lib/directives). A paragraph after them is the afterword.
	Frontmatter: `rubric`, `title` (lines).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { inline, lines } from '#lib/inline.ts';

	let {
		rubric,
		title,
		children
	}: { rubric?: string; title?: string | string[]; children?: Snippet } = $props();
</script>

<section class="scene plate">
	<div class="sheet">
		<header>
			{#if rubric}<p class="rubric">{@html inline(rubric)}</p>{/if}
			<h2>{@html lines(title)}</h2>
		</header>
		{@render children?.()}
	</div>
</section>
