<!--
	::stream — read as it arrives. Incoming source opposite the rendered output, one frame
	per character received. Each frame is a snapshot of mdsvex's incremental parser → wire
	tree builder → HTML renderer after exactly that many characters (stream-frames.json).
	Play advances a character every 145 ms; the range scrubs and pauses. Leaving the scene
	stops the timer; the position is kept.
-->
<script lang="ts">
	import stream from './stream-frames.json';
	import { demos } from './state.svelte.ts';

	const END = stream.source.length;

	let timer: ReturnType<typeof setInterval> | undefined = $state();

	let action = $derived(timer ? 'Pause' : demos.stream === END ? 'Replay' : 'Play');

	function stop() {
		clearInterval(timer);
		timer = undefined;
	}

	function play() {
		if (timer) return stop();
		if (demos.stream === END) demos.stream = 0;
		timer = setInterval(() => {
			demos.stream = Math.min(END, demos.stream + 1);
			if (demos.stream === END) stop();
		}, 145);
	}

	$effect(() => stop);
</script>

<div class="pair stream">
	<div class="sample">
		<p class="label">Incoming source</p>
		<pre class="incoming">{stream.source.slice(0, demos.stream)}</pre>
	</div>
	<div class="sample">
		<p class="label">Rendered so far</p>
		<div class="stream-result">{@html stream.frames[demos.stream]}</div>
	</div>
</div>
<div class="scrub">
	<button onclick={play}>{action}</button>
	<input
		type="range"
		min="0"
		max={END}
		bind:value={demos.stream}
		oninput={stop}
		aria-label="Characters received"
		aria-valuetext="{demos.stream} characters received"
	/>
	<output>{demos.stream} / {END}</output>
</div>

<style>
	.stream {
		min-height: calc(15 * var(--unit));
	}

	.stream-result :global(h1) {
		font-size: 1.4em;
		line-height: 1.2;
	}

	.stream-result :global(p) {
		margin-top: 0.25em;
	}

	.incoming::after {
		content: '';
		display: inline-block;
		height: 1em;
		border-right: 2px solid var(--aqua);
		vertical-align: -0.1em;
	}

	.scrub {
		display: flex;
		align-items: center;
		gap: 1em;
		margin-top: calc(3 * var(--unit));
		border-top: 1px solid var(--hairline);
		padding-top: 1em;
		font: calc(1.65 * var(--unit)) var(--face-mono);
	}

	.scrub input {
		min-width: 30px;
		flex: 1;
		accent-color: var(--aqua);
	}

	.scrub output {
		font-size: 0.9em;
		min-width: 13ch;
	}

	@container screen (max-aspect-ratio: 4 / 5) {
		.stream .sample {
			min-height: 16cqh;
		}

		.scrub {
			margin-top: 2em;
			font-size: 13px;
		}

		.scrub output {
			font-size: 14px;
			min-width: 6ch;
		}
	}
</style>
