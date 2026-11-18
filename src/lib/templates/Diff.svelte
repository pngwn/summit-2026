<!--
	`template: diff` — a plate whose sample is CommonMark, then PFM in its place.

	The document holds two fences, the CommonMark version then the PFM one, and a caption
	paragraph for each step. On the first step the sample reads as the CommonMark fence; on
	the step named by `diff` (the last, by default) the PFM lines grow in and the lines PFM
	drops are struck, so the change reads as a diff without the code becoming hard to read.

	The two fences keep mdsvex's highlighting: the diff is taken over their highlighted
	lines in the browser. Before that (a prerendered page, no JS yet) the CommonMark fence
	shows as it is, which is exactly the first step.

	Frontmatter: `rubric`, `title`, `labels` (before and after the diff), `steps` (default
	2), `diff` (the step the PFM diff shows on, default steps - 1), `reveal` (a step from
	which trailing spaces are drawn, for invisible syntax), `size` (small).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { diff_lines, inline_changes, read_lines, type DiffLine } from '#lib/diff.ts';
	import { inline, lines as title_lines } from '#lib/inline.ts';

	let {
		rubric,
		title,
		labels = ['CommonMark', 'CommonMark → PFM'],
		step = 0,
		steps = 2,
		diff,
		reveal,
		size,
		children
	}: {
		rubric?: string;
		title?: string | string[];
		labels?: [string, string];
		step?: number;
		steps?: number;
		diff?: number;
		reveal?: number;
		/** `small`: the code a size down, for a longer sample */
		size?: 'small';
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

	/** the markdown highlighter reads an HTML comment as an autolink; on a slide about
	 * what is and isn't a link, it has to read as the aside it is */
	const quiet_comments = (line: DiffLine): DiffLine => ({
		...line,
		html: line.html.replace(
			/<span class="tok autolink">(&lt;!--[^]*?--(?:&gt;|>))<\/span>/g,
			'<span class="comment">$1</span>'
		)
	});

	$effect(() => {
		const [before, after] = body.querySelectorAll(':scope > pre:not(.merged)');
		if (!before || !after) return;
		lang = before.className;
		lines = inline_changes(
			diff_lines(read_lines(before), read_lines(after)).map(mark_trailing).map(quiet_comments)
		);
	});
</script>

<section
	class="scene plate"
	class:small={size === 'small'}
	data-step={step}
	class:diffed
	class:revealed
>
	<div class="sheet">
		<header>
			{#if rubric}<p class="rubric">{@html inline(rubric)}</p>{/if}
			<h2>{@html title_lines(title)}</h2>
		</header>
		<div class="sample">
			<p class="label">
				<span class="before">{labels[0]}</span><span class="after">{labels[1]}</span>
			</p>
			<div class="body" class:ready={lines} bind:this={body}>
				{#if lines}
					<pre class="{lang} merged"><code
							>{#each lines as line, i (i)}<span
									class="row {line.kind}"
									class:blank={!line.text.trim()}
									><span class="line"
										>{@html line.html || '&#8203;'}{#if line.tail}<span class="tail"
												>{@html line.tail}</span
											>{/if}</span
									></span
								>{/each}</code
						></pre>
				{/if}
				{@render children?.()}
			</div>
		</div>
	</div>
</section>

<style>
	/* a diff's sample is the focus: the title sits closer, so six lines of source and a
	   caption fit a 16:9 screen */
	.sheet > header {
		margin-bottom: calc(3.2 * var(--unit));
	}

	/* the label says which reading the sample is: CommonMark, then the change to PFM */
	.label {
		display: grid;
	}

	.label > span {
		grid-area: 1 / 1;
		transition: opacity 0.35s ease;
	}

	.after,
	.diffed .before {
		opacity: 0;
	}

	.diffed .after {
		opacity: 1;
	}

	/* the fence in the first row; every caption in the second, stacked in one cell */
	.body {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		row-gap: calc(3 * var(--unit));
	}

	.body > :global(pre) {
		grid-row: 1;
		grid-column: 1;
		font-size: calc(2.45 * var(--unit));
	}

	.small .body > :global(pre) {
		font-size: calc(2.1 * var(--unit));
	}

	@container screen (max-aspect-ratio: 4 / 5) {
		.body > :global(pre) {
			font-size: clamp(16px, 4.2cqw, 25px);
		}

		.body > :global(p) {
			font-size: 4.6cqw;
		}
	}

	/* the PFM fence is only read, never shown; the CommonMark one shows until the diff is ready */
	.body > :global(pre:not(.merged) ~ pre:not(.merged)),
	.body.ready > :global(pre:not(.merged)) {
		display: none;
	}

	.body > :global(p) {
		grid-row: 2;
		grid-column: 1;
		max-width: 46ch;
		font: italic 480 calc(2.7 * var(--unit)) / 1.3 var(--face-display);
		line-height: 1.3;
		color: var(--quiet);
		opacity: 0;
		transition: opacity 0.35s ease;
	}

	[data-step='0'] .body > :global(p:nth-of-type(1)),
	[data-step='1'] .body > :global(p:nth-of-type(2)),
	[data-step='2'] .body > :global(p:nth-of-type(3)),
	[data-step='3'] .body > :global(p:nth-of-type(4)),
	[data-step='4'] .body > :global(p:nth-of-type(5)) {
		opacity: 1;
		transition-delay: 0.15s;
	}

	/* ---- the diff ---- */

	/* the gutter's + and − sit inside each row, so the code keeps its left edge on the rule */
	.merged {
		margin-left: -1.6em !important;
	}

	.merged code {
		display: grid;
	}

	/* every row keeps its height from the first step: PFM's lines are there, unseen, so
	   when the diff lands nothing moves; it only appears */
	.row {
		position: relative;
		padding-left: 1.6em;
		transition:
			opacity 0.4s ease,
			background-color 0.4s ease;
	}

	.line {
		display: block;
		white-space: pre;
		transition:
			opacity 0.4s ease,
			text-decoration-color 0.4s ease;
		text-decoration: line-through 0.07em transparent;
	}

	.row::before {
		position: absolute;
		left: 0.45em;
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	/* first step: PFM's lines are unseen, so the fence reads as CommonMark */
	.row.add {
		opacity: 0;
	}

	/* the diff: CommonMark's lines dim and strike where they are, PFM's fade in after them */
	.diffed .row.del:not(.blank) {
		background-color: color-mix(in srgb, var(--line-item) 9%, transparent);
	}

	.diffed .row.del .line {
		opacity: 0.45;
		text-decoration-color: color-mix(in srgb, var(--name-item) 70%, transparent);
	}

	.diffed .row.del:not(.blank)::before {
		content: '−';
		color: var(--name-item);
		opacity: 1;
	}

	.diffed .row.add {
		opacity: 1;
		transition-delay: 0.25s;
	}

	.diffed .row.add:not(.blank) {
		background-color: color-mix(in srgb, var(--line-code) 16%, transparent);
	}

	.diffed .row.add:not(.blank)::before {
		content: '+';
		color: var(--name-code);
		opacity: 1;
		transition-delay: 0.25s;
	}

	/* a line changed at its end: the old end strikes, the new one appears after it, on a
	   band of its own. Unseen, it already takes its cells, so the line never grows */
	.tail {
		opacity: 0;
		border-radius: 0.12em;
		transition:
			opacity 0.4s ease 0.25s,
			background-color 0.4s ease 0.25s;
	}

	.diffed .tail {
		opacity: 1;
		color: var(--name-code);
		background-color: color-mix(in srgb, var(--line-code) 22%, transparent);
	}

	.diffed .row.change .line :global(.ws) {
		text-decoration-line: line-through;
		text-decoration-thickness: 0.07em;
		opacity: 0.55;
	}

	.diffed .row.change::before {
		content: '±';
		color: var(--quiet);
		opacity: 1;
	}

	.row :global(.comment) {
		color: var(--quiet);
		font-style: italic;
	}

	/* trailing whitespace: spaces until revealed, then the site's pink dots on a band.
	   The dots take the space's own cells, so "violets" never moves */
	.row :global(.ws) {
		color: transparent;
		text-decoration: underline 0.06em transparent;
		text-underline-offset: 0.2em;
		transition:
			color 0.4s ease,
			text-decoration-color 0.4s ease;
	}

	.revealed .row :global(.ws) {
		color: var(--pink);
		text-decoration-color: var(--pink);
	}
</style>
