<!--
	::row[Name](mark=":", code="name[text]", note="Inside a sentence") — a ledger row:
	an italic name, then source (its leading marks in the directive ink) and a quiet note.
	As a container, :::row[Name] … ::: takes prose instead.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		mark,
		code,
		note,
		label,
		children
	}: { mark?: string; code?: string; note?: string; label?: Snippet; children?: Snippet } =
		$props();
</script>

<div class="row">
	<span>{@render label?.()}</span>
	{#if code !== undefined || mark}<code>
			{#if mark}<b>{mark}</b>{/if}{code}
		</code>{/if}
	{#if note}<small>{note}</small>{/if}
	{@render children?.()}
</div>
