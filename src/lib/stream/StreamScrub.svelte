<!--
	::stream(example=arrives, panels="ops data") — a document read as it arrives, through
	mdsvex's own incremental parser (engine.ts). Incoming source on the left, with the
	lookahead the parser is still holding shaded; the page so far on the right, guesses
	dashed. Panels, as a slide asks for them:
	- ops: the wire opcodes of the last characters, the newest last
	- data: what the plugins wrote, live
	- toc: plugin_data.toc as the list a ::toc component draws
	Play feeds a character every `speed` ms; the range scrubs and pauses. The position is
	kept per example when the scene is left.
-->
<script module lang="ts">
	const positions = $state<Record<string, number>>({});
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { describe, record, type Frame } from './engine.ts';
	import { examples } from './examples.ts';
	import TreeView from './TreeView.svelte';

	let {
		example = 'arrives',
		panels = '',
		speed = '145'
	}: { example?: string; panels?: string; speed?: string } = $props();

	const ex = $derived(examples[example] ?? examples.arrives);
	const show = $derived(new Set(panels.split(/[\s,]+/).filter(Boolean)));

	let frames = $state<Frame[]>([]);
	let timer: ReturnType<typeof setInterval> | undefined = $state();

	$effect(() => {
		let live = true;
		const { source, plugins } = ex;
		// the plugins' live data is reactive: recorded inside this effect it would subscribe
		// the effect to every change it makes, and run it again
		untrack(() => record(source, plugins)).then((f) => {
			if (live) frames = f;
		});
		return () => {
			live = false;
		};
	});

	const end = $derived(Math.max(0, frames.length - 1));
	let at = $derived(Math.min(positions[example] ?? 0, end));
	const frame = $derived(frames[at]);
	const fed = $derived(ex.source.slice(0, frame?.fed ?? 0));
	const sure = $derived(fed.slice(0, frame?.cursor ?? 0));
	const held = $derived(fed.slice(frame?.cursor ?? 0));
	const done = $derived(at === end && end > 0);

	/** the last few characters' opcodes, a row per character that said something */
	/** the block separators the parser sends between blocks: real, but noise on a slide */
	const separators = $derived(
		new Set(
			frames.flatMap((f) => f.ops.filter((op) => op[0] === 'O' && op[2] === 6).map((op) => op[1]))
		)
	);
	const shown = (op: Frame['ops'][number]) =>
		!((op[0] === 'O' || op[0] === 'C') && separators.has(op[1]));

	const log = $derived.by(() => {
		const rows: { at: number; ch: string; ops: ReturnType<typeof describe>[] }[] = [];
		const ch = (i: number) => (i === end ? 'end' : JSON.stringify(ex.source[frames[i].fed - 1]));
		for (let i = at; i > 0 && rows.length < 3; i--) {
			const f = frames[i];
			// the current character is shown even when it sent nothing: the silence is the point
			const ops = f.ops.filter(shown);
			if (!ops.length && i !== at) continue;
			rows.unshift({ at: i, ch: ch(i), ops: ops.map(describe) });
		}
		return rows;
	});

	/** what the plugins wrote, a line per key */
	const data = $derived(
		Object.entries(frame?.data ?? {}).flatMap(([plugin, keys]) =>
			Object.entries(keys).map(([key, value]) => ({
				name: `${plugin}.${key}`,
				value: JSON.stringify(value)
			}))
		)
	);

	const headings = $derived((frame?.data?.toc?.headings ?? []) as { id: string; text: string }[]);

	/** the page holds a guess somewhere, so the key to the dashed line is shown */
	const guessing = $derived.by(() => {
		const any = (n: Frame['tree'][number]): boolean => n.pending || n.children.some(any);
		return frame?.tree.some(any) ?? false;
	});

	function go(to: number) {
		positions[example] = Math.max(0, Math.min(end, to));
	}

	function stop() {
		clearInterval(timer);
		timer = undefined;
	}

	function play() {
		if (timer) return stop();
		if (done) go(0);
		timer = setInterval(
			() => {
				go(at + 1);
				if (at >= end) stop();
			},
			Number(speed) || 145
		);
	}

	$effect(() => stop);
