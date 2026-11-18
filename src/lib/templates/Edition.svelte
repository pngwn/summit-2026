<!--
	`template: edition` — the mdsvex home page's cover at stage size: the heading's source
	scored on staves ruled out to the edges, the line bird perched on them, and the
	wordmark under them, here with its edition. The Title is the site's own
	(src/lib/home, from packages/site/src/lib/design/title), reading the source with
	the real parser. Frontmatter: `edition`.
-->
<script lang="ts">
	import Title from '#lib/home/Title.svelte';

	let { edition = '1.0' }: { edition?: string } = $props();
</script>

<section class="scene edition">
	<div class="cover">
		<Title />
		<p class="number linen rag">{edition}</p>
	</div>
</section>

<style>
	/* the site's voices, which its score and wordmark are inked in */
	.edition {
		--voice-blue: #2a2fd4;
		--voice-rose: #d4145a;
		--voice-orange: #c93300;
		--voice-green: #0b8457;
	}

	/* the home page's .cover, measured in the stage's unit rather than the viewport */
	.cover {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		--u: calc(2.9 * var(--unit));
		--track: 0.6em;
		--phrase-h: calc(1.9 * var(--unit));
		--stave-gap: 0.2em;
		--title: calc(21 * var(--unit));
		--perch-size: calc(2.4 * var(--unit));
	}

	/* the phrase names are 14px on the site; at stage size they scale with the score */
	.cover :global(.phrase) {
		font-size: calc(1.3 * var(--unit));
	}

	/* the site's gap under the staves, at stage size: clear of the wordmark's ascenders */
	.cover :global(.staves) {
		margin-bottom: calc(9 * var(--unit));
	}

	/* the edition, under the wordmark where the site has its line */
	.number {
		margin: calc(1.2 * var(--unit)) 0 0;
		font: italic 450 calc(8 * var(--unit)) / 1 var(--face-display);
		letter-spacing: -0.02em;
		color: var(--quiet);
	}

	@container screen (max-aspect-ratio: 4 / 5) {
		.cover {
			--u: 4.4cqw;
			--track: 0.45em;
			--title: 23cqw;
		}
	}
</style>
