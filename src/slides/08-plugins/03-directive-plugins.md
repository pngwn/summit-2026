---
name: Directive plugins
size: small
rubric: Plugin API · directive plugins
title: Claim a directive.
notes: |
  A plugin can claim a directive by name, with the components that render it. Its
  handlers run only inside that directive, on the markdown written there as children.
  This is the steps plugin, nearly whole: every heading inside :::steps starts a step.
  wrap_from puts a new step container around the heading and everything after it, until
  the next heading closes it; the heading becomes the step's label.
  The right-hand side is rendered by this exact plugin, running in this deck.
---

::::::pair(cols=wide)
:::::sample[@mdsvex/plugin-steps]
```js
// directives.steps.children
heading(node, ctx) {
  ctx.state.level ??= node.depth;
  if (node.depth !== ctx.state.level) return;
  ctx.state.step?.close();
  ctx.state.step = node.wrap_from(
    'directive_container', { name: 'step' });
  node.wrap_from('directive_label').close();
}
```
:::::

:::::sample[Document, page]
````svx
:::steps
## Install
Add the package.
## Configure
Put it in `plugins`.
:::
````

:::steps
## Install
Add the package.
## Configure
Put it in `plugins`.
:::
:::::
::::::
