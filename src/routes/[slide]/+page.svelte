<!-- The audience view: one slide, full screen. -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import SlideView from '#lib/components/SlideView.svelte';
	import { get_slide } from '#lib/deck.ts';
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
	<SlideView {slide} />
</main>

<style>
	main {
		position: fixed;
		inset: 0;
	}
</style>
