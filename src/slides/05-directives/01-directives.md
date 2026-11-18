---
chapter: Generic directives
name: Generic directives
rubric: Generic directives
title: One colon at a time.
notes: |
  A directive has a name, an optional label and optional arguments in parentheses.
  Show the difference in scope. In an actual container the closing ::: is on its own line.
  A plugin or component gives the name its meaning.
  (This deck is written with them: every pair of samples here is a :::pair of :::sample.)
---

:::ledger
::row[Inline](mark=":", code="name[text]", note="Inside a sentence")

::row[Leaf](mark="::", code="name[text]", note="A block of its own")

::row[Container](mark=":::", code="name … :::", note="Wraps other blocks")
:::
