<!-- :::pair — two samples side by side, stacked source first in portrait. (cols=wide) gives the first more room -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { cols, children }: { cols?: string; children?: Snippet } = $props();
</script>

<div class="pair" class:wide={cols === 'wide'}>{@render children?.()}</div>
