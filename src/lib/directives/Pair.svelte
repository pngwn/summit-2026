<!-- :::pair — two samples side by side, stacked source first in portrait -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<div class="pair">{@render children?.()}</div>
