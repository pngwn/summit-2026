<!--
	`template: title` — a title page, the title set as large as the slide allows.
	`lines` in frontmatter breaks it where you want (each line kept whole); without it,
	`title` is one line. `subtitle` goes under it in italic, and the body, if any, last.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import FitLines from '#lib/components/FitLines.svelte';

	let {
		title,
		lines,
		subtitle,
		children
	}: {
		title?: string;
		lines?: string[];
		subtitle?: string;
		children?: Snippet;
	} = $props();
</script>

<section class="slide">
	<div class="title">
		<FitLines lines={lines ?? (title ? [title] : [])} />
	</div>
	{#if subtitle}<p class="subtitle linen">{subtitle}</p>{/if}
	{@render children?.()}
</section>

<style>
	.slide {
		position: absolute;
		inset: 0;
		padding: 96px 120px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 48px;
	}

	.title {
		flex: 1;
		align-self: stretch;
		min-height: 0;
	}

	.subtitle {
		font-family: var(--face-display);
		font-style: italic;
		font-size: 72px;
	}
</style>
