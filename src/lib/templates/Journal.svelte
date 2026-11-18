<!--
	`template: journal` — a travel journal. The map is fixed on the left; the stops, each a
	`:::travel[Place](coords="lat,lon")`, run down the right. The travel plugin hands the
	template every stop as plugin_data.travel.stops, so the map is drawn whole on the server;
	scrolling a stop into the middle of the screen moves the journey on to it.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Stop } from '#lib/plugins/travel/index.ts';
	import JourneyMap from '#lib/sites/JourneyMap.svelte';

	let {
		title,
		subtitle,
		plugin_data,
		children
	}: {
		title?: string;
		subtitle?: string;
		plugin_data?: { travel?: { stops?: Stop[] } };
		children?: Snippet;
	} = $props();

	const stops = $derived(plugin_data?.travel?.stops ?? []);
	let active = $state(0);
	let column: HTMLElement;

	// the stop crossing the middle of the screen is the one being read
	$effect(() => {
		const sections = [...column.querySelectorAll('[data-stop]')];
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) active = sections.indexOf(e.target);
			},
			{ rootMargin: '-45% 0px -45% 0px' }
		);
		sections.forEach((s) => io.observe(s));
		return () => io.disconnect();
	});
</script>

<svelte:head><title>{title}</title></svelte:head>

<div class="journal">
	<aside class="map">
		{#if stops.length}<JourneyMap {stops} {active} />{/if}
		<p class="leg">Stop {active + 1} of {stops.length}</p>
	</aside>
	<main class="column" bind:this={column}>
		<header>
			<p class="kicker">A travel journal</p>
			<h1>{title}</h1>
			{#if subtitle}<p class="sub">{subtitle}</p>{/if}
		</header>
		{@render children?.()}
		<footer>Written in svx. The map is the travel plugin's data.</footer>
	</main>
</div>

<style>
	:global(html:has(.journal)),
	:global(body:has(.journal)) {
		height: auto;
		background: var(--paper);
	}

	.journal {
		display: grid;
		grid-template-columns: minmax(0, 46fr) minmax(0, 54fr);
		color: var(--ink);
		font-family: var(--face-text);
	}

	.map {
		position: sticky;
		top: 0;
		height: 100vh;
		padding: 4vh 3vw;
		border-right: 1px solid var(--hairline);
		background: radial-gradient(at 30% 20%, rgb(18 19 24 / 0.035), transparent 60%), var(--paper);
	}

	.leg {
		position: absolute;
		right: 3vw;
		top: 1.2vh;
		margin: 0;
		font: 0.75rem var(--face-mono);
		letter-spacing: 0.08em;
		color: var(--quiet);
	}

	.column {
		padding: 0 7vw 30vh;
	}

	header {
		padding: 20vh 0 8vh;
	}

	.kicker {
		margin: 0 0 1rem;
		font: 0.8rem var(--face-mono);
		letter-spacing: 0.08em;
		color: var(--quiet);
	}

	h1 {
		margin: 0;
		font: 560 clamp(3rem, 6vw, 5.5rem) / 0.95 var(--face-display);
		letter-spacing: -0.05em;
	}

	.sub {
		margin: 1.4rem 0 0;
		font: italic 1.4rem var(--face-display);
		color: var(--quiet);
	}

	footer {
		margin-top: 10vh;
		font: 0.8rem var(--face-mono);
		color: var(--quiet);
	}

	@media (max-width: 760px) {
		.journal {
			grid-template-columns: 1fr;
		}

		.map {
			height: 42vh;
			z-index: 1;
			border-right: 0;
			border-bottom: 1px solid var(--hairline);
		}
	}
</style>
