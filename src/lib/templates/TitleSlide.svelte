<!-- `template: title` — opening slide. Reads its text from frontmatter, the body is optional. -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle,
		author,
		event,
		children
	}: {
		title?: string;
		subtitle?: string;
		author?: string;
		event?: string;
		children?: Snippet;
	} = $props();
</script>

<section class="slide">
	{#if event}<p class="event">{event}</p>{/if}
	{#if title}<h1>{title}</h1>{/if}
	{#if subtitle}<p class="subtitle">{subtitle}</p>{/if}
	{@render children?.()}
	{#if author}<p class="author">{author}</p>{/if}
</section>

<style>
	.slide {
		height: 100%;
		padding: 160px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 24px;
	}

	h1 {
		font-size: 160px;
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.event {
		font-family: var(--font-mono);
		font-size: 32px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent);
	}

	.subtitle {
		font-size: 56px;
		color: var(--slide-muted);
	}

	.author {
		margin-top: 64px;
		font-size: 40px;
	}
</style>
