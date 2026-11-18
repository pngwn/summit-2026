<!-- :::sample[Label] — a thin rule over a small mono label, then the source or the result -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { label, children }: { label?: Snippet; children?: Snippet } = $props();
</script>

<div class="sample">
	{#if label}<p class="label">{@render label()}</p>{/if}
	{@render children?.()}
</div>
