<!-- :::columns(count=4) — a short list set in columns of small mono, like an index -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { count = '3', children }: { count?: string; children?: Snippet } = $props();
</script>

<div class="columns" style:--count={count}>{@render children?.()}</div>

<style>
	.columns :global(ul) {
		columns: var(--count);
		column-gap: 2em;
		margin: 0;
		padding: 0;
		list-style: none;
		font: calc(var(--code-size, 2.1) * var(--unit)) / 1.6 var(--face-mono);
		font-variant-ligatures: none;
	}

	.columns :global(li) {
		break-inside: avoid;
	}
</style>
