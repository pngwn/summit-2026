<!--
	The journal's map: a drawn chart with the stops of the journey, the route between them
	dotted, and the part travelled so far inked in copper up to the current stop, where the
	penguin stands with the place's name. Moving to another stop draws the next stretch.
-->
<script lang="ts">
	import type { Stop } from '#lib/plugins/travel/index.ts';
	import { coast } from './coast.ts';

	let {
		stops,
		active = 0,
		aspect = 0.7
	}: { stops: Stop[]; active?: number; aspect?: number } = $props();

	const W = 600;
	const PAD = 1.6;

	// the chart's extent: the stops with some sea around them, widened (or lengthened) to
	// the shape of the panel it fills, so the chart uses all of it
	const box = $derived.by(() => {
		const lats = stops.map((s) => s.lat);
		const lons = stops.map((s) => s.lon);
		let [n, s] = [Math.max(...lats) + PAD, Math.min(...lats) - PAD];
		let [w, e] = [Math.min(...lons) - PAD, Math.max(...lons) + PAD];
		const k = Math.cos((((n + s) / 2) * Math.PI) / 180);
		const wide = ((e - w) * k) / (n - s);
		if (wide < aspect) {
			const grow = ((aspect * (n - s)) / k - (e - w)) / 2;
			[w, e] = [w - grow, e + grow];
		} else {
			const grow = (((e - w) * k) / aspect - (n - s)) / 2;
			[n, s] = [n + grow, s - grow];
		}
		return { n, s, w, e };
	});
	const k = $derived(Math.cos((((box.n + box.s) / 2) * Math.PI) / 180));
	const scale = $derived(W / ((box.e - box.w) * k));
	const H = $derived(Math.round((box.n - box.s) * scale));
	const at = (lat: number, lon: number): [number, number] => [
		(lon - box.w) * k * scale,
		(box.n - lat) * scale
	];

	const points = $derived(stops.map((s) => at(s.lat, s.lon)));

	// the route, a Catmull-Rom curve through the stops sampled as a polyline, so its length
	// to each stop is known exactly without measuring it in the browser
	const route = $derived.by(() => {
		const p = points;
		const out: [number, number][] = [];
		const upto: number[] = [0];
		let length = 0;
		for (let i = 0; i < p.length - 1; i++) {
			const [p0, p1, p2, p3] = [p[i - 1] ?? p[i], p[i], p[i + 1], p[i + 2] ?? p[i + 1]];
			for (let t = i === 0 ? 0 : 1; t <= 24; t++) {
				const u = t / 24;
				const u2 = u * u;
				const u3 = u2 * u;
				const pt = [0, 1].map(
					(d) =>
						0.5 *
						(2 * p1[d] +
							(-p0[d] + p2[d]) * u +
							(2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 +
							(-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * u3)
				) as [number, number];
				const last = out[out.length - 1];
				if (last) length += Math.hypot(pt[0] - last[0], pt[1] - last[1]);
				out.push(pt);
			}
			upto.push(length);
		}
		return {
			d: 'M' + out.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L'),
			upto,
			length
		};
	});

	const shore = $derived(
		coast.map(
			(ring) =>
				'M' +
				ring
					.map(([la, lo]) =>
						at(la, lo)
							.map((v) => v.toFixed(1))
							.join(' ')
					)
					.join('L') +
				'Z'
		)
	);

	// an engraved sea: wavering lines across the whole chart
	const sea = $derived(
		Array.from({ length: Math.ceil(H / 9) }, (_, i) => {
			const y = i * 9 + 4;
			let d = `M0 ${y}`;
			for (let x = 0; x <= W; x += 20) {
				const dy = Math.sin(x / 47 + i * 0.7) * 2.2 + Math.sin(x / 13 + i * 1.9) * 0.8;
				d += `L${x} ${(y + dy).toFixed(1)}`;
			}
			return d;
		})
	);

	// the graticule, every five degrees
	const lats = $derived(
		Array.from({ length: 30 }, (_, i) => -30 - i * 5).filter((v) => v < box.n && v > box.s)
	);
	const lons = $derived(
		Array.from({ length: 30 }, (_, i) => -40 - i * 5).filter((v) => v > box.w && v < box.e)
	);

	const here = $derived(points[active] ?? points[0]);
	const travelled = $derived(route.upto[active] ?? 0);
	const coord = (v: number, pos: string, neg: string) =>
		`${Math.abs(v).toFixed(2)}°${v < 0 ? neg : pos}`;
</script>

<svg
	class="journey"
	viewBox="0 0 {W} {H}"
	role="img"
	aria-label="Map of the journey, at {stops[active]?.name}"
>
	<defs>
		<clipPath id="chart"><rect width={W} height={H} /></clipPath>
		<mask id="travelled" maskUnits="userSpaceOnUse">
			<path
				class="reveal"
				d={route.d}
				style:stroke-dasharray="{route.length + 1}
				{route.length + 1}"
				style:stroke-dashoffset={route.length + 1 - travelled}
			/>
		</mask>
	</defs>

	<g clip-path="url(#chart)">
		<g class="sea">
			{#each sea as d, i (i)}<path {d} />{/each}
		</g>
		<g class="grid">
			{#each lats as lat (lat)}
				<line x1="0" x2={W} y1={at(lat, 0)[1]} y2={at(lat, 0)[1]} />
				<text x="6" y={at(lat, 0)[1] - 5}>{Math.abs(lat)}°S</text>
			{/each}
			{#each lons as lon (lon)}
				<line y1="0" y2={H} x1={at(0, lon)[0]} x2={at(0, lon)[0]} />
				<text x={at(0, lon)[0] + 5} y={H - 8}>{Math.abs(lon)}°W</text>
			{/each}
		</g>
		<g class="land">
			{#each shore as d, i (i)}<path {d} />{/each}
		</g>
		<g class="hatch">
			{#each shore as d, i (i)}<path {d} />{/each}
		</g>

		<path class="route ahead" d={route.d} />
		<path class="route done" d={route.d} mask="url(#travelled)" />

		{#each points as [x, y], i (i)}
			<g class="stop" class:visited={i < active} class:here={i === active} class:ahead={i > active}>
				<circle cx={x} cy={y} r="5" />
				{#if i < active}<text x={x + 10} y={y + 4}>{stops[i].name}</text>{/if}
			</g>
		{/each}
	</g>

	<!-- the penguin, at the stop the reader is reading -->
	<g class="traveller" style:transform="translate({here[0]}px, {here[1]}px)">
		<circle class="ring" r="13" />
		<use href="#bird" x="-20" y="-64" width="44" height="44" />
		<g
			class="tag"
			class:west={here[0] > W * 0.6}
			transform="translate({here[0] > W * 0.6 ? -18 : 18} -14)"
		>
			<text class="name">{stops[active]?.name}</text>
			<text class="where" y="22">
				{coord(stops[active]?.lat ?? 0, 'N', 'S')}
				{coord(stops[active]?.lon ?? 0, 'E', 'W')}
			</text>
		</g>
	</g>
</svg>

<style>
	.journey {
		display: block;
		width: 100%;
		height: 100%;
		color: var(--ink);
	}

	.sea path {
		fill: none;
		stroke: color-mix(in srgb, var(--aqua) 42%, transparent);
		stroke-width: 0.8;
	}

	.grid line {
		stroke: var(--hairline);
		stroke-width: 0.6;
		stroke-dasharray: 2 4;
	}

	.grid text {
		font: 12px var(--face-mono);
		fill: var(--quiet);
		letter-spacing: 0.06em;
	}

	.land path {
		fill: var(--paper);
		stroke: var(--ink);
		stroke-width: 1.6;
		stroke-linejoin: round;
	}

	/* the land engraved, the site's diagonal hatch over the paper */
	.hatch path {
		fill: url(#land);
		color: color-mix(in srgb, var(--ink) 22%, transparent);
		stroke: none;
	}

	.route {
		fill: none;
		stroke-linecap: round;
	}

	.route.ahead {
		stroke: var(--quiet);
		stroke-width: 1.4;
		stroke-dasharray: 0.1 6;
		opacity: 0.5;
	}

	.route.done {
		stroke: var(--copper);
		stroke-width: 4;
		stroke-dasharray: 0.1 9;
	}

	.reveal {
		fill: none;
		stroke: #fff;
		stroke-width: 20;
		transition: stroke-dashoffset 1.6s cubic-bezier(0.45, 0, 0.2, 1);
	}

	.stop circle {
		r: 6;
		fill: var(--paper);
		stroke: var(--quiet);
		stroke-width: 1.5;
		transition:
			fill 0.6s,
			stroke 0.6s;
	}

	.stop.visited circle,
	.stop.here circle {
		fill: var(--copper);
		stroke: var(--copper);
	}

	.stop text {
		font: italic 17px var(--face-display);
		fill: var(--quiet);
		paint-order: stroke;
		stroke: var(--paper);
		stroke-width: 4px;
	}

	.traveller {
		transition: transform 1.6s cubic-bezier(0.45, 0, 0.2, 1);
	}

	.ring {
		fill: none;
		stroke: var(--copper);
		stroke-width: 2;
	}

	.tag.west text {
		text-anchor: end;
	}

	.name {
		font: 600 28px var(--face-display);
		fill: var(--ink);
		paint-order: stroke;
		stroke: var(--paper);
		stroke-width: 5px;
	}

	.where {
		font: 13px var(--face-mono);
		letter-spacing: 0.05em;
		fill: var(--copper);
		paint-order: stroke;
		stroke: var(--paper);
		stroke-width: 4px;
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal,
		.traveller {
			transition: none;
		}
	}
</style>
