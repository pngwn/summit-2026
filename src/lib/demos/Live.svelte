<!--
	::live — a live code block: the document's fence with `{pm}` and its `[!eval]` marker,
	two package managers to choose from, and the command the reader sees. Choosing changes
	only the value; the source keeps showing `{pm}`.
-->
<script lang="ts">
	import { demos } from './state.svelte.ts';

	const CHOICES = ['pnpm', 'yarn'];
</script>

<div class="pair">
	<div class="sample">
		<p class="label">Document source</p>
		<pre><code
				><span class="fence">```sh</span>
<span class="expr">{'{'}pm{'}'}</span> add mdsvex <span class="marker"># [!eval]</span>
<span class="fence">```</span></code
			></pre>
		<div class="switches" role="group" aria-label="Package manager">
			{#each CHOICES as pm (pm)}
				<button aria-pressed={demos.pm === pm} onclick={() => (demos.pm = pm)}>{pm}</button>
			{/each}
		</div>
	</div>
	<div class="sample">
		<p class="label">Reader sees</p>
		<pre><code><output>{demos.pm} add mdsvex</output></code></pre>
	</div>
</div>

<style>
	.switches {
		display: flex;
		gap: 0.45em;
	}

	.fence {
		color: var(--name-fence);
	}

	.expr {
		color: var(--name-expr);
	}

	.marker {
		color: var(--quiet);
	}
</style>
