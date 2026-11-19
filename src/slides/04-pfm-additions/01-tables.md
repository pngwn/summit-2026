---
chapter: PFM additions
name: Merged table cells
rubric: PFM · tables
title: Merged table cells.
notes: |
  The header row names the columns. A cell containing > merges to the left.
  A cell containing ^ merges upward. The result keeps real table structure.
---

::::pair
:::sample[Source]
```svx
| Town  | Votes | > |
| ----- | ----- | - |
| North | 4     | 2 |
| ^     | 3     | 1 |
```
:::

:::sample[Typeset]
| Town  | Votes | > |
| ----- | ----- | - |
| North | 4     | 2 |
| ^     | 3     | 1 |
:::
::::
