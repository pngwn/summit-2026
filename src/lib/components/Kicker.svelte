<!--
	The small label over a slide, in the site's meta voice: the mono, in riso.
	`tone` is one of the score's kinds (heading, emph, code, link, directive …), and
	inks the label with that kind's colour from tokens.css
-->
<script lang="ts">
	let { text, tone }: { text: string; tone?: string } = $props();
</script>

<p class="kicker riso" style:color={tone ? `var(--name-${tone})` : undefined}>{text}</p>

<style>
	.kicker {
		font: 400 34px / 1 var(--face-mono);
		font-variant-ligatures: none;
		letter-spacing: 0.04em;
		color: var(--quiet);
	}
</style>
