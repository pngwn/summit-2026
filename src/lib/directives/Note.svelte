<!--
	:::note[Title] — what the callouts plugin makes of a note: a titled aside on a teal rule.
	The deck's own stand-in, so the plugins scene renders the source it shows.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { label, children }: { label?: Snippet; children?: Snippet } = $props();
</script>

<aside class="callout">
	{#if label}<strong>{@render label()}</strong>{/if}
	{@render children?.()}
</aside>
