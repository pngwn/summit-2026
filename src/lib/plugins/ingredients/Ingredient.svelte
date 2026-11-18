<!--
	:ingredient[flour](qty=200, unit=g) — an ingredient where the method uses it, its
	quantity scaled to the servings the reader picked
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { amount, get_scale } from './scale.ts';

	let {
		qty = '1',
		unit = '',
		children
	}: { qty?: string; unit?: string; children?: Snippet } = $props();

	const scale = get_scale();
</script>

<span class="ingredient">
	<span class="qty">{amount(Number(qty) * scale.factor, unit)}</span>
	{@render children?.()}
</span>

<style>
	.ingredient {
		text-decoration: underline dotted color-mix(in srgb, var(--copper) 60%, transparent);
		text-underline-offset: 0.22em;
		text-decoration-thickness: 1.5px;
	}

	.qty {
		font: 0.88em var(--face-mono);
		color: var(--copper);
	}
</style>
