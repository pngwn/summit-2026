<!--
	The presenter view: current + next slide, speaker notes, and a timer.
	Open it with `p` from the audience view; both windows stay in sync.
-->
<script lang="ts">
	import SlideView from '#lib/components/SlideView.svelte';
	import { get_slide, next, total } from '#lib/deck.ts';
	import { handle_deck_key } from '#lib/keys.ts';
	import { deck_nav } from '#lib/nav.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const nav = deck_nav('/presenter/[slide]', () => data.n);
	let slide = $derived(get_slide(data.n)!);

	// what → shows next: this slide's next step, or the next slide
	let upcoming = $derived.by(() => {
		const to = next(nav.pos);
		if (to.n === nav.pos.n && to.step === nav.pos.step) return undefined;
		return { slide: get_slide(to.n)!, step: to.step };
	});

	// a simple elapsed timer; click it to reset
	let started = $state(Date.now());
	let now = $state(Date.now());
	$effect(() => {
		const id = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(id);
	});

	let elapsed = $derived.by(() => {
		const s = Math.floor((now - started) / 1000);
		const pad = (x: number) => String(x).padStart(2, '0');
		return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
	});
</script>

<svelte:head>
	<title>Presenter · {slide.meta.title ?? `Slide ${data.n}`}</title>
</svelte:head>

<svelte:window onkeydown={(e) => handle_deck_key(e, nav.pos, nav.go)} />

<main>
	<div class="current">
		<SlideView {slide} step={nav.pos.step} />
	</div>

	<aside>
		<div class="next">
			{#if upcoming}
				<SlideView slide={upcoming.slide} step={upcoming.step} />
			{:else}
				<p class="end">End of deck</p>
			{/if}
		</div>

		<div class="status">
			<span>
				{data.n} / {total}{#if slide.steps > 1}&ensp;·&ensp;step {nav.pos.step + 1} of {slide.steps}{/if}
			</span>
			<button title="Reset timer" onclick={() => (started = now = Date.now())}>{elapsed}</button>
		</div>

		<div class="notes">
			{#if slide.meta.notes}
				{slide.meta.notes}
			{:else}
				<span class="empty">No notes for this slide.</span>
			{/if}
		</div>
	</aside>
</main>

<style>
	main {
		position: fixed;
		inset: 0;
		display: grid;
		grid-template-columns: 3fr 2fr;
		gap: 24px;
		padding: 24px;
		background: #111;
		font-family: var(--face-text);
		color: #e8e6de;
	}

	.current,
	.next {
		border-radius: 8px;
		overflow: hidden;
		outline: 1px solid #333;
	}

	aside {
		display: grid;
		grid-template-rows: auto auto 1fr;
		gap: 24px;
		min-height: 0;
	}

	.current {
		align-self: center;
		aspect-ratio: 16 / 9;
	}

	.next {
		aspect-ratio: 16 / 9;
		opacity: 0.7;
	}

	.end {
		height: 100%;
		display: grid;
		place-items: center;
		color: #9b9eaa;
	}

	.status {
		font-variant-ligatures: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--face-mono);
		font-size: 32px;
	}

	.status button {
		font: inherit;
		color: var(--line-expr);
		background: none;
		border: none;
		cursor: pointer;
	}

	.notes {
		overflow: auto;
		white-space: pre-wrap;
		font-size: 24px;
		line-height: 1.5;
	}

	.empty {
		color: #9b9eaa;
	}
</style>
