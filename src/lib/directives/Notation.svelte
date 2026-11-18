<!-- :::notation — specimens in a row, each a :::cell of a result over its source -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<div class="notation">{@render children?.()}</div>
