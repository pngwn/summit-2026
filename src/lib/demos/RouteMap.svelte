<!--
	::routemap[Caption](fig=B) — the relief map with six towns on one curved route.
	Choosing a town (click, tap, Enter or Space) moves the bird along the printed curve and
	inks the travelled part. A new choice mid-journey starts from where the bird is.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { demos } from './state.svelte.ts';

	let { fig, label }: { fig?: string; label?: Snippet } = $props();

	const ROUTE = 'M66 302 Q105 268 144 274T264 203 Q287 167 331 181T447 125 Q501 80 567 95';
	const TOWNS = [
		[66, 302],
		[154, 274],
		[264, 203],
		[339, 181],
		[449, 125],
		[567, 95]
	];

	let trail: SVGPathElement;
	let length = $state(0);
	let distance = $state(0);
	let stops: number[] = [];
	let frame = 0;

	let bird = $derived.by(() => {
		if (!trail || !length) return { x: TOWNS[0][0], y: TOWNS[0][1] };
		const p = trail.getPointAtLength(distance);
		return { x: p.x, y: p.y };
	});

	// locate each stop on the curve by x, since the route runs left to right
	$effect(() => {
		length = trail.getTotalLength();
		stops = TOWNS.map(([x]) => {
			let lo = 0;
			let hi = length;
			while (hi - lo > 0.2) {
				const mid = (hi + lo) / 2;
				if (trail.getPointAtLength(mid).x < x) lo = mid;
				else hi = mid;
			}
			return (lo + hi) / 2;
		});
		distance = stops[demos.town];
		return () => cancelAnimationFrame(frame);
	});

	function visit(index: number) {
		cancelAnimationFrame(frame);
		demos.town = index;
		const from = distance;
		const to = stops[index];
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			distance = to;
			return;
		}
		const start = performance.now();
		const duration = 260 + (600 * Math.abs(to - from)) / length;
		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / duration);
			distance = from + (to - from) * (t * t * (3 - 2 * t));
			if (t < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
	}

	function key(e: KeyboardEvent, index: number) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			visit(index);
		}
	}
</script>

<figure>
	<svg
		class="illustration route-map"
		viewBox="0 0 640 390"
		aria-label="A walking route with six towns"
	>
		<use href="#relief" />
		<path class="trail" d={ROUTE} />
		<path
			class="travelled"
			d={ROUTE}
			bind:this={trail}
			style:stroke-dasharray="{distance}
			{length + 1}"
		/>
		{#each TOWNS as [cx, cy], i (i)}
			<g
				class="town"
				role="button"
				tabindex="0"
				aria-label="Visit town {i + 1}"
				aria-pressed={demos.town === i}
				onclick={() => visit(i)}
				onkeydown={(e) => key(e, i)}
			>
				<circle {cx} {cy} r="18" fill="transparent" />
				<circle class="pin" {cx} {cy} r="6" />
				<circle class="pin-dot" {cx} {cy} r="2" />
			</g>
		{/each}
		<g class="traveller" transform="translate({bird.x} {bird.y})">
			<use href="#bird" x="-32" y="-54" width="50" height="50" />
		</g>
	</svg>
	{#if label}
		<figcaption>
			{#if fig}Fig. {fig}&ensp;
			{/if}{@render label()}
		</figcaption>
	{/if}
</figure>

<style>
	.route-map {
		aspect-ratio: 640 / 390;
		touch-action: manipulation;
	}

	.trail,
	.travelled {
		fill: none;
		stroke: var(--copper);
	}

	.trail {
		stroke-dasharray: 3 5;
		stroke-width: 1.6;
	}

	.travelled {
		stroke-width: 3;
	}

	.town {
		cursor: pointer;
	}

	.pin {
		fill: var(--paper);
		stroke: var(--copper);
		stroke-width: 2;
	}

	.pin-dot {
		fill: var(--copper);
	}

	.town:focus-visible {
		outline: none;
	}

	.town:is(:focus-visible, :hover, [aria-pressed='true']) .pin {
		stroke-width: 3.5;
	}

	.traveller {
		pointer-events: none;
		color: var(--ink);
	}
</style>
