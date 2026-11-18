<!--
	`template: title` — the site's cover: credits across the top, the title in Playfair,
	an italic line under it. All of it from frontmatter; the body, if any, goes last.
-->
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
	<p class="credits linen">
		<span>{event ?? ''}</span>
		<span>{author ?? ''}</span>
	</p>

	<div class="cover">
		{#if title}<h1>{title}</h1>{/if}
		{#if subtitle}<p class="subtitle linen">{subtitle}</p>{/if}
		{@render children?.()}
	</div>
</section>

<style>
	.slide {
		position: absolute;
		inset: 0;
		padding: 120px 160px 160px;
		display: flex;
		flex-direction: column;
	}

	.credits {
		display: flex;
		justify-content: space-between;
		font-family: var(--face-display);
		font-size: 40px;
	}

	.cover {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 48px;
		text-align: center;
	}

	h1 {
		font-size: 220px;
		font-weight: 500;
		line-height: 0.95;
	}

	.subtitle {
		font-family: var(--face-display);
		font-style: italic;
		font-size: 72px;
	}
</style>
