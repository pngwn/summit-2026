<!--
	Lines of display type, one per line and never wrapped, at the largest size where the
	longest line fits the width and all of them fit the height. Measured once the fonts
	have loaded and again whenever the box changes size.
-->
<script lang="ts">
	let { lines, line_height = 0.92 }: { lines: string[]; line_height?: number } = $props();

	// measured at this size, then scaled; the first paint uses it before measuring
	const PROBE = 100;

	let box: HTMLElement;
	let text: HTMLElement;
	let size = $state(PROBE * 2);

	function fit() {
		if (!box || !text) return;
		text.style.fontSize = `${PROBE}px`;
		const w = Math.max(...[...text.children].map((c) => (c as HTMLElement).scrollWidth));
		const h = text.scrollHeight;
		size = Math.floor(Math.min((box.clientWidth / w) * PROBE, (box.clientHeight / h) * PROBE));
		// set it here too: if the size is unchanged, the style directive won't write it again
		text.style.fontSize = `${size}px`;
	}

	$effect(() => {
		lines;
		fit();
		document.fonts.ready.then(fit);
		const ro = new ResizeObserver(fit);
		ro.observe(box);
		return () => ro.disconnect();
	});
</script>

<div class="box" bind:this={box}>
	<h1 bind:this={text} style:font-size="{size}px" style:line-height={line_height}>
		{#each lines as line, i (i)}<span>{line}</span>{/each}
	</h1>
</div>

<style>
	.box {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
	}

	h1 {
		margin: 0;
		font-weight: 500;
		text-align: center;
	}

	span {
		display: block;
		white-space: nowrap;
		width: max-content;
		margin-inline: auto;
	}
</style>
