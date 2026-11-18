<!-- `template: section` — a divider between parts of the talk. -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<section class="slide">
	{@render children?.()}
</section>

<style>
	.slide {
		height: 100%;
		padding: 160px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: var(--accent);
		color: var(--accent-fg);
	}

	.slide :global(h1) {
		font-size: 180px;
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.slide :global(p) {
		font-size: 48px;
		opacity: 0.8;
	}
</style>
