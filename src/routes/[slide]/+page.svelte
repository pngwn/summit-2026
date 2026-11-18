<!-- The audience view: one slide, full screen. -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Stage from '#lib/components/Stage.svelte';
	import { get_slide, total } from '#lib/deck.ts';
	import { handle_deck_key } from '#lib/keys.ts';
	import { broadcast, on_remote_goto } from '#lib/sync.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let slide = $derived(get_slide(data.n)!);

	function go(n: number, from_remote = false) {
		if (n === data.n) return;
		if (!from_remote) broadcast(n);
		goto(resolve('/[slide]', { slide: String(n) }), { reset: false });
	}

	// follow the presenter window
	$effect(() => on_remote_goto((n) => go(n, true)));
</script>

<svelte:head>
	<title>{slide.meta.title ?? `Slide ${data.n}`}</title>
</svelte:head>

<svelte:window onkeydown={(e) => handle_deck_key(e, data.n, go)} />

<main>
	<Stage>
		<slide.component />
	</Stage>

	<div class="progress" style:width="{(data.n / total) * 100}%"></div>
</main>

<style>
	main {
		position: fixed;
		inset: 0;
	}

	.progress {
		position: absolute;
		left: 0;
		bottom: 0;
		height: 4px;
		background: var(--accent);
		transition: width 0.3s ease;
	}
</style>
