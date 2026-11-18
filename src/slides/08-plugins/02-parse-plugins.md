---
name: Parse plugins
size: small
rubric: Plugin API · parse plugins
title: Change the tree as it's read.
notes: |
  A parse plugin is an object keyed by node type. parse(node) runs as the parser opens
  the node; return a function and it runs when the node closes, once everything inside
  it is known. The node is a live view of the tree: read its type, attrs and neighbours,
  set attrs, append, wrap or remove. That's the whole of it: tree manipulation, while
  parsing, so it works when streaming too.
  sequential: true runs over the finished tree instead, and can rewrite runs of text.
---

::::pair
:::sample[A plugin]
```js
const external_links = {
  link: {
    parse(node) {
      // runs when the link closes
      return () => {
        if (/^https?:/.test(node.href))
          node.attrs.rel = 'noopener';
      };
    }
  }
};
```
:::

:::sample[Config, document, page]
```js
parse_plugins: [external_links]
```

```svx
Read the [docs](https://svelte.dev).
```

```html
<a href="https://svelte.dev"
  rel="noopener">docs</a>
```
:::
::::
