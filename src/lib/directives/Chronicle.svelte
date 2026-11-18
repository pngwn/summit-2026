<!-- :::chronicle(year=2004) — a large italic date beside who and what -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { year, children }: { year?: string; children?: Snippet } = $props();
</script>

<div class="chronicle">
	<div class="year">{year}</div>
	<div>{@render children?.()}</div>
</div>
