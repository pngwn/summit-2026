<!--
	The contents and notes dialog, on the projected screen (G or ?, N; Esc closes).
	Contents groups the scenes by chapter and marks the current one; choosing one closes it.
-->
<script lang="ts">
	import { slides, type Slide } from '#lib/deck.ts';
	import type { DeskMode } from '#lib/keys.ts';

	let {
		mode = $bindable(),
		current,
		jump
	}: { mode: DeskMode | undefined; current: Slide; jump: (n: number) => void } = $props();

	let dialog: HTMLDialogElement;

	const chapters = slides.reduce<{ title: string; slides: Slide[] }[]>((all, s) => {
		if (all.at(-1)?.title !== s.chapter) all.push({ title: s.chapter, slides: [] });
		all.at(-1)!.slides.push(s);
		return all;
	}, []);

	$effect(() => {
		if (mode && !dialog.open) dialog.showModal();
		if (!mode && dialog.open) dialog.close();
		dialog.scrollTop = 0;
	});
</script>

<dialog bind:this={dialog} aria-labelledby="desk-title" onclose={() => (mode = undefined)}>
	<form method="dialog"><button class="close" aria-label="Close">Close ×</button></form>
	{#if mode === 'notes'}
		<h2 id="desk-title">{current.name}</h2>
		<p class="notes">{current.notes || 'No notes for this scene.'}</p>
	{:else if mode === 'contents'}
		<h2 id="desk-title">Contents</h2>
		<p class="guide">
			← → move · G contents · N notes · F fullscreen · P presenter · Esc close. On touch, swipe to
			move or hold for contents.
		</p>
		<div class="chapters">
			{#each chapters as chapter (chapter.title)}
				<div class="chapter">
					<h3>{chapter.title}</h3>
					{#each chapter.slides as s (s.n)}
						<button
							type="button"
							class="jump"
							aria-current={s.n === current.n ? 'true' : undefined}
							onclick={() => {
								mode = undefined;
								jump(s.n);
							}}
						>
							{s.name}
						</button>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</dialog>

<style>
	dialog {
		color: var(--ink);
		background: var(--paper);
		border: 1px solid var(--ink);
		padding: clamp(22px, 4vw, 65px);
		width: min(850px, 94vw);
		max-height: 85svh;
		overflow: auto;
	}

	dialog::backdrop {
		background: rgb(18 19 24 / 0.4);
	}

	form {
		float: right;
		margin-left: 1em;
	}

	.close {
		background: transparent;
		border: 1px solid var(--hairline);
		color: var(--ink);
		padding: 0.4em 0.7em;
		font: 15px / 1.3 var(--face-mono);
	}

	h2 {
		font: 500 clamp(32px, 4vw, 58px) / 1.1 var(--face-display);
		letter-spacing: -0.03em;
		margin: 0 0 0.5em;
	}

	.notes {
		font: 20px / 1.45 var(--face-text);
		white-space: pre-wrap;
		margin: 0;
	}

	.guide {
		font: 14px / 1.6 var(--face-mono);
		margin: 0 0 1.4em;
		color: var(--quiet);
	}

	.chapters {
		columns: 2;
		column-gap: 2em;
	}

	.chapter {
		break-inside: avoid;
		margin: 0 0 1.1em;
	}

	/* small type stays plain ink; the linen mask also drops out inside columns */
	h3 {
		font: italic 500 22px / 1.25 var(--face-display);
		margin: 0 0 0.25em;
		mask-image: none;
	}

	.jump {
		display: block;
		background: none;
		border: 0;
		padding: 0.22em 0;
		font: 15px / 1.3 var(--face-mono);
		text-align: left;
		color: var(--quiet);
		text-decoration-thickness: 1px;
	}

	.jump:hover,
	.jump[aria-current] {
		color: var(--aqua);
		text-decoration: underline;
	}

	@media (max-aspect-ratio: 4 / 5) {
		.chapters {
			columns: 1;
		}
	}
</style>
