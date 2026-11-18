<!-- :::cell — one notation specimen: its first paragraph is the result, its last the source -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<div class="cell">{@render children?.()}</div>
