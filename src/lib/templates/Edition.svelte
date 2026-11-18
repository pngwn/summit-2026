<!--
	`template: edition` — the name and its edition on one line, as large as the stage
	takes: "mdsvex 1.0". Printed as the mdsvex home page prints its wordmark (the site's
	Title): Playfair, the black letters with linen's threads knocked out of them, the
	Svelte letters orange ink on the linen plate, every letter with a ragged edge.
	Frontmatter: `edition`.
-->
<script lang="ts">
	import { linen } from '#lib/home/plate.ts';

	let { edition = '1.0' }: { edition?: string } = $props();

	// md, then the Svelte part, then ex: the letters of `# md{"sv"}ex` once rendered
	const parts = [
		{ text: 'md', svelte: false },
		{ text: 'sv', svelte: true },
		{ text: 'ex', svelte: false }
	];
</script>

<section class="scene edition">
	<h1 class="wordmark" style:--plate={linen} aria-label="mdsvex {edition}">
		{#each parts as part (part.text)}<span class="ink rag" class:svelte={part.svelte}>
				{part.text}
			</span>{/each}<span class="number ink rag">{edition}</span>
	</h1>
</section>

<style>
	.edition {
		--svelte: #c93300;
		padding-top: var(--top-gap);
	}

	/* the line: mdsvex and its edition at one size, centred, never wrapped */
	.wordmark {
		margin: 0;
		font: 500 calc(17 * var(--unit)) / 1 var(--face-display);
		font-optical-sizing: auto;
		letter-spacing: -0.02em;
		white-space: nowrap;
		color: var(--ink);
		/* each run takes its own ink below, so the heading's own linen is off */
		mask-image: none;
	}

	.ink {
		display: inline-block;
	}

	/* the black letters with the linen's threads cut out of them */
	.ink:not(.svelte) {
		mask-image: var(--linen-image, none);
		mask-size: var(--linen-size, auto);
		mask-composite: var(--linen-composite, add);
	}

	/* the Svelte plate, orange ink on linen, the weave showing through it */
	.svelte {
		color: transparent;
		background-image: var(--plate), linear-gradient(var(--svelte), var(--svelte));
		background-size:
			96px 96px,
			auto;
		-webkit-background-clip: text;
		background-clip: text;
	}

	/* the edition: italic, the name's size, a word space after it */
	.number {
		margin-left: 0.24em;
		font-style: italic;
		font-weight: 450;
	}

	@container screen (max-aspect-ratio: 4 / 5) {
		.wordmark {
			font-size: 19cqw;
		}
	}
</style>
