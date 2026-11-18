<!-- An example live component, used from src/slides/04-live-components.md -->
<script lang="ts">
	let count = $state(0);
</script>

<button onclick={() => count++}>clicked {count} {count === 1 ? 'time' : 'times'}</button>

<style>
	button {
		align-self: start;
		font: inherit;
		font-size: 48px;
		padding: 24px 48px;
		border: 4px solid var(--accent);
		border-radius: 16px;
		background: transparent;
		color: inherit;
		cursor: pointer;
	}

	button:active {
		background: var(--accent);
		color: var(--accent-fg);
	}
</style>
