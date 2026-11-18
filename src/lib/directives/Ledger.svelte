<!-- :::ledger(kind=tools) — aligned rows on hairlines -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { kind = '', children }: { kind?: string; children?: Snippet } = $props();
</script>

<div class="ledger {kind}">{@render children?.()}</div>
