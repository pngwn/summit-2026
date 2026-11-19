---
chapter: Plugin system
name: The callouts plugin
rubric: Plugin system · callouts
title: A directive rendered by a plugin.
notes: |
  The parser recognises a container directive. The callouts plugin knows what note means
  and supplies its presentation. Other plugins can handle constructs at parse or compile
  time. Use this as a visual example of the extension point.
---

:::::pair
::::sample[With the callouts plugin]
```svx
:::note[Field note]
Start with one town.
:::
```
::::

::::sample[On the page]
:::note[Field note]
Start with one town.
:::
::::
:::::
