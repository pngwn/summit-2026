<!--
	`template: verse` — a spoken beat: most of the sheet open for one phrase, sometimes a
	bird perched on a rule. Frontmatter: `rubric`, `title` (lines), `perch`.
-->
<script lang="ts">
	import { inline, lines } from '#lib/inline.ts';

	let {
		rubric,
		title,
		perch = false
	}: { rubric?: string; title?: string | string[]; perch?: boolean } = $props();
</script>

<section class="scene verse">
	<div class="sheet">
		<div class="soliloquy">
			{#if rubric}<p class="rubric">{@html inline(rubric)}</p>{/if}
			<h2>{@html lines(title)}</h2>
			{#if perch}
				<div class="perch">
					<svg class="illustration bird" aria-hidden="true"><use href="#bird" /></svg>
				</div>
			{/if}
		</div>
	</div>
</section>
