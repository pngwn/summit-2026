<!--
	`template: specimen` — attention on a score: phrases over the source characters they
	own (the site's notation, design/SCORE.md). With `wordmark`, the large name sits above
	the score instead of a title. Frontmatter: `rubric`, `title`, `wordmark`, `score`.
-->
<script lang="ts">
	import Score, { type ScoreData } from '#lib/components/Score.svelte';
	import { inline, lines } from '#lib/inline.ts';

	let {
		rubric,
		title,
		wordmark,
		score
	}: { rubric?: string; title?: string | string[]; wordmark?: string; score: ScoreData } = $props();
</script>

<section class="scene specimen">
	<div class="sheet">
		{#if wordmark}
			<div class="wordmark">
				<h2>{wordmark}</h2>
				<Score {...score} />
			</div>
		{:else}
			<header>
				{#if rubric}<p class="rubric">{@html inline(rubric)}</p>{/if}
				<h2>{@html lines(title)}</h2>
			</header>
			<Score {...score} />
		{/if}
	</div>
</section>
