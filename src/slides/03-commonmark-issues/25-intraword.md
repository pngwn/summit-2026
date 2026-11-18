---
template: diff
title: Intraword emphasis
kicker: Emphasis
steps: 3
notes: |
  (Fences are plain text: the markdown highlighter italicises _case_ in snake_case_name.)
  The second is emphasis: `*` reaches inside a word, `_` doesn't.
  → PFM: a delimiter only opens after space or punctuation, so neither does.
  Inside a word you mark the boundary with |, which isn't rendered.
---

```text
snake_case_name

snake*case*name
```

```text
snake_case_name

snake|_case_|name
```

One of these is emphasis.

The second. `*` reaches inside a word, `_` doesn't.

In PFM, neither does. Inside a word, you say so.
