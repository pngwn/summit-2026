---
chapter: PFM additions
name: Cells that travel
rubric: PFM · tables
title: Cells can share territory.
notes: |
  The header row names the columns. A cell containing > merges to the left.
  A cell containing ^ merges upward. The result keeps real table structure.
---

::::pair
:::sample[Source]
```markdown
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
