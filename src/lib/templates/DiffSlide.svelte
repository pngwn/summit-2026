<!--
	`template: diff` — CommonMark, then PFM in its place.

	The document holds two fences, the CommonMark version then the PFM one, and a caption
	paragraph for each step. On the first step the slide reads as the CommonMark fence; on
	the step named by `diff` (the last, by default) the PFM lines grow in and the lines PFM
	drops are struck, so the change reads as a diff without the code becoming hard to read.

	The two fences keep mdsvex's highlighting: the diff is taken over their highlighted
	lines in the browser. Before that (a prerendered page, no JS yet) the CommonMark fence
	shows as it is, which is exactly the first step.

	Frontmatter: `steps` (default 2), `diff` (the step the PFM diff shows on, default
	steps - 1), `reveal` (a step from which trailing spaces are drawn, for invisible syntax).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Kicker from '#lib/components/Kicker.svelte';
	import { diff_lines, read_lines, type DiffLine } from '#lib/diff.ts';

	let {
		kicker,
		tone,
		step = 0,
		steps = 2,
		diff,
		reveal,
		children
	}: {
		kicker?: string;
		tone?: string;
		step?: number;
		steps?: number;
		diff?: number;
		reveal?: number;
		children?: Snippet;
	} = $props();

	let body: HTMLElement;
	let lines = $state<DiffLine[] | null>(null);
	let lang = $state('');

	let diffed = $derived(step >= (diff ?? steps - 1));
	let revealed = $derived(reveal !== undefined && step >= reveal);

	/** trailing spaces, drawn as · once revealed; the same width as a space, so nothing moves */
	const mark_trailing = (line: DiffLine): DiffLine => {
		const trail = /( +)$/.exec(line.text)?.[1];
		if (!trail || !line.html.endsWith(trail)) return line;
		const html = line.html.slice(0, -trail.length);
		return { ...line, html: `${html}<span class="ws">${'·'.repeat(trail.length)}</span>` };
	};

	$effect(() => {
		const [before, after] = body.querySelectorAll(':scope > pre:not(.merged)');
		if (!before || !after) return;
		lang = before.className;
		lines = diff_lines(read_lines(before), read_lines(after)).map(mark_trailing);
	});
</script>

<section class="slide" data-step={step} class:diffed class:revealed>
	{#if kicker}<Kicker text={kicker} {tone} />{/if}
	<div class="body" class:ready={lines} bind:this={body}>
		{#if lines}
			<pre class="{lang} merged"><code
					>{#each lines as line, i (i)}<span class="row {line.kind}" class:blank={!line.text.trim()}
							><span class="line">{@html line.html || '\u200b'}</span></span
						>{/each}</code
				></pre>
		{/if}
		{@render children?.()}
	</div>
</section>

<style>
	.slide {
		position: absolute;
		inset: 0;
		padding: 120px 160px;
		display: flex;
		flex-direction: column;
		gap: 64px;
	}

	/* the fence in the first row; every caption in the second, stacked in one cell */
	.body {
		flex: 1;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-content: center;
		row-gap: 64px;
	}

	.body > :global(pre) {
		grid-row: 1;
		grid-column: 1;
	}

	/* the PFM fence is only read, never shown; the CommonMark one shows until the diff is ready */
	.body > :global(pre:not(.merged) ~ pre:not(.merged)),
	.body.ready > :global(pre:not(.merged)) {
		display: none;
	}

	.body > :global(p) {
		grid-row: 2;
		grid-column: 1;
		font-style: italic;
		color: var(--quiet);
		opacity: 0;
		translate: 0 12px;
		transition:
			opacity 0.35s ease,
			translate 0.35s ease;
	}

	[data-step='0'] .body > :global(p:nth-of-type(1)),
	[data-step='1'] .body > :global(p:nth-of-type(2)),
	[data-step='2'] .body > :global(p:nth-of-type(3)),
	[data-step='3'] .body > :global(p:nth-of-type(4)),
	[data-step='4'] .body > :global(p:nth-of-type(5)) {
		opacity: 1;
		translate: 0 0;
		transition-delay: 0.15s;
	}

	/* ---- the diff ---- */

	/* the fence's left padding moves into each row, inside the code's box: the riso mask
	   on the code clips anything outside it, and the gutter's + and − have to show */
	.merged {
		padding-left: 0;
	}

	.merged code {
		display: grid;
	}

	/* a row is a one-cell grid, so its height can animate between 0fr and 1fr */
	.row {
		position: relative;
		display: grid;
		grid-template-rows: 1fr;
		padding-left: 56px;
		transition:
			grid-template-rows 0.5s cubic-bezier(0.2, 0.7, 0.2, 1),
			opacity 0.4s ease,
			background-color 0.4s ease;
	}

	.line {
		min-height: 0;
		overflow: hidden;
		white-space: pre;
		transition:
			opacity 0.4s ease,
			text-decoration-color 0.4s ease;
		text-decoration: line-through 4px transparent;
	}

	.row::before {
		position: absolute;
		left: 14px;
		font-weight: 700;
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	/* first step: PFM's lines are folded away, so the fence reads as CommonMark */
	.row.add {
		grid-template-rows: 0fr;
		opacity: 0;
	}

	/* the diff: CommonMark's lines dim and strike, PFM's grow in after them */
	.diffed .row.del {
		background-color: color-mix(in srgb, var(--line-item) 9%, transparent);
	}

	.diffed .row.del .line {
		opacity: 0.45;
		text-decoration-color: color-mix(in srgb, var(--name-item) 70%, transparent);
	}

	.diffed .row.del::before {
		content: '−';
		color: var(--name-item);
		opacity: 1;
	}

	.diffed .row.add {
		grid-template-rows: 1fr;
		opacity: 1;
		background-color: color-mix(in srgb, var(--line-code) 16%, transparent);
		transition-delay: 0.25s;
	}

	.diffed .row.add::before {
		content: '+';
		color: var(--name-code);
		opacity: 1;
		transition-delay: 0.25s;
	}

	/* a blank line PFM drops is only space: fold it rather than strike it */
	.diffed .row.del.blank {
		grid-template-rows: 0fr;
		background-color: transparent;
	}

	.diffed .row.del.blank::before {
		content: none;
	}

	.diffed .row.add.blank {
		background-color: transparent;
	}

	.diffed .row.add.blank::before {
		content: none;
	}

	/* trailing whitespace: spaces until revealed, then dots on a band */
	.row :global(.ws) {
		color: transparent;
		border-radius: 6px;
		transition:
			color 0.4s ease,
			background-color 0.4s ease;
	}

	.revealed .row :global(.ws) {
		color: var(--name-item);
		background-color: color-mix(in srgb, var(--line-item) 18%, transparent);
	}
</style>
