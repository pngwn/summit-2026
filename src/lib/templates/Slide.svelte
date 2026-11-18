<!-- The default mdsvex template: a padded content slide. Frontmatter keys arrive as props. -->
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
		padding: 120px 160px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 32px;
	}
</style>
