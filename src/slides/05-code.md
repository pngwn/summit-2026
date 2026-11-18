---
title: Code
notes: |
  Highlighting is built into mdsvex next (twinkleplop). Theme is imported in app.css.
---

## Code, highlighted at build time

```svelte {3}
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
	{count} × 2 = {doubled}
</button>
```