</script>

<div class="stream" class:side={show.has('toc') || show.has('data')}>
	<div class="sample">
		<p class="label">Incoming source</p>
		<pre class="incoming">{sure}<span class="held">{held}</span></pre>
	</div>
	<div class="sample">
		<p class="label">
			On the page{#if guessing}<span class="key">&ensp;·&ensp;<u>dashed</u>: a guess</span>{/if}
		</p>
		<div class="page"><TreeView nodes={frame?.tree ?? []} /></div>
	</div>
	{#if show.has('toc')}
		<div class="sample">
			<p class="label">plugin_data.toc</p>
			<ol class="toc">
				{#each headings as h (h.id)}<li>
						<span class="hash">#</span>{h.id}<em>{h.text}</em>
					</li>{/each}
			</ol>
		</div>
	{:else if show.has('data')}
		<div class="sample">
			<p class="label">Plugin data</p>
			<dl class="data">
				{#each data as d (d.name)}<dt>{d.name}</dt>
					<dd>{d.value}</dd>{:else}<dt>nothing yet</dt>{/each}
			</dl>
		</div>
	{/if}
</div>

{#if show.has('ops')}
	<div class="ops" aria-label="Opcodes of the last characters">
		{#each log as row (row.at)}
			<div class="op-row" class:now={row.at === at}>
				<span class="ch">{row.ch}</span>
				{#each row.ops as op, i (i)}<span class="op {op.verb}">
						<b>{op.verb}</b>
						{op.detail}
					</span>{:else}<span class="op silent">
						nothing sent{#if held}, holding {held.length}{/if}
					</span>{/each}
			</div>
		{:else}
			<div class="op-row quiet">no opcodes yet</div>
		{/each}
	</div>
{/if}

<div class="scrub">
	<button onclick={play}>{timer ? 'Pause' : done ? 'Replay' : 'Play'}</button>
	<input
		type="range"
		min="0"
		max={end}
		value={at}
		oninput={(e) => {
			stop();
			go(Number(e.currentTarget.value));
		}}
		aria-label="Characters received"
		aria-valuetext="{frame?.fed ?? 0} characters received"
	/>
	<output>
		{frame?.fed ?? 0} / {ex.source.length}{#if held}&ensp;<span class="holding">
				holding {held.length}
			</span>{/if}
	</output>
</div>

<style>
	.stream {
		--code-size: 1.45;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: calc(4 * var(--unit));
		min-height: calc(14 * var(--unit));
	}

	.stream.side {
		grid-template-columns: 1.15fr 1fr 0.85fr;
		gap: calc(3 * var(--unit));
	}

	.incoming {
		white-space: pre-wrap;
	}

	/* fed but not yet read for certain: the lookahead the parser holds */
	.held {
		background: color-mix(in srgb, var(--line-fence) 22%, transparent);
		box-shadow: 0 0.12em 0 var(--name-fence);
	}

	.incoming::after {
		content: '';
		display: inline-block;
		height: 1em;
		border-right: 2px solid var(--aqua);
		vertical-align: -0.1em;
	}

	.label .key {
		text-transform: none;
	}

	.label u {
		text-decoration: underline dashed var(--pink);
		text-underline-offset: 0.2em;
	}

	.page {
		font-size: calc(2.15 * var(--unit));
		line-height: 1.28;
	}

	.page :global(p) {
		margin: 0 0 0.3em !important;
	}

	.page :global(.heading) {
		font: 560 1.25em / 1.1 var(--face-display);
		letter-spacing: -0.03em;
		margin: 0.15em 0 0.15em;
	}

	.page :global(.heading.h1) {
		font-size: 1.6em;
	}

	.page :global(.link) {
		color: var(--name-link);
		text-decoration: underline;
		text-underline-offset: 0.12em;
	}

	.page :global(code) {
		font-size: 0.85em;
	}

	/* a guess: open, but the parser may still take it back */
	.page :global(.pending) {
		text-decoration: underline dashed var(--pink);
		text-decoration-thickness: 0.06em;
		text-underline-offset: 0.18em;
		background: color-mix(in srgb, var(--pink) 7%, transparent);
	}

	/* what the marker plugin set on an emphasis */
	.page :global(.marked) {
		background: color-mix(in srgb, var(--line-emph) 22%, transparent);
		border-radius: 0.12em;
	}

	.page :global(.note) {
		border-left: 3px solid var(--teal);
		padding-left: 0.6em;
		margin-bottom: 0.4em;
	}

	.page :global(.note-label) {
		display: block;
		color: var(--teal);
		font: 500 0.8em / 1.3 var(--face-display);
		margin-bottom: 0.2em;
	}

	.page :global(.footnote) {
		display: flex;
		gap: 0.4em;
		font-size: 0.72em;
		color: var(--quiet);
		border-top: 1px solid var(--hairline);
		padding-top: 0.4em;
	}

	.page :global(.footnote p) {
		margin: 0 !important;
	}

	.toc {
		margin: 0;
		padding: 0;
		list-style: none;
		font: calc(1.6 * var(--unit)) / 1.7 var(--face-mono);
	}

	.toc li {
		display: flex;
		gap: 0.6em;
		align-items: baseline;
	}

	.toc .hash {
		color: var(--name-heading);
		margin-right: -0.5em;
	}

	.toc em {
		font: italic 1.15em var(--face-display);
		color: var(--quiet);
	}

	.data {
		margin: 0;
		font: calc(1.5 * var(--unit)) / 1.5 var(--face-mono);
	}

	.data dt {
		color: var(--quiet);
	}

	.data dd {
		margin: 0 0 0.5em;
		color: var(--name-emph);
	}

	.op.silent {
		color: var(--name-fence);
	}

	/* the opcodes: one row per character that produced any, the current one in ink */
	.ops {
		margin-top: calc(1.6 * var(--unit));
		border-top: 1px solid var(--hairline);
		padding-top: calc(0.8 * var(--unit));
		font: calc(1.4 * var(--unit)) / 1.6 var(--face-mono);
		font-variant-ligatures: none;
		color: var(--quiet);
		min-height: calc(3 * 1.6 * 1.4 * var(--unit) + var(--unit));
	}

	/* a row per character, never wrapped: a long one is cut at the edge, as a log is */
	.op-row {
		display: flex;
		flex-wrap: nowrap;
		white-space: nowrap;
		overflow: hidden;
		gap: 0 1.2em;
		opacity: 0.55;
	}

	.op-row.now {
		opacity: 1;
		color: var(--ink);
	}

	.ch {
		min-width: 4.5ch;
		color: var(--quiet);
	}

	.op b {
		font-weight: 400;
	}

	.op.open b {
		color: var(--name-code);
	}

	.op.close b,
	.op.commit b {
		color: var(--name-heading);
	}

	.op.revoke b {
		color: var(--name-item);
	}

	.op.attr b {
		color: var(--name-link);
	}

	.scrub {
		display: flex;
		align-items: center;
		gap: 1em;
		margin-top: calc(2.4 * var(--unit));
		border-top: 1px solid var(--hairline);
		padding-top: 1em;
		font: calc(1.5 * var(--unit)) var(--face-mono);
	}

	.scrub button {
		margin: 0;
	}

	.scrub input {
		min-width: 30px;
		flex: 1;
		accent-color: var(--aqua);
	}

	.scrub output {
		font-size: 0.9em;
		min-width: 18ch;
	}

	.holding {
		color: var(--name-fence);
	}

	@container screen (max-aspect-ratio: 4 / 5) {
		.stream,
		.stream.side {
			grid-template-columns: 1fr;
		}

		.page {
			font-size: 5cqw;
		}
	}
</style>
