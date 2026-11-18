---
name: Code that runs
size: small
rubric: Live code blocks · run
title: Code you can click.
notes: |
  A fence marked run is shown as code and is also a module the page imports. It is a real
  module in the Vite graph: TypeScript is compiled, a Svelte block is compiled by
  vite-plugin-svelte, imports resolve as they would beside the document, and the server
  renders it with the page. A pre replacement decides what running means: here it renders
  the Svelte block above its code. Click the button. run=client loads it in the browser only.
---

::::pair
:::sample[Document source]
````svx
```svelte run
<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>
  clicked {count}
</button>
```
````
:::

:::sample[On the page]
```svelte run
<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>
  clicked {count}
</button>
```
:::
::::
