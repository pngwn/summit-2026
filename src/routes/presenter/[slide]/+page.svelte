<!--
	The presenter view: current + next slide, speaker notes, and a timer.
	Open it with `p` from the audience view; both windows stay in sync.
-->
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
	let next = $derived(get_slide(data.n + 1));

	function go(n: number, from_remote = false) {
		if (n === data.n) return;
		if (!from_remote) broadcast(n);
		goto(resolve('/presenter/[slide]', { slide: String(n) }), { reset: false });
	}

	$effect(() => on_remote_goto((n) => go(n, true)));

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

<svelte:window onkeydown={(e) => handle_deck_key(e, data.n, go)} />

<main>
	<div class="current">
		<Stage>
			<slide.component />
		</Stage>
	</div>

	<aside>
		<div class="next">
			{#if next}
				<Stage>
					<next.component />
				</Stage>
			{:else}
				<p class="end">End of deck</p>
			{/if}
		</div>

		<div class="status">
			<span>{data.n} / {total}</span>
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
		font-family: var(--font-sans);
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
		color: var(--slide-muted);
	}

	.status {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 32px;
	}

	.status button {
		font: inherit;
		color: var(--accent);
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
		color: var(--slide-muted);
	}
</style>
