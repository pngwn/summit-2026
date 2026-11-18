---
chapter: Plugin system
name: Giving a directive meaning
rubric: Plugin system · callouts
title: Give a name a meaning.
notes: |
  The parser recognises a container directive. The callouts plugin knows what note means
  and supplies its presentation. Other plugins can handle constructs at parse or compile
  time. Use this as a visual example of the extension point.
---

:::::pair
::::sample[With the callouts plugin]
```markdown
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
