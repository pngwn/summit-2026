<!--
	A score: rows of phrases, each a thin rule with end ticks and a small italic name,
	over a line of mono source. A phrase spans exactly the cells it owns, parents above
	children. Tones are the site's construct inks: `heading` is --name-heading, `text` the
	quiet line.
-->
<script module lang="ts">
	export interface Phrase {
		from: number;
		span: number;
		tone?: string;
		name?: string;
	}

	export interface ScoreData {
		/** the source, as runs; a run with a tone is a construct's marks */
		source: { text: string; tone?: string }[];
		rows: { phrases: Phrase[] }[];
	}

	const ink = (tone = 'text') => (tone === 'text' ? 'var(--quiet-line)' : `var(--name-${tone})`);
</script>

<script lang="ts">
	let { source, rows }: ScoreData = $props();

	let cells = $derived(source.reduce((n, run) => n + run.text.length, 0));
</script>

<div class="score" style:--cells={cells}>
	{#each rows as row, r (r)}
		<div class="phrase-row">
			{#each row.phrases as phrase, p (p)}
				<span
					class="phrase"
					style:--from={phrase.from}
					style:--span={phrase.span}
					style:--tone={ink(phrase.tone)}
				>
					<i>{phrase.name ?? ''}</i>
				</span>
			{/each}
		</div>
	{/each}
	<code>
		{#each source as run, i (i)}{#if run.tone}<b style:color={ink(run.tone)}>
					{run.text}
				</b>{:else}{run.text}{/if}{/each}
	</code>
</div>
