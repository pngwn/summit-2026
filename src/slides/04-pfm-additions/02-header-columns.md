---
name: Header columns
rubric: PFM · tables
title: Table header columns.
notes: |
  A double pipe ends the header columns: cells to the left of it are headers for their
  row, rendered as th with scope="row". The delimiter row carries the || too.
  Screen readers then announce each cell with both its column and its row.
---

::::pair
:::sample[Source]
```svx
| Town  || Votes | Seats |
| ----- || ----- | ----- |
| North || 4     | 2     |
| South || 3     | 1     |
```
:::

:::sample[Typeset]
| Town  || Votes | Seats |
| ----- || ----- | ----- |
| North || 4     | 2     |
| South || 3     | 1     |
:::
::::
