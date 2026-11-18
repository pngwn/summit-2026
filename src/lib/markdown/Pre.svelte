<!--
	The deck's `pre`: what running means for a fence marked `run` (mdsvex hands over the
	block's module). A Svelte block renders as its component above its code; a script
	block whose default export is a function shows what it returns. Every other fence is
	rendered as mdsvex highlighted it, with nothing around it, so the diff slides still
	find their `pre > code > .l` lines.
-->
<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	let {
		lang,
		module,
		children
	}: {
		lang?: string;
		module?: { default?: unknown };
		children: Snippet;
	} = $props();

	const Demo = $derived(lang === 'svelte' ? (module?.default as Component | undefined) : undefined);
	const result = $derived(
		lang !== 'svelte' && typeof module?.default === 'function'
			? (module.default as () => unknown)()
			: undefined
	);
</script>

{#if Demo}
	<div class="demo"><Demo /></div>
{:else if result !== undefined}
	<output class="demo">{String(result)}</output>
{/if}
{@render children()}

<style>
	/* the running block, above its code, on the paper with a rule of its own */
	.demo {
		display: block;
		margin-bottom: calc(2.4 * var(--unit));
		padding-bottom: calc(2.4 * var(--unit));
		border-bottom: 1px solid var(--hairline);
	}

	.demo :global(button) {
		margin: 0;
		padding: 0.35em 0.8em;
		border: 1.5px solid var(--ink);
		background: transparent;
		color: var(--ink);
		font: calc(3.4 * var(--unit)) / 1.3 var(--face-mono);
		font-variant-ligatures: none;
		cursor: pointer;
	}

	.demo :global(button:active) {
		background: color-mix(in srgb, var(--ink) 6%, transparent);
	}
</style>
