<!--
	::figure[Caption](art=specimen-bird, fig=A) — one of the talk's drawings
	(src/lib/art/symbols.svg) with an italic caption
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { art, fig, label }: { art: string; fig?: string; label?: Snippet } = $props();
</script>

<figure>
	<svg class="illustration {art}" aria-hidden="true"><use href="#{art}" /></svg>
	{#if label}
		<figcaption>
			{#if fig}Fig. {fig}&ensp;
			{/if}{@render label()}
		</figcaption>
	{/if}
</figure>
