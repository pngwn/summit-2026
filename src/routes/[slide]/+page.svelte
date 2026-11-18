<!-- The audience view: one slide, full screen. -->
<script lang="ts">
	import SlideView from '#lib/components/SlideView.svelte';
	import { get_slide } from '#lib/deck.ts';
	import { handle_deck_key } from '#lib/keys.ts';
	import { deck_nav } from '#lib/nav.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const nav = deck_nav('/[slide]', () => data.n);
	let slide = $derived(get_slide(data.n)!);
</script>

<svelte:head>
	<title>{slide.meta.title ?? `Slide ${data.n}`}</title>
</svelte:head>

<svelte:window onkeydown={(e) => handle_deck_key(e, nav.pos, nav.go)} />

<main>
	<SlideView {slide} step={nav.pos.step} />
</main>

<style>
	main {
		position: fixed;
		inset: 0;
	}
</style>
