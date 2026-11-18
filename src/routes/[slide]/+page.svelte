<!-- The audience view: one scene, full screen, nothing else on the projected surface. -->
<script lang="ts">
	import Desk from '#lib/components/Desk.svelte';
	import SlideView from '#lib/components/SlideView.svelte';
	import { get_slide, next, prev } from '#lib/deck.ts';
	import { gestures } from '#lib/gestures.ts';
	import { handle_deck_key, type DeskMode } from '#lib/keys.ts';
	import { deck_nav } from '#lib/nav.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const nav = deck_nav('/[slide]', () => data.n);
	let slide = $derived(get_slide(data.n)!);
	let desk = $state<DeskMode>();

	const toggle = (mode: DeskMode) => (desk = desk === mode ? undefined : mode);
</script>

<svelte:head>
	<title>{slide.name} · mdsvex</title>
</svelte:head>

<svelte:window
	onkeydown={(e) =>
		handle_deck_key(e, { pos: nav.pos, go: nav.go, desk: toggle, desk_open: !!desk })}
/>

<main
	aria-label="mdsvex anniversary talk"
	{@attach gestures(() => ({
		back: () => nav.go(prev(nav.pos)),
		forward: () => nav.go(next(nav.pos)),
		hold: () => (desk = 'contents')
	}))}
>
	<SlideView {slide} step={nav.pos.step} />
</main>

<!-- reachable with Tab, otherwise hidden: the way in without a keyboard shortcut -->
<button class="skip" onclick={() => (desk = 'contents')}>Talk contents and controls</button>

<Desk bind:mode={desk} current={slide} jump={(n) => nav.go({ n, step: 0 })} />

<div class="sr" aria-live="polite">{slide.name}</div>

<style>
	main {
		position: fixed;
		inset: 0;
	}

	.skip:not(:focus) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		padding: 0;
	}

	.skip:focus {
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 3;
	}
</style>
