<!--
	`template: edition` — the mdsvex home page's cover at stage size: the heading's source
	scored on staves ruled out to the edges, the line bird perched on them, and the
	wordmark under them with its edition beside it. The Title is the site's own
	(src/lib/home, from packages/site/src/lib/design/title), reading the source with the
	real parser. Frontmatter: `edition`.
-->
<script lang="ts">
	import Title from '#lib/home/Title.svelte';

	let { edition = '1.0' }: { edition?: string } = $props();

	// the edition hangs after the wordmark without taking width from it, so "mdsvex" stays
	// centred under its score; the whole cover then moves left by half the edition, so
	// "mdsvex 1.0" sits centred on the stage
	let width = $state(0);
</script>

<section class="scene edition">
	<div class="cover" style:translate="{-width / 2}px 0">
		<Title>
			{#snippet after()}<span
					class="number"
					bind:offsetWidth={width}
					style:margin-right="{-width}px"
				>
					<span class="ink linen rag">{edition}</span>
				</span>{/snippet}
		</Title>
	</div>
</section>

<style>
	/* the site's voices, which its score and wordmark are inked in */
	.edition {
		--voice-blue: #2a2fd4;
		--voice-rose: #d4145a;
		--voice-orange: #c93300;
		--voice-green: #0b8457;
		overflow: hidden;
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
		--title: calc(19 * var(--unit));
		--perch-size: calc(2.4 * var(--unit));
	}

	/* the phrase names are 14px on the site; at stage size they scale with the score */
	.cover :global(.phrase) {
		font-size: calc(1.3 * var(--unit));
	}

	/* the site's gap under the staves (clamp(1.5rem, 4vw, 3rem)), at stage size */
	.cover :global(.staves) {
		margin-bottom: calc(3.5 * var(--unit));
	}

	/* each letter is an inline-block, a break opportunity: the name and edition keep one line */
	.cover :global(.title) {
		white-space: nowrap;
	}

	/* the edition on the wordmark's baseline, italic, at half its size: read with the
	   name, not under it */
	.number {
		display: inline-block;
		padding-left: 0.32em;
		font-size: 0.5em;
		font-style: italic;
		font-weight: 450;
		letter-spacing: -0.02em;
		white-space: nowrap;
	}

	.number .ink {
		display: inline-block;
	}

	@container screen (max-aspect-ratio: 4 / 5) {
		.cover {
			--u: 4.4cqw;
			--track: 0.45em;
			--title: 19cqw;
		}
	}
</style>
