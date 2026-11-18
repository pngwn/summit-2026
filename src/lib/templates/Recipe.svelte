<!--
	`template: recipe` — a recipe blog post. The method is written once, with each
	ingredient where it is used (`:ingredient[flour](qty=200, unit=g)`); the ingredients
	plugin hands the template every one of them as plugin_data.ingredients.items, which it
	lists, summed by name. The servings control scales the list and every quantity in the
	method together. Frontmatter: `title`, `subtitle`, `serves`, `time`.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Ingredient } from '#lib/plugins/ingredients/index.ts';
	import { amount, set_scale } from '#lib/plugins/ingredients/scale.ts';

	let {
		title,
		subtitle,
		serves = 2,
		time,
		plugin_data,
		children
	}: {
		title?: string;
		subtitle?: string;
		serves?: number;
		time?: string;
		plugin_data?: { ingredients?: { items?: Ingredient[] } };
		children?: Snippet;
	} = $props();

	// the reader's choice, starting from the recipe's own servings
	let servings = $derived(serves);
	set_scale({
		get factor() {
			return servings / serves;
		}
	});

	// an ingredient used in two steps is one line in the list
	const list = $derived.by(() => {
		const by = new Map<string, Ingredient>();
		for (const item of plugin_data?.ingredients?.items ?? []) {
			const key = `${item.name}|${item.unit}`;
			const seen = by.get(key);
			by.set(key, seen ? { ...seen, qty: seen.qty + item.qty } : { ...item });
		}
		return [...by.values()];
	});
</script>

<svelte:head><title>{title}</title></svelte:head>

<article class="recipe">
	<header>
		<p class="kicker">From the kitchen</p>
		<h1>{title}</h1>
		{#if subtitle}<p class="sub">{subtitle}</p>{/if}
		<dl class="facts">
			{#if time}<div>
					<dt>Time</dt>
					<dd>{time}</dd>
				</div>{/if}
			<div>
				<dt>Serves</dt>
				<dd class="servings">
					<button
						aria-label="Fewer servings"
						onclick={() => (servings = Math.max(1, servings - 1))}
					>
						−
					</button><output>{servings}</output><button
						aria-label="More servings"
						onclick={() => (servings = Math.min(24, servings + 1))}
					>
						+
					</button>
				</dd>
			</div>
		</dl>
	</header>

	<div class="grid">
		<aside class="ingredients">
			<h2>Ingredients</h2>
			<ul>
				{#each list as item (item.name + item.unit)}
					<li>
						<span class="qty">{amount((item.qty * servings) / serves, item.unit)}</span>
						<span>{item.name}</span>
					</li>
				{/each}
			</ul>
			<p class="note">
				Collected from the method by the ingredients plugin. Change the servings and every quantity
				follows.
			</p>
		</aside>
		<div class="method">
			<h2>Method</h2>
			{@render children?.()}
		</div>
	</div>
</article>

<style>
	:global(html:has(.recipe)),
	:global(body:has(.recipe)) {
		height: auto;
		background: var(--paper);
	}

	.recipe {
		max-width: 72rem;
		margin: 0 auto;
		padding: 12vh 6vw 20vh;
		color: var(--ink);
		font-family: var(--face-text);
	}

	.kicker {
		margin: 0 0 1rem;
		font: 0.8rem var(--face-mono);
		letter-spacing: 0.08em;
		color: var(--quiet);
	}

	h1 {
		margin: 0;
		font: 560 clamp(3rem, 6.5vw, 6rem) / 0.95 var(--face-display);
		letter-spacing: -0.05em;
	}

	.sub {
		margin: 1.2rem 0 0;
		max-width: 32em;
		font: italic 1.4rem / 1.4 var(--face-display);
		color: var(--quiet);
	}

	.facts {
		display: flex;
		gap: 3rem;
		margin: 2.5rem 0 0;
		padding: 1.2rem 0;
		border-block: 1px solid var(--hairline);
	}

	.facts dt {
		font: 0.75rem var(--face-mono);
		letter-spacing: 0.08em;
		color: var(--quiet);
	}

	.facts dd {
		margin: 0.3rem 0 0;
		font: 1.3rem var(--face-display);
	}

	.servings {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.servings button {
		width: 1.8rem;
		height: 1.8rem;
		border: 1.5px solid var(--ink);
		border-radius: 50%;
		background: none;
		font: 1rem / 1 var(--face-mono);
		color: var(--ink);
		cursor: pointer;
	}

	.servings output {
		min-width: 1.5em;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}

	.grid {
		display: grid;
		grid-template-columns: minmax(14rem, 1fr) minmax(0, 2fr);
		gap: 5vw;
		margin-top: 4rem;
	}

	h2 {
		margin: 0 0 1.2rem;
		font: italic 500 1.6rem var(--face-display);
	}

	.ingredients {
		align-self: start;
		position: sticky;
		top: 2rem;
	}

	.ingredients ul {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 1.1rem;
	}

	.ingredients li {
		display: grid;
		grid-template-columns: 5.5em 1fr;
		padding: 0.45rem 0;
		border-bottom: 1px solid var(--hairline);
	}

	.qty {
		font: 0.9em var(--face-mono);
		color: var(--copper);
	}

	.note {
		margin: 1.2rem 0 0;
		font: italic 0.95rem / 1.45 var(--face-display);
		color: var(--quiet);
	}

	.method {
		font-size: 1.15rem;
		line-height: 1.6;
	}

	.method :global(.steps) {
		--marker: 2.2rem;
		counter-reset: step;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.method :global(.step) {
		counter-increment: step;
	}

	.method :global(.step-title) {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.method :global(.step-title::before) {
		content: counter(step);
		display: grid;
		place-items: center;
		flex: none;
		width: var(--marker);
		height: var(--marker);
		border: 1.5px solid var(--ink);
		border-radius: 50%;
		font: 0.9rem var(--face-mono);
	}

	.method :global(.step-title h3) {
		margin: 0;
		font: 560 1.5rem var(--face-display);
		letter-spacing: -0.02em;
	}

	.method :global(.step-body) {
		margin-left: calc(var(--marker) / 2);
		padding: 0.4rem 0 1.6rem calc(var(--marker) / 2 + 1rem);
		border-left: 1px solid var(--hairline);
	}

	.method :global(.step:last-child .step-body) {
		border-left-color: transparent;
	}

	@media (max-width: 760px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.ingredients {
			position: static;
		}
	}
</style>
